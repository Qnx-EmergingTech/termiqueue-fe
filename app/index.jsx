import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import styles from "../src/styles/styles";

export default function Index() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        
        if (isLoggedIn === "true") {
          console.log('✅ User authenticated, redirecting to home');
          router.replace('/home');
        } else {
          console.log('❌ User not authenticated, showing landing page');
          setIsCheckingAuth(false); // Show landing page
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsCheckingAuth(false); // Show landing page on error
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking auth
  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#096B72" />
      </View>
    );
  }

  // Show landing page if not authenticated
  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Frame.png')}
            style={styles.image}
            resizeMode="cover"
          />

          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textSection}>
          <View>
            <Text style={styles.mid}>Get in line without standing in one.</Text>
            <Text style={styles.label}>
              Join the queue from your phone and breeze through the terminal.
            </Text>
          </View>

          <Pressable style={styles.loginButton} onPress={handleSignup}>
            <Text style={styles.loginText}>SIGN UP</Text>
          </Pressable>

          <View style={styles.bottom}>
            <Text style={styles.bot}>ALREADY HAVE AN ACCOUNT? </Text>
            <Link href="/login" style={[styles.bot, styles.italic]}>
              LOG IN
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}