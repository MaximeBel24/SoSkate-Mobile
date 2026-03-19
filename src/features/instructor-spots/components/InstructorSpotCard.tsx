// ============================================
// 🛹 SOSKATE - INSTRUCTOR SPOT CARD
// ============================================
// Carte affichant un spot où l'instructeur enseigne

import React from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { InstructorSpotResponse } from "../types/instructor-spots.types";
import {useCustomAlert} from "@/src/shared/ui/CustomModal/AlertContext";

interface InstructorSpotCardProps {
  spot: InstructorSpotResponse;
  onRemove: (spotId: number) => Promise<boolean>;
  isRemoving: boolean;
  animationDelay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const InstructorSpotCard: React.FC<InstructorSpotCardProps> = ({
  spot,
  onRemove,
  isRemoving,
  animationDelay = 0,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const { showAlert } = useCustomAlert();

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    showAlert(
      "Se retirer de ce spot",
      `Êtes-vous sûr de vouloir arrêter d'enseigner à "${spot.spot.name}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se retirer",
          style: "destructive",
          onPress: async () => {
            const success = await onRemove(spot.spot.id);
            if (success) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            }
          },
        },
      ],
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Formater la date d'association
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay).springify()}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: colors.background.subtle,
            borderColor: colors.border.subtle,
          },
          animatedStyle,
        ]}
      >
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.accent.primary },
          ]}
        >
          <Icons.MapPinIcon
            size={24}
            color={colors.constant.white}
            weight="fill"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Typo
            size={15}
            fontWeight="600"
            color={colors.text.primary}
            numberOfLines={1}
          >
            {spot.spot.name}
          </Typo>
          <View style={styles.addressRow}>
            <Icons.NavigationArrowIcon size={12} color={colors.text.muted} />
            <Typo size={13} color={colors.text.secondary} numberOfLines={1}>
              {spot.spot.city}
            </Typo>
          </View>
          <Typo size={11} color={colors.text.muted}>
            Depuis le {formatDate(spot.createdAt)}
          </Typo>
        </View>

        {/* Remove button */}
        <Pressable
          onPress={handleRemove}
          disabled={isRemoving}
          style={[
            styles.removeButton,
            {
              backgroundColor: colors.semantic.dangerBg,
              opacity: isRemoving ? 0.5 : 1,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icons.XIcon size={18} color={colors.semantic.danger} weight="bold" />
        </Pressable>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default InstructorSpotCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
