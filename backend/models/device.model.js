const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true, // MAC Address AABBCCDDEEFF
    },
    name: {
      type: String,
      default: "Unnamed Sensor",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //Updated from AWS Shadow + Live MQTT
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: null,
    },

    // latest live reading
    lastData: {
      sh: Number, // soil humidity *10
      t: Number, // temp *10
      lx: Number, // light *10
      bp: Number, // battery *10
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
