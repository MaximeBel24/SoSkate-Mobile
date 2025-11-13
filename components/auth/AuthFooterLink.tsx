import Typo from "@/components/text/Typo";
import { colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

const AuthFooterLink = ({ text, linkText, onPress }: AuthFooterLinkProps) => {
  return (
    <View style={styles.container}>
      <Typo size={15} color={colors.neutral300}>
        {text}
      </Typo>
      <Pressable onPress={onPress}>
        <Typo size={15} fontWeight="700" color={colors.primary}>
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
