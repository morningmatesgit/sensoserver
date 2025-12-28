const PlantModel = require("../models/plant.model.js");
const DeviceModel = require("../models/device.model.js");
const { sendShadowCommand } = require("../utils/awsShadow");
require("dotenv").config();

/* ================= GEMINI HELPERS ================= */
async function callGeminiIdentify(base64Image) {
  try {
    const res = await fetch(process.env.GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `
        Identify the plant and provide a JSON response with:
        - plantName: The common name of the plant
        - scientificName: The scientific/botanical name
        - isPlant: true if it is a plant, false otherwise
        - careInstructions: {
            watering: string,
            light: string,
            temperature: string,
            humidity: string
          }
        - description: string
        - soilType: string
        - wateringFrequency: number (days)
        - mistingFrequency: number (days)
        `,
        image: base64Image,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Gemini Identify Error:", error);
    return null;
  }
}

async function callGeminiDisease(base64Image) {
  try {
    const res = await fetch(process.env.GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `
        Detect plant disease and provide a JSON response with:
        - diseaseName: Name of the disease
        - cause: Primary cause
        - treatment: Treatment steps
        - prevention: Prevention tips
        `,
        image: base64Image,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Gemini Disease Error:", error);
    return null;
  }
}

/* ================= CONTROLLER FUNCTIONS ================= */

exports.getGlobalPlantCount = async (_, res) => {
  try {
    const count = await PlantModel.countDocuments();
    res.json({ success: true, count: 2847 + count });
  } catch (err) {
    res.status(500).json({ success: false, count: 2847 });
  }
};

exports.getPlantHealth = (_, res) => {
  res.json({ success: true, message: "Plant API working" });
};

exports.identifyPlant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    const base64Image = req.file.buffer.toString("base64");

    /* ---------- 1️⃣ PLANT.ID (Primary) ---------- */
    try {
      const plantIdRes = await fetch(process.env.PLANT_ID_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.PLANT_ID_API_KEY,
        },
        body: JSON.stringify({
          images: [base64Image],
          classification_level: "species",
          similar_images: true,
        }),
      });

      const plantIdData = await plantIdRes.json();
      const suggestions = plantIdData?.result?.classification?.suggestions || [];

      if (suggestions.length > 0 && suggestions[0].probability > 0.5) {
        const top = suggestions[0];
        
        return res.status(200).json({
          success: true,
          source: "plant.id",
          data: {
            plantName: top.name,
            scientificName: top.name,
            confidence: top.probability,
            isPlant: true,
            careInstructions: {
              watering: "Regularly check soil moisture",
              light: "Keep in bright spot",
              temperature: "Average room temperature"
            }
          },
        });
      }
    } catch (error) {
      console.log("Plant.id failed, falling back to Gemini...");
    }

    /* ---------- 2️⃣ GEMINI FALLBACK ---------- */
    const geminiResult = await callGeminiIdentify(base64Image);
    
    if (geminiResult && geminiResult.isPlant === false) {
      return res.status(400).json({ success: false, message: "Please provide a valid plant image" });
    }

    if (geminiResult?.plantName) {
      return res.json({
        success: true,
        source: "gemini",
        data: geminiResult,
      });
    }

    /* ---------- 3️⃣ MANUAL FALLBACK ---------- */
    return res.json({
      success: false,
      requireManual: true,
      message: "Unable to identify plant automatically",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.savePlant = async (req, res) => {
  try {
    const { plantName } = req.body;
    if (!plantName) return res.status(400).json({ success: false, message: "plantName required" });

    let imageData = req.body.image;
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      imageData = `data:${req.file.mimetype};base64,${base64}`;
    }

    const plant = await PlantModel.create({ ...req.body, userId: req.user.id, image: imageData });
    res.status(201).json({ success: true, data: plant });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.scanPlantHealth = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image required" });
    const base64Image = req.file.buffer.toString("base64");
    
    // Attempt Plant.id health assessment first
    try {
      const plantIdRes = await fetch("https://plant.id/api/v3/health_assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.PLANT_ID_API_KEY,
        },
        body: JSON.stringify({
          images: [`data:image/jpeg;base64,${base64Image}`],
          similar_images: true,
        }),
      });
      const healthData = await plantIdRes.json();
      if (healthData?.result?.is_healthy?.binary === false) {
        return res.json({ success: true, source: "plant.id", data: healthData });
      }
    } catch (e) {
      console.log("Plant.id health failed, using Gemini...");
    }

    const geminiResult = await callGeminiDisease(base64Image);
    if (geminiResult) return res.json({ success: true, source: "gemini", data: geminiResult });
    
    return res.json({ success: false, message: "Unable to detect disease" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyPlants = async (req, res) => {
  try {
    const plants = await PlantModel.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    const enrichedPlants = await Promise.all(plants.map(async (p) => {
      if (p.deviceId) {
        const d = await DeviceModel.findOne({ deviceId: p.deviceId }).lean();
        if (d) return { ...p, connected: true, isOnline: d.isOnline, moisture: d.lastData?.sh/10, temperature: d.lastData?.t/10 };
      }
      return { ...p, connected: false };
    }));
    res.json({ success: true, data: enrichedPlants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    const plant = await PlantModel.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!plant) return res.status(404).json({ success: false, message: "Plant not found" });
    if (plant.deviceId) {
      const d = await DeviceModel.findOne({ deviceId: plant.deviceId }).lean();
      if (d) return res.json({ success: true, data: { ...plant, connected: true, isOnline: d.isOnline, lastData: d.lastData } });
    }
    res.json({ success: true, data: { ...plant, connected: false } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updatePlantCare = async (req, res) => {
  try {
    const plant = await PlantModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (req.body.thresholds && plant.deviceId) {
      const scaledThresholds = {};
      Object.keys(req.body.thresholds).forEach(key => {
        scaledThresholds[key] = req.body.thresholds[key] * 10;
      });

      await sendShadowCommand(plant.deviceId, {
        cmd_id: `cmd-${Date.now()}`,
        thresholds: scaledThresholds
      });
    }

    res.json({ success: true, data: plant });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.bindDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const plant = await PlantModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { deviceId: deviceId },
      { new: true }
    );
    res.json({ success: true, data: plant });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    await PlantModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.setReminder = async (req, res) => {
  try {
    const { frequency, type } = req.body; // e.g., type: 'watering', frequency: 3
    const field = `${type}Frequency`;
    const update = {};
    update[field] = frequency;

    const plant = await PlantModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: update },
      { new: true }
    );
    res.json({ success: true, data: plant });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.sharePlant = async (req, res) => {
  try {
    const plant = await PlantModel.findOne({ _id: req.params.id, userId: req.user.id });
    // For now, return a shareable summary. You could generate a deep link here.
    const shareText = `Check out my ${plant.plantName} (${plant.scientificName}) on Senso Plant Care!`;
    res.json({ success: true, shareText });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
