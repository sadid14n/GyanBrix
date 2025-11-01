import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../../../services/userManager";

export default function EditProfile() {
  const { profile, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: profile?.name || "",
    dob: profile?.dob || "",
    state: profile?.state || "",
    district: profile?.district || "",
    town: profile?.town || "",
    pin: profile?.pin || "",
    class: profile?.class || "",
    institute: profile?.institute || "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleUpdate = async () => {
    try {
      await updateProfile(form);
      alert("Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Edit Profile
      </Text>

      {/* Full Name */}
      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#a8a8a8ff"
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
        style={styles.input}
      />

      {/* Date of Birth - simple text input */}
      <TextInput
        placeholder="Date of Birth (DD-MM-YYYY)"
        placeholderTextColor="#a8a8a8ff"
        value={form.dob}
        onChangeText={(v) => handleChange("dob", v)}
        style={styles.input}
      />

      {/* State */}
      <TextInput
        placeholder="State"
        placeholderTextColor="#a8a8a8ff"
        value={form.state}
        onChangeText={(v) => handleChange("state", v)}
        style={styles.input}
      />

      {/* District */}
      <TextInput
        placeholder="District"
        placeholderTextColor="#a8a8a8ff"
        value={form.district}
        onChangeText={(v) => handleChange("district", v)}
        style={styles.input}
      />

      {/* Town */}
      <TextInput
        placeholder="Town"
        placeholderTextColor="#a8a8a8ff"
        value={form.town}
        onChangeText={(v) => handleChange("town", v)}
        style={styles.input}
      />

      {/* Pin */}
      <TextInput
        placeholder="Pin Code"
        placeholderTextColor="#a8a8a8ff"
        keyboardType="numeric"
        value={form.pin}
        onChangeText={(v) => handleChange("pin", v)}
        style={styles.input}
      />

      {/* Institute */}
      <TextInput
        placeholder="Institute"
        placeholderTextColor="#a8a8a8ff"
        value={form.institute}
        onChangeText={(v) => handleChange("institute", v)}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Update Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f0f8ff",
  },
};
