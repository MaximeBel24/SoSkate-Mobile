import AuthFooterLink from "@/src/features/auth/ui/AuthFooterLink";
import AuthFormCard from "@/src/features/auth/ui/AuthFormCard";
import AuthLayout from "@/src/features/auth/ui/AuthLayout";
import PasswordRequirements from "@/src/features/auth/ui/PasswordRequirements";
import Button from "@/src/shared/ui/button/Button";
import FormInputGroup from "@/src/shared/ui/form/FormInputGroup";
import { SecurityInfoBanner } from "@/src/shared/ui/form/SecurityInfoBanner";
import Input from "@/src/shared/ui/typography/Input";
import Typo from "@/src/shared/ui/typography/Typo";
import { colors } from "@/src/shared/constants/theme";
import { CustomerRegisterRequest } from "@/src/shared/types/auth.interface";
import { registerCustomer } from "@/src/shared/services/authService";
import { verticalScale } from "@/src/shared/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const firstnameRef = useRef("");
  const lastnameRef = useRef("");

  // États pour la validation
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Callback pour gérer le changement de validation du mot de passe
  const handlePasswordValidationChange = useCallback((isValid: boolean) => {
    setIsPasswordValid(isValid);
  }, []);

  // Vérifier si le formulaire est valide pour activer/désactiver le bouton
  const isFormValid =
    emailRef.current &&
    firstnameRef.current &&
    lastnameRef.current &&
    isPasswordValid &&
    password === passwordConfirm &&
    password.length > 0;

  const handleSubmit = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !firstnameRef.current ||
      !lastnameRef.current
    ) {
      Alert.alert("Inscription", "Veuillez remplir tous les champs");
      return;
    }

    if (passwordRef.current !== passwordConfirmRef.current) {
      Alert.alert("Inscription", "Le mot de passe n'est pas identique");
      return;
    }

    if (!isPasswordValid) {
      Alert.alert(
        "Inscription",
        "Le mot de passe ne respecte pas tous les critères de sécurité"
      );
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
      await registerCustomer(payload);
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
    <AuthLayout
      title="Inscription"
      subtitle="Rejoignez la communauté SoSkate"
      scrollable={true}
      footerContent={
        <AuthFooterLink
          text="Vous avez déjà un compte ?"
          linkText="Se connecter"
          onPress={() => router.navigate("/(auth)/login")}
        />
      }
    >
      <AuthFormCard
        title="Créez votre compte"
        description="Remplissez les informations ci-dessous"
      >
        <FormInputGroup label="INFORMATIONS PERSONNELLES">
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
        </FormInputGroup>

        <FormInputGroup label="IDENTIFIANTS DE CONNEXION">
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
            onChangeText={(value) => {
              passwordRef.current = value;
              setPassword(value);
            }}
            icon={
              <Icons.LockIcon
                size={verticalScale(24)}
                color={colors.neutral400}
                weight="duotone"
              />
            }
          />

          {/* Composant de validation du mot de passe */}
          <PasswordRequirements
            password={password}
            onValidationChange={handlePasswordValidationChange}
          />

          <Input
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            onChangeText={(value) => {
              passwordConfirmRef.current = value;
              setPasswordConfirm(value);
            }}
            icon={
              <Icons.LockIcon
                size={verticalScale(24)}
                color={colors.neutral400}
                weight="duotone"
              />
            }
          />
        </FormInputGroup>

        <SecurityInfoBanner />

        <Button
          loading={isLoading}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
          // style={!isFormValid && { opacity: 0.5 }}
        >
          <Typo fontWeight="700" color={colors.white} size={17}>
            Créer mon compte
          </Typo>
        </Button>
      </AuthFormCard>
    </AuthLayout>
  );
};

export default Register;
