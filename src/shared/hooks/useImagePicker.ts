// ============================================
// 🛹 SOSKATE - USE IMAGE PICKER HOOK
// ============================================
// Hook pour gérer la sélection d'images (galerie et caméra)

import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import { logger } from "@/src/shared/utils/logger";

// ============================================
// TYPES
// ============================================
export interface SelectedImage {
  uri: string;
  type: string;
  name: string;
  width: number;
  height: number;
  fileSize?: number;
}

export interface UseImagePickerOptions {
  /** Qualité de l'image (0-1) */
  quality?: number;
  /** Permettre l'édition de l'image */
  allowsEditing?: boolean;
  /** Ratio d'aspect pour l'édition [width, height] */
  aspect?: [number, number];
  /** Taille max en pixels */
  maxWidth?: number;
  maxHeight?: number;
}

export interface UseImagePickerReturn {
  /** Image sélectionnée */
  selectedImage: SelectedImage | null;
  /** Chargement en cours */
  isLoading: boolean;
  /** Ouvrir la galerie */
  pickFromGallery: () => Promise<SelectedImage | null>;
  /** Ouvrir la caméra */
  takePhoto: () => Promise<SelectedImage | null>;
  /** Afficher le menu de choix (galerie ou caméra) */
  showImagePickerAlert: (
    onImageSelected?: (image: SelectedImage) => void,
  ) => void;
  /** Réinitialiser l'image sélectionnée */
  clearSelection: () => void;
}

// ============================================
// DEFAULT OPTIONS
// ============================================
const DEFAULT_OPTIONS: UseImagePickerOptions = {
  quality: 0.8,
  allowsEditing: true,
  aspect: [1, 1], // Carré pour les avatars
  maxWidth: 1024,
  maxHeight: 1024,
};

// ============================================
// HOOK
// ============================================
export function useImagePicker(
  options: UseImagePickerOptions = {},
): UseImagePickerReturn {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  /**
   * Vérifie et demande les permissions pour la galerie
   */
  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "SoSkate a besoin d'accéder à vos photos pour définir votre photo de profil.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return false;
    }

    return true;
  };

  /**
   * Vérifie et demande les permissions pour la caméra
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "SoSkate a besoin d'accéder à votre caméra pour prendre une photo de profil.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return false;
    }

    return true;
  };

  /**
   * Extrait le nom du fichier depuis l'URI
   */
  const getFileName = (uri: string): string => {
    const uriParts = uri.split("/");
    const fileName = uriParts[uriParts.length - 1];

    // Ajouter une extension si elle n'existe pas
    if (!fileName.includes(".")) {
      return `avatar_${Date.now()}.jpg`;
    }

    return fileName;
  };

  /**
   * Détermine le type MIME de l'image
   */
  const getMimeType = (uri: string): string => {
    const extension = uri.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      default:
        return "image/jpeg";
    }
  };

  /**
   * Traite le résultat du picker
   */
  const processResult = (
    result: ImagePicker.ImagePickerResult,
  ): SelectedImage | null => {
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];

    const image: SelectedImage = {
      uri: asset.uri,
      type: asset.mimeType || getMimeType(asset.uri),
      name: getFileName(asset.uri),
      width: asset.width,
      height: asset.height,
      fileSize: asset.fileSize,
    };

    setSelectedImage(image);
    return image;
  };

  /**
   * Ouvre la galerie pour sélectionner une image
   */
  const pickFromGallery =
    useCallback(async (): Promise<SelectedImage | null> => {
      try {
        setIsLoading(true);

        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
          return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: mergedOptions.allowsEditing,
          aspect: mergedOptions.aspect,
          quality: mergedOptions.quality,
        });

        return processResult(result);
      } catch (error) {
        logger.error("Error picking image from gallery:", error);
        Alert.alert("Erreur", "Impossible d'accéder à la galerie");
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [mergedOptions]);

  /**
   * Ouvre la caméra pour prendre une photo
   */
  const takePhoto = useCallback(async (): Promise<SelectedImage | null> => {
    try {
      setIsLoading(true);

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
      });

      return processResult(result);
    } catch (error) {
      logger.error("Error taking photo:", error);
      Alert.alert("Erreur", "Impossible d'accéder à la caméra");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mergedOptions]);

  /**
   * Affiche un menu pour choisir entre galerie et caméra
   */
  const showImagePickerAlert = useCallback(
    (onImageSelected?: (image: SelectedImage) => void) => {
      Alert.alert(
        "Changer la photo",
        "Comment souhaitez-vous ajouter votre photo ?",
        [
          {
            text: "📷 Prendre une photo",
            onPress: async () => {
              const image = await takePhoto();
              if (image && onImageSelected) {
                onImageSelected(image);
              }
            },
          },
          {
            text: "🖼️ Choisir dans la galerie",
            onPress: async () => {
              const image = await pickFromGallery();
              if (image && onImageSelected) {
                onImageSelected(image);
              }
            },
          },
          {
            text: "Annuler",
            style: "cancel",
          },
        ],
      );
    },
    [takePhoto, pickFromGallery],
  );

  /**
   * Réinitialise l'image sélectionnée
   */
  const clearSelection = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return {
    selectedImage,
    isLoading,
    pickFromGallery,
    takePhoto,
    showImagePickerAlert,
    clearSelection,
  };
}

export default useImagePicker;
