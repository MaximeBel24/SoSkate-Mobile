import Typo from "@/src/shared/ui/typography/Typo";
import { colors } from "@/src/shared/constants/theme";
import { usePasswordValidation } from "@/src/features/auth/hooks/usePasswordValidation";
import { verticalScale } from "@/src/shared/utils/styling";
import * as Icons from "phosphor-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface PasswordRequirementsProps {
  password: string;
  onValidationChange?: (isValid: boolean) => void;
}

interface CriterionItemProps {
  isValid: boolean;
  label: string;
}

/**
 * Composant individuel pour afficher un critère de validation
 */
const CriterionItem: React.FC<CriterionItemProps> = ({ isValid, label }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (isValid) {
      // Animation quand le critère devient valide
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      opacity.value = withSpring(1, { damping: 10 });
    } else {
      // Reset quand le critère devient invalide
      opacity.value = withSpring(0.5, { damping: 10 });
    }
  }, [isValid]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconColor = isValid ? colors.success : colors.neutral400;
  const textColor = isValid ? colors.success : colors.neutral500;

  return (
    <Animated.View style={[styles.criterionItem, animatedStyle]}>
      {isValid ? (
        <Icons.CheckCircleIcon
          size={verticalScale(18)}
          color={iconColor}
          weight="fill"
        />
      ) : (
        <Icons.CircleIcon
          size={verticalScale(18)}
          color={iconColor}
          weight="regular"
        />
      )}
      <Typo size={13} color={textColor} style={styles.criterionText}>
        {label}
      </Typo>
    </Animated.View>
  );
};

/**
 * Composant affichant les critères de validation du mot de passe
 * Validation en temps réel avec animations
 */
const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  onValidationChange,
}) => {
  const { criteria, isValid } = usePasswordValidation(password);

  // Notifier le parent du changement de validation
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  // N'afficher le composant que si l'utilisateur a commencé à taper
  if (!password) {
    return null;
  }

  return (
    <View style={styles.container}>
      <CriterionItem
        isValid={criteria.minLength}
        label="Au moins 8 caractères"
      />
      <CriterionItem
        isValid={criteria.hasUppercase}
        label="Une lettre majuscule"
      />
      <CriterionItem
        isValid={criteria.hasLowercase}
        label="Une lettre minuscule"
      />
      <CriterionItem isValid={criteria.hasNumber} label="Un chiffre" />
      <CriterionItem
        isValid={criteria.hasSpecialChar}
        label="Un caractère spécial (@$!%*?&#)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(8),
    marginTop: verticalScale(8),
  },
  criterionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(8),
  },
  criterionText: {
    flex: 1,
  },
});

export default PasswordRequirements;
