import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingState = () => {
  return (
    <View style={styles.centerContent}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typo size={16} color={colors.white} style={{ marginTop: 16 }}>
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: spacingY._30,
    paddingHorizontal: spacingX._40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});
