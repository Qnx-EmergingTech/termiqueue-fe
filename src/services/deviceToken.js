import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const EXPO_PROJECT_ID = "bc72a1ab-acde-43e5-b72e-c6618d7a14d0"; // find it in Expo Dashboard

export async function getDeviceToken() {
  if (!Device.isDevice) {
    console.log("Must use a physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: EXPO_PROJECT_ID,
    });
    console.log("Device Token:", token.data);
    return token.data;
  } catch (error) {
    console.error("Error fetching device token:", error);
    return null;
  }
}
