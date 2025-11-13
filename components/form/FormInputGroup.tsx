import Typo from "@/components/text/Typo";
import { colors, spacingY } from "@/constants/theme";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface FormInputGroupProps {
  label?: string;
  children: ReactNode;
}

const FormInputGroup = ({ label, children }: FormInputGroupProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Typo
          size={13}
          fontWeight="600"
          color={colors.neutral300}
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
