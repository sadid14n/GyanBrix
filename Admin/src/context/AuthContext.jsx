import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
      value={{ user, profile, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
