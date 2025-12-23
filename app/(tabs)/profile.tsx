import { SectionHeader } from "@/src/shared/ui/layout/SectionHeader";
import Header from "@/src/shared/ui/typography/Header";
import { ProfileInfoCard } from "@/src/features/profile/ui/ProfileInfoCard";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import SettingsList from "@/src/features/profile/ui/SettingsList";
import SettingsListItem from "@/src/features/profile/ui/SettingsListItem";
import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingX, spacingY } from "@/src/shared/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SettingsOption = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: string;
  isDanger?: boolean;
};

const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const settingsOptions: SettingsOption[] = [
    {
      title: "Éditer le profil",
      icon: (
        <Icons.UserCircleIcon size={24} color={colors.white} weight="duotone" />
      ),
      routeName: "/(modals)/profileModal",
      bgColor: colors.primary,
    },
    {
      title: "Mes réservations",
      icon: (
        <Icons.CalendarCheckIcon
          size={24}
          color={colors.white}
          weight="duotone"
        />
      ),
      bgColor: "#8b5cf6",
    },
    {
      title: "Paramètres",
      icon: (
        <Icons.GearSixIcon size={24} color={colors.white} weight="duotone" />
      ),
      bgColor: "#06b6d4",
    },
    {
      title: "Politique de confidentialité",
      icon: (
        <Icons.ShieldCheckIcon
          size={24}
          color={colors.white}
          weight="duotone"
        />
      ),
      bgColor: "#10b981",
    },
    {
      title: "Aide & Support",
      icon: (
        <Icons.QuestionIcon size={24} color={colors.white} weight="duotone" />
      ),
      bgColor: "#f59e0b",
    },
    {
      title: "Déconnexion",
      icon: (
        <Icons.SignOutIcon size={24} color={colors.white} weight="duotone" />
      ),
      bgColor: "#ef4444",
      isDanger: true,
    },
  ];

  const handleLogout = async () => {
    // await signOut(auth);
    router.replace("/(auth)/login");
  };

  const showLogoutAlert = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        onPress: () => console.log("Cancel logout"),
        style: "cancel",
      },
      {
        text: "Se déconnecter",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const handleOptionPress = (option: SettingsOption) => {
    if (option.isDanger) {
      showLogoutAlert();
      return;
    }

    if (option.routeName) {
      router.push(option.routeName);
    } else {
      Alert.alert(
        "Bientôt disponible",
        "Cette fonctionnalité arrive prochainement !"
      );
    }
  };

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.2}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacingY._20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <Header title="Profil" style={{ marginVertical: spacingY._10 }} />

          {/* User Info Card */}
          <ProfileInfoCard
            name="Jean Dupont"
            email="jean.dupont@email.com"
            avatarUri="https://i.pravatar.cc/300?img=12"
            isVerified={true}
            onEditPress={() => router.push("/(modals)/profileModal")}
            // stats={{
            //   coursesCount: 12,
            //   favoritesCount: 8,
            //   level: 5,
            // }}
          />

          {/* Section Header */}
          <SectionHeader
            title="Mon compte"
            description="Gérez vos paramètres et préférences"
            animationDelay={200}
          />

          {/* Settings List */}
          <SettingsList animationDelay={300}>
            {settingsOptions.map((option, index) => (
              <SettingsListItem
                key={index}
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

          {/* Version info */}
          <View style={styles.versionContainer}>
            <Typo
              size={12}
              color={colors.neutral500}
              style={{ textAlign: "center" }}
            >
              SoSkate v1.0.0
            </Typo>
            <Typo
              size={12}
              color={colors.neutral500}
              style={{ textAlign: "center" }}
            >
              Made with 🛹 in France
            </Typo>
          </View>
        </View>
      </ScrollView>

      {/* Gradient bottom */}
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.3)"]}
        style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
        pointerEvents="none"
      />
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
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
