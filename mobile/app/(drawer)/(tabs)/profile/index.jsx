import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../constants/color";
import { useAuth } from "../../../../services/userManager";

export default function Profile() {
  const { profile, user, setProfile, refreshProfileFromFirebase, logout } =
    useAuth();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!user?.uid) return;
        setLoading(true);

        const updatedProfile = await refreshProfileFromFirebase(user.uid);
        if (updatedProfile) setProfile(updatedProfile);

        setLoading(false);
      };
      fetchData();
    }, [user?.uid])
  );

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      setLoggingOut(false);
      router.replace("../../../(auth)"); // redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  if (loading || !profile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ color: COLORS.textPrimary, fontSize: 18 }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Header */}
      <View
        style={{
          alignItems: "center",
          marginVertical: 30,
        }}
      >
        <Image
          source={{
            uri:
              profile.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
          }}
        />
        <Text
          style={{ fontSize: 22, fontWeight: "700", color: COLORS.primary }}
        >
          {profile.name || "Unnamed User"}
        </Text>
        <Text style={{ fontSize: 14, color: "#555" }}>{profile.email}</Text>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 15,
          }}
          onPress={() => router.push("/(drawer)/(tabs)/profile/edit")}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Details */}
      <View style={{ marginBottom: 25 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: COLORS.textPrimary,
            marginBottom: 10,
          }}
        >
          Personal Details
        </Text>

        {renderDetail("Full Name", profile.name)}
        {renderDetail("Email", profile.email)}
        {renderDetail("Date of Birth", profile.dob)}
        {renderDetail("State", profile.state)}
        {renderDetail("District", profile.district)}
        {renderDetail("Town", profile.town)}
        {renderDetail("PIN Code", profile.pin)}
      </View>

      {/* Academic Details */}
      <View style={{ marginBottom: 25 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: COLORS.textPrimary,
            marginBottom: 10,
          }}
        >
          Academic Details
        </Text>

        {renderDetail("Class", profile.className || "Not assigned")}
        {renderDetail("School/Institute", profile.institute || "N/A")}
      </View>

      {/* 🔘 Simple Logout Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#E53935",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
          marginBottom: 40,
        }}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 16,
              letterSpacing: 0.5,
            }}
          >
            LOG OUT
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Helper for displaying each field
const renderDetail = (label, value) => (
  <View
    style={{
      backgroundColor: "#f4f4f4",
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
    }}
  >
    <Text style={{ fontWeight: "600", color: "#333" }}>{label}</Text>
    <Text style={{ color: "#555", marginTop: 3 }}>
      {value ? value : "Not provided"}
    </Text>
  </View>
);
