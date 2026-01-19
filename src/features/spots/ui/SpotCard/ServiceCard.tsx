import { spacingX } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// ============================================
// 🛹 SOSKATE - SERVICE CARD (SIMPLIFIED)
// ============================================
// Carte de service minimaliste
// - Titre du service
// - Prix par heure
// - Sélection visuelle

type ServiceCardProps = {
  service: ServiceResponse;
  isSelected?: boolean;
  onSelect?: (service: ServiceResponse) => void;
};

const ServiceCard = ({
  service,
  isSelected = false,
  onSelect,
}: ServiceCardProps) => {
  const { colors, isDark } = useTheme();

  // === Calcul du prix par heure ===
  const pricePerHour =
    service.durationMinutes > 0
      ? (service.basePriceCents / service.durationMinutes) * 60
      : service.basePriceCents;

  const pricePerHourInEuros = (pricePerHour / 100).toFixed(0);

  const handleCardPress = () => {
    onSelect?.(service);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? "rgba(22, 20, 18, 0.8)"
            : "rgba(255, 255, 255, 0.95)",
          borderColor: isSelected
            ? colors.accent.primary
            : colors.border.default,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      {/* Selection indicator */}
      {isSelected && (
        <View
          style={[
            styles.selectionIndicator,
            { backgroundColor: colors.semantic.success },
          ]}
        >
          <Icons.Check size={10} color={colors.constant.white} weight="bold" />
        </View>
      )}

      {/* Titre du service */}
      <Typo
        size={14}
        fontWeight="600"
        color={colors.text.primary}
        numberOfLines={2}
        style={styles.serviceName}
      >
        {service.name}
      </Typo>

      {/* Prix par heure */}
      <View style={styles.priceRow}>
        <Typo
          size={18}
          fontWeight="700"
          color={isSelected ? colors.accent.primary : colors.text.primary}
        >
          {pricePerHourInEuros}€
        </Typo>
        <Typo size={12} color={colors.text.muted}>
          /heure
        </Typo>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    width: 130,
    minHeight: 90,
    borderRadius: 14,
    padding: spacingX._12,
    justifyContent: "space-between",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  serviceName: {
    lineHeight: 18,
    paddingRight: 20, // Espace pour l'indicateur de sélection
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
});
