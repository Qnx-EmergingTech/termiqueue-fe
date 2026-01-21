import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { getToken } from "../src/utils/authStorage";

export default function Kyc() {
  const router = useRouter();
  
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const togglePicker = () => setShowPicker((prev) => !prev);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

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
          is_privileged: false,
          in_queue: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit KYC");
      }

      console.log("KYC submitted successfully");
      router.push('/login');

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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

          <ScrollView
            contentContainerStyle={{
              paddingTop: 170,
              paddingBottom: 60,
            }}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <View style={styles.field}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
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
                  onFocus={() => setShowPicker(true)}
                />
                <TouchableOpacity style={styles.icon} onPress={togglePicker}>
                  <Ionicons name="calendar-outline" size={22} color="#555" />
                </TouchableOpacity>
              </View>

              {showPicker && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <DateTimePicker
                    value={birthdate ? new Date(birthdate) : new Date()}
                    mode="date"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (event.type === "dismissed") {
                        setShowPicker(false);
                        return;
                      }

                      if (selectedDate) {
                        const iso = selectedDate.toISOString().split("T")[0];
                        setBirthdate(iso);
                      }

                      setShowPicker(false);
                    }}
                  />
                </View>
              )}
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

            <View>
              <Text style={styles.fp}>Forgot Password?</Text>
            </View>

            <View style={styles.bottom}>
              <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
              <Link href="/signup" style={[styles.bot, styles.italic]}>
                SIGN UP
              </Link>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
