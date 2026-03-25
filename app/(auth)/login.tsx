// ============================================
// 🛹 SOSKATE - LOGIN SCREEN
// ============================================
// Écran de connexion unifié Customer/Instructor

import AuthFooterLink from "@/src/features/auth/components/AuthFooterLink";
import AuthFormCard from "@/src/features/auth/components/AuthFormCard";
import AuthLayout from "@/src/features/auth/components/AuthLayout";
import SocialAuthButtons from "@/src/features/auth/components/SocialAuthButtons";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { logger } from "@/src/shared/utils/logger";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { login } from "@/src/shared/services/authService";
import { useTheme } from "@/src/shared/theme";
import { LoginRequest } from "@/src/features/auth/types/auth.types";
import Button from "@/src/shared/ui/button/Button";
import FormDivider from "@/src/shared/ui/form/FormDivider";
import FormInputGroup from "@/src/shared/ui/form/FormInputGroup";
import Input from "@/src/shared/ui/typography/Input";
import Typo from "@/src/shared/ui/typography/Typo";
import { verticalScale } from "@/src/shared/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import {useCustomAlert} from "@/src/shared/ui/CustomModal/AlertContext";

const Login = () => {
  const { colors } = useTheme();
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { showAlert } = useCustomAlert();

  // === Form State ===
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  // === Handlers ===
  const handleSubmit = async () => {
    // Validation des champs
    if (!emailRef.current || !passwordRef.current) {
      showAlert("Connexion", "Veuillez remplir tous les champs");
      return;
    }

    const payload: LoginRequest = {
      email: emailRef.current.trim().toLowerCase(),
      password: passwordRef.current,
    };

    try {
      setIsLoading(true);

      // 1. Appel API avec le nouvel endpoint unifié
      const response = await login(payload);

      // 2. Sauvegarder dans le contexte (et AsyncStorage)
      await authLogin(response);

      // 3. Log du rôle pour debug
      logger.dev("Connexion réussie - Rôle:", response.role);

      // 4. Navigation vers l'écran principal
      // Le router remplace la stack pour éviter le retour arrière
      router.replace("/(tabs)");
    } catch (error) {
      logger.error("Erreur de connexion:", error);

      showAlert(
        "Erreur de connexion",
        getErrorMessage(error, "Une erreur est survenue. Veuillez réessayer."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    showAlert(
      `Connexion ${provider}`,
      "Cette fonctionnalité sera bientôt disponible !",
    );
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  // === Render ===
  return (
    <AuthLayout
      title="Connexion"
      subtitle="Bon retour parmi nous ! 👋"
      showLogo={true}
      footerContent={
        <AuthFooterLink
          text="Pas encore de compte ?"
          linkText="S'inscrire gratuitement"
          onPress={() => router.navigate("/(auth)/register")}
        />
      }
    >
      <AuthFormCard
        title="Accédez à votre compte"
        description="Entrez vos identifiants"
      >
        {/* === Champs du formulaire === */}
        <FormInputGroup>
          <Input
            placeholder="Email"
            autoComplete="email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.AtIcon
                size={verticalScale(24)}
                color={colors.text.muted}
                weight="duotone"
              />
            }
          />
          <Input
            placeholder="Mot de passe"
            secureTextEntry
            autoComplete="password"
            onChangeText={(value) => (passwordRef.current = value)}
            icon={
              <Icons.LockIcon
                size={verticalScale(24)}
                color={colors.text.muted}
                weight="duotone"
              />
            }
          />
        </FormInputGroup>

        {/* === Mot de passe oublié === */}
        <Typo
          size={14}
          color={colors.accent.primary}
          fontWeight="600"
          style={{ alignSelf: "flex-end" }}
          onPress={handleForgotPassword}
        >
          Mot de passe oublié ?
        </Typo>

        {/* === Bouton de connexion === */}
        <Button loading={isLoading} onPress={handleSubmit}>
          <Typo fontWeight="700" color={colors.constant.white} size={17}>
            Se connecter
          </Typo>
        </Button>

        {/* === Séparateur === */}
        <FormDivider />

        {/* === Connexion sociale === */}
        <SocialAuthButtons
          onGooglePress={() => handleSocialLogin("Google")}
          onApplePress={() => handleSocialLogin("Apple")}
        />
      </AuthFormCard>
    </AuthLayout>
  );
};

export default Login;
