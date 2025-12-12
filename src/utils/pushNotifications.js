import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';

// Request notification permissions and get FCM token
export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device.');
      return null;
    }

    console.log('Requesting notification permission...');

    // Request permission (iOS and Android 13+)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission not granted');
      return null;
    }

    console.log('Permission granted, getting FCM token...');

    // Get FCM token
    const token = await messaging().getToken();
    console.log('FCM Token received:', token ? 'Yes' : 'No');

    return token;
  } catch (error) {
    console.log('registerForPushNotificationsAsync error:', error);
    return null;
  }
}

// Send token to your backend
export async function sendTokenToServer(token, userId) {
  if (!token) {
    console.log('No token to send');
    return null;
  }

  try {
    const BACKEND_URL = 'http://44.202.107.196:8080/profiles/register-fcm';

    console.log('Sending FCM token to server...');
    
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify({ fcm_token: token }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log('Failed to send token to server:', errorText);
      return null;
    }

    const result = await res.json();
    console.log('Token successfully sent to server');
    return result;
  } catch (err) {
    console.log('sendTokenToServer error:', err);
    return null;
  }
}

// Listen for token refresh (optional but recommended)
export function onTokenRefresh(callback) {
  return messaging().onTokenRefresh(token => {
    console.log('FCM token refreshed:', token);
    callback(token);
  });
}

export default {
  registerForPushNotificationsAsync,
  sendTokenToServer,
  onTokenRefresh,
};