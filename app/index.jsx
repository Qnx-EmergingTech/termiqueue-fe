import { View, Text, Pressable, ImageBackground } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_300Light, Roboto_500Medium } from "@expo-google-fonts/roboto";
import styles from "../src/styles/styles";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Image } from "react-native";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
            resizeMode="cover" />

          <Text style={styles.headingOnImage}>Termi-Q</Text>
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
