import ServiceList from "@/src/features/spots/ui/SpotCard/ServiceList";
import SpotActions from "@/src/features/spots/ui/SpotCard/SpotActions";
import SpotInfo from "@/src/features/spots/ui/SpotCard/SpotInfo";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { getSpotPhotos } from "@/src/shared/services/photoService";
import { getActiveServices } from "@/src/shared/services/serviceService";
import { getAllInstructors } from "@/src/shared/services/instructorService";
import { useTheme } from "@/src/shared/theme";
import { Photo } from "@/src/shared/types/photo.interface";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import PhotoGallery from "@/src/shared/ui/media/PhotoGallery";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import InstructorList from "./InstructorList";
import ServiceCard from "./ServiceCard";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
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

type SpotCardProps = {
  spot: SpotResponse;
  bottomInset: number;
  onClose: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COMPACT_HEIGHT = 420;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.96;
const SWIPE_THRESHOLD = 50;
const PHOTO_HEIGHT = 180;

const SpotCard = ({ spot, bottomInset, onClose }: SpotCardProps) => {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [instructorsLoaded, setInstructorsLoaded] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  const cardHeight = useSharedValue(
      COMPACT_HEIGHT + bottomInset + spacingY._70
  );
  const translateY = useSharedValue(0);

  useEffect(() => {
    loadPhotos();
  }, [spot.id]);

  useEffect(() => {
    if (isExpanded) {
      loadServices();
      loadInstructors();
    }
  }, [isExpanded]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const data = await getActiveServices();
      setServices(data);
      setServicesLoaded(true);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadPhotos = async () => {
    try {
      setLoadingPhotos(true);
      const photoResponses = await getSpotPhotos(spot.id);
      const transformedPhotos: Photo[] = photoResponses.map((photo) => ({
        id: photo.id,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
      }));
      setPhotos(transformedPhotos);
    } catch (error) {
      console.error("Error loading spot photos:", error);
      setPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const loadInstructors = async () => {
    try {
      setLoadingInstructors(true);
      const data = await getAllInstructors();
      setInstructors(data);
      setInstructorsLoaded(true);
    } catch (err) {
      console.error("Erreur chargement instructeurs:", err);
      setInstructors([]);
    } finally {
      setLoadingInstructors(false);
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

  const panGesture = Gesture.Pan()
      .enabled(isExpanded)
      .onUpdate((event) => {
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
    console.log("Instructeur sélectionné:", selectedInstructorId);
    // TODO: Navigation vers la réservation avec serviceId et selectedInstructorId
  };

  const handleSelectInstructor = (instructor: InstructorResponse) => {
    // Toggle selection
    if (selectedInstructorId === instructor.id) {
      setSelectedInstructorId(null);
    } else {
      setSelectedInstructorId(instructor.id);
    }
  };

  const handleViewInstructorDetails = (instructorId: string) => {
    router.push(`/(modals)/instructor/${instructorId}`);
  };

  const handleCloseCard = () => {
    if (isExpanded) {
      toggleExpanded();
    } else {
      onClose();
    }
  };

  const isLoading = loadingServices || loadingInstructors;
  const hasContent = instructors.length > 0 || services.length > 0;

  return (
      <GestureHandlerRootView style={styles.gestureRoot}>
        <Animated.View
            style={[
              styles.spotCard,
              {
                backgroundColor: isDark ? "#161412" : "#ffffff",
              },
              animatedCardStyle,
            ]}
        >
          {/* Swipe indicator */}
          {isExpanded && (
              <GestureDetector gesture={panGesture}>
                <View style={styles.swipeIndicatorContainer}>
                  <View style={styles.swipeIndicator}>
                    <View
                        style={[
                          styles.swipeBar,
                          {
                            backgroundColor: isDark
                                ? "rgba(255, 255, 255, 0.3)"
                                : "rgba(0, 0, 0, 0.2)",
                          },
                        ]}
                    />
                  </View>
                </View>
              </GestureDetector>
          )}

          {/* Photos */}
          {loadingPhotos ? (
              <View
                  style={[
                    styles.photoLoading,
                    { backgroundColor: colors.neutral[800] },
                  ]}
              >
                <ActivityIndicator size="large" color={colors.accent.primary} />
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
          <TouchableOpacity
              style={[styles.closeButton, { borderColor: colors.border.default }]}
              onPress={handleCloseCard}
          >
            <Icons.X size={20} color={colors.text.primary} weight="bold" />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.spotContent}>
            <SpotInfo
                name={spot.name}
                address={spot.address}
                zipCode={spot.zipCode}
                city={spot.city}
                isIndoor={spot.isIndoor}
                description={spot.description}
            />

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

            {isExpanded && (
                <View style={styles.expandedSection}>
                  {/* Loading state */}
                  {isLoading && !hasContent && (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color={colors.accent.primary}
                        />
                        <Typo size={14} color={colors.text.muted}>
                          Chargement...
                        </Typo>
                      </View>
                  )}

                  {/* Unified ScrollView */}
                  {(!isLoading || hasContent) && (
                      <ScrollView
                          style={styles.unifiedScrollView}
                          contentContainerStyle={styles.unifiedScrollContent}
                          showsVerticalScrollIndicator={false}
                          nestedScrollEnabled
                      >
                        {/* Section Instructeurs */}
                        {instructors.length > 0 && (
                            <View style={styles.section}>
                              <View style={styles.sectionHeader}>
                                <Typo size={18} fontWeight="700" color={colors.text.primary}>
                                  Choisir un instructeur
                                </Typo>
                                <Typo size={13} color={colors.text.muted}>
                                  {instructors.length} disponible{instructors.length > 1 ? "s" : ""}
                                </Typo>
                              </View>

                              {selectedInstructorId && (
                                  <View
                                      style={[
                                        styles.selectionBadge,
                                        { backgroundColor: colors.semantic.successBg },
                                      ]}
                                  >
                                    <Icons.CheckCircle
                                        size={14}
                                        color={colors.semantic.success}
                                        weight="fill"
                                    />
                                    <Typo size={12} color={colors.semantic.success}>
                                      Instructeur sélectionné
                                    </Typo>
                                  </View>
                              )}

                              <InstructorList
                                  instructors={instructors}
                                  selectedInstructorId={selectedInstructorId}
                                  onSelectInstructor={handleSelectInstructor}
                                  onViewInstructorDetails={handleViewInstructorDetails}
                                  compact
                              />
                            </View>
                        )}

                        {!loadingInstructors &&
                            instructors.length === 0 &&
                            instructorsLoaded && (
                                <View style={styles.emptyInstructorsContainer}>
                                  <Typo size={14} color={colors.text.muted}>
                                    Aucun instructeur disponible
                                  </Typo>
                                </View>
                            )}

                        {/* Section Services */}
                        <View style={styles.section}>
                          <View style={styles.sectionHeader}>
                            <Typo size={18} fontWeight="700" color={colors.text.primary}>
                              Services disponibles
                            </Typo>
                          </View>

                          {loadingServices && (
                              <View style={styles.sectionLoadingContainer}>
                                <ActivityIndicator
                                    size="small"
                                    color={colors.accent.primary}
                                />
                              </View>
                          )}

                          {!loadingServices && services.length > 0 && (
                              <View style={styles.servicesGrid}>
                                {services.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onPress={handleServicePress}
                                    />
                                ))}
                              </View>
                          )}

                          {!loadingServices &&
                              services.length === 0 &&
                              servicesLoaded && (
                                  <View style={styles.emptyContainer}>
                                    <View
                                        style={[
                                          styles.emptyIconContainer,
                                          {
                                            backgroundColor: isDark
                                                ? "rgba(255, 255, 255, 0.05)"
                                                : "rgba(0, 0, 0, 0.03)",
                                            borderColor: colors.border.default,
                                          },
                                        ]}
                                    >
                                      <Icons.CalendarX
                                          size={48}
                                          color={colors.text.muted}
                                          weight="thin"
                                      />
                                    </View>
                                    <Typo
                                        size={16}
                                        fontWeight="600"
                                        color={colors.text.primary}
                                        style={styles.emptyTitle}
                                    >
                                      Aucun service disponible
                                    </Typo>
                                    <Typo
                                        size={14}
                                        color={colors.text.muted}
                                        style={styles.emptyText}
                                    >
                                      Ce spot n'a pas encore de prestations actives.
                                    </Typo>
                                  </View>
                              )}
                        </View>

                        {/* Bottom spacer */}
                        <View style={{ height: 20 }} />
                      </ScrollView>
                  )}

                  {/* Collapse button */}
                  <TouchableOpacity
                      style={[
                        styles.collapseButton,
                        {
                          backgroundColor: isDark
                              ? "rgba(255, 107, 53, 0.15)"
                              : "rgba(234, 88, 12, 0.1)",
                          borderColor: isDark
                              ? "rgba(255, 107, 53, 0.3)"
                              : "rgba(234, 88, 12, 0.2)",
                        },
                      ]}
                      onPress={toggleExpanded}
                      activeOpacity={0.8}
                  >
                    <Icons.CaretDown
                        size={20}
                        color={colors.accent.primary}
                        weight="bold"
                    />
                    <Typo size={15} fontWeight="600" color={colors.accent.primary}>
                      Masquer
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  swipeIndicatorContainer: {
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
    zIndex: 10,
  },
  photoLoading: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  spotContent: {
    padding: spacingX._20,
    flex: 1,
  },
  expandedSection: {
    marginTop: spacingY._12,
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  unifiedScrollView: {
    flex: 1,
  },
  unifiedScrollContent: {
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sectionLoadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyInstructorsContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  servicesGrid: {
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
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
    marginTop: spacingY._12,
    borderRadius: 12,
    borderWidth: 1,
  },
});