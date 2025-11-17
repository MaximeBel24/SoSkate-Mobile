import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type MapHeaderProps = {
  spotsCount: number;
  topInset: number;
  onSearchPress: () => void;
};

const MapHeader = ({ spotsCount, topInset, onSearchPress }: MapHeaderProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={[styles.header, { paddingTop: topInset }]}
    >
      <LinearGradient
        colors={["rgba(10, 10, 10, 0.9)", "transparent"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.statsCard}>
            <Icons.MapPinIcon
              size={20}
              color={colors.primary}
              weight="duotone"
            />
            <Typo size={16} fontWeight="700" color={colors.white}>
              {spotsCount}
            </Typo>
            <Typo size={12} color={colors.neutral400}>
              spots
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Icons.MagnifyingGlassIcon
              size={20}
              color={colors.white}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default MapHeader;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  searchButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});
