import { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, Image } from "react-native";
import { Stack, Link, useRouter } from "expo-router";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "../src/styles/styles";
import Checkbox from 'expo-checkbox';
import { auth } from "../firebaseConfig";
import { Alert } from "react-native";


SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          RobotoMono_400Regular,
          RobotoMono_500Medium,
          RobotoMono_700Bold,
        });
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  const handleFacebook = () => {
    router.push('/home');
  };

  const handleGoogle = () => {
    console.log("Signup pressed");
  };

  const handleProceed = async () => {
    setError("");

    if (!accepted) {
      setError("Please accept the privacy policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCred.user);
      Alert.alert("Success", "Your account has been created!");
      router.replace("/kyc");
    } catch (err) {
      let msg;
    switch (err.code) {
      case "auth/email-already-in-use":
        msg = "This email is already registered. Try logging in instead.";
        break;
      case "auth/invalid-email":
        msg = "Please enter a valid email address.";
        break;
      case "auth/weak-password":
        msg = "Password must be at least 6 characters.";
        break;
      default:
        msg = "Something went wrong. Please try again.";
    }
    setError(msg);
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

      <View style={styles.container}>
        <View style={styles.imageContainer}>
    <Image
      source={require('../assets/images/Blob.png')}
      style={styles.imageBg}
      resizeMode="cover"
    />

    <View style={styles.welcome}>
      <Text style={styles.heading}>Create your account</Text>

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

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.pp}>
          <Text style={styles.read}>I have read the </Text>
          <Link href="/signup" style={[styles.policy, styles.italic]}>
            Privacy Policy
          </Link>
          <Checkbox
            value={accepted}
            onValueChange={setAccepted}
            tintColors={{ true: '#096B72', false: '#ccc' }} 
            style={styles.checkbox}
          />
        </View>

        <Pressable style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.loginText}>PROCEED</Text>
        </Pressable>
        
      </View>
    </>
  );
}
