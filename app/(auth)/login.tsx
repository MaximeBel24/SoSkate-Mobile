import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { LoginRequest } from "@/interfaces/auth.interface";
import { login } from "@/services/authService";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Inscription", "Veuillez remplir les champs");
      return;
    }

    const payload: LoginRequest = {
      email: emailRef.current,
      password: passwordRef.current,
    };

    try {
      setIsLoading(true);
      const response = await login(payload);

      // Alert.alert("Succès", `Bienvenue ${response.customer.firstname} !`);
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

  return (
    <ScreenWrapper>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ display: "flex", flexDirection: "row", gap: 70 }}>
            <BackButton iconSize={28} />

            <View style={{ gap: 12, bottom: 5 }}>
              <Typo size={30} fontWeight={"800"}>
                Connexion
              </Typo>
            </View>
          </View>

          {/* form */}

          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Connectez vous pour pouvoir réserver un cours
            </Typo>
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

            <Typo
              size={14}
              color={colors.text}
              style={{ alignSelf: "flex-end" }}
            >
              Mot de passe oublié ?
            </Typo>

            <Button loading={isLoading} onPress={handleSubmit}>
              <Typo fontWeight={"700"} color={colors.black} size={21}>
                Se connecter
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

export default Login;

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
