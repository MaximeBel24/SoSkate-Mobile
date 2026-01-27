import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { getInstructorById } from "@/src/shared/services/instructorService";
import { getInstructorAvatar } from "@/src/shared/services/photoService";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import Avatar from "@/src/shared/ui/media/Avatar";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================
// COMPONENT
// ============================================
const InstructorDetailsModal = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // === State ===
  const [instructor, setInstructor] = useState<InstructorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Avatar State ===
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  // === Charger l'instructeur ===
  useEffect(() => {
    if (id) {
      loadInstructor();
    }
  }, [id]);

  // === Charger l'avatar quand l'instructeur est chargé ===
  useEffect(() => {
    if (instructor) {
      loadAvatar();
    }
  }, [instructor]);

  const loadInstructor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInstructorById(Number(id));
      setInstructor(data);
    } catch (err: any) {
      console.error("Error loading instructor:", err);
      setError(err?.message || "Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  };

  const loadAvatar = async () => {
    if (!instructor) return;

    try {
      setIsLoadingAvatar(true);
      const avatar = await getInstructorAvatar(Number(instructor.id));
      if (avatar) {
        setAvatarUri(avatar.url);
      }
    } catch (err) {
      console.error("Error loading avatar:", err);
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleInstagramPress = () => {
    if (instructor?.instagramHandle) {
      const url = `https://instagram.com/${instructor.instagramHandle.replace(
        "@",
        "",
      )}`;
      Linking.openURL(url);
    }
  };

  const handleYoutubePress = () => {
    if (instructor?.youtubeChannel) {
      Linking.openURL(instructor.youtubeChannel);
    }
  };

  const handleBookLesson = () => {
    // TODO: Navigation vers la réservation
    console.log("Book lesson with instructor:", instructor?.id);
  };

  // === Nom complet ===
  const fullName = instructor
    ? `${instructor.firstname} ${instructor.lastname}`
    : "Instructeur";

  // === Loading State ===
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Typo size={14} color={colors.text.muted} style={{ marginTop: 12 }}>
          Chargement du profil...
        </Typo>
      </View>
    );
  }

  // === Error State ===
  if (error || !instructor) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Icons.WarningIcon
          size={48}
          color={colors.semantic.danger}
          weight="duotone"
        />
        <Typo
          size={16}
          fontWeight="600"
          color={colors.text.primary}
          style={{ marginTop: 16 }}
        >
          Erreur
        </Typo>
        <Typo
          size={14}
          color={colors.text.muted}
          style={{ marginTop: 8, textAlign: "center" }}
        >
          {error || "Instructeur introuvable"}
        </Typo>
        <TouchableOpacity
          style={[{ backgroundColor: colors.accent.primary }]}
          onPress={handleClose}
        >
          <Typo size={14} fontWeight="600" color={colors.constant.white}>
            Fermer
          </Typo>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[
            styles.header,
            {
              paddingTop: insets.top,
              borderBottomColor: colors.border.subtle,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.ui.badge }]}
            onPress={handleClose}
          >
            <Icons.XIcon size={20} color={colors.text.primary} weight="bold" />
          </TouchableOpacity>
          <Typo size={18} fontWeight="700" color={colors.text.primary}>
            Profil moniteur
          </Typo>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section avec Avatar */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.heroSection}
          >
            <LinearGradient
              colors={[colors.accent.primary, colors.accent.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              {/* Cercles décoratifs */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />

              {/* Avatar */}
              <Avatar
                imageUri={avatarUri}
                name={fullName}
                size="xl"
                loading={isLoadingAvatar}
                verified
              />

              {/* Nom et spécialité */}
              <View style={styles.heroInfo}>
                <Typo size={24} fontWeight="800" color={colors.constant.white}>
                  {fullName}
                </Typo>
                {instructor.specialty && (
                  <View style={styles.specialtyBadge}>
                    <Icons.MedalIcon
                      size={16}
                      color={colors.constant.white}
                      weight="fill"
                    />
                    <Typo
                      size={14}
                      fontWeight="600"
                      color="rgba(255, 255, 255, 0.9)"
                    >
                      {instructor.specialty}
                    </Typo>
                  </View>
                )}
              </View>

              {/* Stats */}
              {instructor.yearsOfExperience && (
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Icons.TimerIcon
                      size={18}
                      color={colors.constant.white}
                      weight="duotone"
                    />
                    <Typo
                      size={16}
                      fontWeight="700"
                      color={colors.constant.white}
                    >
                      {instructor.yearsOfExperience}
                    </Typo>
                    <Typo size={11} color="rgba(255, 255, 255, 0.7)">
                      ans d'exp.
                    </Typo>
                  </View>
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Bio Section */}
          {instructor.bio && (
            <Animated.View
              entering={FadeInUp.delay(200).springify()}
              style={[styles.section, { borderColor: colors.border.subtle }]}
            >
              <View style={styles.sectionHeader}>
                <Icons.UserIcon
                  size={20}
                  color={colors.accent.primary}
                  weight="duotone"
                />
                <Typo size={16} fontWeight="700" color={colors.text.primary}>
                  À propos
                </Typo>
              </View>
              <Typo
                size={15}
                color={colors.text.secondary}
                style={styles.bioText}
              >
                {instructor.bio}
              </Typo>
            </Animated.View>
          )}

          {/* Social Links Section */}
          {(instructor.instagramHandle || instructor.youtubeChannel) && (
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              style={[styles.section, { borderColor: colors.border.subtle }]}
            >
              <View style={styles.sectionHeader}>
                <Icons.ShareNetworkIcon
                  size={20}
                  color={colors.accent.primary}
                  weight="duotone"
                />
                <Typo size={16} fontWeight="700" color={colors.text.primary}>
                  Réseaux sociaux
                </Typo>
              </View>
              <View style={styles.socialLinks}>
                {instructor.instagramHandle && (
                  <TouchableOpacity
                    style={[
                      styles.socialButton,
                      {
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                        borderColor: colors.border.default,
                      },
                    ]}
                    onPress={handleInstagramPress}
                  >
                    <Icons.InstagramLogoIcon
                      size={24}
                      color="#E4405F"
                      weight="fill"
                    />
                    <Typo size={14} color={colors.text.primary}>
                      {instructor.instagramHandle}
                    </Typo>
                    <Icons.ArrowSquareOutIcon
                      size={16}
                      color={colors.text.muted}
                      weight="bold"
                    />
                  </TouchableOpacity>
                )}
                {instructor.youtubeChannel && (
                  <TouchableOpacity
                    style={[
                      styles.socialButton,
                      {
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                        borderColor: colors.border.default,
                      },
                    ]}
                    onPress={handleYoutubePress}
                  >
                    <Icons.YoutubeLogoIcon
                      size={24}
                      color="#FF0000"
                      weight="fill"
                    />
                    <Typo
                      size={14}
                      color={colors.text.primary}
                      numberOfLines={1}
                      style={{ flex: 1 }}
                    >
                      Chaîne YouTube
                    </Typo>
                    <Icons.ArrowSquareOutIcon
                      size={16}
                      color={colors.text.muted}
                      weight="bold"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default InstructorDetailsModal;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacingX._20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX._16,
    paddingBottom: spacingY._12,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacingX._20,
  },
  heroSection: {
    marginTop: spacingY._20,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroGradient: {
    padding: spacingX._24,
    alignItems: "center",
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  heroInfo: {
    alignItems: "center",
    marginTop: spacingY._16,
    gap: 8,
  },
  specialtyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: spacingY._16,
    paddingTop: spacingY._16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  statBadge: {
    alignItems: "center",
    gap: 2,
  },
  section: {
    marginTop: spacingY._20,
    padding: spacingX._16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: spacingY._12,
  },
  bioText: {
    lineHeight: 24,
  },
  socialLinks: {
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: spacingX._14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
