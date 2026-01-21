import { spacingX } from "@/src/shared/constants/theme";
import { getInstructorAvatar } from "@/src/shared/services/photoService";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import Avatar from "@/src/shared/ui/media/Avatar";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

// ============================================
// 🛹 SOSKATE - INSTRUCTOR CARD (REFACTORED)
// ============================================
// Carte d'instructeur harmonisée avec ServiceCard
// - Format compact pour scroll horizontal
// - Design cohérent avec le reste de l'app

type InstructorCardProps = {
  instructor: InstructorResponse;
  isSelected?: boolean;
  onSelect?: (instructor: InstructorResponse) => void;
  onViewDetails?: (instructorId: string) => void;
};

const InstructorCard = ({
  instructor,
  isSelected = false,
  onSelect,
  onViewDetails,
}: InstructorCardProps) => {
  const { colors, isDark } = useTheme();

  // === Avatar State ===
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  // === Charger l'avatar de l'instructeur ===
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setIsLoadingAvatar(true);
        const avatar = await getInstructorAvatar(Number(instructor.id));
        if (avatar) {
          setAvatarUri(avatar.url);
        }
      } catch (error) {
        console.error("Error loading instructor avatar:", error);
      } finally {
        setIsLoadingAvatar(false);
      }
    };

    loadAvatar();
  }, [instructor.id]);

  // === Nom complet pour le placeholder ===
  const fullName = `${instructor.firstname} ${instructor.lastname}`;

  const handleCardPress = () => {
    onSelect?.(instructor);
  };

  const handleViewDetails = () => {
    onViewDetails?.(instructor.id);
  };

  const handleInstagramPress = () => {
    if (instructor.instagramHandle) {
      const url = `https://instagram.com/${instructor.instagramHandle.replace(
        "@",
        "",
      )}`;
      Linking.openURL(url);
    }
  };

  const handleYoutubePress = () => {
    if (instructor.youtubeChannel) {
      Linking.openURL(instructor.youtubeChannel);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? "rgba(22, 20, 18, 0.8)"
            : "rgba(255, 255, 255, 0.95)",
          borderColor: isSelected
            ? colors.accent.primary
            : colors.border.default,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      {/* Selection indicator */}
      {isSelected && (
        <View
          style={[
            styles.selectionIndicator,
            { backgroundColor: colors.semantic.success },
          ]}
        >
          <Icons.CheckIcon
            size={12}
            color={colors.constant.white}
            weight="bold"
          />
        </View>
      )}

      {/* Details button */}
      {onViewDetails && (
        <TouchableOpacity
          style={[
            styles.detailsButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
          onPress={handleViewDetails}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icons.MagnifyingGlassIcon
            size={14}
            color={colors.text.secondary}
            weight="bold"
          />
        </TouchableOpacity>
      )}

      {/* Avatar avec composant réutilisable */}
      <View style={styles.avatarContainer}>
        <Avatar
          imageUri={avatarUri}
          name={fullName}
          size="md"
          loading={isLoadingAvatar}
        />
      </View>

      {/* Infos */}
      <View style={styles.infoContainer}>
        <Typo
          size={14}
          fontWeight="700"
          color={colors.text.primary}
          numberOfLines={1}
        >
          {instructor.firstname} {instructor.lastname}
        </Typo>

        {/*{instructor.specialty && (*/}
        {/*  <View style={styles.infoRow}>*/}
        {/*    <Icons.MedalIcon*/}
        {/*      size={11}*/}
        {/*      color={colors.accent.primary}*/}
        {/*      weight="fill"*/}
        {/*    />*/}
        {/*    <Typo*/}
        {/*      size={11}*/}
        {/*      color={colors.text.secondary}*/}
        {/*      numberOfLines={1}*/}
        {/*      style={styles.infoText}*/}
        {/*    >*/}
        {/*      {instructor.specialty}*/}
        {/*    </Typo>*/}
        {/*  </View>*/}
        {/*)}*/}

        {instructor.yearsOfExperience && instructor.yearsOfExperience > 0 && (
          <View style={styles.infoRow}>
            <Icons.TimerIcon
              size={11}
              color={colors.accent.primary}
              weight="fill"
            />
            <Typo size={11} color={colors.text.secondary}>
              {instructor.yearsOfExperience} ans d'exp.
            </Typo>
          </View>
        )}
      </View>

      {/* Social Links */}
      {(instructor.instagramHandle || instructor.youtubeChannel) && (
        <View style={styles.socialContainer}>
          {instructor.instagramHandle && (
            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: colors.ui.badge },
              ]}
              onPress={handleInstagramPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icons.InstagramLogoIcon
                size={14}
                color={colors.accent.primary}
                weight="fill"
              />
            </TouchableOpacity>
          )}
          {instructor.youtubeChannel && (
            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: colors.ui.badge },
              ]}
              onPress={handleYoutubePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icons.YoutubeLogoIcon
                size={14}
                color={colors.semantic.danger}
                weight="fill"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default InstructorCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: 16,
    padding: spacingX._12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  detailsButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  avatarContainer: {
    marginTop: 8,
  },
  infoContainer: {
    alignItems: "center",
    gap: 3,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    flex: 1,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  socialButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
});
