import { useTheme } from "@/src/shared/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import { BackButtonProps } from "@/src/shared/utils/types";
import { Href, useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({
  style,
  iconSize = 26,
  color,
  route,
}: BackButtonProps) => {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    if (route) {
      router.push(route as Href);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, style]}>
      <CaretLeftIcon
        size={verticalScale(iconSize)}
        color={color || colors.text.primary}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {},
});
