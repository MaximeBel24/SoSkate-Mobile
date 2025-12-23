import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingY } from "@/src/shared/constants/theme";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

const AuthFormCard = ({ title, description, children }: AuthFormCardProps) => {
  return (
    <View style={styles.form}>
      <View style={styles.formHeader}>
        <Typo size={18} fontWeight="700" color={colors.white}>
          {title}
        </Typo>
        <Typo size={14} color={colors.neutral300}>
          {description}
        </Typo>
      </View>

      {children}
    </View>
  );
};

export default AuthFormCard;

const styles = StyleSheet.create({
  form: {
    gap: spacingY._16,
  },
  formHeader: {
    gap: 4,
    marginBottom: spacingY._4,
  },
});
