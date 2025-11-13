// app/(modals)/spotDetails.tsx
import ScreenWrapper from "@/components/screen/ScreenWrapper";
import EmptyServiceState from "@/components/spotDetails/EmptyServiceState";
import ServiceList from "@/components/spotDetails/ServiceList";
import SpotDetailsHeader from "@/components/spotDetails/SpotDetailsHeader";
import { colors } from "@/constants/theme";
import { ServiceResponse } from "@/interfaces/service.interface";
import { SpotResponse } from "@/interfaces/spot.interface";
import { getActiveServices } from "@/services/serviceService";
import { getSpotById } from "@/services/spotService";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SpotDetails = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { spotId } = useLocalSearchParams<{ spotId: string }>();

    const [spot, setSpot] = useState<SpotResponse | null>(null);
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!spotId) {
            setError("ID du spot manquant");
            setLoading(false);
            return;
        }

        loadData();
    }, [spotId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Chargement parallèle du spot et des services
            const [spotData, servicesData] = await Promise.all([
                getSpotById(Number(spotId)),
                getActiveServices(),
            ]);

            setSpot(spotData);
            setServices(servicesData);
        } catch (err: any) {
            console.error("Erreur lors du chargement:", err);
            setError(err.message || "Impossible de charger les données");
        } finally {
            setLoading(false);
        }
    };

    const handleServicePress = (serviceId: number) => {
        // TODO: Navigation vers le flow de réservation
        console.log("Service sélectionné:", serviceId);
        // router.push(`/(modals)/booking?serviceId=${serviceId}&spotId=${spotId}`);
    };

    const handleClose = () => {
        router.back();
    };

    // ====== LOADING STATE ======
    if (loading) {
        return (
            <ScreenWrapper style={styles.container}>
                <Animated.View
                    entering={SlideInUp.springify()}
                    style={styles.loadingContainer}
                >
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </Animated.View>

                {/* Close button même en loading */}
                <TouchableOpacity
                    style={[styles.closeButton, { top: insets.top + 16 }]}
                    onPress={handleClose}
                >
                    <Icons.XIcon size={24} color={colors.white} weight="bold" />
                </TouchableOpacity>
            </ScreenWrapper>
        );
    }

    // ====== ERROR STATE ======
    if (error || !spot) {
        return (
            <ScreenWrapper style={styles.container}>
                <Animated.View
                    entering={SlideInUp.springify()}
                    style={styles.errorContainer}
                >
                    <Icons.WarningCircleIcon size={48} color={colors.rose} weight="fill" />
                    <Text style={styles.errorTitle}>Oups !</Text>
                    <Text style={styles.errorMessage}>
                        {error || "Spot introuvable"}
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                        <Text style={styles.retryButtonText}>Réessayer</Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    style={[styles.closeButton, { top: insets.top + 16 }]}
                    onPress={handleClose}
                >
                    <Icons.XIcon size={24} color={colors.white} weight="bold" />
                </TouchableOpacity>
            </ScreenWrapper>
        );
    }

    // ====== SUCCESS STATE ======
    return (
        <ScreenWrapper style={styles.container}>
            <Animated.View
                entering={SlideInUp.springify()}
                exiting={SlideOutDown.springify()}
                style={styles.modalContent}
            >
                {/* Header avec récap du spot */}
                <SpotDetailsHeader
                    name={spot.name}
                    city={spot.city}
                    zipCode={spot.zipCode}
                    imageUrl={spot.photos?.[0]}
                    isIndoor={spot.isIndoor}
                />

                {/* Liste des services ou état vide */}
                {services.length > 0 ? (
                    <ServiceList services={services} onServicePress={handleServicePress} />
                ) : (
                    <EmptyServiceState onBackToMap={handleClose} />
                )}
            </Animated.View>

            {/* Close button */}
            <TouchableOpacity
                style={[styles.closeButton, { top: insets.top + 16 }]}
                onPress={handleClose}
            >
                <Icons.XIcon size={24} color={colors.white} weight="bold" />
            </TouchableOpacity>
        </ScreenWrapper>
    );
};

export default SpotDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A0908",
    },
    modalContent: {
        flex: 1,
    },
    closeButton: {
        position: "absolute",
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        zIndex: 999,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: "600",
    },
    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        gap: 12,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
        marginTop: 8,
    },
    errorMessage: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.6)",
        textAlign: "center",
        lineHeight: 24,
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: colors.primary,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },
});