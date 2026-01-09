import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { HeaderProps } from "@/src/shared/utils/types";
import React from "react";
import { StyleSheet, View } from "react-native";

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {!title && (
        <Typo
          size={22}
          fontWeight="600"
          color={colors.text.primary}
          style={{ textAlign: "center", width: leftIcon ? "82%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
