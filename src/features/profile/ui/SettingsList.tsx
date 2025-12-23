import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SettingsListProps {
  /** Contenu de la liste (SettingsListItem) */
  children: ReactNode;
  /** Délai d'animation */
  animationDelay?: number;
}

/**
 * Container pour une liste d'options de paramètres
 * Applique le style de bordure et background
 */
const SettingsList = ({ children, animationDelay = 0 }: SettingsListProps) => {
  const content = <View style={styles.container}>{children}</View>;

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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
});
