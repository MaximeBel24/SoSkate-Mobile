import { spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface FormInputGroupProps {
  label?: string;
  children: ReactNode;
}

const FormInputGroup = ({ label, children }: FormInputGroupProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Typo
          size={13}
          fontWeight="600"
          color={colors.text.secondary}
          style={styles.label}
        >
          {label}
        </Typo>
      )}
      {children}
    </View>
  );
};

export default FormInputGroup;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._12,
  },
  label: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
