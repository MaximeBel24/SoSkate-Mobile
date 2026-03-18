import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { logger } from "@/src/shared/utils/logger";
import {useLocationSettings} from "@/src/shared/contexts/LocationContext";

// ============================================
// TYPES
// ============================================

// Position simplifiée : on n'expose que lat/lng, pas tout l'objet Location
interface UserLocation {
  latitude: number;
  longitude: number;
}

// Contrat du hook — tout ce que le composant parent peut consommer
interface UseUserLocationReturn {
  userLocation: UserLocation | null; // null = pas encore de position ou permission refusée
  permissionStatus: Location.PermissionStatus | null; // pour afficher un message adapté dans l'UI
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; // permet de relancer la géoloc manuellement (ex: bouton "recentrer")
}

// ============================================
// HOOK
// ============================================

export function useUserLocation(): UseUserLocationReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLocationEnabled } = useLocationSettings();

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isLocationEnabled) {
        setUserLocation(null);
        setPermissionStatus(null);
        return;
      }

      // 1. Demander la permission de localisation "en utilisation"
      //    requestForegroundPermissionsAsync() affiche la popup système
      //    au premier appel, puis retourne le choix mémorisé ensuite
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      // 2. Si l'utilisateur refuse, on ne bloque rien :
      //    la map fonctionnera toujours, juste sans le point bleu
      if (status !== Location.PermissionStatus.GRANTED) {
        setError("Permission de localisation refusée");
        return;
      }

      // 3. Récupérer la position courante du device
      //    accuracy: Balanced = bon compromis précision/vitesse (~100m)
      //    Sur un vrai device c'est quasi instantané si le GPS est actif
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 4. On ne garde que lat/lng, pas besoin d'altitude, heading, etc.
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      logger.error("Erreur géolocalisation:", err);
      setError("Impossible de récupérer votre position");
    } finally {
      setLoading(false);
    }
  }, [isLocationEnabled]);

  // Lancer la géoloc au mount du hook (= quand l'écran map s'affiche)
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    userLocation,
    permissionStatus,
    loading,
    error,
    refresh: fetchLocation, // exposé sous le nom "refresh" pour l'API publique
  };
}
