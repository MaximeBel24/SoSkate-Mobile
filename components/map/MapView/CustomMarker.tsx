import { colors } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

type CustomMarkerProps = {
  isSelected: boolean;
};

const CustomMarker = ({ isSelected }: CustomMarkerProps) => {

  return (
    <View style={styles.markerContainer}>
      <View style={[styles.marker, isSelected && styles.markerSelected]}>
        <Icons.MapPinIcon
          size={20}
          color={isSelected ? colors.primary : colors.neutral200}
          weight="fill"
        />
      </View>
    </View>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  marker: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 100,
    padding: 10,
    borderWidth: 3,
    borderColor: colors.neutral200,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
  },
  markerSelected: {
    borderColor: colors.primary,
  },
});
