import { StyleSheet, View } from "react-native";
import React from "react";
import Typo from "@/src/shared/ui/typography/Typo";
import Button from "@/src/shared/ui/button/Button";
import { useTheme } from "@/src/shared/theme";
import { spacingX, spacingY } from "@/src/shared/constants/theme";

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <Typo size={18} fontWeight="700">
        Oups, une erreur est survenue
      </Typo>
      {__DEV__ && (
        <Typo size={13} color={colors.text.muted}>
          {error.message}
        </Typo>
      )}
      <View style={styles.buttonWrapper}>
        <Button onPress={onReset}>
          <Typo fontWeight="700" color={colors.constant.white} size={16}>
            Réessayer
          </Typo>
        </Button>
      </View>
    </View>
  );
};

export default ErrorFallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX._24,
    gap: spacingY._16,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: spacingY._8,
  },
});
