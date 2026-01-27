import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
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

  const fetchQueueDetails = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");

      const response = await fetch(
        `${apiUrl}/queues/${queueId}/me/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const err = await response.json();

        if (
          err.detail === "User not found in queue" ||
          err.detail?.includes("not found")
        ) {
          await AsyncStorage.removeItem("currentQueueId");
        }

        throw new Error(err.detail || "Failed to fetch queue");
      }

      const statusData = await response.json();

      if (statusData.status === "boarded") {
        router.replace("/scan-success");
        return;
      }

      const qrResponse = await fetch(
        `${apiUrl}/queues/${queueId}/my-qr-code`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (qrResponse.ok) {
        const qrResult = await qrResponse.json();
        setQrData(
          qrResult.qr_base64 ||
            qrResult.qr_code ||
            qrResult.qr ||
            qrResult.data
        );
      }

      setQueue({
        ...statusData,
        destination: destination || statusData.destination || "Unknown",
        bus_id: busId || statusData.bus_id || "N/A",
        terminal_status: terminalStatus || "N/A",
      });

      setError(null);
    } catch (err) {
      console.error("QR fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [queueId, apiUrl, destination, busId, terminalStatus, router]);

  useEffect(() => {
    let interval;

    if (queueId) {
      fetchQueueDetails();
      interval = setInterval(fetchQueueDetails, 5000);
    }

    return () => clearInterval(interval);
  }, [queueId, fetchQueueDetails]);

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
        <Text style={{ color: "red", textAlign: "center" }}>
          {error}
        </Text>

        <Pressable
          onPress={() => router.replace("/terminal")}
          style={qrstyles.button}
        >
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

  const handleReturn = () => {          
    router.replace('/home');          
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Bus details',
          headerTransparent: false,
          headerBackTitleVisible: false,
          headerBackVisible: false,
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

      <View style={{ padding: 20 }}>
        <Text style={qrstyles.title}>ONE AYALA TERMINAL</Text>

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Departure</Text>
          <Image
            source={require('../assets/images/bus-school.png')}
            style={qrstyles.image}
            resizeMode="contain"
          />
          <Text style={qrstyles.info}>One Ayala</Text>
        </View>

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Destination</Text>
          <Image
            source={require('../assets/images/bus-school.png')}
            style={qrstyles.image}
            resizeMode="contain"
          />
          <Text style={qrstyles.info}>{queue.destination}</Text>
        </View>

        {/* <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Your Status - </Text>
          <Text style={qrstyles.info}>{queue.status || "waiting"}</Text>
        </View> */}

        <View style={qrstyles.textContainer}>
          <Text style={qrstyles.info}>Ticket number - </Text>
          <Text style={qrstyles.info}>#{queue.ticket_number}</Text>
        </View>

        <Text style={qrstyles.subtitle}>
          You are all set! Just show this QR to the attendant when boarding.
        </Text>
      </View>

      <View style={qrstyles.bottomButtons}>
        <Pressable style={qrstyles.button} onPress={() => handleLeaveQueue(queueId)}>
          <Text style={qrstyles.confirm}>Cancel Queue</Text>
        </Pressable>

        <Pressable style={qrstyles.rbutton} onPress={handleReturn}>
          <Text style={qrstyles.return}>Return to Home</Text>
        </Pressable>
      </View>
      </View>
    </>
  );
}