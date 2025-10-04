// app/(drawer)/_layout.jsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";

export default function DrawerLayout() {
  const navigation = useNavigation();

  return (
    <Drawer
      screenOptions={{
        headerTitle: () => (
          <View
            style={{
              flex: 1,
              justifyContent: "center", // vertical center
              alignItems: "center", // horizontal center
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>GyanBrix</Text>
          </View>
        ),
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerStyle: {
          height: 80, // adjust header height
          padding: 0, // adjust padding to center title vertically
        },
        drawerActiveTintColor: "#ff6600",
        drawerInactiveTintColor: "#888",
        drawerStyle: { backgroundColor: "#f5f5f5", width: 280 },
        drawerItemStyle: { justifyContent: "center" },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home", // hide header title
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
