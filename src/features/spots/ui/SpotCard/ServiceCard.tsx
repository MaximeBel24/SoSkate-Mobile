// components/SpotDetails/ServiceCard.tsx
import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingX, spacingY } from "@/src/shared/constants/theme";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ServiceCardProps = {
  service: ServiceResponse;
  onPress: (serviceId: number) => void;
};

const ServiceCard = ({ service, onPress }: ServiceCardProps) => {
  // Conversion du prix de centimes en euros
  const priceInEuros = (service.basePriceCents / 100).toFixed(2);

  // Conversion de la durée en format lisible
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
      {/* Glassmorphism background */}
      <View style={styles.card}>
        {/* Header avec titre et type */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Typo size={18} fontWeight="700" color={colors.white}>
              {service.name}
            </Typo>
          </View>
        </View>

        {/* Description */}
        {service.description && (
          <Typo
            size={14}
            color="rgba(255, 255, 255, 0.7)"
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
              color={colors.primary}
              weight="bold"
            />
            <Typo size={15} fontWeight="600" color={colors.white}>
              {priceInEuros}€
            </Typo>
          </View>

          {/* Séparateur */}
          <View style={styles.separator} />

          {/* Durée */}
          <View style={styles.infoItem}>
            <Icons.Clock size={16} color={colors.primary} weight="bold" />
            <Typo size={15} fontWeight="600" color={colors.white}>
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
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Typo size={15} fontWeight="700" color={colors.white}>
              Réserver
            </Typo>
            <Icons.ArrowRight size={18} color={colors.white} weight="bold" />
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
    backgroundColor: "rgba(22, 20, 18, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: spacingX._16,
    gap: 12,
    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Shadow Android
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
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
