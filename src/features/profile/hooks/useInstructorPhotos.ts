// ============================================
// SOSKATE - USE INSTRUCTOR PHOTOS HOOK
// ============================================
// Hook pour gérer la galerie photos d'un instructeur

import { useCallback, useState } from "react";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { useCustomAlert } from "@/src/shared/ui/CustomModal/AlertContext";
import useImagePicker, {
    SelectedImage,
} from "@/src/shared/hooks/useImagePicker";
import {
    getInstructorPhotos,
    uploadInstructorPhoto,
    deletePhoto,
} from "@/src/shared/services/photoService";
import { PhotoResponse } from "@/src/shared/types/photo.interface";
import { logger } from "@/src/shared/utils/logger";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";

// ============================================
// TYPES
// ============================================
export interface UseInstructorPhotosReturn {
    photos: PhotoResponse[];
    isLoading: boolean;
    isUploading: boolean;
    loadPhotos: () => Promise<void>;
    handleAddPhoto: () => void;
    handleDeletePhoto: (photoId: number) => void;
}

// ============================================
// HOOK
// ============================================
export function useInstructorPhotos(): UseInstructorPhotosReturn {
    const { user } = useAuth();
    const { showAlert } = useCustomAlert();
    const { showMultiImagePickerAlert } = useImagePicker({
        allowsEditing: false,
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        allowsMultiple: true
    });

    const [photos, setPhotos] = useState<PhotoResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // === Charger les photos ===
    const loadPhotos = useCallback(async () => {
        if (!user?.instructorId) return;

        try {
            setIsLoading(true);
            const data = await getInstructorPhotos(user.instructorId);
            setPhotos(data);
        } catch (error) {
            logger.error("Error loading instructor photos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.instructorId]);

    // === Upload multiple photos ===
    const onImagesSelected = useCallback(
        async (images: SelectedImage[]) => {
            if (!user?.instructorId) return;

            try {
                setIsUploading(true);

                const results: PhotoResponse[] = [];

                for (const image of images) {
                    const result = await uploadInstructorPhoto({
                        file: {
                            uri: image.uri,
                            type: image.type,
                            name: image.name,
                        },
                        entityType: "INSTRUCTOR",
                        entityId: user.instructorId,
                        photoType: "GALLERY",
                        uploadedBy: user.id,
                    });
                    results.push(result);
                }

                // Ajouter les photos en début de liste
                setPhotos((prev) => [...results, ...prev]);

                const count = results.length;
                showAlert(
                    "Succès",
                    count > 1
                        ? `${count} photos ajoutées avec succès !`
                        : "Photo ajoutée avec succès !",
                );
            } catch (error) {
                logger.error("Error uploading instructor photos:", error);
                showAlert(
                    "Erreur",
                    getErrorMessage(error, "Impossible d'ajouter les photos"),
                );
                // Recharger pour être à jour
                await loadPhotos();
            } finally {
                setIsUploading(false);
            }
        },
        [user?.instructorId, user?.id, loadPhotos],
    );


    const handleAddPhoto = useCallback(() => {
        showMultiImagePickerAlert(onImagesSelected);
    }, [showMultiImagePickerAlert, onImagesSelected]);


    // === Supprimer une photo ===
    const handleDeletePhoto = useCallback(
        (photoId: number) => {
            showAlert(
                "Supprimer la photo",
                "Êtes-vous sûr de vouloir supprimer cette photo ?",
                [
                    { text: "Annuler", style: "cancel" },
                    {
                        text: "Supprimer",
                        style: "destructive",
                        onPress: async () => {
                            if (!user) return;

                            // Suppression optimiste
                            setPhotos((prev) => prev.filter((p) => p.id !== photoId));

                            try {
                                await deletePhoto(photoId, user.id);
                            } catch (error) {
                                logger.error("Error deleting photo:", error);
                                showAlert(
                                    "Erreur",
                                    getErrorMessage(error, "Impossible de supprimer la photo"),
                                );
                                // Recharger en cas d'erreur
                                await loadPhotos();
                            }
                        },
                    },
                ],
            );
        },
        [user, loadPhotos],
    );

    return {
        photos,
        isLoading,
        isUploading,
        loadPhotos,
        handleAddPhoto,
        handleDeletePhoto,
    };
}

export default useInstructorPhotos;
