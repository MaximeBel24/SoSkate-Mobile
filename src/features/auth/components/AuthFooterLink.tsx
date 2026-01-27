import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

const AuthFooterLink = ({ text, linkText, onPress }: AuthFooterLinkProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Typo size={15} color={colors.text.secondary}>
        {text}
      </Typo>
      <Pressable onPress={onPress}>
        <Typo size={15} fontWeight="700" color={colors.accent.primary}>
          {linkText}
        </Typo>
      </Pressable>
    </View>
  );
};

export default AuthFooterLink;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
  },
});
