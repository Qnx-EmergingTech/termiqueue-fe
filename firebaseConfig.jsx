import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyA3r4cUe7Vf4h0PSdzG00i5qm7RzKiV804",
  authDomain: "qnext-qnx.firebaseapp.com",
  projectId: "qnext-qnx",
  storageBucket: "qnext-qnx.firebasestorage.app",
  messagingSenderId: "565011913202",
  appId: "1:565011913202:web:fcb5e0e9dd346a5f0f736b",
  measurementId: "G-5HG6VEDC5C"
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { auth, db };
