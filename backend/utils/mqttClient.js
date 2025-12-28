//const mqtt = require("mqtt");
//const Device = require("../models/device.model");
//const History = require("../models/history.model");
//const User = require("../models/auth.model");
//const Notification = require("../models/notification.model");
//const { sendPushNotification } = require("./pushNotifications");
//
///* -------------------------------------------------
//   AWS IoT MQTT OPTIONS (Render Safe)
//--------------------------------------------------*/
//const options = {
//  protocol: "mqtts",
//  host: process.env.AWS_IOT_ENDPOINT,
//  port: 8883,
//
//  clientId: `backend-${Math.random().toString(16).slice(2, 8)}`,
//  keepalive: 60,
//  reconnectPeriod: 5000,
//
//  key: process.env.AWS_IOT_PRIVATE_KEY,
//  cert: process.env.AWS_IOT_CERT,
//  rejectUnauthorized: true,
//};
//
//const client = mqtt.connect(options);
//
//const SHARED_TOPIC = "sdk/test/js";
//
///* -------------------------------------------------
//   MQTT EVENTS
//--------------------------------------------------*/
//client.on("connect", () => {
//  console.log("✅ Backend connected to AWS IoT (Render)");
//  client.subscribe(SHARED_TOPIC);
//});
//
//client.on("error", (err) => {
//  console.error("❌ MQTT Connection Error:", err.message);
//});
//
//client.on("message", async (topic, message) => {
//  try {
//    const payload = JSON.parse(message.toString());
//    const deviceId = payload.mac || payload.deviceId;
//
//    if (!deviceId) return;
//
//    console.log("📩 MQTT Message:", payload);
//
//    /* ---------------- ALERT FLOW ---------------- */
//    if (payload.type === "alert" || payload.alert_type) {
//      const device = await Device.findOne({ deviceId });
//
//      if (device && device.userId) {
//        const user = await User.findById(device.userId);
//
//        const msg = `Alert for ${device.name}: ${payload.alert_type}. Value: ${
//          payload.val ? payload.val / 10 : "N/A"
//        }`;
//
//        await Notification.create({
//          userId: device.userId,
//          title: "Plant Alert",
//          message: msg,
//          type: "alert",
//        });
//
//        if (user?.pushToken) {
//          await sendPushNotification(
//            user.pushToken,
//            "Plant Alert",
//            msg,
//            { deviceId }
//          );
//        }
//      }
//
//      return;
//    }
//
//    /* ---------------- SENSOR DATA FLOW ---------------- */
//    await Device.findOneAndUpdate(
//      { deviceId },
//      {
//        isOnline: true,
//        lastSeen: new Date(),
//        lastData: {
//          sh: payload.sh,
//          t: payload.t,
//          lx: payload.lx,
//          bp: payload.bp,
//        },
//      },
//      { upsert: true }
//    );
//
//    await History.create({
//      deviceId,
//      sh: payload.sh,
//      t: payload.t,
//      lx: payload.lx,
//      bp: payload.bp,
//      timestamp: new Date(),
//    });
//
//  } catch (err) {
//    console.error("❌ MQTT Message Error:", err.message);
//  }
//});
//
//module.exports = client;
