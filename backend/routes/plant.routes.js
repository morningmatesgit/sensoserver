const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getPlantHealth,
  identifyPlant,
  savePlant,
  scanPlantHealth,
  getMyPlants,
  getPlantById,
  deletePlant,
  getGlobalPlantCount,
  bindDevice,
  updatePlantCare,
} = require("../controllers/plant.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Multer configuration for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

/* =============================================
   PLANT ROUTES
============================================= */

// Global stats
router.get("/global-count", getGlobalPlantCount);

// Health check for Plant API
router.get("/health", getPlantHealth);

// Identify plant using image (Plant.id or Gemini)
router.post("/identify", verifyToken, upload.single("image"), identifyPlant);

// Manually save a plant (now supports image upload)
router.post("/save", verifyToken, upload.single("image"), savePlant);

// Scan plant for diseases
router.post("/:plantId/health-scan", verifyToken, upload.single("image"), scanPlantHealth);

// Get all plants for the authenticated user
router.get("/my-plants", verifyToken, getMyPlants);

// Get a single plant by ID
router.get("/:id", verifyToken, getPlantById);

// Update plant care status (watered, misted, fertilized)
router.put("/:id/care", verifyToken, updatePlantCare);

// Bind a device MAC to a plant
router.post("/:id/bind", verifyToken, bindDevice);

// Delete a plant
router.delete("/:id", verifyToken, deletePlant);

module.exports = router;
