import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA3VkTfSdOfJhX-MuDljst5G8npc3WQe7Q",
  authDomain: "gyanbrix-25.firebaseapp.com",
  projectId: "gyanbrix-25",
  storageBucket: "gyanbrix-25.firebasestorage.app",
  messagingSenderId: "536572186075",
  appId: "1:536572186075:web:babe2c5b22fdc01ae1ebfe",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// created firebase context
const FirebaseContext = createContext(null);

// create custom hook
export const useFirebase = () => useContext(FirebaseContext);

// Firebase Provider
export const FirebaseProvider = (props) => {
  const signupUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };
  return (
    <FirebaseContext.Provider value={{ signupUserWithEmailAndPassword }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
