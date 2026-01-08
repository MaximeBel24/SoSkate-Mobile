import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SecurityInfoBannerProps {
  message?: string;
}

export const SecurityInfoBanner = ({
  message = "Vos données sont sécurisées et cryptées",
}: SecurityInfoBannerProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.03)",
          borderColor: colors.border.subtle,
        },
      ]}
    >
      <Icons.ShieldCheckIcon
        size={16}
        color={colors.accent.primary}
        weight="fill"
      />
      <Typo size={12} color={colors.text.muted}>
        {message}
      </Typo>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    borderRadius: 12,
    borderWidth: 1,
  },
});
