import { useCallback, useEffect, useState } from "react";
import { getSpotPhotos } from "@/src/shared/services/photoService";
import { getActiveServices } from "@/src/shared/services/serviceService";
import { getInstructorsBySpot } from "@/src/shared/services/instructorSpotsService";
import { logger } from "@/src/shared/utils/logger";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import { Photo } from "@/src/shared/types/photo.interface";
import { ServiceResponse } from "@/src/shared/types/service.interface";

interface UseSpotCardDataReturn {
  photos: Photo[];
  loadingPhotos: boolean;
  services: ServiceResponse[];
  loadingServices: boolean;
  servicesLoaded: boolean;
  instructors: InstructorResponse[];
  loadingInstructors: boolean;
  instructorsLoaded: boolean;
  loadInstructors: () => Promise<void>;
}

export function useSpotCardData(
  spotId: number,
  isExpanded: boolean,
): UseSpotCardDataReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [instructorsLoaded, setInstructorsLoaded] = useState(false);

  const loadPhotos = useCallback(async () => {
    try {
      setLoadingPhotos(true);
      const photoResponses = await getSpotPhotos(spotId);
      const transformedPhotos: Photo[] = photoResponses.map((photo) => ({
        id: photo.id,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
      }));
      setPhotos(transformedPhotos);
    } catch (error) {
      logger.error("Error loading spot photos:", error);
      setPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  }, [spotId]);

  const loadServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      const data = await getActiveServices();
      setServices(data);
      setServicesLoaded(true);
    } catch (error) {
      logger.error("Erreur lors du chargement des services:", error);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const loadInstructors = useCallback(async () => {
    try {
      setLoadingInstructors(true);
      const data = await getInstructorsBySpot(spotId);
      setInstructors(data);
      setInstructorsLoaded(true);
    } catch (err) {
      logger.error("Erreur chargement instructeurs:", err);
      setInstructors([]);
    } finally {
      setLoadingInstructors(false);
    }
  }, [spotId]);

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Load services and instructors when expanded
  useEffect(() => {
    if (isExpanded) {
      loadServices();
      loadInstructors();
    }
  }, [isExpanded, loadServices, loadInstructors]);

  return {
    photos,
    loadingPhotos,
    services,
    loadingServices,
    servicesLoaded,
    instructors,
    loadingInstructors,
    instructorsLoaded,
    loadInstructors,
  };
}
