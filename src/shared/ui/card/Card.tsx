// ============================================
// SOSKATE - CARD COMPONENT
// ============================================
// Conteneur réutilisable avec option pressable et animation

import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import { radius } from "@/src/shared/constants/theme";

// ============================================
// TYPES
// ============================================
type CardVariant = "elevated" | "outlined" | "filled" | "ghost";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  disabled?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// ============================================
// CONSTANTS
// ============================================
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PADDING_MAP: Record<CardPadding, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

// ============================================
// COMPONENT
// ============================================
const Card: React.FC<CardProps> = ({
  children,
  variant = "elevated",
  padding = "md",
  onPress,
  disabled = false,
  haptic = true,
  style,
  testID,
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const isInteractive = !!onPress && !disabled;

  // ============================================
  // ANIMATIONS
  // ============================================
  const handlePressIn = () => {
    if (isInteractive) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (isInteractive) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const handlePress = () => {
    if (isInteractive) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ============================================
  // VARIANT STYLES
  // ============================================
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.03)"
            : colors.constant.white,
          borderWidth: 1,
          borderColor: colors.border.subtle,
          shadowColor: colors.constant.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 8,
          elevation: 3,
        };
      case "outlined":
        return {
          backgroundColor: colors.constant.transparent,
          borderWidth: 1,
          borderColor: colors.border.default,
        };
      case "filled":
        return {
          backgroundColor: colors.background.surface,
          borderWidth: 0,
        };
      case "ghost":
        return {
          backgroundColor: colors.constant.transparent,
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  // ============================================
  // RENDER
  // ============================================
  const cardStyle: ViewStyle[] = [
    styles.card,
    { padding: PADDING_MAP[padding] },
    getVariantStyle(),
    ...(disabled ? [styles.disabled] : []),
  ];

  if (isInteractive) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyle, animatedStyle, style]}
        testID={testID}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={[cardStyle, style]} testID={testID}>
      {children}
    </View>
  );
};

export default Card;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  card: {
    borderRadius: radius._15,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
  },
});
