import Button from "@/components/button/Button";
import ScreenWrapper from "@/components/screen/ScreenWrapper";
import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Welcome = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.7}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacingY._10,
            paddingBottom: insets.bottom + spacingY._20,
          },
        ]}
      >
        {/* Header compact avec login */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Typo color={colors.white} size={22} fontWeight="900">
              So
              <Typo color={colors.primary} size={22} fontWeight="900">
                Skate
              </Typo>
            </Typo>
          </View>

          {/*<TouchableOpacity*/}
          {/*  onPress={() => router.push("/(auth)/login")}*/}
          {/*  style={styles.loginButton}*/}
          {/*>*/}
          {/*  <Typo fontWeight="600" color={colors.white} size={14}>*/}
          {/*    Se connecter*/}
          {/*  </Typo>*/}
          {/*</TouchableOpacity>*/}
        </Animated.View>

        {/* Hero Image plus compact */}
        <Animated.View
          entering={FadeIn.duration(800).delay(300)}
          style={styles.imageContainer}
        >
          <Animated.Image
            entering={FadeIn.duration(1000).springify()}
            source={require("../../assets/images/soskate_logo_home.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />

          {/* Badge décoratif */}
          <Animated.View
            entering={FadeIn.delay(800).springify()}
            style={styles.badge}
          >
            <Typo color={colors.white} size={11} fontWeight="700">
              #1 EN ILE-DE-FRANCE
            </Typo>
          </Animated.View>
        </Animated.View>

        {/* Contenu principal optimisé */}
        <View style={styles.content}>
          {/* Titre principal condensé */}
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={styles.titleContainer}
          >
            <Typo
              color={colors.white}
              size={34}
              fontWeight="900"
              style={styles.mainTitle}
            >
              Trouvez des cours de
            </Typo>
            <View style={styles.highlightRow}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.highlightGradient}
              >
                <Typo color={colors.white} size={34} fontWeight="900">
                  skateboard
                </Typo>
              </LinearGradient>
              <Typo color={colors.white} size={34} fontWeight="900">
                {" "}
                près de vous
              </Typo>
            </View>
          </Animated.View>

          {/* Sous-titre plus court */}
          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <Typo
              color={colors.neutral300}
              size={15}
              fontWeight="500"
              style={styles.subtitle}
            >
              Réservez avec les meilleurs instructeurs
            </Typo>
          </Animated.View>

          {/* Features en ligne compacte */}
          <Animated.View
            entering={FadeInUp.delay(700).springify()}
            style={styles.featuresRow}
          >
            <View style={styles.featureItem}>
              <Typo color={colors.primary} size={16}>
                📍
              </Typo>
              <Typo color={colors.neutral200} size={12} fontWeight="600">
                Spots vérifiés
              </Typo>
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featureItem}>
              <Typo color={colors.primary} size={16}>
                ⭐
              </Typo>
              <Typo color={colors.neutral200} size={12} fontWeight="600">
                Pros certifiés
              </Typo>
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featureItem}>
              <Typo color={colors.primary} size={16}>
                💳
              </Typo>
              <Typo color={colors.neutral200} size={12} fontWeight="600">
                Sécurisé
              </Typo>
            </View>
          </Animated.View>
        </View>

        {/* CTA avec effet spacer intelligent */}
        <View style={styles.spacer} />

        <Animated.View
          entering={FadeInUp.delay(800).springify()}
          style={styles.ctaContainer}
        >
          <Button
            onPress={() => router.push("/(auth)/register")}
            style={styles.ctaButton}
          >
            <Typo size={17} fontWeight="700" color={colors.white}>
              Commencer maintenant
            </Typo>
          </Button>

          <Typo
            color={colors.neutral400}
            size={12}
            fontWeight="500"
            style={styles.ctaSubtext}
          >
            Gratuit • Sans engagement
          </Typo>
        </Animated.View>
      </View>

      {/* Gradient fade en bas */}
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.3)"]}
        style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
        pointerEvents="none"
      />
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButton: {
    paddingHorizontal: spacingX._14,
    paddingVertical: spacingY._6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageContainer: {
    alignItems: "center",
    position: "relative",
    marginVertical: spacingY._8,
  },
  welcomeImage: {
    height: verticalScale(200),
    width: verticalScale(300),
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 30,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    transform: [{ rotate: "12deg" }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    gap: spacingY._16,
  },
  titleContainer: {
    gap: 2,
  },
  mainTitle: {
    lineHeight: 40,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  highlightGradient: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  subtitle: {
    lineHeight: 22,
    opacity: 0.9,
  },
  featuresRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginTop: spacingY._8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  spacer: {
    flex: 1,
  },
  ctaContainer: {
    gap: spacingY._10,
    marginBottom: spacingY._8,
  },
  ctaButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaSubtext: {
    textAlign: "center",
    opacity: 0.7,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
