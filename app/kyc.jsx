import { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, ImageBackground, Platform, TouchableOpacity } from "react-native";
import { Stack, Link, useRouter } from "expo-router";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";
import { getIdToken } from "firebase/auth";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getToken } from "../src/utils/authStorage";

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
  const [showPicker, setShowPicker] = useState(false);
  const openPicker = () => setShowPicker(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

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

async function handleProceed() {
     try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not signed in");

    const token = await getToken();
    const response = await fetch(`${apiUrl}/profiles/`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: firstname,
        middle_name: middlename || null,
        last_name: lastname,
        birthdate: birthdate,
        address: address,
        is_privileged: false,
        in_queue: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to submit KYC");
    }

    console.log("KYC submitted successfully");

    router.push('/accessModal');
  } catch (e) {
    console.error(e);
    setError(e.message);
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
            <ImageBackground
                source={require("../assets/images/Blob.png")}
                style={styles.imageBg}        
                resizeMode="stretch"
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
        </View>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Middle Name (Optional)"
            value={middlename}
            onChangeText={setMiddleName}
          />
        </View>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.field}>
          <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { paddingRight: 40 }]}
          placeholder="Birthdate (YYYY-MM-DD)"
          value={birthdate}
          onChangeText={setBirthdate}               
          keyboardType="numbers-and-punctuation"
          onFocus={openPicker}                       
        />
        <TouchableOpacity style={styles.icon} onPress={openPicker}>
          <Ionicons name="calendar-outline" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={birthdate ? new Date(birthdate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') setShowPicker(false);
            if (selectedDate) {
              const iso = selectedDate.toISOString().split('T')[0];
              setBirthdate(iso);                     
            }
          }}
          onTouchCancel={() => setShowPicker(false)}
        />
      )}
    </View>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Full address"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.field}>
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
