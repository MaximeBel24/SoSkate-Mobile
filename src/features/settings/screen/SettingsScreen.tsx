// ============================================
// 🛹 SOSKATE - SETTINGS SCREEN
// ============================================
// Settings page with theme selector and other preferences

import ThemeSelector from "@/src/features/settings/ui/ThemeSelector";
import { useTheme } from "@/src/shared/theme";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import Header from "@/src/shared/ui/typography/Header";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================
// SETTING ITEM COMPONENT
// ============================================
type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  animationDelay?: number;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  onPress,
  rightElement,
  showChevron = true,
  animationDelay = 0,
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay).duration(300)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.settingItem,
          {
            backgroundColor: pressed
              ? colors.background.surfaceHover
              : colors.background.surface,
            borderColor: colors.border.subtle,
          },
        ]}
        disabled={!onPress}
      >
        <View
          style={[styles.settingIcon, { backgroundColor: colors.neutral[800] }]}
        >
          {icon}
        </View>

        <View style={styles.settingContent}>
          <Typo size={15} fontWeight="500" color={colors.text.primary}>
            {title}
          </Typo>
          {description && (
            <Typo size={12} color={colors.text.muted} style={{ marginTop: 2 }}>
              {description}
            </Typo>
          )}
        </View>

        {rightElement}

        {showChevron && onPress && (
          <Icons.CaretRightIcon size={18} color={colors.text.muted} />
        )}
      </Pressable>
    </Animated.View>
  );
};

// ============================================
// SECTION HEADER COMPONENT
// ============================================
type SectionHeaderProps = {
  title: string;
  animationDelay?: number;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  animationDelay = 0,
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      style={styles.sectionHeader}
      entering={FadeInDown.delay(animationDelay).duration(300)}
    >
      <Typo size={13} fontWeight="600" color={colors.text.muted}>
        {title.toUpperCase()}
      </Typo>
    </Animated.View>
  );
};

// ============================================
// SETTINGS SCREEN
// ============================================
const SettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Mock states for toggles
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.15}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + verticalScale(100),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header with back button */}
          <Header
            title="Paramètres"
            // onBackPress={() => router.back()}
            style={{ marginVertical: verticalScale(10) }}
          />

          {/* Theme Section */}
          <View style={styles.section}>
            <ThemeSelector />
          </View>

          {/* Notifications Section */}
          <SectionHeader title="Notifications" animationDelay={300} />
          <View style={styles.section}>
            <SettingItem
              icon={
                <Icons.BellIcon
                  size={20}
                  color={colors.accent.primary}
                  weight="duotone"
                />
              }
              title="Notifications push"
              description="Recevoir des alertes pour vos réservations"
              showChevron={false}
              animationDelay={350}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{
                    false: colors.neutral[600],
                    true: colors.accent.primary + "80",
                  }}
                  thumbColor={
                    notificationsEnabled
                      ? colors.accent.primary
                      : colors.neutral[400]
                  }
                />
              }
            />

            <SettingItem
              icon={
                <Icons.EnvelopeIcon
                  size={20}
                  color={colors.semantic.info}
                  weight="duotone"
                />
              }
              title="E-mails promotionnels"
              description="Offres et nouveautés SoSkate"
              onPress={() => {}}
              animationDelay={400}
            />
          </View>

          {/* Privacy Section */}
          <SectionHeader title="Confidentialité" animationDelay={450} />
          <View style={styles.section}>
            <SettingItem
              icon={
                <Icons.MapPinIcon
                  size={20}
                  color={colors.semantic.success}
                  weight="duotone"
                />
              }
              title="Localisation"
              description="Autoriser l'accès à votre position"
              showChevron={false}
              animationDelay={500}
              rightElement={
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{
                    false: colors.neutral[600],
                    true: colors.accent.primary + "80",
                  }}
                  thumbColor={
                    locationEnabled
                      ? colors.accent.primary
                      : colors.neutral[400]
                  }
                />
              }
            />

            <SettingItem
              icon={
                <Icons.ShieldCheckIcon
                  size={20}
                  color={colors.semantic.warning}
                  weight="duotone"
                />
              }
              title="Données personnelles"
              description="Gérer vos informations"
              onPress={() => {}}
              animationDelay={550}
            />
          </View>

          {/* About Section */}
          <SectionHeader title="À propos" animationDelay={600} />
          <View style={styles.section}>
            <SettingItem
              icon={
                <Icons.InfoIcon
                  size={20}
                  color={colors.text.secondary}
                  weight="duotone"
                />
              }
              title="Version de l'application"
              description="v1.0.0 (Build 1)"
              showChevron={false}
              animationDelay={650}
            />

            <SettingItem
              icon={
                <Icons.FileTextIcon
                  size={20}
                  color={colors.text.secondary}
                  weight="duotone"
                />
              }
              title="Conditions d'utilisation"
              onPress={() => {}}
              animationDelay={700}
            />

            <SettingItem
              icon={
                <Icons.LockIcon
                  size={20}
                  color={colors.text.secondary}
                  weight="duotone"
                />
              }
              title="Politique de confidentialité"
              onPress={() => {}}
              animationDelay={750}
            />
          </View>

          {/* Support Section */}
          <SectionHeader title="Support" animationDelay={800} />
          <View style={styles.section}>
            <SettingItem
              icon={
                <Icons.QuestionIcon
                  size={20}
                  color={colors.accent.primary}
                  weight="duotone"
                />
              }
              title="Centre d'aide"
              description="FAQ et tutoriels"
              onPress={() => {}}
              animationDelay={850}
            />

            <SettingItem
              icon={
                <Icons.ChatCircleIcon
                  size={20}
                  color={colors.accent.primary}
                  weight="duotone"
                />
              }
              title="Nous contacter"
              description="support@soskate.fr"
              onPress={() => {}}
              animationDelay={900}
            />
          </View>

          {/* Footer */}
          <Animated.View
            style={styles.footer}
            entering={FadeInDown.delay(950).duration(300)}
          >
            <Typo size={12} color={colors.text.muted} style={styles.footerText}>
              Made with 🛹 in France
            </Typo>
            <Typo size={11} color={colors.text.muted} style={styles.footerText}>
              © 2025 SoSkate. Tous droits réservés.
            </Typo>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Gradient bottom */}
      <LinearGradient
        colors={[
          "transparent",
          isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.8)",
        ]}
        style={[styles.bottomGradient, { height: insets.bottom + 60 }]}
        pointerEvents="none"
      />
    </ScreenWrapper>
  );
};

export default SettingsScreen;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  section: {
    gap: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  sectionHeader: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    paddingHorizontal: scale(4),
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(14),
    borderRadius: scale(14),
    borderWidth: 1,
  },
  settingIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
    marginLeft: scale(12),
    marginRight: scale(8),
  },
  footer: {
    marginTop: verticalScale(32),
    alignItems: "center",
    gap: verticalScale(4),
  },
  footerText: {
    textAlign: "center",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
