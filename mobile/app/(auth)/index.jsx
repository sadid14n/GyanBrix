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
  const [phoneError, setPhoneError] = useState("");

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

  // Smart phone number formatting and validation
  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters except +
    let cleaned = input.replace(/[^\d+]/g, "");

    // If user types only digits (no +)
    if (!cleaned.startsWith("+")) {
      // Remove leading zeros
      cleaned = cleaned.replace(/^0+/, "");

      // Case 1: User enters 10 digits (e.g., 9876543210)
      if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
        return `+91${cleaned}`;
      }

      // Case 2: User enters 12 digits starting with 91 (e.g., 919876543210)
      if (cleaned.length === 12 && cleaned.startsWith("91")) {
        return `+${cleaned}`;
      }

      // Case 3: User enters 11 digits starting with 91 (missing one digit)
      if (cleaned.length === 11 && cleaned.startsWith("91")) {
        return `+${cleaned}`;
      }

      // Case 4: Add + to beginning if user enters country code
      if (cleaned.length > 10) {
        return `+${cleaned}`;
      }

      // Case 5: Less than 10 digits - just return with + for other countries
      if (cleaned.length > 0 && cleaned.length < 10) {
        return `+91${cleaned}`;
      }
    }

    return cleaned;
  };

  // Validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    // Remove spaces and special characters for validation
    const cleaned = phoneNumber.replace(/[\s\-()]/g, "");

    // Check if it's a valid format
    // Indian number: +91 followed by 10 digits
    const indianPattern = /^\+91[6-9]\d{9}$/;

    // International format: + followed by country code and number
    const internationalPattern = /^\+\d{10,15}$/;

    if (indianPattern.test(cleaned)) {
      return { valid: true, formatted: cleaned };
    }

    if (internationalPattern.test(cleaned)) {
      return { valid: true, formatted: cleaned };
    }

    // Check common errors
    if (!cleaned.startsWith("+")) {
      return {
        valid: false,
        error: "Phone number must include country code (e.g., +91)",
      };
    }

    if (cleaned.length < 12) {
      return {
        valid: false,
        error: "Phone number is too short. Indian numbers need 10 digits.",
      };
    }

    if (cleaned.length > 15) {
      return {
        valid: false,
        error: "Phone number is too long.",
      };
    }

    return {
      valid: false,
      error: "Invalid phone number format.",
    };
  };

  // Handle phone input change
  const handlePhoneChange = (text) => {
    setPhoneError("");
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  // Function to send OTP
  const sendOtp = async () => {
    // Validate phone number
    const validation = validatePhoneNumber(phone);

    if (!validation.valid) {
      setPhoneError(validation.error);
      Alert.alert("Invalid Phone Number", validation.error);
      return;
    }

    setLoading(true);
    setOverlayLoading(true);

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        validation.formatted
      );
      setConfirm(confirmation);
      setResendTimer(30);
      setCanResend(false);

      setOverlayLoading(false);
      Alert.alert("Success", "OTP sent successfully! Check your phone.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOverlayLoading(false);

      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        errorMessage =
          "Invalid phone number format. Please check and try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "Daily SMS quota exceeded. Please try again tomorrow.";
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

  // Function to confirm OTP
  const confirmCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setOverlayLoading(true);

    try {
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

  // Get phone number display (formatted for readability)
  const getDisplayPhone = () => {
    if (!phone) return "";
    // Format: +91 98765 43210
    if (phone.startsWith("+91") && phone.length === 13) {
      return `${phone.slice(0, 3)} ${phone.slice(3, 8)} ${phone.slice(8)}`;
    }
    return phone;
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
                      : `Enter the 6-digit code sent to ${getDisplayPhone()}`}
                  </Text>
                </View>

                {/* Phone Input or OTP Input */}
                {!confirm ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Phone Number</Text>
                      <View
                        style={[
                          styles.inputContainer,
                          phoneError && styles.inputContainerError,
                        ]}
                      >
                        <Ionicons
                          name="call-outline"
                          size={20}
                          color={phoneError ? "#EF4444" : COLORS.primary}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="9876543210 or +919876543210"
                          placeholderTextColor={COLORS.placeholderText}
                          value={phone}
                          onChangeText={handlePhoneChange}
                          keyboardType="phone-pad"
                          autoCapitalize="none"
                          maxLength={15}
                        />
                        {phone.length === 13 && !phoneError && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#10B981"
                            style={{ marginLeft: 8 }}
                          />
                        )}
                      </View>
                      {phoneError ? (
                        <Text style={styles.errorText}>{phoneError}</Text>
                      ) : (
                        <Text style={styles.helperText}>
                          Enter 10 digits or include +91 for India
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.button,
                        (loading || phone.length < 10) && { opacity: 0.7 },
                      ]}
                      onPress={sendOtp}
                      disabled={loading || phone.length < 10}
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
