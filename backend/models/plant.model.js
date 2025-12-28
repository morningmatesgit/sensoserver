const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      default: null,
    },
    plantName: {
      type: String,
      required: true,
    },
    scientificName: String,
    commonNames: [String],
    confidence: Number,
    image: String,
    latitude: Number,
    longitude: Number,
    potSize: String,
    soilType: String,
    location: String,
    
    // Care Tracking
    lastWatered: { type: Date, default: null },
    lastMisted: { type: Date, default: null },
    lastFertilized: { type: Date, default: null },
    
    // Frequency in days
    wateringFrequency: { type: Number, default: 3 },
    mistingFrequency: { type: Number, default: 2 },
    fertilizingFrequency: { type: Number, default: 30 },

    // Thresholds (Stored as real values, scaled x10 when sent to device)
    thresholds: {
      t_min: { type: Number, default: 10 },
      t_max: { type: Number, default: 35 },
      sh_min: { type: Number, default: 20 },
      sh_max: { type: Number, default: 70 },
      lx_min: { type: Number, default: 150 },
      lx_max: { type: Number, default: 2000 },
    },

    careInstructions: {
      watering: String,
      light: String,
      temperature: String,
      humidity: String,
    },
    description: String,
    identificationData: mongoose.Schema.Types.Mixed,
    assistantConversation: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PlantModel = mongoose.model("plants", plantSchema);
module.exports = PlantModel;
