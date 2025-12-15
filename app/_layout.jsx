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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import SafeScreen from "../components/SafeScreen";

import { getIdToken } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import {
  onTokenRefresh,
  sendTokenToServer,
  setupBackgroundNotificationHandler,
  setupForegroundNotificationHandler,
  setupNotificationOpenHandler,
} from "../src/utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        const token = await AsyncStorage.getItem("firebaseIdToken");
        
        console.log('Auth check:', { isLoggedIn, hasToken: !!token });
        
        if (isLoggedIn === "true" && token) {
          console.log('✅ User is authenticated');
          setIsAuthenticated(true);
        } else {
          console.log('❌ User is not authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Set up notification handlers
  useEffect(() => {
    if (!isAuthenticated) return; // Only set up if authenticated

    console.log('🔔 Setting up notifications...');

    setupBackgroundNotificationHandler();
    const unsubscribeForeground = setupForegroundNotificationHandler();

    setupNotificationOpenHandler((remoteMessage) => {
      console.log('📬 User tapped notification:', remoteMessage);
      
      const data = remoteMessage.data || {};
      
      // Add a small delay to ensure auth is loaded
      setTimeout(async () => {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        
        if (isLoggedIn !== "true") {
          console.log('⚠️ User not authenticated, redirecting to login');
          router.replace('/login');
          return;
        }

        if (data.queueId) {
          console.log('🔄 Navigating to QR page...');
          router.push({
            pathname: '/home',
            params: {
              queueId: data.queueId,
              destination: data.destination || 'Unknown',
              busId: data.busId || 'N/A',
              terminalStatus: data.terminalStatus || 'N/A',
            },
          });
        } else if (data.screen) {
          router.push(data.screen);
        }
      }, 500);
    });

    const unsubscribeTokenRefresh = onTokenRefresh(async (newToken) => {
      const user = auth.currentUser;
      if (user && newToken) {
        console.log('🔄 Updating refreshed token on server');
        const idToken = await getIdToken(user, true);
        await sendTokenToServer(newToken, idToken);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeTokenRefresh();
    };
  }, [router, isAuthenticated]);

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

  if (!fontsLoaded || isCheckingAuth) return null;

  return (
    <SafeScreen onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: true }} />
    </SafeScreen>
  );
}