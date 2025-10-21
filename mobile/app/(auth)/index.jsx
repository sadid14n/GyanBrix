import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/color";
import styles from "../../constants/styles/login.style";

const Login = () => {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Function to send OTP
  const sendOtp = async () => {
    if (!phone) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmationResult);
      Alert.alert("Success", "OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Function to confirm OTP
  const confirmCode = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the OTP code.");
      return;
    }

    setLoading(true);
    try {
      const result = await confirm.confirm(code); // confirms the OTP
      Alert.alert("Success", "Phone number verified successfully!");
      // ✅ Navigate to signup or home after verification
      router.replace("/(auth)/signup");
    } catch (error) {
      console.error("Error confirming code:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
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
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/login.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            {!confirm ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="+91 12345 54321"
                      placeholderTextColor={COLORS.placeholderText}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={sendOtp}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Enter OTP</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="6 digit code"
                      placeholderTextColor={COLORS.placeholderText}
                      value={code}
                      onChangeText={setCode}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={confirmCode}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href={"/signup"} asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
