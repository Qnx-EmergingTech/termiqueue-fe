import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View} from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { setToken } from "../src/utils/authStorage";
import { registerForPushNotificationsAsync, sendTokenToServer } from "../src/utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  //const [keyboardVisible, setKeyboardVisible] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/profiles/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid username or password");
      }

      const data = await res.json();
      const email = data.email;

      if (!email) throw new Error("Email not found for this username");

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
      setError(err.message || "Login failed");
    }
  };

  const handleFacebook = () => {
    console.log("Signup pressed");
  };

  const handleGoogle = () => {
    console.log("Signup pressed");
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

      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "height" : "padding"}
        keyboardVerticalOffset={Platform.OS === "android" ? 25 : 0}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        > */}
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Blob.png')}
            style={styles.imageBg}
            resizeMode="stretch"
          />

          <View style={styles.welcome}>
            <Text style={styles.heading}>Welcome Back!</Text>

          {/* {!keyboardVisible && ( */}
            <View style={{ width: '100%' }}>
            <Pressable style={styles.fbButton} onPress={handleFacebook}>
              <Text style={styles.loginText}>CONTINUE WITH FACEBOOK</Text>
            </Pressable>

            <Pressable style={styles.gButton} onPress={handleGoogle}>
              <Text style={styles.buttonText}>CONTINUE WITH GOOGLE</Text>
            </Pressable>
            </View>
          {/* )} */}
          </View>
        </View>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

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
      {/* </ScrollView> */}
      {/* </TouchableWithoutFeedback>
      </KeyboardAvoidingView> */}
    </>
  );
}