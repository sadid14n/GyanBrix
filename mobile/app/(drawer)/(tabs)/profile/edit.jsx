import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../constants/color";
import { useAuth } from "../../../../services/userManager";

export default function EditProfile() {
  const { profile, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: profile?.name || "",
    state: profile?.state || "",
    district: profile?.district || "",
    town: profile?.town || "",
    pin: profile?.pin || "",
    institute: profile?.institute || "",
  });

  const [dateOfBirth, setDateOfBirth] = useState(
    profile?.dateOfBirth || profile?.dob
      ? new Date(profile.dateOfBirth || profile.dob)
      : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
    if (!birthDate) return null;
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

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleUpdate = async () => {
    // Validation
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    if (form.name.trim().length < 3) {
      Alert.alert("Error", "Name must be at least 3 characters long.");
      return;
    }

    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      if (age < 5) {
        Alert.alert("Error", "Age must be at least 5 years.");
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {
        ...form,
        ...(dateOfBirth && {
          dateOfBirth: dateOfBirth.toISOString(),
          age: calculateAge(dateOfBirth),
        }),
      };

      await updateProfile(updateData);
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F5F7FA" }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            Edit Profile
          </Text>
          <Text style={{ fontSize: 15, color: "#666" }}>
            Update your personal information
          </Text>
        </View>

        {/* Full Name */}
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
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              style={styles.input}
              // onFocus={() => setFocusedField("name")}
              // onBlur={() => setFocusedField(null)}
            />
            {form.name.length >= 3 && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10B981"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>

        {/* Email (Read-only) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputContainer, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <Text style={[styles.input, { color: "#666" }]}>
              {profile?.email || "Not provided"}
            </Text>
            <Ionicons
              name="lock-closed"
              size={16}
              color="#999"
              style={{ marginLeft: 8 }}
            />
          </View>
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
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
            <Text style={[styles.input, !dateOfBirth && { color: "#999" }]}>
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

        {/* Phone (Read-only) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.inputContainer, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <Text style={[styles.input, { color: "#666" }]}>
              {profile?.phone || "Not provided"}
            </Text>
            <Ionicons
              name="lock-closed"
              size={16}
              color="#999"
              style={{ marginLeft: 8 }}
            />
          </View>
          <Text style={styles.helperText}>Phone number cannot be changed</Text>
        </View>

        {/* Location Section Header */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: COLORS.textPrimary,
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          Location Details
        </Text>

        {/* State */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>State</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "state" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={focusedField === "state" ? COLORS.primary : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your state"
              placeholderTextColor="#999"
              value={form.state}
              onChangeText={(v) => handleChange("state", v)}
              style={styles.input}
              // onFocus={() => setFocusedField("state")}
              // onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* District */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>District</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "district" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="navigate-outline"
              size={20}
              color={focusedField === "district" ? COLORS.primary : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your district"
              placeholderTextColor="#999"
              value={form.district}
              onChangeText={(v) => handleChange("district", v)}
              style={styles.input}
              // onFocus={() => setFocusedField("district")}
              // onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Town */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Town/City</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "town" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="home-outline"
              size={20}
              color={focusedField === "town" ? COLORS.primary : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your town/city"
              placeholderTextColor="#999"
              value={form.town}
              onChangeText={(v) => handleChange("town", v)}
              style={styles.input}
              // onFocus={() => setFocusedField("town")}
              // onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* PIN Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PIN Code</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "pin" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="flag-outline"
              size={20}
              color={focusedField === "pin" ? COLORS.primary : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter PIN code"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={6}
              value={form.pin}
              onChangeText={(v) => handleChange("pin", v)}
              style={styles.input}
              // onFocus={() => setFocusedField("pin")}
              // onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Academic Section Header */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: COLORS.textPrimary,
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          Academic Details
        </Text>

        {/* Institute */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>School/Institute</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "institute" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="business-outline"
              size={20}
              color={focusedField === "institute" ? COLORS.primary : "#999"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your school/institute"
              placeholderTextColor="#999"
              value={form.institute}
              onChangeText={(v) => handleChange("institute", v)}
              style={styles.input}
              // onFocus={() => setFocusedField("institute")}
              // onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 16,
            borderRadius: 12,
            marginTop: 32,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Update Profile
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            marginTop: 12,
            borderWidth: 1.5,
            borderColor: COLORS.primary,
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              textAlign: "center",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    paddingVertical: 0,
  },
  helperText: {
    fontSize: 13,
    color: "#999",
    marginTop: 6,
    marginLeft: 4,
  },
};
