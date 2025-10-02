import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { Image } from 'react-native';


export default function terminalModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const closeAndGoHome = () => {
    setVisible(false);
    setTimeout(() => router.replace('/home'), 150);
  };

  const handleConfirm = () => {
    setVisible(false);           
    router.replace('/qr');          
  };

  const handleCancel = () => {
    setVisible(false);           
    router.replace('/terminal');          
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
              <Text style={styles.title}>Select terminal?</Text>
              <Text style={styles.text}>
                This bus is already here, if you didn't make it, your queue prioritization would just go down but you will still be able to queue.
              </Text>

              <Pressable style={styles.button} onPress={handleConfirm}>
                <Text style={styles.cbutton}>Confirm</Text>
              </Pressable>

              <Pressable style={styles.button2} onPress={handleCancel}>
                <Text style={styles.cancelbutton}>Cancel</Text>
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
