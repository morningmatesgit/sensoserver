const router = require("express").Router();
const {
  getDeviceStatus,
  sendSceneCommand,
  sendThresholdCommand,
  getDeviceHistory,
} = require("../controllers/device.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/:deviceId/status", verifyToken, getDeviceStatus);
router.get("/:deviceId/history", verifyToken, getDeviceHistory);
router.post("/:deviceId/scene", verifyToken, sendSceneCommand);
router.post("/:deviceId/thresholds", verifyToken, sendThresholdCommand);

module.exports = router;
