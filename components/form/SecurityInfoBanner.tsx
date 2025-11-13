import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SecurityInfoBannerProps {
  message?: string;
}

export const SecurityInfoBanner = ({
  message = "Vos données sont sécurisées et cryptées",
}: SecurityInfoBannerProps) => {
  return (
    <View style={styles.container}>
      <Icons.ShieldCheckIcon size={16} color={colors.primary} weight="fill" />
      <Typo size={12} color={colors.neutral400}>
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
});
