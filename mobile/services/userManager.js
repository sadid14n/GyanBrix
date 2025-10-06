import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { firebaseAuth, firestoreDB } from "./firebaseConfig";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Helper function to fetch user profile from Firestore
export const getUserData = async (uid) => {
  try {
    const ref = doc(firestoreDB, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup
  const signup = async (email, password, role = "user") => {
    try {
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
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(firebaseAuth, provider);
      const newUser = res.user;

      // Fetch Firestore profile
      const ref = doc(firestoreDB, "users", newUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          email: newUser.email,
          name: newUser.displayName,
          photoURL: newUser.photoURL,
          role: "user",
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
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Update user profile (like name, photoURL, etc.)
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      const ref = doc(firestoreDB, "users", user.uid);
      await updateDoc(ref, updates);

      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);

      return updatedProfile;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  /* 🧩 Update user’s selected class */
  const updateUserSelectedClass = async (uid, classId) => {
    try {
      const userRef = doc(firestoreDB, "users", uid);
      await updateDoc(userRef, { selectedClass: classId });
    } catch (error) {
      console.error("Error updating user selected class:", error);
      throw error;
    }
  };

  /* 📦 Get user profile (with saved class) */
  const getUserProfile = async (uid) => {
    try {
      const ref = doc(firestoreDB, "users", uid);
      const snap = await getDoc(ref);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        console.log("Auth state changed:", currentUser);
        try {
          if (currentUser) {
            setUser(currentUser);
            const userProfile = await getUserData(currentUser.uid);
            setProfile(userProfile);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("Auth state error:", error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        getUserData,
        updateProfile,
        updateUserSelectedClass,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
