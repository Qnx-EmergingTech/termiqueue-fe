import { View, Text, Pressable } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_300Light, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Stack, useRouter } from "expo-router";
import hstyles from "../src/styles/homeStyles";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();
  const [region, setRegion] = useState(null);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleProceed = () => {
    router.push('/terminal');
  };

  return (
  <>
    <Stack.Screen options={{ headerShown: false }} />

    <View style={hstyles.container}>
      <Text style={hstyles.greeting}>Hello, Jane!</Text>
      <Text style={hstyles.title}>Ready to queue for yout next ride?</Text>
      
      {region && (
        <MapView
          style={hstyles.map}
          region={region}
          showsUserLocation
          showsMyLocationButton
        >
          <Marker coordinate={region} title="You are here" />
        </MapView>
      )}
      
      <Text style={hstyles.out}>Out of range!</Text>
      <Text style={hstyles.outtext}>You are currently out of the queueing range, please go near the terminal first!</Text>
    
      <View style={hstyles.try}>
      <Pressable style={hstyles.proceedButton} onPress={handleProceed}>
        <View style={hstyles.textContainer}>
          <Text style={hstyles.btitle}>No terminal selected yet</Text>
          <Text style={hstyles.stitle}>Please select a terminal</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="white" style={hstyles.icon} />
      </Pressable>
      </View>
    </View>
  </>
  );
}
