import { colors } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type CustomMarkerProps = {
  isSelected: boolean;
};

const CustomMarker = ({ isSelected }: CustomMarkerProps) => {
  // // Animation pour le pulse
  // const pulseStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: withTiming(isSelected ? 0.3 : 0, { duration: 300 }),
  //     transform: [
  //       {
  //         scale: withSpring(isSelected ? 1 : 0.5, {
  //           damping: 15,
  //           stiffness: 100,
  //         }),
  //       },
  //     ],
  //   };
  // });
  //
  // // Animation pour le marker
  // const markerStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         scale: withSpring(isSelected ? 1.3 : 1, {
  //           damping: 15,
  //           stiffness: 120,
  //         }),
  //       },
  //     ],
  //   };
  // });

  return (
    // <View style={styles.markerContainer}>
    //     {/* Pulse animé */}
    //     <Animated.View style={[styles.markerPulse, pulseStyle]} />
    //
    //     {/* Marker animé */}
    //     <Animated.View
    //         style={[
    //             styles.marker,
    //             isSelected && styles.markerSelected,
    //             markerStyle
    //         ]}
    //     >
    //         <Icons.MapPinIcon
    //             size={isSelected ? 28 : 22}
    //             color={isSelected ? colors.primary : colors.white}
    //             weight="fill"
    //         />
    //     </Animated.View>
    // </View>
    <View style={styles.markerContainer}>
      <View style={[styles.marker, isSelected && styles.markerSelected]}>
        <Icons.MapPinIcon
          size={isSelected ? 28 : 22}
          color={isSelected ? colors.primary : colors.white}
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
  markerPulse: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25, // ✅ Parfaitement arrondi
    backgroundColor: colors.primary,
  },
  marker: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 100, // ✅ Valeur très élevée pour garantir des bords arrondis
    padding: 10,
    borderWidth: 3,
    borderColor: colors.white,
    // ✅ S'assure que le contenu reste arrondi
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    // ✅ Dimensions fixes pour garantir un cercle parfait
    width: 44,
    height: 44,
  },
  markerSelected: {
    borderColor: colors.primary,
  },
});
