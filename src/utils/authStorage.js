import AsyncStorage from "@react-native-async-storage/async-storage";
import { getIdToken } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const TOKEN_KEY = "firebaseIdToken";

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};


export const getValidToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const freshToken = await getIdToken(user, false); 
      await AsyncStorage.setItem(TOKEN_KEY, freshToken);
      return freshToken;
    }
  
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting valid token:", error);
    return await AsyncStorage.getItem(TOKEN_KEY); 
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};