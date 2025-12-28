import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../context/AppContext";
import { useFonts } from "expo-font";
import { View, Text as RNText, LogBox } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';

// Ignore the specific "Already Registered" font warning as it's a known Expo/iOS quirk
LogBox.ignoreLogs(['Font registration was unsuccessful']);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// This prevents the user's system font size settings from breaking the UI
if ((RNText as any).defaultProps) {
  (RNText as any).defaultProps.allowFontScaling = false;
} else {
  (RNText as any).defaultProps = { allowFontScaling: false };
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts aren't loaded and there's no error, keep splash screen
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
