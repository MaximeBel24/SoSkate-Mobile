// ============================================
// 🛹 SOSKATE - BOOKING STEPPER
// ============================================
// Indicateur de progression horizontal

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { BOOKING_STEPS, BookingStep } from "../types/booking.types";

interface BookingStepperProps {
  currentStep: BookingStep;
  onStepPress?: (step: BookingStep) => void;
  completedSteps?: BookingStep[];
}

const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  onStepPress,
  completedSteps = [],
}) => {
  const { colors } = useTheme();

  const currentIndex = BOOKING_STEPS.findIndex((s) => s.key === currentStep);

  const getStepStatus = (stepKey: BookingStep, index: number) => {
    if (completedSteps.includes(stepKey)) return "completed";
    if (index === currentIndex) return "current";
    if (index < currentIndex) return "completed";
    return "upcoming";
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Calendar":
        return Icons.CalendarIcon;
      case "Clock":
        return Icons.ClockIcon;
      case "CheckCircle":
        return Icons.CheckCircleIcon;
      default:
        return Icons.CircleIcon;
    }
  };

  return (
    <View style={styles.container}>
      {BOOKING_STEPS.map((step, index) => {
        const status = getStepStatus(step.key, index);
        const IconComponent = getIconComponent(step.icon);
        const isLast = index === BOOKING_STEPS.length - 1;

        const circleColor =
          status === "upcoming" ? colors.border.default : colors.accent.primary;

        const textColor =
          status === "current"
            ? colors.text.primary
            : status === "completed"
              ? colors.accent.primary
              : colors.text.muted;

        const iconColor =
          status === "upcoming" ? colors.text.muted : colors.constant.white;

        return (
          <React.Fragment key={step.key}>
            <Pressable
              style={styles.stepContainer}
              onPress={() => {
                if (onStepPress && status === "completed") {
                  onStepPress(step.key);
                }
              }}
              disabled={status === "upcoming"}
            >
              {/* Circle avec icône */}
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: circleColor,
                    borderColor:
                      status === "current"
                        ? colors.accent.primaryLight
                        : "transparent",
                    borderWidth: status === "current" ? 2 : 0,
                  },
                ]}
              >
                {status === "completed" ? (
                  <Icons.CheckIcon
                    size={16}
                    color={colors.constant.white}
                    weight="bold"
                  />
                ) : (
                  <IconComponent
                    size={16}
                    color={iconColor}
                    weight={status === "current" ? "fill" : "regular"}
                  />
                )}
              </View>

              {/* Label */}
              <Typo
                size={12}
                fontWeight={status === "current" ? "600" : "400"}
                color={textColor}
                style={styles.label}
              >
                {step.label}
              </Typo>
            </Pressable>

            {/* Ligne de connexion */}
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor:
                      index < currentIndex
                        ? colors.accent.primary
                        : colors.border.default,
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default BookingStepper;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: "center",
    gap: 6,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
  connector: {
    height: 2,
    width: 40,
    marginHorizontal: 8,
    marginBottom: 20, // Aligner avec le cercle
    borderRadius: 1,
  },
});
