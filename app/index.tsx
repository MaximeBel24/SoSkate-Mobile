// ============================================
// 🛹 SOSKATE - INDEX (ENTRY POINT)
// ============================================
// Point d'entrée avec redirection intelligente basée sur l'état d'auth

import { useAuth } from "@/src/shared/contexts/AuthContext";
import { useTheme } from "@/src/shared/theme";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();
  const { colors } = useTheme();

  // === Loading State ===
  // Pendant que l'AuthContext charge les données depuis AsyncStorage
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" color={colors.accent.primary} />
        </Animated.View>
      </View>
    );
  }

  // === Redirection Logic ===
  // Si authentifié → aller directement aux tabs (home)
  // Sinon → aller au welcome screen
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
