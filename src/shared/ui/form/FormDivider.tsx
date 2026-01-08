import { spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import React from "react";
import { StyleSheet, View } from "react-native";

const FormDivider = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.divider}>
      <View
        style={[styles.dividerLine, { backgroundColor: colors.border.default }]}
      />
      <Typo size={12} color={colors.text.muted}>
        OU
      </Typo>
      <View
        style={[styles.dividerLine, { backgroundColor: colors.border.default }]}
      />
    </View>
  );
};

export default FormDivider;

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: spacingY._8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
});
