import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function Terminals() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [terminals, setTerminals] = useState([]);
  const [currentQueueId, setCurrentQueueId] = useState(null);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await fetch(`${apiUrl}/queues/`);
        const data = await response.json();
        setTerminals(data);
      } catch (error) {
        console.error("Error fetching terminals:", error);
      }
    };

    if (apiUrl) {
    fetchTerminals();
    }
  }, [apiUrl]);

  const handleJoinQueue = async (terminalId) => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");
      if (!token) {
        Alert.alert("Error", "You must be logged in to join a queue.");
        return;
      }

      const terminal = terminals.find((t) => t.id === terminalId);

      const joinResponse = await fetch(`${apiUrl}/queues/${terminalId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const joinData = await joinResponse.json();

      if (joinData?.detail === "User already in queue") {
        console.warn("⚠️ User already in queue");

        const savedQueueId = await AsyncStorage.getItem("currentQueueId");
        if (!savedQueueId) {
          console.log("💾 Saving currentQueueId since it was missing...");
          await AsyncStorage.setItem("currentQueueId", terminalId.toString());
        }

        const updatedQueueId = await AsyncStorage.getItem("currentQueueId");

        const savedId = updatedQueueId?.toString();
        const currentId = terminalId?.toString();

        if (savedId && savedId === currentId) {
          console.log("✅ Same queue detected — redirecting to QR...");
          router.push({
            pathname: "/qr",
            params: {
              queueId: savedId,
              destination: terminal?.destination || "Unknown",
              busId: terminal?.bus_id || "N/A",
              terminalStatus: terminal?.status || "N/A",
            },
          });
          return;
        }

        Alert.alert(
          "Already in a queue",
          "Please leave your current queue first before joining another."
        );
        return;
      }

      if (!joinResponse.ok) {
        Alert.alert("Error", joinData?.detail || "Failed to join queue");
        return;
      }

      await AsyncStorage.setItem("currentQueueId", terminalId.toString());
      setCurrentQueueId(terminalId.toString());
      console.log("✅ Joined queue successfully:", joinData);

      router.replace({
        pathname: "/qr",
        params: {
          queueId: terminalId,
          destination: terminal?.destination || "Unknown",
          busId: terminal?.bus_id || "N/A",
          terminalStatus: terminal?.status || "N/A",
        },
      });
    } catch (error) {
      console.error("Error joining queue:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  useEffect(() => {
    const loadCurrentQueue = async () => {
      const savedId = await AsyncStorage.getItem("currentQueueId");
      if (savedId) setCurrentQueueId(savedId);
    };
    loadCurrentQueue();
  }, []);

  const q = (searchQuery || "").trim().toLowerCase();
  const filteredTerminals =
    q.length === 0
      ? terminals
      : terminals.filter((t) => (t?.destination ?? "").toLowerCase().includes(q));

  return (
    <>
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Please select a bus",
          headerTransparent: false,
          headerBackTitleVisible: false,
          headerBackVisible: false,
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
              placeholder="Search for a terminal..."
              placeholderTextColor="#A1A4B2"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Text style={styles.heading}>Terminals</Text>

          {filteredTerminals.map((terminal) => (
            <Pressable key={terminal.id} onPress={() => handleJoinQueue(terminal.id)}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/images/location.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{terminal.destination}</Text>

                  <Text
                    style={[
                      styles.subtitle,
                      currentQueueId === terminal.id.toString() && styles.inQueueText,
                    ]}
                  >
                    {currentQueueId === terminal.id.toString()
                      ? "In Queue"
                      : "Tap to join queue"}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.returnHomeButton} onPress={() => router.replace("/home")}>
        <Text style={styles.returnHomeText}>Return to Home</Text>
      </Pressable>
    </View>
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
  inQueueText: {
    color: "#59A96A",
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
  },
  returnHomeButton: {
  position: "absolute",
  bottom: 30,
  alignSelf: "center",
  width: Dimensions.get("window").width * 0.85,
  backgroundColor: "white",
  borderWidth: 1,
  borderColor: "#096B72",
  paddingVertical: 14,
  borderRadius: 24,
  alignItems: "center",
},
returnHomeText: {
  fontSize: 16,
  fontFamily: "Roboto_500Medium",
  color: "#096B72",
},
});