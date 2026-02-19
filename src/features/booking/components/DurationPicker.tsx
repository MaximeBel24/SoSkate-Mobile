// ============================================
// 🛹 SOSKATE - DURATION PICKER
// ============================================
// Sélecteur de durée avec chips horizontales

import React from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { DURATION_OPTIONS, DurationOption } from "../types/booking.types";

interface DurationPickerProps {
  selectedDuration: number | null;
  onSelectDuration: (duration: number) => void;
  availableDurations?: number[]; // Durées disponibles (les autres seront grisées)
  showPricePreview?: boolean;
  basePriceCents?: number; // Pour afficher le prix estimé
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DurationChipProps {
  option: DurationOption;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
  pricePreview?: string;
}

const DurationChip: React.FC<DurationChipProps> = ({
  option,
  isSelected,
  isDisabled,
  onPress,
  pricePreview,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (!isDisabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = isSelected
    ? colors.accent.primary
    : isDisabled
      ? colors.background.subtle
      : colors.background.elevated;

  const borderColor = isSelected
    ? colors.accent.primary
    : isDisabled
      ? colors.border.subtle
      : colors.border.default;

  const textColor = isSelected
    ? colors.constant.white
    : isDisabled
      ? colors.text.muted
      : colors.text.primary;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.chip,
        {
          backgroundColor,
          borderColor,
          opacity: isDisabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
    >
      <Typo size={16} fontWeight={isSelected ? "700" : "500"} color={textColor}>
        {option.label}
      </Typo>

      {pricePreview && (
        <Typo
          size={12}
          fontWeight="400"
          color={isSelected ? "rgba(255,255,255,0.8)" : colors.text.secondary}
        >
          {pricePreview}
        </Typo>
      )}
    </AnimatedPressable>
  );
};

const DurationPicker: React.FC<DurationPickerProps> = ({
  selectedDuration,
  onSelectDuration,
  availableDurations,
  showPricePreview = false,
  basePriceCents = 0,
}) => {
  const { colors } = useTheme();

  const calculatePrice = (durationMinutes: number): string => {
    if (!basePriceCents) return "";
    const priceCents = Math.round((basePriceCents / 60) * durationMinutes);
    return `${(priceCents / 100).toFixed(0)}€`;
  };

  const isAvailable = (duration: number): boolean => {
    if (!availableDurations) return true;
    return availableDurations.includes(duration);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typo size={14} fontWeight="600" color={colors.text.primary}>
          Durée du cours
        </Typo>
        {selectedDuration && (
          <Typo size={14} color={colors.accent.primary} fontWeight="600">
            {DURATION_OPTIONS.find((d) => d.value === selectedDuration)?.label}
          </Typo>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {DURATION_OPTIONS.map((option) => (
          <DurationChip
            key={option.value}
            option={option}
            isSelected={selectedDuration === option.value}
            isDisabled={!isAvailable(option.value)}
            onPress={() => onSelectDuration(option.value)}
            pricePreview={
              showPricePreview ? calculatePrice(option.value) : undefined
            }
          />
        ))}
      </ScrollView>

      {/* Message si certaines durées indisponibles */}
      {availableDurations &&
        availableDurations.length < DURATION_OPTIONS.length && (
          <Typo size={12} color={colors.text.muted} style={styles.hint}>
            Certaines durées ne sont pas disponibles pour ce créneau
          </Typo>
        )}
    </View>
  );
};

export default DurationPicker;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    gap: 2,
  },
  hint: {
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
