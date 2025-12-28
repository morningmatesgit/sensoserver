const { Expo } = require("expo-server-sdk");
let expo = new Expo();

/**
 * Send push notification via Expo
 * @param {string} pushToken - The target device push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Extra data for the app
 */
exports.sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const messages = [{
    to: pushToken,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high'
  }];

  try {
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
