import Checkbox from 'expo-checkbox';
import { Link, Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig";
import styles from "../src/styles/styles";
import { setToken } from "../src/utils/authStorage";

export default function Index() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [username, setUsername] = useState("");

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleFacebook = () => {
    router.push('/home');
  };

  const handleGoogle = () => {
    console.log("Signup pressed");
  };

  const handleProceed = async () => {
    setError("");

     if (!username.trim()) return setError("Username is required.");
     if (!email.trim()) return setError("Email is required.");
     if (!password || !confirmPassword) return setError("Password is required.");
     if (password !== confirmPassword) return setError("Passwords do not match.");
     if (!accepted) return setError("Please accept the privacy policy.");
    
     try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const idToken = await getIdToken(user, true);
      await setToken(idToken);
      
      const res = await fetch(`${apiUrl}/profiles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to create profile");
      }

      Alert.alert("Success", "Account created!");
      router.replace("/kyc");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
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
            placeholder="Enter your username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
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
