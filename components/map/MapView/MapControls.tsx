import { colors, spacingX } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type MapControlsProps = {
  topInset: number;
  onRecenter: () => void;
  onRefresh: () => void;
};

const MapControls = ({
  topInset,
  onRecenter,
  onRefresh,
}: MapControlsProps) => {

  return (
    <View style={[styles.floatingControls, { top: topInset + 100 }]}>
      <TouchableOpacity style={styles.controlButton} onPress={onRecenter}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.08)"]}
          style={styles.controlGradient}
        >
          <Icons.CrosshairSimpleIcon
            size={24}
            color={colors.white}
            weight="bold"
          />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlButton} onPress={onRefresh}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.08)"]}
          style={styles.controlGradient}
        >
          <Icons.ArrowClockwiseIcon
            size={24}
            color={colors.white}
            weight="bold"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default MapControls;

const styles = StyleSheet.create({
  floatingControls: {
    position: "absolute",
    right: spacingX._20,
    gap: 12,
    zIndex: 5,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  controlGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
  },
});
