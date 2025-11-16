import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth } from "@react-native-firebase/auth";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
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
import { firebaseApp } from "../../services/firebaseConfig";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const Signup = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate age
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const saveDetails = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert("Error", "Name must be at least 3 characters long.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!dateOfBirth) {
      Alert.alert("Error", "Please select your date of birth.");
      return;
    }

    const age = calculateAge(dateOfBirth);
    if (age < 5) {
      Alert.alert("Error", "You must be at least 5 years old to register.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(
        "Error",
        "Please accept the Terms & Conditions and Privacy Policy to continue."
      );
      return;
    }

    if (!user) {
      Alert.alert("Error", "No authenticated user found. Please login again.");
      router.replace("/(auth)");
      return;
    }

    setLoading(true);
    setOverlayLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          dob: dateOfBirth.toISOString(),
          age: calculateAge(dateOfBirth),
          phone: user.phoneNumber || null,
          role: "user",
          privacyAccepted: acceptedTerms,
          termsAccepted: acceptedTerms,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setOverlayLoading(false);
      Alert.alert(
        "Success! 🎉",
        "Your profile has been created successfully!",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(drawer)/(tabs)/home"),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving details:", error);
      setOverlayLoading(false);
      Alert.alert("Error", "Failed to save your details. Please try again.");
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
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="person-add"
                    size={40}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.title}>Complete Your Profile 📝</Text>
                <Text style={styles.subtitle}>
                  Just a few more details to get started with GyanBrix
                </Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* Name Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name *</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === "name" && styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={focusedField === "name" ? COLORS.primary : "#999"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.placeholderText}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      keyboardType="default"
                      // onFocus={() => setFocusedField("name")}
                      // onBlur={() => setFocusedField(null)}
                    />
                    {name.length >= 3 && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10B981"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address *</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === "email" && styles.inputContainerFocused,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={focusedField === "email" ? COLORS.primary : "#999"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="yourname@example.com"
                      placeholderTextColor={COLORS.placeholderText}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    {isValidEmail(email) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10B981"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </View>
                </View>

                {/* Date of Birth Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date of Birth *</Text>
                  <TouchableOpacity
                    style={[
                      styles.inputContainer,
                      focusedField === "dob" && styles.inputContainerFocused,
                    ]}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={dateOfBirth ? COLORS.primary : "#999"}
                      style={styles.inputIcon}
                    />
                    <Text
                      style={[
                        styles.input,
                        !dateOfBirth && { color: COLORS.placeholderText },
                      ]}
                    >
                      {dateOfBirth
                        ? formatDate(dateOfBirth)
                        : "Select your date of birth"}
                    </Text>
                    {dateOfBirth && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#10B981"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </TouchableOpacity>
                  {dateOfBirth && (
                    <Text style={styles.helperText}>
                      Age: {calculateAge(dateOfBirth)} years
                    </Text>
                  )}
                </View>

                {/* Date Picker Modal */}
                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth || new Date(2010, 0, 1)}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1950, 0, 1)}
                  />
                )}

                {/* Terms and Conditions Checkbox */}
                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkboxBox,
                        acceptedTerms && styles.checkboxBoxChecked,
                      ]}
                    >
                      {acceptedTerms && (
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.termsTextContainer}>
                    <Text style={styles.termsText}>I agree to the </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          "http://127.0.0.1:3000/terms-and-conditions"
                        )
                      }
                    >
                      <Text style={styles.termsLink}>Terms & Conditions</Text>
                    </TouchableOpacity>
                    <Text style={styles.termsText}> and </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("http://127.0.0.1:3000/privacy-policy")
                      }
                    >
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    (loading || !acceptedTerms) && { opacity: 0.7 },
                    { marginTop: 24 },
                  ]}
                  onPress={saveDetails}
                  disabled={loading || !acceptedTerms}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Creating Profile..." : "Save & Continue"}
                  </Text>
                  {!loading && (
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  )}
                </TouchableOpacity>

                {(!acceptedTerms || !dateOfBirth) && (
                  <Text style={styles.warningText}>
                    {!dateOfBirth
                      ? "⚠️ Please select your date of birth"
                      : "⚠️ Please accept terms to continue"}
                  </Text>
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
            <Text style={styles.overlayText}>Creating your profile...</Text>
            <Text style={styles.overlaySubtext}>Just a moment</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Signup;
