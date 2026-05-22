import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { Alert, Image, Pressable, Text, TextInput, View, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard } from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { setToken } from "../src/utils/authStorage";
import { registerForPushNotificationsAsync, sendTokenToServer } from "../src/utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const firebaseErrorMessage = (code) => {
    switch (code) {
      case "auth/user-not-found": return "No account found with this username.";
      case "auth/wrong-password": return "Incorrect password.";
      case "auth/invalid-credential": return "Invalid username or password.";
      case "auth/user-disabled": return "This account has been disabled.";
      case "auth/too-many-requests": return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed": return "Network error. Please check your connection.";
      default: return "Login failed. Please try again.";
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      return Alert.alert("Error", "Username and password are required.");
    }

    try {
      const res = await fetch(`${apiUrl}/profiles/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid username or password.");
      }

      const data = await res.json();
      const email = data.email;

      if (!email) throw new Error("Email not found for this username.");

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await getIdToken(user, true);

      await setToken(idToken);
      await AsyncStorage.setItem("firebaseIdToken", idToken);
      await AsyncStorage.setItem("userId", user.uid);
      await AsyncStorage.setItem("isLoggedIn", "true");

      console.log("✅ Auth saved to AsyncStorage");

      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await sendTokenToServer(token, idToken);
        }
      } catch (pushErr) {
        console.log("Push registration failed", pushErr);
      }

      router.replace("/home");
    } catch (err) {
      console.log(err);
      const message = err.code
        ? firebaseErrorMessage(err.code)
        : err.message || "Login failed. Please try again.";
      Alert.alert("Error", message);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../assets/images/blob1.png')}
                  style={styles.imageBg}
                  resizeMode="stretch"
                />

                <View style={styles.welcome}>
                  <Image
                    source={require('../assets/images/logo1.png')}
                    style={[styles.logo, { width: 100, height: 100, marginTop: 0 }]}
                    resizeMode="contain"
                  />
                  {!keyboardVisible && (
                    <Text style={styles.heading}>Welcome Back!</Text>
                  )}
                </View>
              </View>

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#A1A4B2"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#A1A4B2"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>LOG IN</Text>
              </Pressable>

              <View style={styles.field}>
                <Text style={styles.fp}>Forgot Password?</Text>
              </View>

              <View style={styles.bottom}>
                <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
                <Link href="/signup" style={[styles.bot, styles.italic]}>
                  SIGN UP
                </Link>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}