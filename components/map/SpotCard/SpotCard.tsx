// components/map/SpotCard/SpotCard.tsx
import ServiceList from "@/components/map/SpotCard/ServiceList";
import SpotActions from "@/components/map/SpotCard/SpotActions";
import SpotImage from "@/components/map/SpotCard/SpotImage";
import SpotInfo from "@/components/map/SpotCard/SpotInfo";
import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { ServiceResponse } from "@/interfaces/service.interface";
import { SpotResponse } from "@/interfaces/spot.interface";
import { getActiveServices } from "@/services/serviceService";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {Photo} from "@/interfaces/photo.interface";
import {getSpotPhotos} from "@/services/photoService";
import PhotoGallery from "@/components/gallery/PhotoGallery";

type SpotCardProps = {
  spot: SpotResponse;
  bottomInset: number;
  onClose: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COMPACT_HEIGHT = 420;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.96;
const SWIPE_THRESHOLD = 50;
const PHOTO_HEIGHT = 180; // ✅ Hauteur fixe pour les photos

const SpotCard = ({ spot, bottomInset, onClose }: SpotCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesLoaded, setServicesLoaded] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(true);

  const cardHeight = useSharedValue(
    COMPACT_HEIGHT + bottomInset + spacingY._70
  );
  const translateY = useSharedValue(0);

    // ✅ useEffect pour charger les photos au montage
    useEffect(() => {
        loadPhotos();
    }, [spot.id]);

    // ✅ useEffect pour charger les services uniquement en mode étendu
    useEffect(() => {
        if (isExpanded && !servicesLoaded) {
            loadServices();
        }
    }, [isExpanded]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const data = await getActiveServices();
      // console.log("✅ Services chargés:", data.length, "services");
      // console.log("📋 Détails services:", JSON.stringify(data, null, 2));
      setServices(data);
      setServicesLoaded(true);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des services:", error);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

    const loadPhotos = async () => {
        try {
            setLoadingPhotos(true);
            const photoResponses = await getSpotPhotos(spot.id);
            // console.log("✅ Photo chargés:", photoResponses.length, "services");
            // console.log("📋 Détails photos:", JSON.stringify(photoResponses, null, 2));

            // Transform PhotoResponse[] to Photo[] for PhotoGallery
            const transformedPhotos: Photo[] = photoResponses.map((photo) => ({
                id: photo.id,
                url: photo.url,
                thumbnailUrl: photo.thumbnailUrl,
            }));

            setPhotos(transformedPhotos);
        } catch (error) {
            console.error("Error loading spot photos:", error);
            setPhotos([]); // Fallback to empty array
        } finally {
            setLoadingPhotos(false);
        }
    };

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    cardHeight.value = withSpring(
      newExpandedState
        ? EXPANDED_HEIGHT
        : COMPACT_HEIGHT + bottomInset + spacingY._70
    );
  };

  // Gesture pour swipe down to close - UNIQUEMENT sur la swipe bar
  const panGesture = Gesture.Pan()
    .enabled(isExpanded)
    .onUpdate((event) => {
      // Seulement si on swipe vers le bas
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SWIPE_THRESHOLD) {
        runOnJS(toggleExpanded)();
        translateY.value = withSpring(0);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleServicePress = (serviceId: number) => {
    console.log("Service sélectionné:", serviceId);
    // TODO: Navigation vers booking
  };

  const handleCloseCard = () => {
    if (isExpanded) {
      toggleExpanded();
    } else {
      onClose();
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <Animated.View style={[styles.spotCard, animatedCardStyle]}>
        {/* Swipe indicator - AVEC gesture pour fermer */}
        {isExpanded && (
          <GestureDetector gesture={panGesture}>
            <View style={styles.swipeIndicatorContainer}>
              <View style={styles.swipeIndicator}>
                <View style={styles.swipeBar} />
              </View>
            </View>
          </GestureDetector>
        )}

          {/* ✅ Affichage conditionnel avec loading */}
          {loadingPhotos ? (
              <View style={styles.photoLoading}>
                  <ActivityIndicator size="large" color={colors.primary} />
              </View>
          ) : (
              <PhotoGallery
                  photos={photos}
                  height={PHOTO_HEIGHT}
                  borderRadius={0}
                  showIndicators={true}
              />
          )}

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseCard}>
          <Icons.XIcon size={20} color={colors.white} weight="bold" />
        </TouchableOpacity>

        {/* Content - SANS gesture detector pour permettre le scroll */}
        <View style={styles.spotContent}>
          {/* Info du spot (toujours visible) */}
          <SpotInfo
            name={spot.name}
            address={spot.address}
            zipCode={spot.zipCode}
            city={spot.city}
            isIndoor={spot.isIndoor}
            description={spot.description}
          />

          {/* Actions - Bouton toggle pour voir les cours */}
          {!isExpanded && (
            <SpotActions
              spotId={spot.id}
              latitude={spot.latitude}
              longitude={spot.longitude}
              spotName={spot.name}
              address={spot.address}
              onViewCourses={toggleExpanded}
              hasServices={services.length > 0 || !servicesLoaded}
            />
          )}

          {/* Section étendue avec les services - SANS gesture */}
          {isExpanded && (
            <View style={styles.expandedSection}>
              {/* Header section services */}
              <View style={styles.servicesHeader}>
                <Typo size={18} fontWeight="700" color={colors.white}>
                  Services disponibles
                </Typo>
              </View>

              {/* Zone scrollable pour le contenu */}
              <View style={styles.servicesScrollContainer}>
                {/* Loading state */}
                {loadingServices && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Typo size={14} color="rgba(255, 255, 255, 0.6)">
                      Chargement des services...
                    </Typo>
                  </View>
                )}

                {/* Services list or empty state */}
                {!loadingServices && services.length > 0 && (
                  <ServiceList
                    services={services}
                    onServicePress={handleServicePress}
                    compact
                  />
                )}

                {!loadingServices &&
                  services.length === 0 &&
                  servicesLoaded && (
                    <View style={styles.emptyContainer}>
                      <View style={styles.emptyIconContainer}>
                        <Icons.CalendarXIcon
                          size={48}
                          color="rgba(255, 255, 255, 0.2)"
                          weight="thin"
                        />
                      </View>
                      <Typo
                        size={16}
                        fontWeight="600"
                        color={colors.white}
                        style={styles.emptyTitle}
                      >
                        Aucun service disponible
                      </Typo>
                      <Typo
                        size={14}
                        color="rgba(255, 255, 255, 0.6)"
                        style={styles.emptyText}
                      >
                        Ce spot n'a pas encore de prestations actives.
                      </Typo>
                    </View>
                  )}
              </View>

              {/* Bouton pour replier */}
              <TouchableOpacity
                style={styles.collapseButton}
                onPress={toggleExpanded}
                activeOpacity={0.8}
              >
                <Icons.CaretDownIcon
                  size={20}
                  color={colors.primary}
                  weight="bold"
                />
                <Typo size={15} fontWeight="600" color={colors.primary}>
                  Masquer les services
                </Typo>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default SpotCard;

const styles = StyleSheet.create({
  gestureRoot: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 11,
  },
  spotCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#161412",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  swipeIndicatorContainer: {
    // Container pour le GestureDetector
    width: "100%",
  },
  swipeIndicator: {
    alignItems: "center",
    paddingVertical: 8,
  },
  swipeBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 10,
  },
    photoLoading: {
        width: "100%",
        height: PHOTO_HEIGHT,
        backgroundColor: colors.neutral800,
        alignItems: "center",
        justifyContent: "center",
    },
  spotContent: {
    padding: spacingX._20,
    flex: 1,
  },
  expandedSection: {
    marginTop: spacingY._20,
    flex: 1,
  },
  servicesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._16,
  },
  servicesScrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },
  collapseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacingY._14,
    marginTop: spacingY._16,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
});
