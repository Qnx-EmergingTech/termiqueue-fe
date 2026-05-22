import { Checkbox } from 'expo-checkbox';
import { Link, Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { useState, useEffect } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { setToken } from "../src/utils/authStorage";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
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
      case "auth/email-already-in-use": return "An account with this email already exists.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/weak-password": return "Password must be at least 6 characters.";
      case "auth/network-request-failed": return "Network error. Please check your connection.";
      default: return "Something went wrong. Please try again.";
    }
  };

  const handleProceed = async () => {
    if (!username.trim()) return Alert.alert("Error", "Username is required.");
    if (!email.trim()) return Alert.alert("Error", "Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Alert.alert("Error", "Please enter a valid email address.");
    if (!password || !confirmPassword) return Alert.alert("Error", "Password is required.");
    if (password.length < 6) return Alert.alert("Error", "Password must be at least 6 characters.");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match.");
    if (!accepted) return Alert.alert("Error", "Please accept the privacy policy.");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const idToken = await getIdToken(user);
      await setToken(idToken);

      const res = await fetch(`${apiUrl}/profiles/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          username: username.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.log("Backend error response:", data);
        await user.delete();
        throw new Error(data.detail || "Failed to create profile.");
      }

      Alert.alert("Success", "Account created!");
      router.replace("/kyc");
    } catch (err) {
      console.error("Signup error:", err);
      const message = err.code
        ? firebaseErrorMessage(err.code)
        : err.message || "Something went wrong. Please try again.";
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
                  resizeMode="cover"
                />

                <View style={styles.welcome}>
                  <Image
                    source={require('../assets/images/logo1.png')}
                    style={[styles.logo, { width: 100, height: 100, marginTop: -20 }]}
                    resizeMode="contain"
                  />

                  {!keyboardVisible && (
                    <Text style={styles.heading}>Create your account</Text>
                  )}
                </View>
              </View>

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#A1A4B2"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#A1A4B2"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
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

              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#A1A4B2"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <View style={styles.pp}>
                <Text style={styles.read}>I have read the </Text>
                <Link href="/signup" style={[styles.policy, styles.italic]}>
                  Privacy Policy
                </Link>
                <Checkbox
                  value={accepted}
                  onValueChange={setAccepted}
                  tintColors={{ true: '#020eba', false: '#ccc' }}
                  style={styles.checkbox}
                />
              </View>

              <Pressable style={styles.proceedButton} onPress={handleProceed}>
                <Text style={styles.loginText}>PROCEED</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}