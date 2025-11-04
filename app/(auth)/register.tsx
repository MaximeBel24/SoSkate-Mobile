import BackButton from "@/components/button/BackButton";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { CustomerRegisterRequest } from "@/interfaces/auth.interface";
import { registerCustomer } from "@/services/authService";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const firstnameRef = useRef("");
  const lastnameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !firstnameRef.current ||
      !lastnameRef.current
    ) {
      Alert.alert(
        "Inscription",
        "Veuillez remplir tous les champs"
      );
      return;
    }

    if (passwordRef.current !== passwordConfirmRef.current) {
      Alert.alert("Inscription", "Le mot de passe n'est pas identique");
      return;
    }

    const payload: CustomerRegisterRequest = {
      firstname: firstnameRef.current,
      lastname: lastnameRef.current,
      email: emailRef.current,
      password: passwordRef.current,
      birthDate: "1986-02-01",
      phone: "+33678534661",
    };

    try {
      setIsLoading(true);
      const response = await registerCustomer(payload);

      Alert.alert("Succès", `Bienvenue ${response.firstname} !`);
      router.push("/(auth)/login");
    } catch (error: any) {
      Alert.alert(
        "Erreur d'inscription",
        error?.message || "Une erreur est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.3}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacingY._20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.container, { paddingTop: insets.top + spacingY._20 }]}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.header}
          >
            <BackButton iconSize={28} />
            <View style={styles.headerTextContainer}>
              <Typo size={32} fontWeight="900" color={colors.white}>
                Inscription
              </Typo>
              <Typo size={15} fontWeight="500" color={colors.neutral300}>
                Rejoignez la communauté SoSkate
              </Typo>
            </View>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={styles.formCard}
          >
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
              style={styles.formGradient}
            >
              <View style={styles.form}>
                <View style={styles.formHeader}>
                  <Typo size={18} fontWeight="700" color={colors.white}>
                    Créez votre compte
                  </Typo>
                  <Typo size={14} color={colors.neutral300}>
                    Remplissez les informations ci-dessous
                  </Typo>
                </View>

                <View style={styles.inputGroup}>
                  <Typo
                    size={13}
                    fontWeight="600"
                    color={colors.neutral300}
                    style={styles.inputLabel}
                  >
                    INFORMATIONS PERSONNELLES
                  </Typo>

                  <Input
                    placeholder="Prénom"
                    onChangeText={(value) => (firstnameRef.current = value)}
                    icon={
                      <Icons.UserIcon
                        size={verticalScale(24)}
                        color={colors.neutral400}
                        weight="duotone"
                      />
                    }
                  />
                  <Input
                    placeholder="Nom"
                    autoComplete="family-name"
                    onChangeText={(value) => (lastnameRef.current = value)}
                    icon={
                      <Icons.UserIcon
                        size={verticalScale(24)}
                        color={colors.neutral400}
                        weight="duotone"
                      />
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Typo
                    size={13}
                    fontWeight="600"
                    color={colors.neutral300}
                    style={styles.inputLabel}
                  >
                    IDENTIFIANTS DE CONNEXION
                  </Typo>

                  <Input
                    placeholder="Email"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={(value) => (emailRef.current = value)}
                    icon={
                      <Icons.AtIcon
                        size={verticalScale(24)}
                        color={colors.neutral400}
                        weight="duotone"
                      />
                    }
                  />
                  <Input
                    placeholder="Mot de passe"
                    secureTextEntry
                    onChangeText={(value) => (passwordRef.current = value)}
                    icon={
                      <Icons.LockIcon
                        size={verticalScale(24)}
                        color={colors.neutral400}
                        weight="duotone"
                      />
                    }
                  />
                  <Input
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry
                    onChangeText={(value) =>
                      (passwordConfirmRef.current = value)
                    }
                    icon={
                      <Icons.LockIcon
                        size={verticalScale(24)}
                        color={colors.neutral400}
                        weight="duotone"
                      />
                    }
                  />
                </View>

                {/* Info sécurité */}
                <View style={styles.securityInfo}>
                  <Icons.ShieldCheckIcon
                    size={16}
                    color={colors.primary}
                    weight="fill"
                  />
                  <Typo size={12} color={colors.neutral400}>
                    Vos données sont sécurisées et cryptées
                  </Typo>
                </View>

                <Button loading={isLoading} onPress={handleSubmit}>
                  <Typo fontWeight="700" color={colors.white} size={17}>
                    Créer mon compte
                  </Typo>
                </Button>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.footer}
          >
            <Typo size={15} color={colors.neutral300}>
              Vous avez déjà un compte ?
            </Typo>
            <Pressable onPress={() => router.navigate("/(auth)/login")}>
              <Typo size={15} fontWeight="700" color={colors.primary}>
                Se connecter
              </Typo>
            </Pressable>
          </Animated.View>
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

export default Register;

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
  form: {
    gap: spacingY._20,
  },
  formHeader: {
    gap: 4,
    marginBottom: spacingY._8,
  },
  inputGroup: {
    gap: spacingY._12,
  },
  inputLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
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
