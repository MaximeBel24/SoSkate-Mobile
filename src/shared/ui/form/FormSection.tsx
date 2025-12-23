import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingY } from "@/src/shared/constants/theme";
import * as Icons from "phosphor-react-native";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type PhosphorIcon = keyof typeof Icons;

interface FormSectionProps {
  icon: PhosphorIcon;
  title: string;
  children: ReactNode;
}

const FormSection = ({ icon, title, children }: FormSectionProps) => {
  const IconComponent = Icons[icon] as React.ComponentType<any>;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <IconComponent size={20} color={colors.primary} weight="duotone" />
        <Typo size={15} fontWeight="700" color={colors.white}>
          {title}
        </Typo>
      </View>
      {children}
    </View>
  );
};

export default FormSection;

const styles = StyleSheet.create({
  section: {
    gap: spacingY._12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacingY._4,
  },
});
