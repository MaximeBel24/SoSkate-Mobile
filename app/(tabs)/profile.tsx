// ============================================
// 🛹 SOSKATE - PROFILE SCREEN
// ============================================
// Écran profil avec données réelles, avatar et options selon le rôle

import { ProfileInfoCard } from "@/src/features/profile/ui/ProfileInfoCard";
import SettingsList from "@/src/features/profile/ui/SettingsList";
import SettingsListItem from "@/src/features/profile/ui/SettingsListItem";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import {
  getCustomerAvatar,
  getInstructorAvatar,
} from "@/src/shared/services/photoService";
import { useTheme } from "@/src/shared/theme";
import { logger } from "@/src/shared/utils/logger";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import { SectionHeader } from "@/src/shared/ui/layout/SectionHeader";
import Header from "@/src/shared/ui/typography/Header";
import Typo from "@/src/shared/ui/typography/Typo";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Href } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================
// TYPES
// ============================================
type SettingsOption = {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: string;
  isDanger?: boolean;
  roles?: ("CUSTOMER" | "INSTRUCTOR")[];
};

// ============================================
// COMPONENT
// ============================================
const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, logout, isCustomer, isInstructor } = useAuth();

  // === Avatar State ===
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  // === Nom complet de l'utilisateur ===
  const fullName = useMemo(() => {
    if (!user) return "Utilisateur";
    return `${user.firstName} ${user.lastName}`;
  }, [user?.firstName, user?.lastName]);

  // === Charger l'avatar (et recharger quand l'écran reprend le focus) ===
  const loadAvatar = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoadingAvatar(true);

      let avatar = null;

      if (isCustomer && user.customerId) {
        avatar = await getCustomerAvatar(user.customerId);
      } else if (isInstructor && user.instructorId) {
        avatar = await getInstructorAvatar(user.instructorId);
      }

      if (avatar) {
        setAvatarUri(avatar.url);
      } else {
        setAvatarUri(null);
      }
    } catch (error) {
      logger.error("Error loading avatar:", error);
      setAvatarUri(null);
    } finally {
      setIsLoadingAvatar(false);
    }
  }, [user, isCustomer, isInstructor]);

  // Recharger l'avatar quand l'écran reprend le focus (après édition par exemple)
  useFocusEffect(
    useCallback(() => {
      loadAvatar();
    }, [loadAvatar]),
  );

  // === Options de paramètres (dynamiques selon le rôle) ===
  const allSettingsOptions: SettingsOption[] = [
    // === Options communes ===
    {
      id: "edit-profile",
      title: "Éditer le profil",
      icon: (
        <Icons.UserCircleIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      routeName: "/(modals)/profileModal",
      bgColor: colors.accent.primary,
    },

    // === Options CUSTOMER uniquement ===
    {
      id: "my-bookings",
      title: "Mes réservations",
      icon: (
        <Icons.CalendarCheckIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#8b5cf6",
      routeName: "/(modals)/my-bookings/",
      roles: ["CUSTOMER"],
    },
    {
      id: "my-favorites",
      title: "Mes favoris",
      icon: (
        <Icons.HeartIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#ec4899",
      roles: ["CUSTOMER"],
    },

    // === Options INSTRUCTOR uniquement ===
    {
      id: "my-schedule",
      title: "Mon planning",
      icon: (
        <Icons.CalendarDotsIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#8b5cf6",
      routeName: "/(modals)/instructor/planning", // ← AJOUTER
      roles: ["INSTRUCTOR"],
    },
    {
      id: "my-spots",
      title: "Mes spots d'enseignement",
      icon: (
        <Icons.MapPinIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#10b981", // Vert
      routeName: "/(modals)/instructor/my-spots",
      roles: ["INSTRUCTOR"],
    },
    {
      id: "my-courses",
      title: "Mes cours",
      icon: (
        <Icons.ChalkboardTeacherIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#6366f1",
      routeName: "/(modals)/instructor/courses",
      roles: ["INSTRUCTOR"],
    },
    {
      id: "my-stats",
      title: "Mes statistiques",
      icon: (
        <Icons.ChartLineUpIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#14b8a6",
      roles: ["INSTRUCTOR"],
    },

    // === Options communes (suite) ===
    {
      id: "settings",
      title: "Paramètres",
      icon: (
        <Icons.GearSixIcon
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      routeName: "/(modals)/settingsModal",
      bgColor: "#06b6d4",
    },
    {
      id: "privacy",
      title: "Politique de confidentialité",
      icon: (
        <Icons.ShieldCheck
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#10b981",
    },
    {
      id: "help",
      title: "Aide & Support",
      icon: (
        <Icons.Question
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#f59e0b",
    },
    {
      id: "logout",
      title: "Déconnexion",
      icon: (
        <Icons.SignOut
          size={24}
          color={colors.constant.white}
          weight="duotone"
        />
      ),
      bgColor: "#ef4444",
      isDanger: true,
    },
  ];

  // === Filtrer les options selon le rôle ===
  const settingsOptions = useMemo(() => {
    return allSettingsOptions.filter((option) => {
      if (!option.roles) return true;
      if (isCustomer && option.roles.includes("CUSTOMER")) return true;
      if (isInstructor && option.roles.includes("INSTRUCTOR")) return true;
      return false;
    });
  }, [isCustomer, isInstructor, colors]);

  // === Handlers ===
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/welcome");
    } catch (error) {
      logger.error("Erreur lors de la déconnexion:", error);
      Alert.alert(
        "Erreur",
        "Impossible de se déconnecter. Veuillez réessayer.",
      );
    }
  };

  const showLogoutAlert = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", onPress: handleLogout, style: "destructive" },
    ]);
  };

  const handleOptionPress = (option: SettingsOption) => {
    if (option.isDanger) {
      showLogoutAlert();
      return;
    }

    if (option.routeName) {
      router.push(option.routeName as Href);
    } else {
      Alert.alert(
        "Bientôt disponible",
        "Cette fonctionnalité arrive prochainement !",
      );
    }
  };

  // === Section header dynamique ===
  const sectionDescription = isInstructor
    ? "Gérez votre activité de professeur"
    : "Gérez vos paramètres et préférences";

  // === Stats selon le rôle ===
  const profileStats = useMemo(() => {
    if (isCustomer) {
      return {
        // TODO: Remplacer par les vraies stats depuis l'API
        coursesCount: 0,
        favoritesCount: 0,
      };
    }

    if (isInstructor) {
      return {
        // TODO: Remplacer par les vraies stats depuis l'API
        coursesCount: 0, // Nombre de cours donnés
        level: 5, // Note moyenne ou niveau
      };
    }

    return undefined;
  }, [isCustomer, isInstructor]);

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacingY._20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <Header title="Profil" style={{ marginVertical: spacingY._10 }} />

          {/* === Carte profil avec Avatar dynamique === */}
          <ProfileInfoCard
            name={fullName}
            email={user?.email || "email@example.com"}
            avatarUri={avatarUri}
            isVerified={isInstructor}
            onEditPress={() => router.push("/(modals)/profileModal")}
            isLoadingAvatar={isLoadingAvatar}
            stats={profileStats}
          />

          {/* === Badge rôle pour les instructeurs === */}
          {isInstructor && (
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: colors.semantic.infoBg,
                  borderColor: colors.accent.primary,
                },
              ]}
            >
              <Icons.CertificateIcon
                size={18}
                color={colors.accent.primary}
                weight="duotone"
              />
              <Typo size={13} fontWeight="600" color={colors.accent.primary}>
                Compte Professeur
              </Typo>
            </View>
          )}

          <SectionHeader
            title="Mon compte"
            description={sectionDescription}
            animationDelay={200}
          />

          <SettingsList animationDelay={300}>
            {settingsOptions.map((option, index) => (
              <SettingsListItem
                key={option.id}
                title={option.title}
                icon={option.icon}
                bgColor={option.bgColor}
                onPress={() => handleOptionPress(option)}
                isLast={index === settingsOptions.length - 1}
                isDanger={option.isDanger}
                animationDelay={350 + index * 50}
              />
            ))}
          </SettingsList>

          {/* === Version === */}
          <View style={styles.versionContainer}>
            <Typo
              size={12}
              color={colors.text.muted}
              style={{ textAlign: "center" }}
            >
              SoSkate v1.0.0
            </Typo>
            <Typo
              size={12}
              color={colors.text.muted}
              style={{ textAlign: "center" }}
            >
              Made with 🛹 in France
            </Typo>
            {/* Debug: afficher le rôle en dev */}
            {__DEV__ && user && (
              <Typo
                size={10}
                color={colors.text.muted}
                style={{ textAlign: "center", marginTop: 8 }}
              >
                [DEV] Rôle: {user.role} | ID: {user.id}
              </Typo>
            )}
          </View>
        </View>
      </ScrollView>

      <LinearGradient
        colors={[
          "transparent",
          colors.background.scrim,
        ]}
        style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
        pointerEvents="none"
      />
    </ScreenWrapper>
  );
};

export default Profile;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    marginTop: spacingY._12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  versionContainer: {
    marginTop: spacingY._30,
    marginBottom: spacingY._20,
    gap: 4,
    alignItems: "center",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
