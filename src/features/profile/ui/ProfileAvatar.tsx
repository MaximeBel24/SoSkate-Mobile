import { spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { verticalScale } from "@/src/shared/utils/styling";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface ProfileAvatarProps {
  imageUri: string;
  onEdit: () => void;
  helpText?: string;
  animationDelay?: number;
}

const ProfileAvatar = ({
  imageUri,
  onEdit,
  helpText = "Appuyez pour changer votre photo",
  animationDelay = 200,
}: ProfileAvatarProps) => {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).springify()}
      style={styles.avatarSection}
    >
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatarBorder,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            },
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={[styles.avatar, { backgroundColor: colors.neutral[700] }]}
            contentFit="cover"
          />
        </View>

        <TouchableOpacity
          style={[styles.cameraButton, { shadowColor: colors.accent.primary }]}
          onPress={onEdit}
        >
          <LinearGradient
            colors={[colors.accent.primary, colors.accent.primaryDark]}
            style={[
              styles.cameraGradient,
              { borderColor: colors.background.primary },
            ]}
          >
            <Icons.CameraIcon
              size={20}
              color={colors.constant.white}
              weight="bold"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Typo size={14} color={colors.text.muted} style={{ textAlign: "center" }}>
        {helpText}
      </Typo>
    </Animated.View>
  );
};

export default ProfileAvatar;

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    gap: spacingY._12,
    marginBottom: spacingY._24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 200,
    borderWidth: 2,
  },
  avatar: {
    height: verticalScale(120),
    width: verticalScale(120),
    borderRadius: 200,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraGradient: {
    padding: 12,
    borderRadius: 50,
    borderWidth: 3,
  },
});
