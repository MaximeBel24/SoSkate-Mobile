// components/map/SpotCard/SpotActions.tsx
import Typo from "@/components/text/Typo";
import { colors, spacingY } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

type SpotActionsProps = {
  spotId: number;
  onViewCourses: () => void;
  hasServices: boolean;
};

const SpotActions = ({
  spotId,
  onViewCourses,
  hasServices,
}: SpotActionsProps) => {
  const handleItinerary = () => {
    Alert.alert("Itinéraire", "Ouverture de Google Maps...");
    // TODO: Implémenter l'ouverture de Google Maps
  };

  return (
    <View style={styles.actions}>
      {/* Bouton principal - Voir les cours */}
      <TouchableOpacity
        style={[styles.primaryButton, !hasServices && styles.disabledButton]}
        onPress={onViewCourses}
        disabled={!hasServices}
        activeOpacity={0.8}
      >
        {hasServices ? (
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButtonGradient}
          >
            <Icons.CalendarCheckIcon
              size={20}
              color={colors.white}
              weight="bold"
            />
            <Typo size={16} fontWeight="700" color={colors.white}>
              Voir les cours
            </Typo>
          </LinearGradient>
        ) : (
          <View style={styles.disabledContent}>
            <Icons.CalendarXIcon
              size={20}
              color="rgba(255, 255, 255, 0.4)"
              weight="bold"
            />
            <Typo size={16} fontWeight="700" color="rgba(255, 255, 255, 0.4)">
              Aucun cours disponible
            </Typo>
          </View>
        )}
      </TouchableOpacity>

      {/* Bouton secondaire - Itinéraire */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleItinerary}
        activeOpacity={0.8}
      >
        <Icons.NavigationArrowIcon
          size={20}
          color={colors.primary}
          weight="bold"
        />
        <Typo size={15} fontWeight="600" color={colors.primary}>
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});
