// app/_layout.tsx

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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";

import SafeScreen from "../components/SafeScreen";
import { auth } from "../firebaseConfig";
import { getIdToken } from "firebase/auth";

import {
  onTokenRefresh,
  sendTokenToServer,
  setupBackgroundNotificationHandler,
  setupForegroundNotificationHandler,
  setupNotificationOpenHandler,
} from "../src/utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        const token = await AsyncStorage.getItem("firebaseIdToken");

        if (isLoggedIn === "true" && token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.log("Auth check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    setupBackgroundNotificationHandler();

    const unsubscribeForeground = setupForegroundNotificationHandler();

    setupNotificationOpenHandler(async (remoteMessage) => {
      const data = remoteMessage?.data || {};

      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        router.replace("/login");
        return;
      }

      if (data.queueId) {
        router.push({
          pathname: "/home",
          params: {
            queueId: data.queueId,
            destination: data.destination,
            busId: data.busId,
          },
        });
      }
    });

    const unsubscribeTokenRefresh = onTokenRefresh(async (newFcmToken) => {
      const user = auth.currentUser;
      if (!user || !newFcmToken) return;

      const idToken = await getIdToken(user, true);
      await sendTokenToServer(newFcmToken, idToken);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeTokenRefresh();
    };
  }, [isAuthenticated]);

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
    if (fontsLoaded && !isCheckingAuth) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isCheckingAuth]);

  if (!fontsLoaded || isCheckingAuth) {
    return (
      <SafeScreen onLayout={onLayoutRootView}>
        <Stack />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: true }} />
    </SafeScreen>
  );
}
