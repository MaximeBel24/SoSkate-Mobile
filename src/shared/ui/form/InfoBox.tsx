import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

interface InfoBoxProps {
  message: string;
  variant?: "info" | "warning" | "success";
}

const InfoBox = ({ message, variant = "info" }: InfoBoxProps) => {
  const { colors, isDark } = useTheme();

  const iconColor =
    variant === "warning"
      ? colors.semantic.warning
      : variant === "success"
      ? colors.semantic.success
      : colors.accent.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(0, 0, 0, 0.02)",
          borderColor: colors.border.subtle,
        },
      ]}
    >
      <Icons.InfoIcon size={16} color={iconColor} weight="fill" />
      <Typo size={12} color={colors.text.muted} style={{ flex: 1 }}>
        {message}
      </Typo>
    </View>
  );
};

export default InfoBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
