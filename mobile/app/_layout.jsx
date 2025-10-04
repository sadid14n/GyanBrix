import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
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

  // Hide splash once loading is done
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // Redirect logic
  useEffect(() => {
    if (loading || segments.length === 0) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = !!user;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  // Don't render anything while auth state is loading
  if (loading) {
    return null; // or a Splash/Loader component
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
