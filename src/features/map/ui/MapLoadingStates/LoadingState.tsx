import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingState = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.centerContent}>
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)",
            borderColor: colors.border.default,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Typo size={16} color={colors.text.primary} style={{ marginTop: 16 }}>
          Chargement des spots...
        </Typo>
      </View>
    </View>
  );
};

export default LoadingState;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacingY._30,
    paddingHorizontal: spacingX._40,
    borderRadius: 20,
    borderWidth: 1,
  },
});
