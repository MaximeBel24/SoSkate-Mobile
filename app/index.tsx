import { useTheme } from "@/src/shared/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const SplashScreen = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      // router.replace("/(tabs)");
      router.replace("/(auth)/welcome");
    }, 1500);
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.primary}
      />
      <Animated.Image
        source={require("../assets/images/logo.png")}
        entering={FadeInDown}
        style={styles.logo}
        resizeMethod="scale"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: "23%",
    aspectRatio: 1,
  },
});
