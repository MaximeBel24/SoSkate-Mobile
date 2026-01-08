import { useTheme } from "@/src/shared/theme";
import { ScreenWrapperProps } from "@/src/shared/utils/types";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({
  style,
  children,
  showPattern = false,
  isModal = false,
  bgOpacity = 1,
}: ScreenWrapperProps) => {
  const { colors, isDark } = useTheme();

  let paddingTop = Platform.OS === "android" ? 0.06 : 40;
  let paddingBottom = 0;

  if (isModal) {
    paddingTop = Platform.OS === "android" ? 0.02 : 45;
    paddingBottom = height * 0.02;
  }

  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: isModal
          ? colors.background.surface
          : colors.background.primary,
      }}
      imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
    >
      <SafeAreaView
        edges={["bottom", "top"]}
        style={[{ paddingTop, paddingBottom, flex: 1 }, style]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor="transparent"
        />
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
