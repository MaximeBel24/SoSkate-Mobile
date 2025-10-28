import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { CustomerRegisterRequest } from "@/interfaces/auth.interface";
import { registerCustomer } from "@/services/authService";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const firstnameRef = useRef("");
  const lastnameRef = useRef("");
  const phoneRef = useRef("");
  const birthDateRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !firstnameRef.current ||
      !lastnameRef.current
    ) {
      Alert.alert(
        "Inscription",
        "Veuillez remplir les champs Prénom, Nom, Email et Mot de passe"
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

  const [date, setDate] = useState(new Date());

  return (
    <ScreenWrapper>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ display: "flex", flexDirection: "row", gap: 70 }}>
            <BackButton iconSize={28} />

            <View style={{ gap: 12, bottom: 5 }}>
              <Typo size={30} fontWeight={"800"}>
                Inscription
              </Typo>
            </View>
          </View>

          {/* form */}

          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Créez un compte pour pouvoir réserver un cours
            </Typo>
            <Input
              placeholder="Entrez votre prénom"
              onChangeText={(value) => (firstnameRef.current = value)}
              icon={
                <Icons.UserIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            <Input
              placeholder="Entrez votre nom"
              autoComplete="family-name"
              onChangeText={(value) => (lastnameRef.current = value)}
              icon={
                <Icons.UserIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            <Input
              placeholder="Entrez votre email"
              autoComplete="email"
              onChangeText={(value) => (emailRef.current = value)}
              icon={
                <Icons.AtIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            {/*<Input*/}
            {/*    placeholder="Entrez votre numéro de téléphone"*/}
            {/*    onChangeText={(value) => (phoneRef.current = value)}*/}
            {/*    icon={*/}
            {/*        <Icons.PhoneIcon*/}
            {/*            size={verticalScale(26)}*/}
            {/*            color={colors.neutral300}*/}
            {/*            weight="fill"*/}
            {/*        />*/}
            {/*    }*/}
            {/*/>*/}
            {/*<Input*/}
            {/*    placeholder="Entrez votre date de naissance"*/}
            {/*    onChangeText={(value) => (birthDateRef.current = value)}*/}
            {/*    icon={*/}
            {/*        <Icons.CakeIcon*/}
            {/*            size={verticalScale(26)}*/}
            {/*            color={colors.neutral300}*/}
            {/*            weight="fill"*/}
            {/*        />*/}
            {/*    }*/}
            {/*/>*/}
            <Input
              placeholder="Entrez votre mot de passe"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
              icon={
                <Icons.LockIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            <Input
              placeholder="Confirmez votre mot de passe"
              secureTextEntry
              onChangeText={(value) => (passwordConfirmRef.current = value)}
              icon={
                <Icons.LockIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />

            {/*<Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>*/}
            {/*    Mot de passe oublié ?*/}
            {/*</Typo>*/}

            <Button loading={isLoading} onPress={handleSubmit}>
              <Typo fontWeight={"700"} color={colors.black} size={21}>
                S'inscrire
              </Typo>
            </Button>
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <Typo size={15}>Vous avez déja un compte ?</Typo>
            <Pressable onPress={() => router.navigate("/(auth)/login")}>
              <Typo size={15} fontWeight={"700"} color={colors.primary}>
                Se connecter
              </Typo>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._50,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
