import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useLocalSearchParams} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TripDetails() {

const router = useRouter();
const { trip_id } = useLocalSearchParams();

const [trip, setTrip] = useState(null);
const [loading, setLoading] = useState(true);

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("firebaseIdToken");

        const response = await fetch(
          `${apiUrl}/profiles/me/trips/${trip_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      } finally {
        setLoading(false);
      }
    };

    if (trip_id) {
      fetchTripDetails();
    }
  }, [trip_id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.loading}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
   <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Trip Details",
          headerTransparent: false,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "white", 
          },
          contentStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            fontFamily: "Roboto_700Bold",
            fontSize: 20,
          },
        }}
      />

      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={styles.tripRow}>
            <Text style={styles.title}>{trip.origin}</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#555"
              style={{ marginHorizontal: 6 }}
            />
            <Text style={styles.title}>{trip.destination}</Text>
          </View>
        </View>

        <Text style={styles.subText}>
          Departed: {formatTime(trip.departed_at)}
        </Text>

        <View style={styles.details}>
          <Text style={styles.data}>
            Bus Number: {trip.bus_number}
          </Text>
          <Text style={styles.data}>
            Origin: {trip.origin}
          </Text>
          <Text style={styles.data}>
            Destination: {trip.destination}
          </Text>
          <Text style={styles.data}>
            Plate Number: {trip.plate_number}
          </Text>
          <Text style={styles.data}>
            Ticket Number: {trip.ticket_number}
          </Text>
          <Text style={styles.data}>
           Boarded at: {formatTime(trip.boarded_at)}
          </Text>
        </View>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Go back</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
container: {
    backgroundColor: "white",
    padding: 20,
  },
heading: {
    fontSize: 34,
    fontFamily: "Roboto_700Bold",
  },
  trip: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
    color: "#8C8C8C",
  },
  data: {
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
    color: "#3F414E",
  },
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subText: {
    fontSize: 16,
    color: "#8C8C8C",
    marginBottom: 20,
  },
  details: {
    marginTop: 10,
  },
  back: {
    marginTop: 30,
    color: "#096B72",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});