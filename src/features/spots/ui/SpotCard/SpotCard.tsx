import InstructorAssociationButton from "@/src/features/spots/ui/SpotCard/InstructorAssociationButton";
import SpotActions from "@/src/features/spots/ui/SpotCard/SpotActions";
import SpotCardCustomerView from "@/src/features/spots/ui/SpotCard/SpotCardCustomerView";
import SpotCardInstructorView from "@/src/features/spots/ui/SpotCard/SpotCardInstructorView";
import SpotInfo from "@/src/features/spots/ui/SpotCard/SpotInfo";
import { useSpotCardData } from "@/src/features/spots/hooks/useSpotCardData";
import { useInstructorAssociation } from "@/src/features/spots/hooks/useInstructorAssociation";
import { useSpotCardGesture } from "@/src/features/spots/hooks/useSpotCardGesture";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { useTheme } from "@/src/shared/theme";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import PhotoGallery from "@/src/shared/ui/media/PhotoGallery";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

type SpotCardProps = {
  spot: SpotResponse;
  bottomInset: number;
  onClose: () => void;
  distance?: number | null;
};


const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COMPACT_HEIGHT_CUSTOMER = 420;
const COMPACT_HEIGHT_INSTRUCTOR = 540;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.96;
const PHOTO_HEIGHT = 180;

const SpotCard = ({ spot, bottomInset, onClose, distance }: SpotCardProps) => {
  const { colors, isDark } = useTheme();
  const { user, isInstructor } = useAuth();

  const COMPACT_HEIGHT = isInstructor
    ? COMPACT_HEIGHT_INSTRUCTOR
    : COMPACT_HEIGHT_CUSTOMER;

  const { isExpanded, toggleExpanded, panGesture, animatedCardStyle } =
    useSpotCardGesture({
      compactHeight: COMPACT_HEIGHT + bottomInset + spacingY._70,
      expandedHeight: EXPANDED_HEIGHT,
    });

  const {
    photos,
    loadingPhotos,
    services,
    loadingServices,
    servicesLoaded,
    instructors,
    loadingInstructors,
    instructorsLoaded,
    loadInstructors,
  } = useSpotCardData(spot.id, isExpanded);

  const association = useInstructorAssociation({
    spotId: spot.id,
    spotName: spot.name,
    instructorId: user?.instructorId,
    isInstructor,
    isExpanded,
    onReloadInstructors: loadInstructors,
  });

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
          { backgroundColor: colors.background.primary },
          animatedCardStyle,
        ]}
      >
        {/* Swipe indicator (expanded only) */}
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
          style={[styles.closeButton, { borderColor: colors.border.subtle }]}
          onPress={handleCloseCard}
        >
          <Icons.XIcon size={20} color={colors.text.primary} weight="bold" />
        </TouchableOpacity>

        {/* === SCROLLABLE CONTENT === */}
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          scrollEnabled={isExpanded}
        >
          <View style={styles.spotInfoSection}>
            <SpotInfo
              name={spot.name}
              address={spot.address}
              zipCode={spot.zipCode}
              city={spot.city}
              isIndoor={spot.isIndoor}
              description={spot.description}
              distance={distance}
            />
          </View>

          {/* Instructor association (compact) */}
          {isInstructor && !isExpanded && (
            <InstructorAssociationButton
              isAssociatedToSpot={association.isAssociatedToSpot}
              loadingAssociation={association.loadingAssociation}
              checkingAssociation={association.checkingAssociation}
              onAssociate={association.handleAssociateToSpot}
              onRemove={association.handleRemoveFromSpot}
            />
          )}

          {/* Actions (compact) */}
          {!isExpanded && (
            <View style={styles.actionsSection}>
              <SpotActions
                spotId={spot.id}
                latitude={spot.latitude}
                longitude={spot.longitude}
                spotName={spot.name}
                address={spot.address}
                onViewCourses={toggleExpanded}
                hasServices={services.length > 0 || !servicesLoaded}
                hideBookingButton={isInstructor}
              />
            </View>
          )}

          {/* === EXPANDED === */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              {isInstructor && (
                <InstructorAssociationButton
                  isAssociatedToSpot={association.isAssociatedToSpot}
                  loadingAssociation={association.loadingAssociation}
                  checkingAssociation={association.checkingAssociation}
                  onAssociate={association.handleAssociateToSpot}
                  onRemove={association.handleRemoveFromSpot}
                />
              )}

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

              {(!isLoading || hasContent) && !isInstructor && (
                <SpotCardCustomerView
                  spot={spot}
                  instructors={instructors}
                  services={services}
                  loadingInstructors={loadingInstructors}
                  loadingServices={loadingServices}
                  instructorsLoaded={instructorsLoaded}
                  servicesLoaded={servicesLoaded}
                />
              )}

              {isInstructor && instructorsLoaded && (
                <SpotCardInstructorView
                  instructors={instructors}
                  currentInstructorId={user?.instructorId}
                />
              )}

              <View style={{ height: 100 }} />
            </View>
          )}
        </ScrollView>
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
    top: 21,
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
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._16,
    paddingBottom: spacingY._20,
  },
  spotInfoSection: {
    marginBottom: spacingY._8,
  },
  actionsSection: {
    marginTop: spacingY._8,
  },
  expandedContent: {
    gap: 20,
    marginTop: spacingY._12,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
});
