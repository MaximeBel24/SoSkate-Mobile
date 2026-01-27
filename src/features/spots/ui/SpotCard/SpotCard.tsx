import HorizontalCardList from "@/src/features/spots/ui/SpotCard/HorizontalCardList";
import InstructorCard from "@/src/features/spots/ui/SpotCard/InstructorCard";
import ServiceCard from "@/src/features/spots/ui/SpotCard/ServiceCard";
import SpotActions from "@/src/features/spots/ui/SpotCard/SpotActions";
import SpotInfo from "@/src/features/spots/ui/SpotCard/SpotInfo";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { getSpotPhotos } from "@/src/shared/services/photoService";
import { getActiveServices } from "@/src/shared/services/serviceService";
import {
    getInstructorSpots,
    addSpotToInstructor,
    removeSpotFromInstructor,
    getInstructorsBySpot,
} from "@/src/shared/services/instructorSpotsService";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import { Photo } from "@/src/shared/types/photo.interface";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import PhotoGallery from "@/src/shared/ui/media/PhotoGallery";
import Typo from "@/src/shared/ui/typography/Typo";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
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

// ============================================
// 🛹 SOSKATE - SPOT CARD (REFACTORED)
// ============================================
// Carte de spot avec:
// - Galerie photo fixe en haut
// - Tout le contenu (nom, description, instructeurs, services)
//   dans un seul ScrollView vertical
// - Bouton contextuel pour instructeurs (s'associer/se retirer)

