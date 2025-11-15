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

  // Format date of birth for display
  const formatDateOfBirth = (dob) => {
    if (!dob) return "Not provided";

    try {
      const date = new Date(dob);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;

    try {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch (error) {
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      setLoggingOut(false);
      router.replace("../../../(auth)");
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
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text
          style={{ color: COLORS.textPrimary, fontSize: 18, marginTop: 12 }}
        >
          Loading profile...
        </Text>
      </View>
    );
  }

  const age = calculateAge(profile.dateOfBirth || profile.dob);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F5F7FA" }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile Header */}
      <View
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
          paddingVertical: 40,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: `${COLORS.primary}20`,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
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
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}
        >
          {profile.name || "Unnamed User"}
        </Text>

        <Text style={{ fontSize: 15, color: "#666", marginBottom: 8 }}>
          {profile.email}
        </Text>

        {/* {age && (
          <View
            style={{
              backgroundColor: `${COLORS.primary}15`,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 14, color: COLORS.primary, fontWeight: "600" }}
            >
              {age} years old
            </Text>
          </View>
        )} */}

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 12,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => router.push("/(drawer)/(tabs)/profile/edit")}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Personal Details */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: COLORS.textPrimary,
            marginBottom: 16,
          }}
        >
          Personal Details
        </Text>

        {renderDetail("Full Name", profile.name, "person-outline")}
        {renderDetail("Email", profile.email, "mail-outline")}
        {renderDetail(
          "Date of Birth",
          formatDateOfBirth(profile.dateOfBirth || profile.dob),
          "calendar-outline"
        )}
        {renderDetail("Phone", profile.phone, "call-outline")}
        {renderDetail("State", profile.state, "location-outline")}
        {renderDetail("District", profile.district, "navigate-outline")}
        {renderDetail("Town", profile.town, "home-outline")}
        {renderDetail("PIN Code", profile.pin, "flag-outline")}
      </View>

      {/* Academic Details */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: COLORS.textPrimary,
            marginBottom: 16,
          }}
        >
          Academic Details
        </Text>

        {renderDetail(
          "Class",
          profile.className || "Not assigned",
          "school-outline"
        )}
        {renderDetail(
          "School/Institute",
          profile.institute || "N/A",
          "business-outline"
        )}
      </View>

      {/* Logout Button */}
      <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#E53935",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            shadowColor: "#E53935",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
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
      </View>
    </ScrollView>
  );
}

// Helper for displaying each field - Enhanced version
const renderDetail = (label, value, icon) => {
  // Import Ionicons at the top of your file
  const Ionicons = require("@expo/vector-icons").Ionicons;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${COLORS.primary}15`,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", color: "#666", fontSize: 13 }}>
          {label}
        </Text>
        <Text
          style={{
            color: "#1A1A1A",
            marginTop: 2,
            fontSize: 15,
            fontWeight: "500",
          }}
        >
          {value || "Not provided"}
        </Text>
      </View>
    </View>
  );
};
