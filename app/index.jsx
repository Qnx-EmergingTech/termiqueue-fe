import { Link, Stack, useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import styles from "../src/styles/styles";

export default function Index() {
  const router = useRouter();

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

          <Image source=
            {require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="cover" />
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
