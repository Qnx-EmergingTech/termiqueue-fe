import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [showPicker, setShowPicker] = useState(false);
  const togglePicker = () => setShowPicker((prev) => !prev);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  async function handleProceed() {
    if (!firstname.trim()) return Alert.alert("Error", "First name is required.");
    if (!lastname.trim()) return Alert.alert("Error", "Last name is required.");
    if (!birthdate) return Alert.alert("Error", "Birthdate is required.");
    if (!contact.trim()) return Alert.alert("Error", "Contact number is required.");
    if (!/^\d{10,15}$/.test(contact.trim())) return Alert.alert("Error", "Please enter a valid contact number.");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in.");

      const token = await getToken();
      const response = await fetch(`${apiUrl}/profiles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstname.trim(),
          middle_name: middlename.trim() || null,
          last_name: lastname.trim(),
          birthdate: birthdate,
          is_privileged: false,
          in_queue: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || err.detail || "Failed to submit KYC.");
      }

      console.log("KYC submitted successfully");
      router.push('/login');
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || "Something went wrong. Please try again.");
    }
  }

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
                <ImageBackground
                  source={require("../assets/images/blob1.png")}
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
                  placeholderTextColor="#A1A4B2"
                  value={firstname}
                  onChangeText={setFirstName}
                />
              </View>

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Middle Name (Optional)"
                  placeholderTextColor="#A1A4B2"
                  value={middlename}
                  onChangeText={setMiddleName}
                />
              </View>

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#A1A4B2"
                  value={lastname}
                  onChangeText={setLastName}
                />
              </View>

              <View style={styles.field}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { paddingRight: 40 }]}
                    placeholder="Birthdate (YYYY-MM-DD)"
                    placeholderTextColor="#A1A4B2"
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
                  placeholderTextColor="#A1A4B2"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                />
              </View>

              <Pressable style={styles.registerButton} onPress={handleProceed}>
                <Text style={styles.loginText}>REGISTER</Text>
              </Pressable>

              <View>
                <Text style={styles.fp}>Forgot Password?</Text>
              </View>

              <View style={styles.bottom}>
                <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
                <Link href="/login" style={[styles.bot, styles.italic]}>
                  LOG IN
                </Link>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}