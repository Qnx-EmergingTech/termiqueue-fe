import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Requests permissions, obtains device push token (FCM on Android / APNs on iOS),
// and returns the token string or null.
export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device.');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token permission');
      return null;
    }

    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    // `tokenResponse` shape: { data: '<token>' }
    const token = tokenResponse?.data ?? null;

    // On Android, optionally configure the notification channel now
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.log('registerForPushNotificationsAsync error', error);
    return null;
  }
}

// Sends the token to your backend. Replace `BACKEND_URL` with your API endpoint.
export async function sendTokenToServer(token, userId) {
  if (!token) return null;

  try {
    const BACKEND_URL = 'http://44.202.107.196:8080/profiles/register-fcm';

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify({ fcm_token: token }),
    });

    if (!res.ok) {
      console.log('Failed to send token to server', await res.text());
      return null;
    }

    return await res.json();
  } catch (err) {
    console.log('sendTokenToServer error', err);
    return null;
  }
}

export default {
  registerForPushNotificationsAsync,
  sendTokenToServer,
};
