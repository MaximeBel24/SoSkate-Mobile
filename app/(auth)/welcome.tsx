import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={styles.loginButton}
      >
        <Typo fontWeight="500" color={colors.text}>
          Se connecter
        </Typo>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Typo color={colors.white} size={43} fontWeight={"900"}>
            SoSkate
          </Typo>
        </View>

        <Animated.Image
          entering={FadeIn.duration(700).springify()}
          source={require("../../assets/images/logo.png")}
          style={styles.welcomeImage}
          resizeMethod="scale"
        />

        <View>
          <Typo color={colors.white} size={33} fontWeight={"800"}>
            Trouvez des cours
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={"800"}>
            de skateboard prêt
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={"800"}>
            de chez vous
          </Typo>
        </View>

        <Button onPress={() => router.push("/(auth)/register")}>
          <Typo size={23} fontWeight={"bold"} color={colors.white}>
            Commencer
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: spacingX._20,
    marginVertical: spacingY._50,
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
    marginTop: spacingX._40,
    // backgroundColor: 'red',
    color: colors.white,
  },
  background: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: "center",
  },
});
