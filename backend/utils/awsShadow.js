//const client = require("./mqttClient");
//
///**
// * Send Shadow Command via Allowed Topic (sdk/test/js)
// * Since your policy blocks official Shadow topics, we use the test channel.
// */
//exports.sendShadowCommand = async (deviceId, desiredState) => {
//  return new Promise((resolve, reject) => {
//    // MATCHES POLICY: Only sdk/test/js is allowed
//    const topic = `sdk/test/js`;
//
//    const payload = JSON.stringify({
//      targetDeviceId: deviceId,
//      type: "command",
//      state: {
//        desired: desiredState
//      }
//    });
//
//    client.publish(topic, payload, { qos: 1 }, (err) => {
//      if (err) {
//        console.error("MQTT Publish Error:", err);
//        return reject(err);
//      }
//      console.log(`✅ Command sent to ${deviceId} via ${topic}`);
//      resolve({ success: true });
//    });
//  });
//};
//
///**
// * Shadow status is handled via live updates in MongoDB
// * because GetThingShadow is blocked by your policy.
// */
//exports.getDeviceShadow = async (deviceId) => {
//  return null;
//};
