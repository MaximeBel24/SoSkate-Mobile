// ============================================
// SOSKATE - COURSE DETAIL SCREEN
// ============================================
// Écran de détail d'un cours pour les instructeurs

import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    Linking,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import Card from "@/src/shared/ui/card/Card";
import Badge from "@/src/shared/ui/badge/Badge";
import Button from "@/src/shared/ui/button/Button";
import { ParticipantCard, CourseStatusBadge } from "@/src/features/courses";
import { instructorCoursesService } from "@/src/shared/services/instructorCoursesService";
import { CourseDetail, CourseHelpers } from "@/src/features/courses/types/course.types";

// ============================================
// HELPERS
// ============================================
const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatPrice = (cents: number): string => {
    return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
};

const canCancel = (startTime: string): boolean => {
    const start = new Date(startTime);
    const now = new Date();
    const hoursUntilStart = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilStart >= 24;
};

// ============================================
// COMPONENT
// ============================================
export default function CourseDetailScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();

    // State
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ============================================
    // FETCH DATA
    // ============================================
    const fetchCourse = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await instructorCoursesService.getCourseDetail(Number(id));
            setCourse(data);
        } catch (err: unknown) {
            console.error("[CourseDetail] fetch error:", err);
            setError("Impossible de charger les détails du cours");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    // ============================================
    // HANDLERS
    // ============================================
    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleOpenMaps = () => {
        if (!course) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const { latitude, longitude, name } = course.spot;
        const url = `https://maps.google.com/?q=${latitude},${longitude}&label=${encodeURIComponent(name)}`;
        Linking.openURL(url);
    };

    const handleCancelCourse = () => {
        if (!course) return;

        if (!canCancel(course.startTime)) {
            Alert.alert(
                "Annulation impossible",
                "Vous ne pouvez annuler un cours que 24h avant son début.",
                [{ text: "Compris" }]
            );
            return;
        }

        Alert.alert(
            "Annuler ce cours ?",
            "Cette action est irréversible. Le client sera notifié de l'annulation.",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: "destructive",
                    onPress: confirmCancel,
                },
            ]
        );
    };

    const confirmCancel = async () => {
        if (!course) return;

        setIsCancelling(true);
        try {
            await instructorCoursesService.cancelCourse(course.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Alert.alert("Cours annulé", "Le cours a été annulé avec succès.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (err) {
            console.error("[CourseDetail] cancel error:", err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Erreur", "Impossible d'annuler le cours. Veuillez réessayer.");
        } finally {
            setIsCancelling(false);
        }
    };

    // ============================================
    // RENDER LOADING
    // ============================================
    if (isLoading) {
        return (
            <View
                style={[styles.container, { backgroundColor: colors.background.primary }]}
            >
                <View
                    style={[
                        styles.header,
                        { paddingTop: insets.top + 8, borderBottomColor: colors.border.subtle },
                    ]}
                >
                    <Pressable onPress={handleClose} style={styles.headerButton}>
                        <Icons.CaretLeft size={24} color={colors.text.primary} weight="bold" />
                    </Pressable>
                    <Typo size={18} fontWeight="700" color={colors.text.primary}>
                        Détail du cours
                    </Typo>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent.primary} />
                </View>
            </View>
        );
    }

    // ============================================
    // RENDER ERROR
    // ============================================
    if (error || !course) {
        return (
            <View
                style={[styles.container, { backgroundColor: colors.background.primary }]}
            >
                <View
                    style={[
                        styles.header,
                        { paddingTop: insets.top + 8, borderBottomColor: colors.border.subtle },
                    ]}
                >
                    <Pressable onPress={handleClose} style={styles.headerButton}>
                        <Icons.CaretLeft size={24} color={colors.text.primary} weight="bold" />
                    </Pressable>
                    <Typo size={18} fontWeight="700" color={colors.text.primary}>
                        Détail du cours
                    </Typo>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.errorContainer}>
                    <Icons.WarningCircle size={48} color={colors.semantic.danger} weight="thin" />
                    <Typo size={16} fontWeight="600" color={colors.text.primary}>
                        {error || "Cours introuvable"}
                    </Typo>
                    <Pressable
                        style={[styles.retryButton, { backgroundColor: colors.accent.primary }]}
                        onPress={fetchCourse}
                    >
                        <Typo size={14} fontWeight="600" color={colors.constant.white}>
                            Réessayer
                        </Typo>
                    </Pressable>
                </View>
            </View>
        );
    }

    // ============================================
    // RENDER CONTENT
    // ============================================
    const isPast = new Date(course.endTime) < new Date();
    const isCancelled = course.status === "CANCELLED";
    const showCancelButton = !isPast && !isCancelled && course.status === "CONFIRMED";

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background.primary }]}
        >
            {/* Header */}
            <View
                style={[
                    styles.header,
                    { paddingTop: insets.top + 8, borderBottomColor: colors.border.subtle },
                ]}
            >
                <Pressable onPress={handleClose} style={styles.headerButton}>
                    <Icons.CaretLeft size={24} color={colors.text.primary} weight="bold" />
                </Pressable>
                <Typo size={18} fontWeight="700" color={colors.text.primary}>
                    Détail du cours
                </Typo>
                <View style={styles.headerButton} />
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 100 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Status + Date */}
                <View style={styles.topSection}>
                    <CourseStatusBadge status={course.status} />
                    <Typo
                        size={14}
                        color={colors.text.muted}
                        style={{ textTransform: "capitalize" }}
                    >
                        {formatFullDate(course.startTime)}
                    </Typo>
                </View>

                {/* Horaires */}
                <Card variant="outlined" padding="md" style={styles.card}>
                    <View style={styles.row}>
                        <Icons.Clock size={20} color={colors.accent.primary} weight="fill" />
                        <View style={styles.rowContent}>
                            <Typo size={16} fontWeight="600" color={colors.text.primary}>
                                {formatTime(course.startTime)} - {formatTime(course.endTime)}
                            </Typo>
                            <Typo size={13} color={colors.text.secondary}>
                                Durée : {CourseHelpers.formatDuration(course.durationMinutes)}
                            </Typo>
                        </View>
                    </View>
                </Card>

                {/* Service */}
                <Card variant="outlined" padding="md" style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icons.PersonSimpleRun size={20} color={colors.accent.primary} weight="fill" />
                        <Typo size={14} fontWeight="600" color={colors.text.muted}>
                            SERVICE
                        </Typo>
                    </View>
                    <View style={styles.cardBody}>
                        <Typo size={16} fontWeight="600" color={colors.text.primary}>
                            {course.service.name}
                        </Typo>
                        <View style={styles.serviceDetails}>
                            <Badge
                                label={`${course.maxParticipants} pers. max`}
                                variant="neutral"
                                size="sm"
                            />
                            <Badge
                                label={formatPrice(course.service.basePriceCents)}
                                variant="accent"
                                size="sm"
                            />
                        </View>
                    </View>
                </Card>

                {/* Spot */}
                <Card
                    variant="outlined"
                    padding="md"
                    style={styles.card}
                    onPress={handleOpenMaps}
                >
                    <View style={styles.cardHeader}>
                        <Icons.MapPin size={20} color={colors.accent.primary} weight="fill" />
                        <Typo size={14} fontWeight="600" color={colors.text.muted}>
                            LIEU
                        </Typo>
                        <Icons.ArrowSquareOut
                            size={16}
                            color={colors.text.muted}
                            style={{ marginLeft: "auto" }}
                        />
                    </View>
                    <View style={styles.cardBody}>
                        <Typo size={16} fontWeight="600" color={colors.text.primary}>
                            {course.spot.name}
                        </Typo>
                        <Typo size={13} color={colors.text.secondary}>
                            {course.spot.address}
                        </Typo>
                        <Typo size={13} color={colors.text.secondary}>
                            {course.spot.city}
                        </Typo>
                    </View>
                </Card>

                {/* Participants */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icons.Users size={20} color={colors.accent.primary} weight="fill" />
                        <Typo size={14} fontWeight="600" color={colors.text.muted}>
                            PARTICIPANTS ({course.participants.length})
                        </Typo>
                    </View>
                    <View style={styles.participantsList}>
                        {course.participants.map((participant) => (
                            <ParticipantCard
                                key={participant.id}
                                participant={participant}
                            />
                        ))}
                    </View>
                </View>

                {/* Notes */}
                {course.notes && (
                    <Card variant="filled" padding="md" style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icons.Note size={20} color={colors.text.muted} weight="fill" />
                            <Typo size={14} fontWeight="600" color={colors.text.muted}>
                                NOTES DU CLIENT
                            </Typo>
                        </View>
                        <Typo
                            size={14}
                            color={colors.text.secondary}
                            style={{ fontStyle: "italic", marginTop: 8 }}
                        >
                            "{course.notes}"
                        </Typo>
                    </Card>
                )}

                {/* Prix total */}
                <View
                    style={[
                        styles.priceSection,
                        {
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.03)"
                                : colors.background.surface,
                            borderColor: colors.border.subtle,
                        },
                    ]}
                >
                    <Typo size={14} color={colors.text.secondary}>
                        Prix total
                    </Typo>
                    <Typo size={24} fontWeight="700" color={colors.accent.primary}>
                        {CourseHelpers.getTotalAmountEuros(course).toFixed(2).replace(".", ",")} €
                    </Typo>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            {showCancelButton && (
                <View
                    style={[
                        styles.bottomAction,
                        {
                            backgroundColor: colors.background.primary,
                            borderTopColor: colors.border.subtle,
                            paddingBottom: insets.bottom + 16,
                        },
                    ]}
                >
                    <Button
                        onPress={handleCancelCourse}
                        loading={isCancelling}
                        style={{ backgroundColor: colors.semantic.danger }}
                    >
                        <Typo size={16} fontWeight="600" color={colors.constant.white}>
                            Annuler ce cours
                        </Typo>
                    </Button>

                    {!canCancel(course.startTime) && (
                        <Typo
                            size={11}
                            color={colors.text.muted}
                            style={{ textAlign: "center", marginTop: 8 }}
                        >
                            Annulation possible jusqu'à 24h avant le cours
                        </Typo>
                    )}
                </View>
            )}
        </View>
    );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 32,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    scrollContent: {
        padding: 16,
    },
    topSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    rowContent: {
        flex: 1,
        gap: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    cardBody: {
        gap: 4,
    },
    serviceDetails: {
        flexDirection: "row",
        gap: 8,
        marginTop: 8,
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    participantsList: {
        gap: 8,
    },
    priceSection: {
        alignItems: "center",
        paddingVertical: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 8,
    },
    bottomAction: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
    },
});
