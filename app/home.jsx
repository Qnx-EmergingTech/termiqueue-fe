import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput
} from "react-native";
import styles from "../src/styles/styles";

export default function home() {
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Your normal home content */}
      <Text style={styles.title}>🏠 Home Page</Text>

      <Pressable style={styles.loginButton} onPress={() => setLoginVisible(true)}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      {/* === LOGIN MODAL === */}
      <Modal
        visible={loginVisible}
        animationType="fade"      // nice subtle effect
        transparent={true}        // lets the Home screen remain visible behind
        onRequestClose={() => setLoginVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalBox}>
            {/* Close / X */}
            <Pressable style={styles.closeIcon} onPress={() => setLoginVisible(false)}>
              <Text style={{fontSize:18}}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Login</Text>
            <TextInput placeholder="Email" style={styles.input}/>
            <TextInput placeholder="Password" style={styles.input} secureTextEntry/>
            <Pressable style={styles.submitButton} onPress={() => { /* handle login */ }}>
              <Text style={styles.submitText}>Log In</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
