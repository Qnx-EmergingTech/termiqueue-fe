import { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, ImageBackground } from "react-native";
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
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");

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

  const handleProceed = () => {
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
            <ImageBackground
                source={require("../assets/images/Blob.png")}
                style={styles.image}        
                resizeMode="cover"
            />
            <View style={styles.create}>
                <Text style={styles.heading}>Create your account</Text>
            </View>
        </View>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            autoCapitalize="none"
            value={firstname}
            onChangeText={setFirstName}
          />
        
          <TextInput
            style={styles.input}
            placeholder="Middle Name (Optional)"
            value={middlename}
            onChangeText={setMiddleName}
          />
        
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastName}
          />
        
          <TextInput
            style={styles.input}
            placeholder="Birthdate"
            value={birthdate}
            onChangeText={setBirthdate}
          />
    
          <TextInput
            style={styles.input}
            placeholder="Full address"
            value={address}
            onChangeText={setAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="Contact number"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.registerButton} onPress={handleProceed}>
          <Text style={styles.loginText}>REGISTER</Text>
        </Pressable>

        <View styles={styles.field}>
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
