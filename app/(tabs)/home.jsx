import { View, Text, Pressable, ImageBackground } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_300Light, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Link, Stack, useRouter } from "expo-router";
import { Image } from "react-native";
import hstyles from "../../src/styles/homeStyles";

export default function home() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
  <>
    <Stack.Screen options={{ headerShown: false }} />

    <View style={hstyles.container}>
      <Text style={hstyles.greeting}>Hello, Jane!</Text>
      <Text style={hstyles.title}>Ready to queue for yout next ride?</Text>
      <Text style={hstyles.out}>Out of range!</Text>
      <Text style={hstyles.outtext}>You are currently out of the queueing range, please go near the terminal first!</Text>
    </View>
  </>
  );
}
