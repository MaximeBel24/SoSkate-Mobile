import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SettingsListItemProps {
  title: string;
  icon: ReactNode;
  bgColor: string;
  onPress: () => void;
  isLast?: boolean;
  isDanger?: boolean;
  animationDelay?: number;
}

const SettingsListItem = ({
  title,
  icon,
  bgColor,
  onPress,
  isLast = false,
  isDanger = false,
  animationDelay = 0,
}: SettingsListItemProps) => {
  const { colors, isDark } = useTheme();

  const borderColor = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";

  const dangerBgColor = isDark
    ? "rgba(239, 68, 68, 0.05)"
    : "rgba(239, 68, 68, 0.08)";

  const content = (
    <TouchableOpacity
      style={[
        styles.listItem,
        isDanger && { backgroundColor: dangerBgColor },
        !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor },
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
        color={isDanger ? colors.semantic.danger : colors.text.primary}
      >
        {title}
      </Typo>

      {/* Arrow */}
      <Icons.CaretRightIcon
        size={20}
        weight="bold"
        color={isDanger ? colors.semantic.danger : colors.text.muted}
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
