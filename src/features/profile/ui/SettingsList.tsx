import { useTheme } from "@/src/shared/theme";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SettingsListProps {
  children: ReactNode;
  animationDelay?: number;
}

const SettingsList = ({ children, animationDelay = 0 }: SettingsListProps) => {
  const { colors, isDark } = useTheme();

  const dynamicStyles = {
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.03)",
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
  };

  const content = (
    <View style={[styles.container, dynamicStyles]}>{children}</View>
  );

  if (animationDelay > 0) {
    return (
      <Animated.View entering={FadeInUp.delay(animationDelay).springify()}>
        {content}
      </Animated.View>
    );
  }

  return content;
};

export default SettingsList;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
});
