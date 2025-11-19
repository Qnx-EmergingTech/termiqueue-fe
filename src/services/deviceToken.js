// src/services/deviceToken.js
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function getDeviceToken() {
  if (!Device.isDevice) {
    console.log("Must use a physical device for push notifications.");
    return null;
  }

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted.");
    return null;
  }

  try {
    // Attempt to get a real Expo push token
    const token = await Notifications.getExpoPushTokenAsync();

    console.log("Expo Device Token:", token.data);
    return token.data;
  } catch (error) {
    // Expo Go fallback
    console.log(
      "Unable to get real push token (likely running in Expo Go). Using dummy token for testing."
    );
    return "dummy-token-for-expo-go"; // This allows frontend testing without crashing
  }
}