type SpotCardProps = {
    spot: SpotResponse;
    bottomInset: number;
    onClose: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COMPACT_HEIGHT_CUSTOMER = 420;
const COMPACT_HEIGHT_INSTRUCTOR = 540;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.96;
const SWIPE_THRESHOLD = 50;
const PHOTO_HEIGHT = 180;

const SpotCard = ({ spot, bottomInset, onClose }: SpotCardProps) => {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { user, isInstructor } = useAuth();

    const COMPACT_HEIGHT = isInstructor ? COMPACT_HEIGHT_INSTRUCTOR : COMPACT_HEIGHT_CUSTOMER;

    const [isExpanded, setIsExpanded] = useState(false);
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [servicesLoaded, setServicesLoaded] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(true);
    const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [instructorsLoaded, setInstructorsLoaded] = useState(false);
    const [selectedInstructorId, setSelectedInstructorId] = useState<
        number | null
    >(null);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        null
    );

    // === État pour l'association instructeur-spot ===
    const [isAssociatedToSpot, setIsAssociatedToSpot] = useState(false);
    const [loadingAssociation, setLoadingAssociation] = useState(false);
    const [checkingAssociation, setCheckingAssociation] = useState(false);

    const cardHeight = useSharedValue(
        COMPACT_HEIGHT + bottomInset + spacingY._70
    );
    const translateY = useSharedValue(0);

    // === Vérifier si l'instructeur est associé au spot ===
    const checkInstructorAssociation = useCallback(async () => {
        if (!isInstructor || !user?.instructorId) {
            setIsAssociatedToSpot(false);
            return;
        }

        setCheckingAssociation(true);
        try {
            const instructorSpots = await getInstructorSpots(user.instructorId);
            const isAssociated = instructorSpots.some((s) => s.spot.id === spot.id);
            setIsAssociatedToSpot(isAssociated);
        } catch (error) {
            console.error("Erreur vérification association:", error);
            setIsAssociatedToSpot(false);
        } finally {
            setCheckingAssociation(false);
        }
    }, [isInstructor, user?.instructorId, spot.id]);

    useEffect(() => {
        loadPhotos();
        // Vérifier l'association si c'est un instructeur
        if (isInstructor) {
            checkInstructorAssociation();
        }
    }, [spot.id, isInstructor]);

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
            const data = await getInstructorsBySpot(spot.id);
            setInstructors(data);
            setInstructorsLoaded(true);
        } catch (err) {
            console.error("Erreur chargement instructeurs:", err);
            setInstructors([]);
        } finally {
            setLoadingInstructors(false);
        }
    };

    // === Handlers pour l'association instructeur-spot ===
    const handleAssociateToSpot = async () => {
        if (!user?.instructorId) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Alert.alert(
            "S'associer à ce spot",
            `Voulez-vous enseigner à "${spot.name}" ? Vous serez visible par les élèves sur ce spot.`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Confirmer",
                    onPress: async () => {
                        setLoadingAssociation(true);
                        try {
                            await addSpotToInstructor(user.instructorId!, spot.id);
                            setIsAssociatedToSpot(true);
                            Haptics.notificationAsync(
                                Haptics.NotificationFeedbackType.Success
                            );
                            Alert.alert(
                                "Succès ! 🛹",
                                `Vous enseignez maintenant à "${spot.name}". Les élèves peuvent vous trouver ici.`
                            );
                            // Recharger les instructeurs pour afficher l'instructeur actuel
                            if (isExpanded) {
                                loadInstructors();
                            }
                        } catch (error: any) {
                            console.error("Erreur association:", error);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            Alert.alert(
                                "Erreur",
                                error.response?.data?.message ||
                                "Impossible de vous associer à ce spot"
                            );
                        } finally {
                            setLoadingAssociation(false);
                        }
                    },
                },
            ]
        );
    };

    const handleRemoveFromSpot = async () => {
        if (!user?.instructorId) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Alert.alert(
            "Se retirer de ce spot",
            `Voulez-vous arrêter d'enseigner à "${spot.name}" ? Vous ne serez plus visible par les élèves ici.`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Se retirer",
                    style: "destructive",
                    onPress: async () => {
                        setLoadingAssociation(true);
                        try {
                            await removeSpotFromInstructor(user.instructorId!, spot.id);
                            setIsAssociatedToSpot(false);
                            Haptics.notificationAsync(
                                Haptics.NotificationFeedbackType.Success
                            );
                            // Recharger les instructeurs
                            if (isExpanded) {
                                loadInstructors();
                            }
                        } catch (error: any) {
                            console.error("Erreur retrait:", error);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            Alert.alert(
                                "Erreur",
                                error.response?.data?.message ||
                                "Impossible de vous retirer de ce spot"
                            );
                        } finally {
                            setLoadingAssociation(false);
                        }
                    },
                },
            ]
        );
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
        const selectedInstructor = instructors.find(
            (i) => String(i.id) === String(selectedInstructorId)
        );
        const selectedService = services.find((s) => Number(s.id) === serviceId);

        if (!selectedInstructor || !selectedService) {
            console.error("Instructeur ou service non trouvé", {
                selectedInstructorId,
                serviceId,
                instructorFound: !!selectedInstructor,
                serviceFound: !!selectedService,
            });
            return;
        }

        router.push({
            pathname: "/(modals)/booking/[spotId]",
            params: {
                spotId: String(spot.id),
                spotName: spot.name || "",
                spotAddress: spot.address || "",
                instructorId: String(selectedInstructor.id),
                instructorFirstName: selectedInstructor.firstname || "",
                instructorLastName: selectedInstructor.lastname || "",
                serviceId: String(selectedService.id),
                serviceName: selectedService.name || "",
                basePriceCents: String(
                    selectedService.basePriceCents ?? 0
                ),
                maxParticipants: String(selectedService.maxParticipants ?? 1),
            },
        });
    };

    const handleSelectInstructor = (instructor: InstructorResponse) => {
        if (selectedInstructorId === instructor.id) {
            setSelectedInstructorId(null);
        } else {
            setSelectedInstructorId(instructor.id);
        }
    };

    const handleSelectService = (service: ServiceResponse) => {
        if (selectedServiceId === Number(service.id)) {
            setSelectedServiceId(null);
        } else {
            setSelectedServiceId(Number(service.id));
        }
    };

    const handleViewInstructorDetails = (instructorId: number) => {
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

    // === Rendu du bouton instructeur (contextuel) ===
    const renderInstructorButton = () => {
        if (!isInstructor) return null;

        if (checkingAssociation) {
            return (
                <View
                    style={[
                        styles.instructorStatusContainer,
                        {
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.03)",
                            borderColor: colors.border.default,
                        },
                    ]}
                >
                    <ActivityIndicator size="small" color={colors.accent.primary} />
                </View>
            );
        }

        if (isAssociatedToSpot) {
            // Instructeur DÉJÀ associé
            return (
                <View style={styles.instructorActionContainer}>
                    {/* Badge "Vous enseignez ici" */}
                    <View
                        style={[
                            styles.instructorStatusContainer,
                            {
                                backgroundColor: colors.semantic.successBg,
                                borderColor: colors.semantic.successBorder,
                            },
                        ]}
                    >
                        <Icons.CheckCircleIcon
                            size={18}
                            color={colors.semantic.success}
                            weight="fill"
                        />
                        <Typo size={13} fontWeight="600" color={colors.semantic.success}>
                            Vous enseignez ici
                        </Typo>
                    </View>

                    {/* Bouton "Se retirer" */}
                    <TouchableOpacity
                        style={[
                            styles.instructorButton,
                            {
                                backgroundColor: colors.semantic.dangerBg,
                                borderColor: colors.semantic.dangerBorder,
                            },
                        ]}
                        onPress={handleRemoveFromSpot}
                        disabled={loadingAssociation}
                        activeOpacity={0.7}
                    >
                        {loadingAssociation ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.semantic.danger}
                            />
                        ) : (
                            <>
                                <Icons.MinusCircleIcon
                                    size={18}
                                    color={colors.semantic.danger}
                                    weight="fill"
                                />
                                <Typo size={14} fontWeight="600" color={colors.semantic.danger}>
                                    Se retirer
                                </Typo>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            );
        } else {
            // Instructeur NON associé
            return (
                <View style={styles.instructorActionContainer}>
                    {/* Info */}
                    <View
                        style={[
                            styles.instructorStatusContainer,
                            {
                                backgroundColor: colors.semantic.infoBg,
                                borderColor: colors.semantic.infoBorder,
                            },
                        ]}
                    >
                        <Icons.InfoIcon
                            size={16}
                            color={colors.semantic.info}
                            weight="fill"
                        />
                        <Typo size={12} color={colors.semantic.info}>
                            Vous n'enseignez pas encore ici
                        </Typo>
                    </View>

                    {/* Bouton "S'associer" */}
                    <TouchableOpacity
                        style={[
                            styles.instructorButton,
                            styles.instructorButtonPrimary,
                            { backgroundColor: colors.accent.primary },
                        ]}
                        onPress={handleAssociateToSpot}
                        disabled={loadingAssociation}
                        activeOpacity={0.8}
                    >
                        {loadingAssociation ? (
                            <ActivityIndicator size="small" color={colors.constant.white} />
                        ) : (
                            <>
                                <Icons.PlusCircleIcon
                                    size={20}
                                    color={colors.constant.white}
                                    weight="fill"
                                />
                                <Typo
                                    size={15}
                                    fontWeight="700"
                                    color={colors.constant.white}
                                >
                                    S'associer à ce spot
                                </Typo>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            );
        }
    };

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
                {/* Swipe indicator (seulement en mode expanded) */}
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

                {/* Photos - Fixe en haut */}
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

                {/* === CONTENU SCROLLABLE === */}
                <ScrollView
                    style={styles.mainScrollView}
                    contentContainerStyle={styles.mainScrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    scrollEnabled={isExpanded}
                >
                    {/* SpotInfo - Nom, adresse, description */}
                    <View style={styles.spotInfoSection}>
                        <SpotInfo
                            name={spot.name}
                            address={spot.address}
                            zipCode={spot.zipCode}
                            city={spot.city}
                            isIndoor={spot.isIndoor}
                            description={spot.description}
                        />
                    </View>

                    {/* === SECTION INSTRUCTEUR (si mode instructeur) === */}
                    {isInstructor && !isExpanded && renderInstructorButton()}

                    {/* Actions (seulement en mode compact ET si PAS instructeur) */}
                    {!isExpanded && !isInstructor && (
                        <View style={styles.actionsSection}>
                            <SpotActions
                                spotId={spot.id}
                                latitude={spot.latitude}
                                longitude={spot.longitude}
                                spotName={spot.name}
                                address={spot.address}
                                onViewCourses={toggleExpanded}
                                hasServices={services.length > 0 || !servicesLoaded}
                            />
                        </View>
                    )}

                    {/* Actions pour instructeur (voir les cours quand même) */}
                    {!isExpanded && isInstructor && (
                        <View style={styles.actionsSection}>
                            <SpotActions
                                spotId={spot.id}
                                latitude={spot.latitude}
                                longitude={spot.longitude}
                                spotName={spot.name}
                                address={spot.address}
                                onViewCourses={toggleExpanded}
                                hasServices={services.length > 0 || !servicesLoaded}
                                hideBookingButton={true}
                            />
                        </View>
                    )}

                    {/* === SECTIONS EXPANDED === */}
                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            {/* Section Instructeur en mode expanded */}
                            {isInstructor && renderInstructorButton()}

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

                            {/* Section Instructeurs (pour les clients) */}
                            {(!isLoading || hasContent) && !isInstructor && (
                                <>
                                    {instructors.length > 0 && (
                                        <View style={styles.section}>
                                            <View style={styles.sectionHeader}>
                                                <Typo
                                                    size={18}
                                                    fontWeight="700"
                                                    color={colors.text.primary}
                                                >
                                                    Choisir un moniteur
                                                </Typo>
                                                <Typo size={13} color={colors.text.muted}>
                                                    {instructors.length} disponible
                                                    {instructors.length > 1 ? "s" : ""}
                                                </Typo>
                                            </View>

                                            {selectedInstructorId && (
                                                <View
                                                    style={[
                                                        styles.selectionBadge,
                                                        { backgroundColor: colors.semantic.successBg },
                                                    ]}
                                                >
                                                    <Icons.CheckCircleIcon
                                                        size={14}
                                                        color={colors.semantic.success}
                                                        weight="fill"
                                                    />
                                                    <Typo size={12} color={colors.semantic.success}>
                                                        Instructeur sélectionné
                                                    </Typo>
                                                </View>
                                            )}

                                            {/* Liste horizontale des instructeurs */}
                                            <HorizontalCardList
                                                data={instructors}
                                                keyExtractor={(instructor) => instructor.id}
                                                renderItem={(instructor) => (
                                                    <InstructorCard
                                                        instructor={instructor}
                                                        isSelected={selectedInstructorId === instructor.id}
                                                        onSelect={handleSelectInstructor}
                                                        onViewDetails={handleViewInstructorDetails}
                                                    />
                                                )}
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
                                            <Typo
                                                size={18}
                                                fontWeight="700"
                                                color={colors.text.primary}
                                            >
                                                Choisir une prestation
                                            </Typo>
                                            {services.length > 0 && (
                                                <Typo size={13} color={colors.text.muted}>
                                                    {services.length} disponible
                                                    {services.length > 1 ? "s" : ""}
                                                </Typo>
                                            )}
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
                                            <>
                                                {selectedServiceId && (
                                                    <View
                                                        style={[
                                                            styles.selectionBadge,
                                                            { backgroundColor: colors.semantic.successBg },
                                                        ]}
                                                    >
                                                        <Icons.CheckCircleIcon
                                                            size={14}
                                                            color={colors.semantic.success}
                                                            weight="fill"
                                                        />
                                                        <Typo size={12} color={colors.semantic.success}>
                                                            Service sélectionné
                                                        </Typo>
                                                    </View>
                                                )}

                                                {/* Liste horizontale des services */}
                                                <HorizontalCardList
                                                    data={services}
                                                    keyExtractor={(service) => service.id}
                                                    renderItem={(service) => (
                                                        <ServiceCard
                                                            service={service}
                                                            isSelected={
                                                                selectedServiceId === Number(service.id)
                                                            }
                                                            onSelect={handleSelectService}
                                                        />
                                                    )}
                                                    compact
                                                />
                                            </>
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
                                                        <Icons.CalendarXIcon
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

                                    {/* Bouton de réservation (si instructeur ET service sélectionnés) */}
                                    {selectedInstructorId && selectedServiceId && (
                                        <TouchableOpacity
                                            style={[
                                                styles.bookingButton,
                                                { backgroundColor: colors.accent.primary },
                                            ]}
                                            onPress={() => handleServicePress(selectedServiceId)}
                                            activeOpacity={0.8}
                                        >
                                            <Icons.CalendarPlusIcon
                                                size={20}
                                                color={colors.constant.white}
                                                weight="bold"
                                            />
                                            <Typo
                                                size={16}
                                                fontWeight="700"
                                                color={colors.constant.white}
                                            >
                                                Réserver un cours
                                            </Typo>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}

                            {/* Vue Instructeur en mode expanded - voir les autres instructeurs */}
                            {isInstructor && instructorsLoaded && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Typo
                                            size={18}
                                            fontWeight="700"
                                            color={colors.text.primary}
                                        >
                                            Instructeurs sur ce spot
                                        </Typo>
                                        <Typo size={13} color={colors.text.muted}>
                                            {instructors.length} inscrit
                                            {instructors.length > 1 ? "s" : ""}
                                        </Typo>
                                    </View>

                                    {instructors.length > 0 ? (
                                        <HorizontalCardList
                                            data={instructors}
                                            keyExtractor={(instructor) => instructor.id}
                                            renderItem={(instructor) => (
                                                <InstructorCard
                                                    instructor={instructor}
                                                    isSelected={false}
                                                    onSelect={() => {}}
                                                    onViewDetails={handleViewInstructorDetails}
                                                    isCurrentUser={
                                                        String(instructor.id) === String(user?.instructorId)
                                                    }
                                                />
                                            )}
                                            compact
                                        />
                                    ) : (
                                        <View style={styles.emptyInstructorsContainer}>
                                            <Typo size={14} color={colors.text.muted}>
                                                Aucun instructeur inscrit
                                            </Typo>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Bottom spacer */}
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
    // === SCROLL PRINCIPAL ===
    mainScrollView: {
        flex: 1,
    },
    mainScrollContent: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._16,
        paddingBottom: spacingY._20,
    },
    // === SECTIONS ===
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
    // === INSTRUCTOR ACTION SECTION ===
    instructorActionContainer: {
        gap: 12,
        marginTop: spacingY._12,
        marginBottom: spacingY._8,
    },
    instructorStatusContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    instructorButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    instructorButtonPrimary: {
        borderWidth: 0,
    },
    // === LOADING & EMPTY STATES ===
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        gap: 12,
    },
    sectionLoadingContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    emptyInstructorsContainer: {
        paddingVertical: 16,
        alignItems: "center",
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
    // === BUTTONS ===
    bookingButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: spacingY._16,
        borderRadius: 14,
        marginTop: spacingY._8,
    },
});