import { spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type EmptyServiceStateProps = {
  onBackToMap: () => void;
};

const EmptyServiceState = ({ onBackToMap }: EmptyServiceStateProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {/* Icône */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)",
            borderColor: colors.border.default,
          },
        ]}
      >
        <Icons.CalendarIcon size={64} color={colors.text.muted} weight="thin" />
      </View>

      {/* Message principal */}
      <Typo
        size={22}
        fontWeight="700"
        color={colors.text.primary}
        style={styles.title}
      >
        Aucun service disponible
      </Typo>

      {/* Message secondaire */}
      <Typo size={15} color={colors.text.muted} style={styles.description}>
        Ce spot n'a pas encore de prestations actives.{"\n"}
        Revenez plus tard ou explorez d'autres spots !
      </Typo>

      {/* Bouton retour */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDark
              ? "rgba(255, 107, 53, 0.15)"
              : "rgba(234, 88, 12, 0.1)",
            borderColor: isDark
              ? "rgba(255, 107, 53, 0.3)"
              : "rgba(234, 88, 12, 0.2)",
          },
        ]}
        onPress={onBackToMap}
        activeOpacity={0.8}
      >
        <Icons.MapTrifoldIcon
          size={20}
          color={colors.accent.primary}
          weight="bold"
        />
        <Typo size={16} fontWeight="600" color={colors.accent.primary}>
          Retour à la carte
        </Typo>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyServiceState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: spacingY._14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
