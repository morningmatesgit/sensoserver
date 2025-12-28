const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plants",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["alert", "reminder", "info"],
      default: "info",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "normal", "low", "info"],
      default: "normal",
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
