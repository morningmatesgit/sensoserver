const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    sh: Number, // soil humidity *10
    t: Number,  // temp *10
    lx: Number, // light *10
    bp: Number, // battery *10
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying by device and time range
historySchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model("History", historySchema);
