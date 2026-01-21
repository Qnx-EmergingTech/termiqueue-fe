import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function TripHistory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [trips, setTrips] = useState([]);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const fetchTripHistory = useCallback(async () => {
    try {
        const token = await AsyncStorage.getItem("firebaseIdToken");

         if (!token) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        const response = await fetch(`${apiUrl}/profiles/me/trips/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setTrips(Array.isArray(data?.trips) ? data.trips : []);
    } catch (error) {
        console.error("Error fetching trip history:", error);
    }
 }, [apiUrl]);

    useEffect(() => {
        fetchTripHistory();
    }, [fetchTripHistory]);

    const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const formatDateHeading = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

    const groupedTrips = useMemo(() => {
    const filtered = trips.filter((trip) =>
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort(
      (a, b) => new Date(b.departed_at) - new Date(a.departed_at)
    );

    const groups = {};

    filtered.forEach((trip) => {
      const date = new Date(trip.departed_at);
      const key = date.toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(trip);
    });

    return groups;
  }, [trips, searchQuery]);

    const sortedDates = Object.keys(groupedTrips).sort(
    (a, b) => new Date(b) - new Date(a)
  );
    
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Trip History",
          headerTransparent: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: "Roboto_700Bold",
            fontSize: 20,
          },
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#A1A4B2"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#A1A4B2"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {sortedDates.map((dateKey) => {
            const heading = formatDateHeading(new Date(dateKey));

            return (
              <View key={dateKey}>
                <Text style={styles.heading}>{heading}</Text>

                {groupedTrips[dateKey].map((trip) => (
                  <Pressable
                    key={trip.id}
                    onPress={() =>
                      router.push({
                        pathname: "/trip-details",
                        params: {
                          trip_id: trip.id,
                        },
                      })
                    }
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={require("../assets/images/location.png")}
                        style={styles.image}
                      />

                      <View style={styles.textContainer}>
                        <View style={styles.trip}>
                          <Text style={styles.title}>{trip.origin}</Text>
                          <Ionicons
                            name="arrow-forward"
                            size={16}
                            color="#555"
                            style={{ marginHorizontal: 6 }}
                          />
                          <Text style={styles.title}>
                            {trip.destination}
                          </Text>
                        </View>

                        <Text style={styles.subtitle}> Departed at: {""}
                          {formatTime(trip.departed_at)}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            );
          })}

        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
  },
  trip: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  heading: {
    fontSize: 34,
    fontFamily: "Roboto_700Bold",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    width: Dimensions.get("window").width * 0.9,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#A1A4B2",
  },
  scrollContent: {
    flexGrow: 1,
  },
  dateHeader: {
  fontSize: 14,
  fontFamily: "Roboto_500Medium",
  color: "#6B7280",
  marginTop: 20,
  marginBottom: 10,
},
});