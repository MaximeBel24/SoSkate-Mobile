import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ServiceCardProps = {
  service: ServiceResponse;
  onPress: (serviceId: number) => void;
};

const ServiceCard = ({ service, onPress }: ServiceCardProps) => {
  const { colors, isDark } = useTheme();

  const priceInEuros = (service.basePriceCents / 100).toFixed(2);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h${remainingMinutes}`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "rgba(22, 20, 18, 0.8)"
              : "rgba(255, 255, 255, 0.95)",
            borderColor: colors.border.default,
          },
        ]}
      >
        {/* Header avec titre et type */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Typo size={18} fontWeight="700" color={colors.text.primary}>
              {service.name}
            </Typo>
          </View>
        </View>

        {/* Description */}
        {!service.description && (
          <Typo
            size={14}
            color={colors.text.secondary}
            style={styles.description}
          >
            {service.description}
          </Typo>
        )}

        {/* Infos (Prix + Durée) */}
        <View style={styles.infoRow}>
          {/* Prix */}
          <View style={styles.infoItem}>
            <Icons.CurrencyEurIcon
              size={16}
              color={colors.accent.primary}
              weight="bold"
            />
            <Typo size={15} fontWeight="600" color={colors.text.primary}>
              {priceInEuros}€
            </Typo>
          </View>

          {/* Séparateur */}
          <View
            style={[
              styles.separator,
              { backgroundColor: colors.border.default },
            ]}
          />

          {/* Durée */}
          <View style={styles.infoItem}>
            <Icons.Clock
              size={16}
              color={colors.accent.primary}
              weight="bold"
            />
            <Typo size={15} fontWeight="600" color={colors.text.primary}>
              {formatDuration(service.durationMinutes)}
            </Typo>
          </View>
        </View>

        {/* Bouton CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => onPress(Number(service.id))}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.accent.primary, colors.accent.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Typo size={15} fontWeight="700" color={colors.constant.white}>
              Réserver
            </Typo>
            <Icons.ArrowRight
              size={18}
              color={colors.constant.white}
              weight="bold"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacingX._16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  description: {
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  separator: {
    width: 1,
    height: 16,
  },
  ctaButton: {
    marginTop: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacingY._12,
  },
});
