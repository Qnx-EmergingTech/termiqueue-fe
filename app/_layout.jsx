import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import SafeScreen from "../components/SafeScreen";

import { getIdToken } from "firebase/auth";
import { useCallback, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onTokenRefresh, sendTokenToServer } from "../src/utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Listen for token refresh and update backend
    const unsubscribe = onTokenRefresh(async (newToken) => {
      const user = auth.currentUser;
      const idToken = await getIdToken(user, true);
      if (user && newToken) {
        console.log('Updating refreshed token on server');
        await sendTokenToServer(newToken, idToken);
      }
    });

    return () => unsubscribe();
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    RobotoMono_400Regular,
    RobotoMono_500Medium,
    RobotoMono_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeScreen onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: true }} />
    </SafeScreen>
  );
}
