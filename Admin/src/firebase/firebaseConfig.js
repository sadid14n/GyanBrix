import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3VkTfSdOfJhX-MuDljst5G8npc3WQe7Q",
  authDomain: "gyanbrix-25.firebaseapp.com",
  projectId: "gyanbrix-25",
  storageBucket: "gyanbrix-25.firebasestorage.app",
  messagingSenderId: "536572186075",
  appId: "1:536572186075:web:babe2c5b22fdc01ae1ebfe",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp);
