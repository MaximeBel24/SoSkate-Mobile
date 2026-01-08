import { spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SectionHeaderProps {
  title: string;
  description?: string;
  animationDelay?: number;
}

export const SectionHeader = ({
  title,
  description,
  animationDelay = 0,
}: SectionHeaderProps) => {
  const { colors } = useTheme();

  const content = (
    <View style={styles.container}>
      <Typo size={18} fontWeight="700" color={colors.text.primary}>
        {title}
      </Typo>
      {description && (
        <Typo size={14} color={colors.text.muted}>
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
