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

export default function TripHistory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  //const [trips, setTrips] = useState([]);

  //const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

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

          <Text style={styles.heading}>Today</Text>

          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>

          <Text style={styles.heading}>Yesterday</Text>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>

          <Text style={styles.heading}>December 12, 2025</Text>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View><View style={styles.imageContainer}>
            <Image
                source={require("../assets/images/location.png")}
                style={styles.image}
                resizeMode="contain"/>
            <View style={styles.textContainer}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/trip-details",
                        })
                    }>
                    <View style={styles.trip}>
                        <Text style={styles.title}>One Ayala </Text>
                        <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                        <Text style={styles.title}> Pacita</Text>
                    </View>
                </Pressable>
            </View>
          </View>

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