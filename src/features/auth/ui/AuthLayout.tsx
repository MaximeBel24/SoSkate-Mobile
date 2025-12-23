import BackButton from "@/src/shared/ui/button/BackButton";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingX, spacingY } from "@/src/shared/constants/theme";
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
          <Typo size={32} fontWeight="900" color={colors.white}>
            {title}
          </Typo>
          <Typo size={15} fontWeight="500" color={colors.neutral300}>
            {subtitle}
          </Typo>
        </View>
      </Animated.View>

      {/*/!* Logo compact (optionnel) *!/*/}
      {/*{showLogo && (*/}
      {/*  <Animated.View*/}
      {/*    entering={FadeInDown.delay(200).springify()}*/}
      {/*    style={styles.logoContainer}*/}
      {/*  >*/}
      {/*    <View style={styles.logoBadge}>*/}
      {/*      <Typo size={20} fontWeight="900" color={colors.white}>*/}
      {/*        So*/}
      {/*        <Typo size={20} fontWeight="900" color={colors.primary}>*/}
      {/*          Skate*/}
      {/*        </Typo>*/}
      {/*      </Typo>*/}
      {/*    </View>*/}
      {/*  </Animated.View>*/}
      {/*)}*/}

      {/*{showLogo && <View style={styles.spacer} />}*/}

      {/* Form Card */}
      <Animated.View
        entering={FadeInUp.delay(showLogo ? 300 : 200).springify()}
        style={styles.formCard}
      >
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
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
        colors={["transparent", "rgba(0, 0, 0, 0.3)"]}
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
  logoContainer: {
    alignItems: "center",
    marginVertical: spacingY._12,
  },
  logoBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  spacer: {
    flex: 0.3,
  },
  formCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
