import { Checkbox } from 'expo-checkbox';
import { Link, Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, Pressable, Text, TextInput, View, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback } from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { setToken } from "../src/utils/authStorage";

const { width: screenWidth } = Dimensions.get("window");

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [username, setUsername] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [accountType, setAccountType] = useState("internal");
  const [code, setCode] = useState("");
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleFacebook = () => {
    router.push('/home');
  };

  const handleGoogle = () => {
    console.log("Signup pressed");
  };

  const handleSelectInternal = () => {
    setAccountType("internal");
    setCode("");
  };

  const handleSelectExternal = () => {
    setAccountType("external");
  };

  const parseBlockingFunctionError = (err) => {
    if (err?.code === "auth/internal-error" && err.message?.includes("Cloud Function")) {
      const match = err.message.match(/Message: "([^"]+)"/);
      return match ? match[1] : "Registration was rejected.";
    }
    return null;
  };

  const firebaseErrorMessage = (err) => {
    const code = err?.code;

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
    if (accountType === "external" && !code.trim()) return Alert.alert("Error", "Please enter your code.");
    if (!accepted) return Alert.alert("Error", "Please accept the privacy policy.");

    console.log("🌐 apiUrl:", apiUrl);

    let user;

    try {
      if (accountType === "external") {
        console.log("🎟️ Validating voucher code:", code.trim());
        const functions = getFunctions();
        const validateVoucher = httpsCallable(functions, "validate_voucher");

        try {
          const voucherResult = await validateVoucher({
            email: email.trim().toLowerCase(),
            voucher_code: code.trim(),
          });
          console.log("✅ Voucher valid:", voucherResult.data);
        } catch (voucherErr) {
          console.log(
            "❌ Voucher validation failed:",
            voucherErr.code,
            voucherErr.message,
          );
          Alert.alert(
            "Error",
            voucherErr.message || "Could not validate voucher code.",
          );
          return;
        }
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      user = userCred.user;
      console.log("✅ Firebase user created, uid:", user.uid);

      const idToken = await getIdToken(user);
      await setToken(idToken);
      console.log("✅ Got idToken and stored it");

      const fullUrl = `${apiUrl}/profiles/signup`;
      console.log("🌐 Fetching:", fullUrl);

      const res = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          accountType: accountType,
          ...(accountType === "external" ? { voucher_code: code.trim() } : {}),
        }),
      });

      console.log("📦 Response status:", res.status);

      if (!res.ok) {
        const data = await res.json();
        console.log("Backend error response:", data);
        await user.delete();
        throw new Error(data.detail || "Failed to create profile.");
      }

      Alert.alert("Success", "Account created!");
      router.replace("/kyc");
    } catch (err) {
      console.error("❌ Signup error:", err.code, err.message);

      if (user) {
        try {
          await user.delete();
          console.log("🗑️ Rolled back Firebase user after error");
        } catch (deleteErr) {
          console.log("⚠️ Could not roll back Firebase user:", deleteErr);
        }
      }

      const message =
        parseBlockingFunctionError(err) ||
        (err.code ? firebaseErrorMessage(err) : err.message) ||
        "Something went wrong. Please try again.";
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
                  source={require('../assets/images/Blob.png')}
                  style={styles.imageBg}
                  resizeMode="cover"
              />

    {!keyboardVisible && (
    <View style={styles.welcome}>
      <Text style={styles.heading}>Create your account</Text>

      <Pressable style={styles.fbButton} onPress={handleFacebook}>
        <Text style={styles.loginText}>CONTINUE WITH FACEBOOK</Text>
      </Pressable>

      <Pressable style={styles.gButton} onPress={handleGoogle}>
        <Text style={styles.buttonText}>CONTINUE WITH GOOGLE</Text>
      </Pressable>
    </View>
    )}
  </View>

        <View
          style={{
            flexDirection: "row",
            width: screenWidth * 0.83,
            alignSelf: "center",
            marginTop: 5,
            marginBottom: 10,
            borderRadius: 10,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#096B72",
          }}
        >
          <Pressable
            onPress={handleSelectInternal}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              backgroundColor: accountType === "internal" ? "#096B72" : "#fff",
            }}
          >
            <Text
              style={{
                color: accountType === "internal" ? "#fff" : "#096B72",
                fontWeight: "600",
              }}
            >
              Internal
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSelectExternal}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              backgroundColor: accountType === "external" ? "#096B72" : "#fff",
            }}
          >
            <Text
              style={{
                color: accountType === "external" ? "#fff" : "#096B72",
                fontWeight: "600",
              }}
            >
              External
            </Text>
          </Pressable>
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

        {accountType === "external" && (
          <View style={styles.field}>
            <TextInput
              style={styles.input}
              placeholder="Enter code"
              placeholderTextColor="#A1A4B2"
              autoCapitalize="characters"
              value={code}
              onChangeText={setCode}
            />
          </View>
        )}

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
            tintColors={{ true: '#096B72', false: '#ccc' }} 
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
