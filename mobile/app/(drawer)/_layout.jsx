import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import { Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../constants/color";
import { useAuth } from "../../services/userManager";

export default function DrawerLayout() {
  const navigation = useNavigation();
  const { logout, profile, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("/(auth)"); // redirect to signin page
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Drawer
      screenOptions={{
        headerTitle: () => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>GyanBrix</Text>
          </View>
        ),
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerStyle: {
          height: 80,
        },
        drawerActiveTintColor: "#ff6600",
        drawerInactiveTintColor: "#888",
        drawerStyle: { backgroundColor: "#f5f5f5", width: 280 },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          {/* --- User Info Section --- */}
          {user && (
            <View
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
                paddingVertical: 20,
                marginBottom: 10,
                backgroundColor: "#fff",
              }}
            >
              <Ionicons name="person-circle-outline" size={80} color="#555" />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {user.displayName || "User"}
              </Text>
              <Text style={{ color: "#555" }}>
                {profile?.email || user?.email}
              </Text>
            </View>
          )}

          {/* --- Default Drawer Screens --- */}
          <DrawerItemList {...props} />

          {/* --- Logout Button --- */}
          <View style={{ marginTop: "auto", padding: 20 }}>
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS?.primary || "#ff6600",
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Ionicons name="log-out-outline" color="white" size={22} />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
