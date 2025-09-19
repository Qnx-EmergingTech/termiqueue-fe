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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import Checkbox from 'expo-checkbox';


SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // const handleLogin = async () => {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     router.replace("/home"); 
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  const handleFacebook = () => {
    console.log("Signup pressed");
  };

  const handleGoogle = () => {
    console.log("Signup pressed");
  };

  const handleProceed = () => {
    router.push('/kyc'); 
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
      style={styles.image}
      resizeMode="contain"
    />

    <View style={styles.create}>
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
            value={password}
            onChangeText={setPassword}
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
