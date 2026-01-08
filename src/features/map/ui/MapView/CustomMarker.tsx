import { useTheme } from "@/src/shared/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

type CustomMarkerProps = {
  isSelected: boolean;
};

const CustomMarker = ({ isSelected }: CustomMarkerProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.markerContainer}>
      <View
        style={[
          styles.marker,
          {
            borderColor: isSelected
              ? colors.accent.primary
              : colors.neutral[200],
          },
        ]}
      >
        <Icons.MapPinIcon
          size={20}
          color={isSelected ? colors.accent.primary : colors.neutral[200]}
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
    justifyContent: "center",
  },
  marker: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
