import { useTheme } from "@/src/shared/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

// Marqueur custom pour la position de l'utilisateur
// Même structure que CustomMarker (cercle + icône) mais en orange
// pour se distinguer visuellement des markers de spots
const UserMarker = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.markerContainer}>
      <View
        style={[
          styles.marker,
          {
            // Fond orange (accent primary) au lieu du noir des spots
            backgroundColor: colors.accent.primary,
            borderColor: colors.accent.primaryLight,
          },
        ]}
      >
        <Icons.UserIcon size={18} color="#FFFFFF" weight="fill" />
      </View>
    </View>
  );
};

export default UserMarker;

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    borderRadius: 100,
    padding: 10,
    borderWidth: 3,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
  },
});
