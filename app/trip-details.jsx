import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react';
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TripDetails() {

const router = useRouter();

  return (
   <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Trip Details",
          headerTransparent: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: "Roboto_700Bold",
            fontSize: 20,
          },
        }}
      />

      <View style={styles.container}>
        <View style={styles.heading}>
            <Pressable
                onPress={() =>
                router.push({
                    pathname: "/trip-details",
                }) }>
                <View style={styles.trip}>
                    <Text style={styles.title}>One Ayala </Text>
                    <Ionicons name="arrow-forward" size={18} color="#555" style={styles.arrow}/>
                    <Text style={styles.title}> Pacita</Text>
                </View>
            </Pressable>
        </View>

        <View style={styles.subtitle}>
            <Text style={styles.text}>Departed: 05:54 PM</Text>
        </View>

        <View style={styles.details}>
            <Text style={styles.data}>Bus: Cher, 0521</Text>
            <Text style={styles.data}>One Ayala</Text>
            <Text style={styles.data}>Destination: Pacita</Text>
            <Text style={styles.data}>Capacity: 30</Text>
            <Text style={styles.data}>Bus plate number: PGH522</Text>
            <Text style={styles.data}>Ticket number: 21</Text>
        </View>
      </View>
    </>
  )
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
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#8C8C8C",
  },
  data: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#3F414E",
  },
});