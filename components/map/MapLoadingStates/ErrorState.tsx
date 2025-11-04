import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ErrorStateProps = {
  error: string;
  onRetry?: () => void;
};

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.centerContent}>
      <View style={styles.errorContainer}>
        <Icons.WarningCircleIcon size={64} color="#ef4444" weight="fill" />
        <Typo
          size={18}
          fontWeight="700"
          color={colors.white}
          style={{ marginTop: 16 }}
        >
          Oups !
        </Typo>
        <Typo
          size={14}
          color={colors.neutral400}
          style={{ marginTop: 8, textAlign: "center" }}
        >
          {error}
        </Typo>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Icons.ArrowClockwiseIcon
            size={20}
            color={colors.white}
            weight="bold"
          />
          <Typo size={15} fontWeight="600" color={colors.white}>
            Réessayer
          </Typo>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    alignItems: "center",
    paddingHorizontal: spacingX._30,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._24,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
});
