const {
  getDeviceShadow,
  sendShadowCommand,
  subscribeToSensorData,
  subscribeToDeviceAlerts,
} = require("../utils/awsShadow");
const Device = require("../models/device.model");
const History = require("../models/history.model");

// ================================
// 1. Check Device Online Status & Data
// ================================
exports.getDeviceStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Get from DB first for last known data
    const device = await Device.findOne({ deviceId });
    
    // Also get live shadow status
    let shadowStatus = "DISCONNECTED";
    try {
      const shadow = await getDeviceShadow(deviceId);
      shadowStatus = shadow?.state?.reported?.connectivity?.status || "DISCONNECTED";
    } catch (shadowErr) {
      console.log("Shadow fetch failed, using DB status");
    }

    return res.json({
      success: true,
      deviceId,
      status: shadowStatus,
      isOnline: device?.isOnline || false,
      lastSeen: device?.lastSeen,
      lastData: device?.lastData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================================
// 2. Get Device History (Graphs)
// ================================
exports.getDeviceHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { period } = req.query; // Day, Week, Month

    let startDate = new Date();
    if (period === "Day") {
      startDate.setHours(startDate.getHours() - 24);
    } else if (period === "Week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "Month") {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate.setHours(startDate.getHours() - 24);
    }

    const history = await History.find({
      deviceId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    return res.json({
      success: true,
      data: history
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// 3. Send SCENE command
// ================================
exports.sendSceneCommand = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { scene_id } = req.body;

    const cmd = {
      cmd_id: `cmd-${Date.now()}`,
      scene_id,
    };

    const result = await sendShadowCommand(deviceId, cmd);

    return res.json({
      success: true,
      message: "Scene command sent",
      shadow: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// 4. Send Threshold Command
// ================================
exports.sendThresholdCommand = async (req, res) => {
  try {
    const { deviceId } = req.params;

    let thresholds = req.body.thresholds;

    // Multiply every value x10
    Object.keys(thresholds).forEach((key) => {
      thresholds[key] = thresholds[key] * 10;
    });

    const cmd = {
      cmd_id: `cmd-${Date.now()}`,
      thresholds,
    };

    const result = await sendShadowCommand(deviceId, cmd);

    return res.json({
      success: true,
      message: "Threshold command sent",
      shadow: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// 5. Subscribe to Sensor Data (Backend Processing)
// ================================
exports.startSensorSubscription = (deviceId) => {
  subscribeToSensorData(deviceId, (data) => {
    console.log("Real-time sensor:", data);

    // Update DB with latest data
    Device.findOneAndUpdate(
      { deviceId },
      {
        isOnline: true,
        lastSeen: new Date(),
        lastData: {
          sh: data.sh,
          t: data.t,
          lx: data.lx,
          bp: data.bp,
        },
      },
      { upsert: true }
    ).catch(err => console.error("Error updating device data from subscription:", err));
  });
};

// ================================
// 6. Subscribe to Alerts
// ================================
exports.startAlertSubscription = (deviceId) => {
  subscribeToDeviceAlerts(deviceId, (alert) => {
    console.log("Alert received:", alert);

    // TODO: save alert in DB
  });
};
