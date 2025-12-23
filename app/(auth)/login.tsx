import AuthFooterLink from "@/src/features/auth/ui/AuthFooterLink";
import AuthFormCard from "@/src/features/auth/ui/AuthFormCard";
import AuthLayout from "@/src/features/auth/ui/AuthLayout";
import SocialAuthButtons from "@/src/features/auth/ui/SocialAuthButtons";
import Button from "@/src/shared/ui/button/Button";
import FormDivider from "@/src/shared/ui/form/FormDivider";
import FormInputGroup from "@/src/shared/ui/form/FormInputGroup";
import Input from "@/src/shared/ui/typography/Input";
import Typo from "@/src/shared/ui/typography/Typo";
import { colors } from "@/src/shared/constants/theme";
import { LoginRequest } from "@/src/shared/types/auth.interface";
import { login } from "@/src/shared/services/authService";
import { verticalScale } from "@/src/shared/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Connexion", "Veuillez remplir tous les champs");
      return;
    }

    const payload: LoginRequest = {
      email: emailRef.current,
      password: passwordRef.current,
    };

    try {
      setIsLoading(true);
      await login(payload);
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Erreur de connexion",
        error?.message || "Une erreur est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`Connexion ${provider}`, "Fonctionnalité bientôt disponible");
  };

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
        <FormInputGroup>
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
        </FormInputGroup>

        <TouchableOpacity
          style={{ alignSelf: "flex-end" }}
          onPress={() =>
            Alert.alert(
              "Mot de passe oublié",
              "Fonctionnalité bientôt disponible"
            )
          }
        >
          <Typo size={14} color={colors.primary} fontWeight="600">
            Mot de passe oublié ?
          </Typo>
        </TouchableOpacity>

        <Button loading={isLoading} onPress={handleSubmit}>
          <Typo fontWeight="700" color={colors.white} size={17}>
            Se connecter
          </Typo>
        </Button>

        <FormDivider />

        <SocialAuthButtons
          onGooglePress={() => handleSocialLogin("Google")}
          onApplePress={() => handleSocialLogin("Apple")}
        />
      </AuthFormCard>
    </AuthLayout>
  );
};

export default Login;
