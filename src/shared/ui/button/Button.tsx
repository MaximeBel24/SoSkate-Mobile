import { radius } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Loading from "@/src/shared/ui/feedback/Loading";
import { verticalScale } from "@/src/shared/utils/styling";
import { ButtonProps } from "@/src/shared/utils/types";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Button = ({ style, onPress, children, loading = false }: ButtonProps) => {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={[styles.button, style, { backgroundColor: "transparent" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.accent.primary }, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.full,
    borderCurve: "continuous",
    height: verticalScale(56),
    justifyContent: "center",
    alignItems: "center",
  },
});
