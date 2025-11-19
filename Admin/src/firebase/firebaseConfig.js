import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// 1. Import App Check libraries
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyA3VkTfSdOfJhX-MuDljst5G8npc3WQe7Q",
  authDomain: "gyanbrix-25.firebaseapp.com",
  projectId: "gyanbrix-25",
  // storageBucket: "gyanbrix-25.appspot.com",
  storageBucket: "gyanbrix-25.firebasestorage.app",
  messagingSenderId: "536572186075",
  appId: "1:536572186075:web:babe2c5b22fdc01ae1ebfe",
};

export const firebaseApp = initializeApp(firebaseConfig);

// 2. Initialize App Check
// ============================================================
if (typeof window !== "undefined") {
  // FORCE the debug token using the string you just copied
  // (Remove this line when deploying to production!)
  if (location.hostname === "localhost") {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = "7AB48A40-2CBD-42C4-BD58-738CA14765EA";
  }

  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(
      "6LfLwhEsAAAAAJhDuqv0pHzbaC4VccnBaCcWy0zf"
    ),
    isTokenAutoRefreshEnabled: true,
  });
}
// ============================================================

export const firebaseAuth = getAuth(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp, "asia-south1");
