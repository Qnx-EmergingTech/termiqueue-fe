import { Stack, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";

const { height: screenHeight } = Dimensions.get("window");

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return Alert.alert("Error", "Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Alert.alert("Error", "Please enter a valid email address.");

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email address.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (err) {
      const message = err.code === "auth/user-not-found"
        ? "No account found with this email address."
        : err.code === "auth/network-request-failed"
        ? "Network error. Please check your connection."
        : "Something went wrong. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
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
              <View style={[styles.imageContainer, { height: 220 }]}>
                <Image
                  source={require("../assets/images/blob1.png")}
                  style={styles.imageBg}
                  resizeMode="stretch"
                />
                <View style={styles.welcome}>
                  <Image
                    source={require("../assets/images/logo1.png")}
                    style={[styles.logo, { width: 100, height: 100, marginTop: 0 }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.heading}>Reset your password</Text>
                </View>
              </View>

              <View style={{ minHeight: screenHeight - 220, justifyContent: "center", paddingBottom: 150 }}>
                <View style={{ paddingHorizontal: '8.5%' }}>
                  <Text style={{
                    color: "#A1A4B2",
                    fontSize: 13,
                    marginBottom: 20,
                    fontFamily: "Roboto_300Light",
                    lineHeight: 20,
                  }}>
                    Please provide the email address associated with your account, and we`ll send you a link to reset your password.
                  </Text>
                </View>

                <View style={styles.field}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#A1A4B2"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                  />
                </View>

                <Pressable
                  style={[styles.loginButton, { marginTop: 10 }, loading && { opacity: 0.7 }]}
                  onPress={handleReset}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.loginText}>SEND RESET LINK</Text>
                  }
                </Pressable>

                <View style={styles.bottom}>
                  <Text style={styles.bot}>Remembered your password? </Text>
                  <Text
                    style={[styles.bot, styles.italic]}
                    onPress={() => router.back()}
                  >
                    LOG IN
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}