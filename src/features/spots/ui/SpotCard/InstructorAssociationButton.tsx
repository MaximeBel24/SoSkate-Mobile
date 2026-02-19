import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { spacingY } from "@/src/shared/constants/theme";

interface InstructorAssociationButtonProps {
  isAssociatedToSpot: boolean;
  loadingAssociation: boolean;
  checkingAssociation: boolean;
  onAssociate: () => void;
  onRemove: () => void;
}

const InstructorAssociationButton = ({
  isAssociatedToSpot,
  loadingAssociation,
  checkingAssociation,
  onAssociate,
  onRemove,
}: InstructorAssociationButtonProps) => {
  const { colors, isDark } = useTheme();

  if (checkingAssociation) {
    return (
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
            borderColor: colors.border.default,
          },
        ]}
      >
        <ActivityIndicator size="small" color={colors.accent.primary} />
      </View>
    );
  }

  if (isAssociatedToSpot) {
    return (
      <View style={styles.actionContainer}>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: colors.semantic.successBg,
              borderColor: colors.semantic.successBorder,
            },
          ]}
        >
          <Icons.CheckCircleIcon
            size={18}
            color={colors.semantic.success}
            weight="fill"
          />
          <Typo size={13} fontWeight="600" color={colors.semantic.success}>
            Vous enseignez ici
          </Typo>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.semantic.dangerBg,
              borderColor: colors.semantic.dangerBorder,
            },
          ]}
          onPress={onRemove}
          disabled={loadingAssociation}
          activeOpacity={0.7}
        >
          {loadingAssociation ? (
            <ActivityIndicator size="small" color={colors.semantic.danger} />
          ) : (
            <>
              <Icons.MinusCircleIcon
                size={18}
                color={colors.semantic.danger}
                weight="fill"
              />
              <Typo size={14} fontWeight="600" color={colors.semantic.danger}>
                Se retirer
              </Typo>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.actionContainer}>
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: colors.semantic.infoBg,
            borderColor: colors.semantic.infoBorder,
          },
        ]}
      >
        <Icons.InfoIcon
          size={16}
          color={colors.semantic.info}
          weight="fill"
        />
        <Typo size={12} color={colors.semantic.info}>
          Vous n'enseignez pas encore ici
        </Typo>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          styles.buttonPrimary,
          { backgroundColor: colors.accent.primary },
        ]}
        onPress={onAssociate}
        disabled={loadingAssociation}
        activeOpacity={0.8}
      >
        {loadingAssociation ? (
          <ActivityIndicator size="small" color={colors.constant.white} />
        ) : (
          <>
            <Icons.PlusCircleIcon
              size={20}
              color={colors.constant.white}
              weight="fill"
            />
            <Typo size={15} fontWeight="700" color={colors.constant.white}>
              S'associer a ce spot
            </Typo>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InstructorAssociationButton;

const styles = StyleSheet.create({
  actionContainer: {
    gap: 12,
    marginTop: spacingY._12,
    marginBottom: spacingY._8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonPrimary: {
    borderWidth: 0,
  },
});
