import { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Font from "expo-font";
import { Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Terminals() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [terminals, setTerminals] = useState([]);

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Roboto_700Bold,
        });
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

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
  fetchTerminals();
}, []);

  const handleJoinQueue = async (terminalId) => {
  try {
    const token = await AsyncStorage.getItem("firebaseIdToken");
    if (!token) {
      console.warn("No auth token found");
      return;
    }

    const response = await fetch(`${apiUrl}/queues/${terminalId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Join queue failed:", response.status, data);

      if (data?.detail?.includes("already joined")) {
        Alert.alert("You're already in a queue", "Redirecting you to your QR...");
        router.push("/qr");
      } else {
        Alert.alert("Error", data?.detail || "Failed to join queue");
      }
      return;
    }

    console.log("✅ Queue joined successfully:", data);

    router.replace({
      pathname: "/qr",
      params: { queueId: terminalId },
    });

  } catch (error) {
    console.error("Error joining queue:", error);
    Alert.alert("Error", "Something went wrong");
  }
};

  if (!appIsReady) return null;

  const q = (searchQuery || "").trim().toLowerCase();
  const filteredTerminals = q.length === 0
  ? terminals
  : terminals.filter(t =>
      (t?.destination ?? "").toLowerCase().includes(q)
    );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Please select a bus",
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
              placeholder="Search for a terminal..."
              placeholderTextColor="#A1A4B2"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Text style={styles.heading}>Terminals</Text>

        {filteredTerminals.map((terminal) => (
  <Pressable
    key={terminal.id}
    onPress={() => handleJoinQueue(terminal.id)}
  >
    <View style={styles.imageContainer}>
      <Image
        source={require("../assets/images/location.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{terminal.destination}</Text>
        <Text style={styles.subtitle}>Tap to join queue</Text>
      </View>
    </View>
  </Pressable>
))}


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
});
