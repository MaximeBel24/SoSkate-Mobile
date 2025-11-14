import Typo from "@/components/text/Typo";
import { colors, spacingY } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SectionHeaderProps {
  /** Titre principal de la section */
  title: string;
  /** Description optionnelle */
  description?: string;
  /** Délai d'animation */
  animationDelay?: number;
}

/**
 * Header de section avec titre et description optionnelle
 * Utilisé pour structurer visuellement les écrans
 */
export const SectionHeader = ({
  title,
  description,
  animationDelay = 0,
}: SectionHeaderProps) => {
  const content = (
    <View style={styles.container}>
      <Typo size={18} fontWeight="700" color={colors.white}>
        {title}
      </Typo>
      {description && (
        <Typo size={14} color={colors.neutral400}>
          {description}
        </Typo>
      )}
    </View>
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

const styles = StyleSheet.create({
  container: {
    marginTop: spacingY._30,
    marginBottom: spacingY._16,
    gap: 4,
  },
});
