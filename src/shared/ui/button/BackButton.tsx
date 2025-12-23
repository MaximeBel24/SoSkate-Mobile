import { colors } from "@/src/shared/constants/theme";
import { BackButtonProps } from "@/src/shared/utils/types";
import { verticalScale } from "@/src/shared/utils/styling";
import {Href, useRouter} from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({
  style,
  iconSize = 26,
  color = colors.white,
    route
}: BackButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
      if (route) {
          router.push(route as Href);
      } else {
          router.back();
      }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, style]}
    >
      <CaretLeftIcon
        size={verticalScale(iconSize)}
        color={color}
        weight={"bold"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {},
});
