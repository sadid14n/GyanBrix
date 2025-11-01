import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/color";
import styles from "../../constants/styles/login.style";

import { getAuth } from "@react-native-firebase/auth";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { firebaseApp } from "../../services/firebaseConfig";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const Signup = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const saveDetails = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "No authenticated user found.");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          name: name.trim(),
          email: email.trim(),
          phone: user.phoneNumber || null,
          role: "user",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Success", "Your details have been saved successfully!");
      // router.push("/(drawer)/(tabs)/home"); // Navigate to home
    } catch (error) {
      console.error("Error saving details:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>GyanBrix</Text>
            <Text style={styles.subtitle}>
              Your Study Buddy, Brick by Brick, GyanBrix
            </Text>
          </View>

          {/* Form Input */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Full Name"
                  placeholderTextColor={COLORS.placeholderText}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  keyboardType="default"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={saveDetails}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Saving..." : "Save & Continue"}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
