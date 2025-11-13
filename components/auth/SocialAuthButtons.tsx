import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

const SocialAuthButtons = ({
  onGooglePress,
  onApplePress,
}: SocialAuthButtonsProps) => {
  return (
    <View style={styles.container}>
      {onGooglePress && (
        <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
          <Icons.GoogleLogoIcon size={20} color={colors.white} weight="bold" />
          <Typo size={14} fontWeight="600" color={colors.white}>
            Google
          </Typo>
        </TouchableOpacity>
      )}

      {onApplePress && (
        <TouchableOpacity style={styles.socialButton} onPress={onApplePress}>
          <Icons.AppleLogoIcon size={20} color={colors.white} weight="bold" />
          <Typo size={14} fontWeight="600" color={colors.white}>
            Apple
          </Typo>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SocialAuthButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacingX._12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacingY._12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});
