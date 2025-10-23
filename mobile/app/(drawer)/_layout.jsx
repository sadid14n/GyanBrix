import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Button, Text, View } from "react-native";
import { useAuth } from "./../../services/userManager";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();

  const { logout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>GyanBrix</Text>
      </View>
      <DrawerItem
        label={"Home"}
        onPress={() => router.push("/(drawer)/(tabs)/home")}
        focused={pathname === "/home"}
      />
      <DrawerItem
        label={"Profile"}
        onPress={() => router.push("/(drawer)/(tabs)/profile")}
        focused={pathname === "/profile"}
      />
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 10,
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Button title="Logout" onPress={() => logout()} color="red" />
      </View>
    </DrawerContentScrollView>
  );
};

export default function DrawerLayout() {
  return (
    <Drawer
      drawerActiveTintColor="#ff6600"
      drawerInactiveTintColor="#888"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, headerTitle: "GyanBrix" }}
    ></Drawer>
  );
}
