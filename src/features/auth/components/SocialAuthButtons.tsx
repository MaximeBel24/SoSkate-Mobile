import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
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
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {onGooglePress && (
        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
              borderColor: colors.border.default,
            },
          ]}
          onPress={onGooglePress}
        >
          <Icons.GoogleLogoIcon
            size={20}
            color={colors.text.primary}
            weight="bold"
          />
          <Typo size={14} fontWeight="600" color={colors.text.primary}>
            Google
          </Typo>
        </TouchableOpacity>
      )}

      {onApplePress && (
        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
              borderColor: colors.border.default,
            },
          ]}
          onPress={onApplePress}
        >
          <Icons.AppleLogoIcon
            size={20}
            color={colors.text.primary}
            weight="bold"
          />
          <Typo size={14} fontWeight="600" color={colors.text.primary}>
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
    borderRadius: 12,
    borderWidth: 1,
  },
});
