import { firebase } from "@react-native-firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA5ai21uU_Ln_2FlSxXpB3Wmn4tzLGmzx0",
  authDomain: "qnext-bc282.firebaseapp.com",
  projectId: "qnext-bc282",
  storageBucket: "qnext-bc282.firebasestorage.app",
  messagingSenderId: "655635157366",
  appId: "1:655635157366:web:041042eac22a7153c0aa57",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
