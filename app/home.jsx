import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View, ScrollView, RefreshControl } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import { auth } from "../firebaseConfig";
import hstyles from "../src/styles/homeStyles";

export default function Home() {
  const router = useRouter();
  const [region, setRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(true); 
  const [geofenceStatus, setGeofenceStatus] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [inRange, setInRange] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentQueue, setCurrentQueue] = useState(null); 
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      await AsyncStorage.multiRemove([
        "firebaseIdToken",
        "userId",
        "isLoggedIn",
        "currentQueueId" 
      ]);
      
      console.log('✅ Auth cleared from AsyncStorage');
      
      await auth.signOut();
      
      router.replace("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");
      if (!token) return;
      const response = await fetch(`${apiUrl}/profiles/me`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      setFirstName(data.first_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchCurrentQueue = async () => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");
      const queueId = await AsyncStorage.getItem("currentQueueId");

      if (!token || !queueId) {
        setCurrentQueue(null);
        return;
      }

      const statusResponse = await fetch(`${apiUrl}/queues/${queueId}/me/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statusResponse.status === 404) {
        setCurrentQueue(null);
        await AsyncStorage.removeItem("currentQueueId");
        return;
      }

      if (!statusResponse.ok) return;

      const statusData = await statusResponse.json();
      const terminalsResponse = await fetch(`${apiUrl}/queues/`);
      const terminals = await terminalsResponse.json();
      const terminal = terminals.find(t => t.id === queueId);

      setCurrentQueue({
        queueId,
        destination: terminal?.destination ?? "Unknown",
        queueNumber: statusData.queue_number,
        status: statusData.status,
      });
    } catch (e) {
      console.error("Queue fetch failed:", e);
    }
  };

  const fetchLocationAndGeofence = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission denied", "We need location access to continue.");
        setIsLoadingMap(false);
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
      setIsLoadingMap(false);

      setIsLoading(true);
      const geofenceRes = await fetch(`${apiUrl}/queues/check-geofence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: userRegion.latitude, lon: userRegion.longitude }),
      });
      const geofenceData = await geofenceRes.json();
      setGeofenceStatus(geofenceData);
    } catch (error) {
      console.error("Error getting location or geofence:", error);
      setIsLoadingMap(false);
      setIsLoading(false);
      Alert.alert("Error", "Unable to get your location or geofence.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchLocationAndGeofence();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchCurrentQueue();
  }, []));

  useEffect(() => {
    setInRange(geofenceStatus?.can_join ?? false);
  }, [geofenceStatus]);

  const handleProceed = () => {
    if (currentQueue) {
      router.push({
        pathname: '/qr',
        params: {
          queueId: currentQueue.queueId,
          destination: currentQueue.destination,
        },
      });
      return;
    }

    if (!inRange) return;
    router.push('/terminal');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    await fetchCurrentQueue();
    await fetchLocationAndGeofence();
    setRefreshing(false);
  };

  return (
    <PaperProvider>
      <Stack.Screen options={{ headerShown: false }} />

       <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>

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

        {isLoadingMap ? (
          <View style={[hstyles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
            <ActivityIndicator size="large" color="#096B72" />
            <Text style={{ marginTop: 10, color: '#666' }}>Loading map...</Text>
          </View>
        ) : region ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={hstyles.map}
            initialRegion={region} 
            showsUserLocation
            showsMyLocationButton
            onMapReady={() => console.log('✅ Map is ready')}
            onError={(error) => console.log('❌ Map error:', error)}
            onMapLoaded={() => console.log('✅ Map loaded successfully')}
          >
            <Marker coordinate={region} title="You are here" />
          </MapView>
        ) : (
          <View style={[hstyles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
            <Text style={{ color: '#666' }}>Unable to load map</Text>
          </View>
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
            disabled={!currentQueue && !inRange} 
            style={[
              hstyles.proceedButton,
              { backgroundColor: (currentQueue || inRange) ? "#333242" : "#8C8C8C" }, 
            ]}
          >
            <View style={hstyles.textContainer}>
              {currentQueue !== null ? (
                <>
                  <Text style={hstyles.btitle}>
                    {currentQueue.destination}
                  </Text>
                  <Text style={hstyles.stitle}>
                    Queue #{currentQueue.queueNumber} • {currentQueue.status}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={hstyles.btitle}>
                    No terminal selected yet
                  </Text>
                  <Text style={hstyles.stitle}>
                    Please select a terminal
                  </Text>
                </>
              )}
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
      </ScrollView>
    </PaperProvider>
  );
}