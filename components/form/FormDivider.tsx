import Typo from "@/components/text/Typo";
import { colors, spacingY } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const FormDivider = () => {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Typo size={12} color={colors.neutral400}>
        OU
      </Typo>
      <View style={styles.dividerLine} />
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
