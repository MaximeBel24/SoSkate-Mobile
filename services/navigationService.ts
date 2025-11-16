// services/navigationService.ts
import { Alert, Linking, Platform } from "react-native";

export type NavigationApp = "google-maps" | "apple-maps" | "waze";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface NavigationOptions {
  destinationName?: string;
  address?: string;
}

/**
 * Vérifie si une application de navigation est installée
 */
const isAppInstalled = async (url: string): Promise<boolean> => {
  try {
    return await Linking.canOpenURL(url);
  } catch {
    return false;
  }
};

/**
 * Construit l'URL pour Google Maps
 */
const getGoogleMapsUrl = (
  coords: Coordinates,
  options?: NavigationOptions
): string => {
  const { latitude, longitude } = coords;
  const destination =
    options?.destinationName || options?.address || `${latitude},${longitude}`;

  if (Platform.OS === "ios") {
    return `comgooglemaps://?daddr=${encodeURIComponent(
      destination
    )}&directionsmode=driving`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
};

/**
 * Construit l'URL pour Apple Maps (iOS uniquement)
 */
const getAppleMapsUrl = (
  coords: Coordinates,
  options?: NavigationOptions
): string => {
  const { latitude, longitude } = coords;
  const label = options?.destinationName || "Destination";

  return `maps://app?daddr=${latitude},${longitude}&q=${encodeURIComponent(
    label
  )}`;
};

/**
 * Construit l'URL pour Waze
 */
const getWazeUrl = (
  coords: Coordinates,
  options?: NavigationOptions
): string => {
  const { latitude, longitude } = coords;

  return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
};

/**
 * Ouvre l'application de navigation spécifiée
 */
const openNavigationApp = async (
  app: NavigationApp,
  coords: Coordinates,
  options?: NavigationOptions
): Promise<boolean> => {
  let url: string;
  let fallbackUrl: string | null = null;

  switch (app) {
    case "google-maps":
      url = getGoogleMapsUrl(coords, options);
      // Fallback vers le navigateur si l'app n'est pas installée
      if (Platform.OS === "ios") {
        fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}&travelmode=driving`;
      }
      break;

    case "apple-maps":
      if (Platform.OS !== "ios") {
        throw new Error("Apple Maps est disponible uniquement sur iOS");
      }
      url = getAppleMapsUrl(coords, options);
      break;

    case "waze":
      url = getWazeUrl(coords, options);
      break;

    default:
      throw new Error(`Application de navigation non reconnue: ${app}`);
  }

  try {
    const canOpen = await isAppInstalled(url);

    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else if (fallbackUrl) {
      // Essayer le fallback
      await Linking.openURL(fallbackUrl);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Erreur lors de l'ouverture de ${app}:`, error);
    return false;
  }
};

/**
 * Affiche un menu de sélection de l'application de navigation
 */
export const openNavigationMenu = async (
  coords: Coordinates,
  options?: NavigationOptions
): Promise<void> => {
  // Vérifier les apps disponibles
  const availableApps: { name: string; app: NavigationApp; url: string }[] = [];

  // Google Maps
  const googleMapsUrl = getGoogleMapsUrl(coords, options);
  if (await isAppInstalled(googleMapsUrl)) {
    availableApps.push({
      name: "Google Maps",
      app: "google-maps",
      url: googleMapsUrl,
    });
  }

  // Apple Maps (iOS uniquement)
  if (Platform.OS === "ios") {
    availableApps.push({
      name: "Apple Maps",
      app: "apple-maps",
      url: getAppleMapsUrl(coords, options),
    });
  }

  // Waze
  const wazeUrl = getWazeUrl(coords, options);
  if (await isAppInstalled(wazeUrl)) {
    availableApps.push({
      name: "Waze",
      app: "waze",
      url: wazeUrl,
    });
  }

  // Si aucune app n'est disponible, ouvrir Google Maps dans le navigateur
  if (availableApps.length === 0) {
    const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}&travelmode=driving`;
    await Linking.openURL(browserUrl);
    return;
  }

  // Si une seule app est disponible, l'ouvrir directement
  if (availableApps.length === 1) {
    await openNavigationApp(availableApps[0].app, coords, options);
    return;
  }

  // Sinon, afficher un menu de sélection
  const buttons = availableApps.map((app) => ({
    text: app.name,
    onPress: () => openNavigationApp(app.app, coords, options),
  }));

  Alert.alert(
    "Choisir une application",
    "Quelle application souhaitez-vous utiliser pour l'itinéraire ?",
    [
      ...buttons,
      {
        text: "Annuler",
        style: "cancel",
      },
    ]
  );
};

/**
 * Ouvre directement l'application de navigation par défaut
 * (Google Maps sur Android, Apple Maps sur iOS)
 */
export const openDefaultNavigation = async (
  coords: Coordinates,
  options?: NavigationOptions
): Promise<void> => {
  const defaultApp: NavigationApp =
    Platform.OS === "ios" ? "apple-maps" : "google-maps";

  const success = await openNavigationApp(defaultApp, coords, options);

  if (!success) {
    // Fallback vers le navigateur
    const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}&travelmode=driving`;
    await Linking.openURL(browserUrl);
  }
};

export default {
  openNavigationMenu,
  openDefaultNavigation,
};
