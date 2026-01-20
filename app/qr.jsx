import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, Text, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import qrstyles from "../src/styles/qrStyles";

export default function Qr() {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const qrSize = width * 0.7;
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  
  const { queueId, destination, busId, terminalStatus } = useLocalSearchParams();
  
  const [queue, setQueue] = useState(null);
  const [qrData, setQrData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("firebaseIdToken");
        
        console.log("🔍 Fetching queue details...");
        console.log("📦 Queue ID:", queueId);
        console.log("📍 Destination from params:", destination);
        
        const response = await fetch(`${apiUrl}/queues/${queueId}/me/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const err = await response.json();
          console.error("❌ Error response:", err);
          
          if (err.detail === "User not found in queue" || err.detail?.includes("not found")) {
            await AsyncStorage.removeItem("currentQueueId");
          }
          
          throw new Error(err.detail?.[0]?.msg || err.detail || "Failed to fetch queue details");
        }

        const statusData = await response.json();
        console.log("✅ User status data:", statusData);

        console.log("🔍 Fetching QR code from API...");
        const qrResponse = await fetch(`${apiUrl}/queues/${queueId}/my-qr-code`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!qrResponse.ok) {
          console.error("❌ Failed to fetch QR code");
        } else {
          const qrResult = await qrResponse.json();
          console.log("📱 QR Response:", qrResult);
          
          const base64QR = qrResult.qr_base64 || qrResult.qr_code || qrResult.qr || qrResult.data || qrResult.image;
          console.log("📱 QR Code (base64):", base64QR ? base64QR.substring(0, 50) + "..." : "null");
          
          setQrData(base64QR);
        }

        const combinedData = {
          ...statusData,
          destination: destination || statusData.destination || "Unknown",
          bus_id: busId || statusData.bus_id || "N/A",
          terminal_status: terminalStatus || "N/A",
        };

        console.log("📦 Combined queue data:", combinedData);
        setQueue(combinedData);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (queueId) fetchQueueDetails();
  }, [queueId, destination, busId, terminalStatus]);

  if (loading) {
    return (
      <View style={qrstyles.container}>
        <ActivityIndicator size="large" color="#096B72" />
        <Text style={{ marginTop: 10 }}>Loading queue details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={qrstyles.container}>
        <Text style={{ color: "red", marginBottom: 20, textAlign: "center", paddingHorizontal: 20 }}>
          Error: {error}
        </Text>
        <Text style={{ marginBottom: 20, textAlign: "center", paddingHorizontal: 20 }}>
          {error.includes("not found") 
            ? "You are not in this queue anymore. Please join a queue first."
            : "Something went wrong loading your queue details."}
        </Text>
        <Pressable onPress={() => router.replace("/terminal")} style={qrstyles.button}>
          <Text style={qrstyles.confirm}>Back to Terminals</Text>
        </Pressable>
      </View>
    );
  }

  if (!queue) return null;

  const handleLeaveQueue = (terminalId) => {
    router.push({
      pathname: "/cancelModal",
      params: { queueId: terminalId },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Bus details',
          headerTransparent: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'Roboto_700Bold',
            fontSize: 20,
          },
        }}
      />

      <View style={qrstyles.container}>
        <View style={qrstyles.qrWrapper}>
          {qrData ? (
            <Image
              source={{ uri: `data:image/png;base64,${qrData}` }}
              style={{ width: qrSize, height: qrSize }}
              resizeMode="contain"
            />
          ) : (
            <QRCode
              value={JSON.stringify({
                ticket_number: queue.ticket_number,
                queue_number: queue.queue_number,
                user_id: queue.user_id,
              })}
              size={qrSize}
              color="black"
              backgroundColor="white"
            />
          )}
        </View>

        <Text style={qrstyles.title}>Terminal {queue.destination || "N/A"}</Text>

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Destination</Text>
          <Image
            source={require('../assets/images/bus-school.png')}
            style={qrstyles.image}
            resizeMode="contain"
          />
          <Text style={qrstyles.info}>{queue.destination}</Text>
        </View>

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Terminal Status</Text>
          <Image
            source={require('../assets/images/bus-school.png')}
            style={qrstyles.image}
            resizeMode="contain"
          />
          <Text style={qrstyles.info}>{queue.terminal_status}</Text>
        </View>

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Your Status - </Text>
          <Text style={qrstyles.info}>{queue.status || "waiting"}</Text>
        </View>

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Queue number - </Text>
          <Text style={qrstyles.info}>#{queue.queue_number}</Text>
        </View>

        <Text style={qrstyles.subtitle}>
          You`re all set! Just show this QR to the attendant when boarding.
        </Text>

        <Pressable style={qrstyles.button} onPress={() => handleLeaveQueue(queueId)}>
          <Text style={qrstyles.confirm}>Cancel Queue</Text>
        </Pressable>
      </View>
    </>
  );
}