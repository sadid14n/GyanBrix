import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3VkTfSdOfJhX-MuDljst5G8npc3WQe7Q",
  authDomain: "gyanbrix-25.firebaseapp.com",
  projectId: "gyanbrix-25",
  storageBucket: "gyanbrix-25.firebasestorage.app",
  messagingSenderId: "536572186075",
  appId: "1:536572186075:web:ce1e79207e5b0cb9e1ebfe",
};

// ✅ Ensure only one app is initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth only once
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If already initialized, just getAuth
  firebaseAuth = getAuth(app);
}

// ✅ Firestore
const firestoreDB = getFirestore(app);

export { firebaseAuth, firestoreDB };
