import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTMnpT8RPKfrYsSRmyYc8i7QZuZTTrU3s",
  authDomain: "termiq-f37d7.firebaseapp.com",
  projectId: "termiq-f37d7",
  storageBucket: "termiq-f37d7.firebasestorage.app",
  messagingSenderId: "625210482750",
  appId: "1:625210482750:web:5a9ee773947f34b051716f",
  measurementId: "G-DZNWKFSCET"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);