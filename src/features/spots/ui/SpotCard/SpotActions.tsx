import { spacingY } from "@/src/shared/constants/theme";
import { openNavigationMenu } from "@/src/shared/services/navigationService";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

type SpotActionsProps = {
  spotId: number;
  latitude?: number;
  longitude?: number;
  spotName?: string;
  address?: string;
  onViewCourses: () => void;
  hasServices: boolean;
};

const SpotActions = ({
  spotId,
  latitude,
  longitude,
  spotName,
  address,
  onViewCourses,
  hasServices,
}: SpotActionsProps) => {
  const { colors, isDark } = useTheme();

  const handleItinerary = async () => {
    if (!latitude || !longitude) {
      Alert.alert(
        "Position non disponible",
        "Les coordonnées de ce spot ne sont pas disponibles."
      );
      return;
    }

    try {
      await openNavigationMenu(
        { latitude, longitude },
        {
          destinationName: spotName,
          address: address,
        }
      );
    } catch (error) {
      console.error("Erreur lors de l'ouverture de l'itinéraire:", error);
      Alert.alert("Erreur", "Impossible d'ouvrir l'application de navigation.");
    }
  };

  return (
    <View style={styles.actions}>
      {/* Bouton principal - Voir les cours */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          !hasServices && [
            styles.disabledButton,
            { borderColor: colors.border.default },
          ],
        ]}
        onPress={onViewCourses}
        disabled={!hasServices}
        activeOpacity={0.8}
      >
        {hasServices ? (
          <LinearGradient
            colors={[colors.accent.primary, colors.accent.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButtonGradient}
          >
            <Icons.CalendarCheckIcon
              size={20}
              color={colors.constant.white}
              weight="bold"
            />
            <Typo size={16} fontWeight="700" color={colors.constant.white}>
              Voir les cours
            </Typo>
          </LinearGradient>
        ) : (
          <View style={styles.disabledContent}>
            <Icons.CalendarXIcon
              size={20}
              color={colors.text.muted}
              weight="bold"
            />
            <Typo size={16} fontWeight="700" color={colors.text.muted}>
              Aucun cours disponible
            </Typo>
          </View>
        )}
      </TouchableOpacity>

      {/* Bouton secondaire - Itinéraire */}
      <TouchableOpacity
        style={[
          styles.secondaryButton,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
            borderColor: colors.border.default,
          },
        ]}
        onPress={handleItinerary}
        activeOpacity={0.8}
      >
        <Icons.NavigationArrowIcon
          size={20}
          color={colors.accent.primary}
          weight="bold"
        />
        <Typo size={15} fontWeight="600" color={colors.accent.primary}>
          Itinéraire
        </Typo>
      </TouchableOpacity>
    </View>
  );
};

export default SpotActions;

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacingY._14,
  },
  disabledButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  disabledContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacingY._14,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacingY._14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
