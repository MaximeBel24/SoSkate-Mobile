import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import {
  getInstructorSpots,
  addSpotToInstructor,
  removeSpotFromInstructor,
} from "@/src/shared/services/instructorSpotsService";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { logger } from "@/src/shared/utils/logger";

interface UseInstructorAssociationParams {
  spotId: number;
  spotName: string;
  instructorId: number | null | undefined;
  isInstructor: boolean;
  isExpanded: boolean;
  onReloadInstructors: () => Promise<void>;
}

interface UseInstructorAssociationReturn {
  isAssociatedToSpot: boolean;
  loadingAssociation: boolean;
  checkingAssociation: boolean;
  handleAssociateToSpot: () => void;
  handleRemoveFromSpot: () => void;
}

export function useInstructorAssociation({
  spotId,
  spotName,
  instructorId,
  isInstructor,
  isExpanded,
  onReloadInstructors,
}: UseInstructorAssociationParams): UseInstructorAssociationReturn {
  const [isAssociatedToSpot, setIsAssociatedToSpot] = useState(false);
  const [loadingAssociation, setLoadingAssociation] = useState(false);
  const [checkingAssociation, setCheckingAssociation] = useState(false);

  const checkInstructorAssociation = useCallback(async () => {
    if (!isInstructor || !instructorId) {
      setIsAssociatedToSpot(false);
      return;
    }

    setCheckingAssociation(true);
    try {
      const instructorSpots = await getInstructorSpots(instructorId);
      const isAssociated = instructorSpots.some((s) => s.spot.id === spotId);
      setIsAssociatedToSpot(isAssociated);
    } catch (error) {
      logger.error("Erreur verification association:", error);
      setIsAssociatedToSpot(false);
    } finally {
      setCheckingAssociation(false);
    }
  }, [isInstructor, instructorId, spotId]);

  useEffect(() => {
    if (isInstructor) {
      checkInstructorAssociation();
    }
  }, [isInstructor, checkInstructorAssociation]);

  const handleAssociateToSpot = useCallback(() => {
    if (!instructorId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "S'associer a ce spot",
      `Voulez-vous enseigner a "${spotName}" ? Vous serez visible par les eleves sur ce spot.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            setLoadingAssociation(true);
            try {
              await addSpotToInstructor(instructorId, spotId);
              setIsAssociatedToSpot(true);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              Alert.alert(
                "Succes !",
                `Vous enseignez maintenant a "${spotName}". Les eleves peuvent vous trouver ici.`,
              );
              if (isExpanded) {
                onReloadInstructors();
              }
            } catch (error) {
              logger.error("Erreur association:", error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                "Erreur",
                getErrorMessage(
                  error,
                  "Impossible de vous associer a ce spot",
                ),
              );
            } finally {
              setLoadingAssociation(false);
            }
          },
        },
      ],
    );
  }, [instructorId, spotId, spotName, isExpanded, onReloadInstructors]);

  const handleRemoveFromSpot = useCallback(() => {
    if (!instructorId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Se retirer de ce spot",
      `Voulez-vous arreter d'enseigner a "${spotName}" ? Vous ne serez plus visible par les eleves ici.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se retirer",
          style: "destructive",
          onPress: async () => {
            setLoadingAssociation(true);
            try {
              await removeSpotFromInstructor(instructorId, spotId);
              setIsAssociatedToSpot(false);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              if (isExpanded) {
                onReloadInstructors();
              }
            } catch (error) {
              logger.error("Erreur retrait:", error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                "Erreur",
                getErrorMessage(
                  error,
                  "Impossible de vous retirer de ce spot",
                ),
              );
            } finally {
              setLoadingAssociation(false);
            }
          },
        },
      ],
    );
  }, [instructorId, spotId, spotName, isExpanded, onReloadInstructors]);

  return {
    isAssociatedToSpot,
    loadingAssociation,
    checkingAssociation,
    handleAssociateToSpot,
    handleRemoveFromSpot,
  };
}
