import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getIdTokenResult,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // signup
  const signup = async (email, password, role = "user") => {
    const res = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const newUser = res.user;

    await setDoc(doc(firestoreDB, "users", newUser.uid), {
      email: newUser.email,
      role,
      createdAt: new Date(),
    });

    setUser(newUser);
    setProfile({ email: newUser.email, role });
    return newUser;
  };

  // login
  const login = (email, password) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  // 📌 Login with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(firebaseAuth, provider);
    const newUser = res.user;

    // check if user already exists in Firestore
    const ref = doc(firestoreDB, "users", newUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // first time login → create Firestore profile
      await setDoc(ref, {
        email: newUser.email,
        name: newUser.displayName,
        photoURL: newUser.photoURL,
        role: "user", // default role
        createdAt: new Date(),
      });
    }

    setUser(newUser);
    setProfile({
      email: newUser.email,
      name: newUser.displayName,
      photoURL: newUser.photoURL,
      role: snap.exists() ? snap.data().role : "user",
    });

    return newUser;
  };

  // logout
  const logout = () => signOut(firebaseAuth);

  // listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const ref = doc(firestoreDB, "users", currentUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) setProfile(snap.data());

          // ✅ Get the latest token result (includes custom claims)
          try {
            const idTokenResult = await getIdTokenResult(currentUser, true);
            const role = idTokenResult.claims.role || "user";

            // 🔥 Console log role + token info
            console.log("👤 Auth state changed:");
            console.log("UID:", currentUser.uid);
            console.log("Phone:", currentUser.phoneNumber || currentUser.email);
            console.log("Role from custom claim:", role);
            console.log("Full token claims:", idTokenResult.claims);
          } catch (error) {
            console.error("Error fetching token claims:", error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signup, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
