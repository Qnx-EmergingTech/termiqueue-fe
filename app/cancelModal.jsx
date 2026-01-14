import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function CancelModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  const { queueId } = useLocalSearchParams();
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const closeAndGoHome = () => {
    setVisible(false);
    setTimeout(() => router.replace('/qr'), 150);
  };

  const handleConfirm = async () => {
    try {
      const token = await AsyncStorage.getItem("firebaseIdToken");
      if (!token) {
        Alert.alert("Error", "No authentication token found");
        return;
      }

      const response = await fetch(`${apiUrl}/queues/${queueId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Leave queue failed:", errData);
        Alert.alert("Error", errData.detail || "Failed to leave queue");
        return;
      }

      await AsyncStorage.removeItem("currentQueueId");
      Alert.alert("Success", "You’ve left the queue.");

      setVisible(false);
      router.replace("/terminal");
    } catch (error) {
      console.error("Error leaving queue:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleCancel = () => {
    setVisible(false);           
    router.replace('/qr');          
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeAndGoHome}
    >
      <TouchableWithoutFeedback onPress={closeAndGoHome}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalBox}>
              <Pressable style={styles.closeIcon} onPress={closeAndGoHome}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
              <Image
                source={require('../assets/images/alert.png')}
                style={styles.icon}
              />
              <Text style={styles.title}>Are you sure you want to cancel?</Text>
              <Text style={styles.text}>
                Canceling means you will be removed from the queue, are you sure?
              </Text>

              <Pressable style={styles.button} onPress={handleConfirm}>
                <Text style={styles.cbutton}>Confirm</Text>
              </Pressable>

              <Pressable style={styles.button2} onPress={handleCancel}>
                <Text style={styles.cancelbutton}>Back</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'left',
    gap: 12,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  cbutton:{
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },
  cancelbutton:{
    fontFamily: "Inter_600SemiBold",
    color: "#096B72",
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#096B72",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  button2: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 5,
    borderColor: "#096B72",
    borderWidth: 1,
  },
  icon: {
    width: 48,
    height: 48,
  }
});
