import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type MapHeaderProps = {
  spotsCount: number;
  topInset: number;
  onSearchPress: () => void;
  onFilterPress: () => void;
  isFilterActive: boolean;
  showFilter: boolean;
  onRecenter: () => void;
};

const MapHeader = ({
     spotsCount,
     topInset,
     onSearchPress,
     onFilterPress,
     isFilterActive,
     showFilter,
    onRecenter
}: MapHeaderProps) => {

  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={[styles.header, { paddingTop: topInset }]}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(10, 10, 10, 0.9)", "transparent"]
            : ["rgba(255, 255, 255, 0.95)", "transparent"]
        }
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View
            style={[
              styles.statsCard,
              {
                backgroundColor: colors.background.elevated,
                borderColor: colors.border.default,
              },
            ]}
          >
            <Icons.MapPinIcon
              size={20}
              color={colors.accent.primary}
              weight="duotone"
            />
            <Typo size={16} fontWeight="700" color={colors.text.primary}>
              {spotsCount}
            </Typo>
            <Typo size={12} color={colors.text.muted}>
              spots
            </Typo>
          </View>

          <View style={styles.headerRight}>
            {showFilter && (
                <TouchableOpacity
                    style={[
                      styles.headerButton,
                      {
                        backgroundColor: colors.background.elevated,
                        borderColor: isFilterActive ? "#ff6b35" : colors.border.default,
                      },
                    ]}
                    onPress={onFilterPress}
                    activeOpacity={0.7}
                >
                  <Icons.FunnelSimpleIcon
                      size={20}
                      color={isFilterActive ? "#ff6b35" : colors.text.primary}
                      weight={isFilterActive ? "fill" : "bold"}
                  />
                </TouchableOpacity>
            )}


            <TouchableOpacity
                style={[
                  styles.headerButton,
                  {
                    backgroundColor: colors.background.elevated,
                    borderColor: colors.border.default,
                  },
                ]}
                onPress={onSearchPress}
                activeOpacity={0.7}
            >
              <Icons.MagnifyingGlassIcon
                  size={20}
                  color={colors.text.primary}
                  weight="bold"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                  styles.headerButton,
                {
                  backgroundColor: colors.background.elevated,
                  borderColor: colors.border.default,
                },
              ]}
              onPress={onRecenter}
              activeOpacity={0.7}
            >
              <Icons.CrosshairSimpleIcon
                  size={20}
                  color={colors.text.primary}
                  weight="bold"
              />
            </TouchableOpacity>
          </View>

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
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._16,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
});
