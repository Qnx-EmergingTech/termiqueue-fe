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
  const { queueId } = useLocalSearchParams();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchQueueDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");
      const response = await fetch(`${apiUrl}/queues/${queueId}/me/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          const err = await response.json();
          console.error("Error response:", err);
          throw new Error(err.detail?.[0]?.msg || "Failed to fetch queue details");
        }

        const data = await response.json();
        setQueue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  if (queueId) fetchQueueDetails();
}, [queueId]);

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
        <Text style={{ color: "red" }}>Error: {error}</Text>
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
    </View>
      <Text style={qrstyles.title}>Terminal {queue.bus_id || "N/A"}</Text>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Destination</Text>
      <Image
        source={require('../assets/images/bus-school.png')}
        style={qrstyles.image}
        resizeMode="contain"
      />
      <Text style={qrstyles.info}>{queue.destination || "Unknown"}</Text>
      </View>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Estimated time arrival</Text>
      <Image
        source={require('../assets/images/bus-school.png')}
        style={qrstyles.image}
        resizeMode="contain"
      />
      <Text style={qrstyles.info}>{queue.status || "N/A"}</Text>
      </View>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Queue number - </Text>
      <Text style={qrstyles.info}>#{queue.queue_number}</Text>
      </View>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Trip duration estimation - </Text>
      <Text style={qrstyles.info}>1hr 20mins</Text>
      </View>
      <Text style={qrstyles.subtitle}>You're all set! Just show this QR to the attendant when boarding.</Text>

      <Pressable style={qrstyles.button} onPress={() => handleLeaveQueue(queueId)}>
          <Text style={qrstyles.confirm}>Cancel Queue</Text>
      </Pressable>
    </View>
  </>
  );
}
