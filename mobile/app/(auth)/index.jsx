import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/color";
import styles from "../../constants/styles/login.style";

import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { firebaseApp } from "../../services/firebaseConfig";

const auth = getAuth(firebaseApp);

const Login = () => {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Function to send OTP
  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert(
        "Error",
        "Please enter a valid phone number with country code."
      );
      return;
    }

    setLoading(true);
    setOverlayLoading(true);

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone);
      setConfirm(confirmation);
      setResendTimer(30); // 30 seconds countdown
      setCanResend(false);

      setOverlayLoading(false);
      Alert.alert("Success", "OTP sent successfully! Check your phone.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOverlayLoading(false);

      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format. Use +91XXXXXXXXXX";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to resend OTP
  const resendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(30);

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone);
      setConfirm(confirmation);
      Alert.alert("Success", "OTP resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  // Function to confirm OTP - Always redirect to signup
  const confirmCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setOverlayLoading(true);

    try {
      // Confirm OTP
      await confirm.confirm(code);

      setOverlayLoading(false);
      Alert.alert("Success", "Phone verified! Please complete your profile.");
      router.replace("/(auth)/signup");
    } catch (error) {
      console.error("Error confirming code:", error);
      setOverlayLoading(false);

      let errorMessage = "Invalid OTP. Please try again.";
      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "Invalid OTP code. Please check and try again.";
      } else if (error.code === "auth/code-expired") {
        errorMessage = "OTP has expired. Please request a new one.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Top Illustration */}
            <View style={styles.topIllustration}>
              <Image
                source={require("../../assets/images/login.png")}
                style={styles.illustrationImage}
                resizeMode="contain"
              />
            </View>

            {/* Main Card */}
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {/* Header */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.title}>
                    {!confirm ? "Welcome Back! 👋" : "Verify OTP 🔐"}
                  </Text>
                  <Text style={styles.subtitle}>
                    {!confirm
                      ? "Enter your phone number to continue"
                      : `Enter the 6-digit code sent to ${phone}`}
                  </Text>
                </View>

                {/* Phone Input or OTP Input */}
                {!confirm ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Phone Number</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons
                          name="call-outline"
                          size={20}
                          color={COLORS.primary}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="+91 98765 43210"
                          placeholderTextColor={COLORS.placeholderText}
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          autoCapitalize="none"
                          maxLength={15}
                        />
                      </View>
                      <Text style={styles.helperText}>
                        Include country code (e.g., +91 for India)
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.button, loading && { opacity: 0.7 }]}
                      onPress={sendOtp}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                      </Text>
                      {!loading && (
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Enter OTP</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color={COLORS.primary}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.input,
                            { letterSpacing: 8, fontSize: 20 },
                          ]}
                          placeholder="● ● ● ● ● ●"
                          placeholderTextColor={COLORS.placeholderText}
                          value={code}
                          onChangeText={setCode}
                          keyboardType="number-pad"
                          maxLength={6}
                          autoFocus
                        />
                      </View>
                    </View>

                    {/* Resend OTP Section */}
                    <View style={styles.resendContainer}>
                      {resendTimer > 0 ? (
                        <Text style={styles.timerText}>
                          Resend OTP in {resendTimer}s
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={resendOtp}
                          disabled={!canResend}
                        >
                          <Text
                            style={[
                              styles.resendText,
                              !canResend && { opacity: 0.5 },
                            ]}
                          >
                            Didn't receive? Resend OTP
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[styles.button, loading && { opacity: 0.7 }]}
                      onPress={confirmCode}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </Text>
                      {!loading && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#fff"
                        />
                      )}
                    </TouchableOpacity>

                    {/* Change Number */}
                    <TouchableOpacity
                      style={styles.changeNumberButton}
                      onPress={() => {
                        setConfirm(null);
                        setCode("");
                        setResendTimer(0);
                        setCanResend(false);
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={styles.changeNumberText}>
                        Change Phone Number
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Overlay Loading Modal */}
      <Modal
        visible={overlayLoading}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.overlayText}>
              {!confirm ? "Sending OTP..." : "Verifying..."}
            </Text>
            <Text style={styles.overlaySubtext}>Please wait</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Login;
