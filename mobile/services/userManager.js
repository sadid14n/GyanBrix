import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Helper function to fetch user profile from Firestore
export const getUserData = async (uid) => {
  try {
    const userRef = firestore().collection("users").doc(uid);
    const snap = await userRef.get();
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

  // Signup with email & password
  const signup = async (email, password, role = "user") => {
    try {
      const res = await auth().createUserWithEmailAndPassword(email, password);
      const newUser = res.user;

      // Save user profile to Firestore
      await firestore().collection("users").doc(newUser.uid).set({
        email: newUser.email,
        role,
        createdAt: new Date().toISOString(),
      });

      setUser(newUser);
      setProfile({ email: newUser.email, role });
      return newUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Login with email & password
  const login = async (email, password) => {
    try {
      return await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Update user profile (name, etc.)
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      const userRef = firestore().collection("users").doc(user.uid);
      await userRef.update(updates);

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
      await auth().signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Update user's selected class
  const updateUserSelectedClass = async (uid, classId) => {
    try {
      const userRef = firestore().collection("users").doc(uid);
      await userRef.update({ selectedClass: classId });
    } catch (error) {
      console.error("Error updating user selected class:", error);
      throw error;
    }
  };

  // Get user profile with saved class
  const getUserProfile = async (uid) => {
    try {
      const userRef = firestore().collection("users").doc(uid);
      const snap = await userRef.get();
      return snap.exists ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
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
    });

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
