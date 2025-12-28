// controllers/wifi.controller.js

exports.updateWifiStatus = async (req, res) => {
  try {
    const { deviceId, status } = req.body;

    if (!deviceId || !status) {
      return res.status(400).json({
        success: false,
        message: "deviceId and status are required",
      });
    }

    // TEMP DB (Later you move to DynamoDB)
    global.wifiStatusStore = global.wifiStatusStore || {};
    global.wifiStatusStore[deviceId] = status; // CONNECTED or FAILED

    return res.json({
      success: true,
      message: "Wi-Fi status updated",
      deviceId,
      status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ESP32 polls this to update success
exports.getWifiStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    global.wifiStatusStore = global.wifiStatusStore || {};

    const status = global.wifiStatusStore[deviceId] || "WAITING";

    return res.json({
      success: true,
      deviceId,
      status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
