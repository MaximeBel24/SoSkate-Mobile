import { useTheme } from "@/src/shared/theme";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SettingsListProps {
  children: ReactNode;
  animationDelay?: number;
}

const SettingsList = ({ children, animationDelay = 0 }: SettingsListProps) => {
  const { colors } = useTheme();

  const dynamicStyles = {
    backgroundColor: colors.background.subtle,
    borderColor: colors.background.elevated,
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
