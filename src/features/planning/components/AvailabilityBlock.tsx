// ============================================
// 🛹 SOSKATE - AVAILABILITY BLOCK
// ============================================
// Bloc représentant une disponibilité dans le calendrier

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import {
  calculateBlockTop,
  calculateBlockHeight,
  BLOCK_COLORS,
  formatTimeRange,
} from "../types/planning.types";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";

interface AvailabilityBlockProps {
  availability: AvailabilityResponse;
  isPast: boolean;
  onPress: (availability: AvailabilityResponse) => void;
  columnWidth: number;
}

const AvailabilityBlock: React.FC<AvailabilityBlockProps> = ({
  availability,
  isPast,
  onPress,
  columnWidth,
}) => {
  const { colors } = useTheme();

  const top = calculateBlockTop(availability.startTime);
  const height = calculateBlockHeight(
    availability.startTime,
    availability.endTime,
  );

  // Déterminer les couleurs
  const getBlockColors = () => {
    if (isPast) {
      return BLOCK_COLORS.past;
    }
    if (availability.status === "BOOKED") {
      return BLOCK_COLORS.booked;
    }
    return BLOCK_COLORS.available;
  };

  const blockColors = getBlockColors();
  const isSmallBlock = height < 50;

  const handlePress = () => {
    if (!isPast && availability.status === "AVAILABLE") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(availability);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isPast || availability.status !== "AVAILABLE"}
      style={[
        styles.block,
        {
          top,
          height: Math.max(height - 2, 20), // Minimum 20px
          width: columnWidth - 8,
          backgroundColor: blockColors.background,
          borderLeftColor: blockColors.border,
          opacity: isPast ? 0.5 : 1,
        },
      ]}
    >
      {isSmallBlock ? (
        // Affichage compact pour les petits blocs
        <Typo size={9} color={blockColors.text} numberOfLines={1}>
          {availability.startTime}
        </Typo>
      ) : (
        // Affichage normal
        <View style={styles.blockContent}>
          <Typo size={10} fontWeight="600" color={blockColors.text}>
            {formatTimeRange(availability.startTime, availability.endTime)}
          </Typo>
          {height >= 60 && (
            <Typo size={9} color={blockColors.text}>
              {availability.status === "AVAILABLE" ? "Disponible" : "Réservé"}
            </Typo>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default AvailabilityBlock;

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    left: 4,
    borderLeftWidth: 3,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: "center",
    overflow: "hidden",
  },
  blockContent: {
    gap: 2,
  },
});
