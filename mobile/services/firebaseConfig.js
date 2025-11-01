// firebase.js
import { getApp, getApps } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// 👇 Get the already-initialized native app (from google-services.json)
const firebaseApp = getApps().length ? getApp() : null;

// 👇 Pass that app instance to modular APIs
const firebaseAuth = getAuth(firebaseApp);
const firestoreDB = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestoreDB };
