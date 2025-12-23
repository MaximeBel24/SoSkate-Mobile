// components/SpotDetails/ServiceList.tsx
import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingX, spacingY } from "@/src/shared/constants/theme";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ServiceCard from "./ServiceCard";

type ServiceListProps = {
  services: ServiceResponse[];
  onServicePress: (serviceId: number) => void;
  compact?: boolean; // Mode compact pour l'affichage dans la SpotCard
};

const ServiceList = ({
  services,
  onServicePress,
  compact = false,
}: ServiceListProps) => {
  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* Section header (seulement si pas en mode compact) */}
      {!compact && (
        <View style={styles.header}>
          <Typo size={20} fontWeight="700" color={colors.white}>
            Services disponibles
          </Typo>
        </View>
      )}

      {/* Liste scrollable des services */}
      <ScrollView
        style={[styles.scrollView, compact && styles.compactScrollView]}
        contentContainerStyle={[
          styles.scrollContent,
          compact && styles.compactScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={compact}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onPress={onServicePress}
          />
        ))}

        {/* Espace en bas pour le scroll */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default ServiceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0908",
  },
  compactContainer: {
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._16,
  },
  scrollView: {
    flex: 1,
  },
  compactScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacingX._20,
    gap: 12,
  },
  compactScrollContent: {
    paddingHorizontal: 0,
  },
  bottomSpacer: {
    height: 40,
  },
});
