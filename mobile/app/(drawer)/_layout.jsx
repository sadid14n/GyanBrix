import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLORS from "./../../constants/color";

// 🔗 Your app share text and link
const APP_SHARE_TEXT =
  "📘 Hey! Check out GyanBrix — an amazing learning app that helps you grow smarter every day! 🚀 Download now:";
const APP_URL = "https://play.google.com/store/apps/details?id=com.gyanbrix";

// const SOCIAL_LINKS = {
//   whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
//     APP_SHARE_TEXT + " " + APP_URL
//   )}`,
//   facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//     APP_URL
//   )}`,
//   youtube: "https://www.youtube.com/@yourchannel", // update your channel
//   telegram: `https://t.me/share/url?url=${encodeURIComponent(
//     APP_URL
//   )}&text=${encodeURIComponent(APP_SHARE_TEXT)}`,
// };

const SOCIAL_ACCOUNTS = {
  whatsapp: "https://whatsapp.com/channel/0029VbBCtWzKrWQupqrzEj2B",
  facebook: "https://facebook.com/yourpage",
  youtube: "https://www.youtube.com/@yourchannel",
  telegram: "https://t.me/yourusername",
  instagram: "https://instagram.com/yourprofile",
};

const CustomDrawerContent = (props) => {
  const pathname = usePathname();

  // Share App Function
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${APP_SHARE_TEXT} ${APP_URL}`,
      });
    } catch (error) {
      console.log("Error sharing app:", error);
    }
  };

  // Open Social Link
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else alert("Cannot open link");
  };

  // Open Play Store Review Page
  const openReview = async () => {
    const url = APP_URL; // change to your real app URL
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>📘 GyanBrix</Text>
        <Text style={styles.tagline}>Brick by Brick, GyanBrix</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <DrawerItem
          label="Home"
          labelStyle={styles.menuLabel}
          icon={({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={22} />
          )}
          onPress={() => router.push("/(drawer)/(tabs)/home")}
          focused={pathname === "/home"}
        />
        <DrawerItem
          label="Profile"
          labelStyle={styles.menuLabel}
          icon={({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={22} />
          )}
          onPress={() => router.push("/(drawer)/(tabs)/profile")}
          focused={pathname === "/profile"}
        />

        {/* 🔸 Divider */}
        <View style={styles.sectionDivider} />

        <DrawerItem
          label="Give Review"
          labelStyle={styles.menuLabel}
          icon={({ color, size }) => (
            <Ionicons name="star-outline" color={color} size={22} />
          )}
          onPress={openReview}
        />

        <DrawerItem
          label="Share App"
          labelStyle={styles.menuLabel}
          icon={({ color, size }) => (
            <Ionicons name="share-social-outline" color={color} size={22} />
          )}
          onPress={handleShare}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Follow & Share</Text>

        {/* <View style={styles.socialRow}>
          <TouchableOpacity
            onPress={() => openLink(SOCIAL_LINKS.whatsapp)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink(SOCIAL_LINKS.facebook)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink(SOCIAL_LINKS.telegram)}
            style={styles.iconBtn}
          >
            <Ionicons name="send-outline" size={24} color="#0088cc" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink(SOCIAL_LINKS.youtube)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View> */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            onPress={() => openLink(SOCIAL_ACCOUNTS.whatsapp)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink(SOCIAL_ACCOUNTS.facebook)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openLink(SOCIAL_ACCOUNTS.instagram)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openLink(SOCIAL_ACCOUNTS.telegram)}
            style={styles.iconBtn}
          >
            <Ionicons name="send-outline" size={24} color="#0088cc" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openLink(SOCIAL_ACCOUNTS.youtube)}
            style={styles.iconBtn}
          >
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
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
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#fff", width: 270 },
        drawerLabelStyle: { fontSize: 16 },
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 12,
    color: "#888",
  },
  menuContainer: {
    marginTop: 10,
  },
  menuLabel: {
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 45,
  },
  iconBtn: {
    marginHorizontal: 8,
  },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6600",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  reviewText: {
    color: "#fff",
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginVertical: 8,
    marginHorizontal: 15,
  },
});
