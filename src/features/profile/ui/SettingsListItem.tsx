import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingX, spacingY } from "@/src/shared/constants/theme";
import * as Icons from "phosphor-react-native";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SettingsListItemProps {
  /** Titre de l'item */
  title: string;
  /** Icône (ReactNode pour flexibilité) */
  icon: ReactNode;
  /** Couleur de fond de l'icône */
  bgColor: string;
  /** Callback au clic */
  onPress: () => void;
  /** Est-ce le dernier item ? (pas de bordure en bas) */
  isLast?: boolean;
  /** Style danger (rouge, pour déconnexion) */
  isDanger?: boolean;
  /** Délai d'animation */
  animationDelay?: number;
}

/**
 * Item de liste pour les paramètres/options du profil
 * Avec icône colorée, titre et flèche
 */
const SettingsListItem = ({
  title,
  icon,
  bgColor,
  onPress,
  isLast = false,
  isDanger = false,
  animationDelay = 0,
}: SettingsListItemProps) => {
  const content = (
    <TouchableOpacity
      style={[
        styles.listItem,
        isDanger && styles.dangerItem,
        !isLast && styles.listItemBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.listIcon, { backgroundColor: bgColor }]}>
        {icon}
      </View>

      {/* Title */}
      <Typo
        size={16}
        style={styles.listTitle}
        fontWeight="600"
        color={isDanger ? "#ef4444" : colors.white}
      >
        {title}
      </Typo>

      {/* Arrow */}
      <Icons.CaretRightIcon
        size={20}
        weight="bold"
        color={isDanger ? "#ef4444" : colors.neutral400}
      />
    </TouchableOpacity>
  );

  if (animationDelay > 0) {
    return (
      <Animated.View entering={FadeInUp.delay(animationDelay).springify()}>
        {content}
      </Animated.View>
    );
  }

  return content;
};

export default SettingsListItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._14,
    paddingVertical: spacingY._16,
    paddingHorizontal: spacingX._16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  dangerItem: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  listIcon: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    flex: 1,
  },
});
