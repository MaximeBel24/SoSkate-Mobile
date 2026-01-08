import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import Typo from "@/src/shared/ui/typography/Typo";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ServiceCard from "./ServiceCard";

type ServiceListProps = {
  services: ServiceResponse[];
  onServicePress: (serviceId: number) => void;
  compact?: boolean;
};

const ServiceList = ({
  services,
  onServicePress,
  compact = false,
}: ServiceListProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background.primary },
        compact && styles.compactContainer,
      ]}
    >
      {/* Section header (seulement si pas en mode compact) */}
      {!compact && (
        <View style={styles.header}>
          <Typo size={20} fontWeight="700" color={colors.text.primary}>
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

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default ServiceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
