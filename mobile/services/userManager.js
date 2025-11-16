import { createContext, useContext, useEffect, useState } from "react";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";

import { getClassName } from "./dataManager";
import { firebaseApp } from "./firebaseConfig";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists) return snap.data();
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

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updates);
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const updateUserSelectedClass = async (uid, classId) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { selectedClass: classId });
    } catch (error) {
      console.error("Error updating user selected class:", error);
      throw error;
    }
  };

  const getUserProfile = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const getUserName = async (userId) => {
    try {
      if (!userId) return "N/A";
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().name || "Unknown User";
      } else {
        return "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Error";
    }
  };

  const refreshProfileFromFirebase = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // 🔹 Fetch class name right here
        if (data.selectedClass) {
          const className = await getClassName(data.selectedClass);
          data.className = className;
        } else {
          data.className = "Not assigned";
        }

        return data;
      } else {
        console.warn("No profile found for user:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        loading,
        logout,
        getUserData,
        updateProfile,
        updateUserSelectedClass,
        getUserProfile,
        getUserName,
        refreshProfileFromFirebase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
