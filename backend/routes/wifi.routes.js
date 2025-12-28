const router = require("express").Router();
const {
  updateWifiStatus,
  getWifiStatus,
} = require("../controllers/wifi.controller");

router.post("/status", updateWifiStatus); // ESP32 reports success
router.get("/status/:deviceId", getWifiStatus); // Web page polls this

module.exports = router;
