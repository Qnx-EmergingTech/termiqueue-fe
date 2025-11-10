import { Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import hstyles from "../src/styles/homeStyles";

export default function Home() {
  const router = useRouter();
  const [region, setRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [inRange, setInRange] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    closeMenu();
    await AsyncStorage.clear();
    Alert.alert("Logged out", "You have been logged out.");
    router.replace("/login");
  };

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_700Bold,
    Roboto_500Medium,
  });

   useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");
      if (!token) {
        console.warn("No auth token found.");
        return;
      }

      const response = await fetch(`${apiUrl}/profiles/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch profile:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Profile data:", data);
      setFirstName(data.first_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission denied", "We need location access to continue.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
        const userRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(userRegion);
      checkGeofence(userRegion); 
    })();
  }, []);

      const checkGeofence = async (coords) => {
        try {
          setIsLoading(true);

      const response = await fetch(`${apiUrl}/queues/check-geofence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: coords.latitude,
            lon: coords.longitude,
          }),
        });

      const data = await response.json();
      console.log("Geofence API response:", data);
      setGeofenceStatus(data);
    } catch (error) {
      console.error("Error checking geofence:", error);
      Alert.alert("Error", "Unable to reach server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
  if (geofenceStatus?.can_join) {
    setInRange(true);
  } else {
    setInRange(false);
  }
}, [geofenceStatus]);

  if (!fontsLoaded) {
    return null;
  }

  const handleProceed = () => {
    if (!inRange) return;
    router.push('/terminal');
    console.log("Proceeding...");
  };

  return (
  <PaperProvider>
    <Stack.Screen options={{ headerShown: false }} />

    <View style={hstyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={hstyles.greeting}>Hello, {firstName}!</Text>
            <Text style={hstyles.title}>Ready to queue for your next ride?</Text>
          </View>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={{
            backgroundColor: "white",
            borderRadius: 5,
            }}
            anchor={
              <Pressable onPress={openMenu} style={{ padding: 10 }}>
                <Ionicons name="ellipsis-vertical" size={24} color="#A1A4B2" />
              </Pressable>
            }
          >
            <Menu.Item
            onPress={handleLogout}
            title="Logout"
            leadingIcon={() => (
              <Ionicons name="log-out-outline" size={24} color="#DB5461" />
            )}
            titleStyle={{
              fontFamily: "Roboto_500Medium",
              fontSize: 16,
              color: "#333",
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          />
          </Menu>
        </View>
      
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
      
      {isLoading ? (
          <ActivityIndicator size="large" color="#096B72" style={{ marginTop: 10 }} />
        ) : (
          <>
            {geofenceStatus?.can_join ? (
              <>
                <Text style={[hstyles.out, { color: "#096B72" }]}>In Range!</Text>
                <Text style={hstyles.outtext}>You are within the queueing area, please select your bus to queue.</Text>
              </>
            ) : (
              <>
                <Text style={hstyles.out}>Out of range!</Text>
                <Text style={hstyles.outtext}>
                   You are currently out of range, please go near the One Ayala terminal.
                </Text>
              </>
            )}
          </>
        )}
    
      <View style={hstyles.try}>
  <Pressable
    onPress={handleProceed}
    disabled={!inRange}
    style={[
      hstyles.proceedButton,
      { backgroundColor: inRange ? "#333242" : "#8C8C8C" }, 
    ]}
  >
    <View style={hstyles.textContainer}>
      <Text style={hstyles.btitle}>
        {inRange ? "No terminal selected yet" : "No terminal selected yet"}
      </Text>
      <Text style={hstyles.stitle}>
        {inRange ? "Please select a terminal" : "Please select a terminal"}
      </Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={24}
      color="white"
      style={hstyles.icon}
    />
  </Pressable>
</View>

    </View>
  </PaperProvider>
  );
}
