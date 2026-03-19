// ============================================
// 🛹 SOSKATE - ROOT LAYOUT
// ============================================
// Layout racine avec providers (Auth, Theme, Navigation)

import { AuthProvider } from "@/src/shared/contexts/AuthContext";
import { ThemeProvider } from "@/src/shared/theme";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ErrorFallback from "@/src/shared/ui/feedback/ErrorFallback";
import ErrorBoundary from "@/src/shared/ui/feedback/ErrorBoundary";
import { StyleSheet } from "react-native";
import {LocationProvider} from "@/src/shared/contexts/LocationContext";
import {AlertProvider} from "@/src/shared/ui/CustomModal/AlertContext";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
              <LocationProvider>
                  <AlertProvider>
                      <Stack screenOptions={{ headerShown: false }}>
                          <Stack.Screen name="index" />
                          <Stack.Screen name="(auth)" />
                          <Stack.Screen name="(tabs)" />
                          <Stack.Screen
                              name="(modals)/profileModal"
                              options={{
                                  presentation: "modal",
                                  animation: "slide_from_bottom",
                              }}
                          />
                          <Stack.Screen
                              name="(modals)/settingsModal"
                              options={{
                                  presentation: "modal",
                                  animation: "slide_from_bottom",
                              }}
                          />
                      </Stack>
                  </AlertProvider>
              </LocationProvider>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
