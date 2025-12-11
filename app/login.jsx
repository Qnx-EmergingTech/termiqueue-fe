import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { setToken } from "../src/utils/authStorage";
import { registerForPushNotificationsAsync, sendTokenToServer } from "../src/utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const idToken = await getIdToken(user, true);
    await setToken(idToken);

    // Register for push notifications after successful login
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await sendTokenToServer(token, idToken);
      }
    } catch (pushErr) {
      console.log('Push registration failed', pushErr);
      // Continue navigation even if push registration fails
    }

    router.replace("/accessModal");
  } catch (err) {
    setError(err.message);
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

      <View style={styles.container}>
        <View style={styles.imageContainer}>
    <Image
      source={require('../assets/images/Blob.png')}
      style={styles.imageBg}
      resizeMode="stretch"
    />

    <View style={styles.welcome}>
      <Text style={styles.heading}>Welcome Back!</Text>

      <Pressable style={styles.fbButton} onPress={handleFacebook}>
        <Text style={styles.loginText}>CONTINUE WITH FACEBOOK</Text>
      </Pressable>

      <Pressable style={styles.gButton} onPress={handleGoogle}>
        <Text style={styles.buttonText}>CONTINUE WITH GOOGLE</Text>
      </Pressable>
    </View>
  </View>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
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
          <Text  style={styles.fp}>Forgot Password?</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
          <Link href="/signup" style={[styles.bot, styles.italic]}>
            SIGN UP
          </Link>
        </View>
      </View>
    </>
  );
}
