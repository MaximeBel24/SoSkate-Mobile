import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

type SpotDetailsHeaderProps = {
  name: string;
  city: string;
  zipCode: string;
  imageUrl?: string;
  isIndoor: boolean;
};

const SpotDetailsHeader = ({
  name,
  city,
  zipCode,
  imageUrl,
  isIndoor,
}: SpotDetailsHeaderProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#161412" : "#ffffff" },
      ]}
    >
      {/* Image avec gradient overlay */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.placeholderImage,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
              },
            ]}
          >
            <Icons.ImageIcon
              size={48}
              color={colors.text.muted}
              weight="thin"
            />
          </View>
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={[
            "transparent",
            isDark ? "rgba(10, 9, 8, 0.95)" : "rgba(255, 255, 255, 0.95)",
          ]}
          style={styles.gradient}
        />
      </View>

      {/* Informations textuelles */}
      <View style={styles.infoContainer}>
        {/* Badge Indoor/Outdoor */}
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark
                  ? "rgba(255, 107, 53, 0.15)"
                  : "rgba(234, 88, 12, 0.1)",
                borderColor: isDark
                  ? "rgba(255, 107, 53, 0.3)"
                  : "rgba(234, 88, 12, 0.2)",
              },
            ]}
          >
            {isIndoor ? (
              <Icons.HouseIcon
                size={14}
                color={colors.accent.primary}
                weight="fill"
              />
            ) : (
              <Icons.SunIcon
                size={14}
                color={colors.accent.primary}
                weight="fill"
              />
            )}
            <Typo size={12} fontWeight="600" color={colors.accent.primary}>
              {isIndoor ? "Intérieur" : "Extérieur"}
            </Typo>
          </View>
        </View>

        {/* Nom du spot */}
        <Typo
          size={24}
          fontWeight="700"
          color={colors.text.primary}
          style={styles.name}
        >
          {name}
        </Typo>

        {/* Localisation */}
        <View style={styles.locationContainer}>
          <Icons.MapPinIcon size={16} color={colors.text.muted} weight="fill" />
          <Typo size={14} color={colors.text.muted}>
            {city} · {zipCode}
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default SpotDetailsHeader;

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  imageContainer: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  infoContainer: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._12,
    gap: 6,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  name: {
    lineHeight: 28,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
