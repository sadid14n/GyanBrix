import firestore from "@react-native-firebase/firestore";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { AuthProvider, useAuth } from "../services/userManager";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  // Check Firestore doc if user is signed in
  // useEffect(() => {
  //   const checkUserProfile = async () => {
  //     if (user) {
  //       try {
  //         const userRef = firestore().collection("users").doc(user.uid);
  //         const userSnap = await userRef.get();
  //         setHasProfile(userSnap.exists);
  //       } catch (error) {
  //         console.error("Error checking Firestore user:", error);
  //       }
  //     }
  //     setCheckingProfile(false);
  //   };

  //   checkUserProfile();
  // }, [user]);

  useEffect(() => {
    if (!user) {
      setHasProfile(false);
      setCheckingProfile(false);
      return;
    }

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot(
        (doc) => {
          setHasProfile(doc.exists);
          setCheckingProfile(false);
        },
        (error) => {
          console.error("Error checking Firestore user:", error);
          setCheckingProfile(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  // Hide splash once loading is done
  useEffect(() => {
    if (!loading && !checkingProfile) {
      SplashScreen.hideAsync();
    }
  }, [loading, checkingProfile]);

  // Redirect logic
  // useEffect(() => {
  //   if (loading || checkingProfile || segments.length === 0) return;

  //   const isSignedIn = !!user;

  //   if (!isSignedIn) {
  //     router.replace("/(auth)");
  //   } else if (isSignedIn && !hasProfile) {
  //     router.replace("/(auth)/signup");
  //   } else if (isSignedIn && hasProfile) {
  //     router.replace("/(drawer)/(tabs)/home");
  //   }
  // }, [user, loading, hasProfile, checkingProfile, segments]);

  // useEffect(() => {
  //   if (loading || checkingProfile || segments.length === 0) return;

  //   if (!user) {
  //     router.replace("/(auth)");
  //   } else if (user && !hasProfile) {
  //     router.replace("/(auth)/signup");
  //   } else if (user && hasProfile) {
  //     router.replace("/(drawer)/(tabs)/home");
  //   }
  // }, [user, loading, hasProfile, checkingProfile, segments]);
  useEffect(() => {
    if (loading || checkingProfile || segments.length === 0) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inDrawerGroup = segments[0] === "(drawer)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (user && !hasProfile && !inAuthGroup) {
      router.replace("/(auth)/signup");
    } else if (user && hasProfile && !inDrawerGroup) {
      router.replace("/(drawer)/(tabs)/home");
    }
  }, [user, loading, hasProfile, checkingProfile, segments]);

  if (loading || checkingProfile) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="(drawer)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
