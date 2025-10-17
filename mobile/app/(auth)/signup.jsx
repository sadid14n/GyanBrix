import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { useAuth } from "../../services/userManager";

const Signup = () => {
  // const { isLoading, login, isCheckingAuth } = useAuthStore();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleLogin = async () => {
  //   const result = await login(email, password);
  //   if (!result.success) Alert.alert("Error", result.error);
  // };

  // if (isCheckingAuth) return null;

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      // call signup function (saves user in Firebase + Firestore)
      await signup(email, password, "user");

      Alert.alert("Success", "Account created successfully!");
      // router.replace("/(drawer)/(tabs)/home"); // 👈 redirect to home or dashboard
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message || "Signup failed");
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
            {/*  Email Input*/}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="jhondoe@gmail.com"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                {/* Left Icon */}
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                {/* Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                {/* Right Icon */}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup button */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>{" "}
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
