import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import BackButton from "@/src/shared/ui/button/BackButton";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerContent?: ReactNode;
  scrollable?: boolean;
  showLogo?: boolean;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerContent,
  scrollable = false,
  showLogo = false,
}: AuthLayoutProps) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacingY._20 },
        !scrollable && { paddingBottom: insets.bottom + spacingY._20 },
      ]}
    >
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={styles.header}
      >
        <BackButton iconSize={28} />
        <View style={styles.headerTextContainer}>
          <Typo size={32} fontWeight="900" color={colors.text.primary}>
            {title}
          </Typo>
          <Typo size={15} fontWeight="500" color={colors.text.secondary}>
            {subtitle}
          </Typo>
        </View>
      </Animated.View>

      {/* Form Card */}
      <Animated.View
        entering={FadeInUp.delay(showLogo ? 300 : 200).springify()}
        style={[styles.formCard, { borderColor: colors.border.default }]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
              : ["rgba(0, 0, 0, 0.02)", "rgba(0, 0, 0, 0.04)"]
          }
          style={styles.formGradient}
        >
          {children}
        </LinearGradient>
      </Animated.View>

      {/* Footer */}
      {footerContent && (
        <Animated.View
          entering={FadeInUp.delay(showLogo ? 400 : 300).springify()}
          style={styles.footer}
        >
          {footerContent}
        </Animated.View>
      )}
    </View>
  );

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.3}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacingY._20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}

      {/* Gradient bottom */}
      <LinearGradient
        colors={[
          "transparent",
          isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.6)",
        ]}
        style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
        pointerEvents="none"
      />
    </ScreenWrapper>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    marginBottom: spacingY._24,
    gap: spacingY._16,
  },
  headerTextContainer: {
    gap: 4,
  },
  formCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  formGradient: {
    padding: spacingX._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: spacingY._24,
    marginBottom: spacingY._12,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
