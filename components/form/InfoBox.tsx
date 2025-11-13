import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

interface InfoBoxProps {
  message: string;
  variant?: "info" | "warning" | "success";
}

const InfoBox = ({ message, variant = "info" }: InfoBoxProps) => {
  const iconColor =
    variant === "warning"
      ? colors.warning
      : variant === "success"
      ? colors.success
      : colors.primary;

  return (
    <View style={styles.container}>
      <Icons.InfoIcon size={16} color={iconColor} weight="fill" />
      <Typo size={12} color={colors.neutral400} style={{ flex: 1 }}>
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
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
});
