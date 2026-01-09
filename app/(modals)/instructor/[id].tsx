import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { getInstructorById } from "@/src/shared/services/instructorService";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import Typo from "@/src/shared/ui/typography/Typo";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const InstructorDetailsModal = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [instructor, setInstructor] = useState<InstructorResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadInstructor();
        }
    }, [id]);

    const loadInstructor = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getInstructorById(id!);
            setInstructor(data);
        } catch (err: any) {
            console.error("Erreur chargement instructeur:", err);
            setError(err.message || "Impossible de charger les informations");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        router.back();
    };

    const getInitials = (firstname: string, lastname: string): string => {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    };

    const handleInstagramPress = () => {
        if (instructor?.instagramHandle) {
            const url = `https://instagram.com/${instructor.instagramHandle.replace("@", "")}`;
            Linking.openURL(url);
        }
    };

    const handleYoutubePress = () => {
        if (instructor?.youtubeChannel) {
            Linking.openURL(instructor.youtubeChannel);
        }
    };

    // Loading state
    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    styles.centeredContainer,
                    { backgroundColor: colors.background.primary },
                ]}
            >
                <ActivityIndicator size="large" color={colors.accent.primary} />
                <Typo size={14} color={colors.text.muted} style={{ marginTop: 12 }}>
                    Chargement du profil...
                </Typo>
            </View>
        );
    }

    // Error state
    if (error || !instructor) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background.primary },
                ]}
            >
                <View
                    style={[
                        styles.header,
                        {
                            paddingTop: insets.top + 8,
                            borderBottomColor: colors.border.subtle,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: colors.ui.badge }]}
                        onPress={handleClose}
                    >
                        <Icons.XIcon size={20} color={colors.text.primary} weight="bold" />
                    </TouchableOpacity>
                    <Typo size={18} fontWeight="700" color={colors.text.primary}>
                        Profil instructeur
                    </Typo>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.errorContainer}>
                    <View
                        style={[
                            styles.errorIconContainer,
                            {
                                backgroundColor: colors.semantic.dangerBg,
                                borderColor: colors.semantic.dangerBorder,
                            },
                        ]}
                    >
                        <Icons.WarningIcon
                            size={48}
                            color={colors.semantic.danger}
                            weight="duotone"
                        />
                    </View>
                    <Typo size={16} fontWeight="600" color={colors.text.primary}>
                        Oups !
                    </Typo>
                    <Typo
                        size={14}
                        color={colors.text.muted}
                        style={styles.errorText}
                    >
                        {error || "Impossible de charger les informations de l'instructeur"}
                    </Typo>
                    <TouchableOpacity
                        style={[
                            styles.retryButton,
                            { backgroundColor: colors.accent.primary },
                        ]}
                        onPress={loadInstructor}
                    >
                        <Icons.ArrowClockwiseIcon
                            size={18}
                            color={colors.constant.white}
                            weight="bold"
                        />
                        <Typo size={14} fontWeight="600" color={colors.constant.white}>
                            Réessayer
                        </Typo>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.background.primary },
            ]}
        >
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        paddingTop: insets.top + 8,
                        borderBottomColor: colors.border.subtle,
                    },
                ]}
            >
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.ui.badge }]}
                    onPress={handleClose}
                >
                    <Icons.XIcon size={20} color={colors.text.primary} weight="bold" />
                </TouchableOpacity>
                <Typo size={18} fontWeight="700" color={colors.text.primary}>
                    Profil instructeur
                </Typo>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View
                        style={[styles.avatar, { backgroundColor: colors.accent.primary }]}
                    >
                        {/* TODO: Remplacer par Image quand photoUrl sera disponible */}
                        <Typo size={32} fontWeight="700" color={colors.constant.white}>
                            {getInitials(instructor.firstname, instructor.lastname)}
                        </Typo>
                    </View>
                    <Typo size={24} fontWeight="700" color={colors.text.primary}>
                        {instructor.firstname} {instructor.lastname}
                    </Typo>
                    {instructor.speciality && (
                        <View
                            style={[
                                styles.specialityBadge,
                                { backgroundColor: colors.ui.badge },
                            ]}
                        >
                            <Icons.MedalIcon
                                size={16}
                                color={colors.accent.primary}
                                weight="fill"
                            />
                            <Typo size={14} fontWeight="600" color={colors.accent.primary}>
                                {instructor.speciality}
                            </Typo>
                        </View>
                    )}
                </View>

                {/* Stats */}
                {instructor.yearsOfExperience && instructor.yearsOfExperience > 0 && (
                    <View
                        style={[
                            styles.statsCard,
                            {
                                backgroundColor: isDark
                                    ? colors.ui.card
                                    : colors.background.secondary,
                                borderColor: colors.border.default,
                            },
                        ]}
                    >
                        <View style={styles.statItem}>
                            <View
                                style={[
                                    styles.statIconContainer,
                                    { backgroundColor: colors.ui.badge },
                                ]}
                            >
                                <Icons.TimerIcon
                                    size={24}
                                    color={colors.accent.primary}
                                    weight="fill"
                                />
                            </View>
                            <Typo size={24} fontWeight="700" color={colors.text.primary}>
                                {instructor.yearsOfExperience}
                            </Typo>
                            <Typo size={13} color={colors.text.secondary}>
                                années d'expérience
                            </Typo>
                        </View>
                    </View>
                )}

                {/* Bio */}
                {instructor.bio && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icons.UserIcon size={20} color={colors.accent.primary} weight="fill" />
                            <Typo size={16} fontWeight="700" color={colors.text.primary}>
                                À propos
                            </Typo>
                        </View>
                        <View
                            style={[
                                styles.sectionCard,
                                {
                                    backgroundColor: isDark
                                        ? colors.ui.card
                                        : colors.background.secondary,
                                    borderColor: colors.border.default,
                                },
                            ]}
                        >
                            <Typo
                                size={14}
                                color={colors.text.secondary}
                                style={styles.bioText}
                            >
                                {instructor.bio}
                            </Typo>
                        </View>
                    </View>
                )}

                {/* Contact Info - Masqué pour le moment */}
                {/* Les infos de contact seront visibles après réservation */}

                {/* Social Links */}
                {(instructor.instagramHandle || instructor.youtubeChannel) && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icons.ShareNetworkIcon
                                size={20}
                                color={colors.accent.primary}
                                weight="fill"
                            />
                            <Typo size={16} fontWeight="700" color={colors.text.primary}>
                                Réseaux sociaux
                            </Typo>
                        </View>
                        <View style={styles.socialLinks}>
                            {instructor.instagramHandle && (
                                <TouchableOpacity
                                    style={[
                                        styles.socialLink,
                                        {
                                            backgroundColor: isDark
                                                ? colors.ui.card
                                                : colors.background.secondary,
                                            borderColor: colors.border.default,
                                        },
                                    ]}
                                    onPress={handleInstagramPress}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.socialIconContainer,
                                            { backgroundColor: "rgba(225, 48, 108, 0.1)" },
                                        ]}
                                    >
                                        <Icons.InstagramLogoIcon
                                            size={22}
                                            color="#E1306C"
                                            weight="fill"
                                        />
                                    </View>
                                    <View style={styles.socialTextContainer}>
                                        <Typo size={14} fontWeight="600" color={colors.text.primary}>
                                            Instagram
                                        </Typo>
                                        <Typo size={12} color={colors.text.muted}>
                                            @{instructor.instagramHandle.replace("@", "")}
                                        </Typo>
                                    </View>
                                    <Icons.ArrowSquareOutIcon
                                        size={18}
                                        color={colors.text.muted}
                                    />
                                </TouchableOpacity>
                            )}
                            {instructor.youtubeChannel && (
                                <TouchableOpacity
                                    style={[
                                        styles.socialLink,
                                        {
                                            backgroundColor: isDark
                                                ? colors.ui.card
                                                : colors.background.secondary,
                                            borderColor: colors.border.default,
                                        },
                                    ]}
                                    onPress={handleYoutubePress}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.socialIconContainer,
                                            { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                                        ]}
                                    >
                                        <Icons.YoutubeLogoIcon
                                            size={22}
                                            color="#FF0000"
                                            weight="fill"
                                        />
                                    </View>
                                    <View style={styles.socialTextContainer}>
                                        <Typo size={14} fontWeight="600" color={colors.text.primary}>
                                            YouTube
                                        </Typo>
                                        <Typo size={12} color={colors.text.muted}>
                                            Voir la chaîne
                                        </Typo>
                                    </View>
                                    <Icons.ArrowSquareOutIcon
                                        size={18}
                                        color={colors.text.muted}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Placeholder pour futures vidéos */}
                <View
                    style={[
                        styles.comingSoonCard,
                        {
                            backgroundColor: isDark
                                ? "rgba(255, 107, 53, 0.1)"
                                : "rgba(234, 88, 12, 0.05)",
                            borderColor: isDark
                                ? "rgba(255, 107, 53, 0.2)"
                                : "rgba(234, 88, 12, 0.15)",
                        },
                    ]}
                >
                    <Icons.VideoCameraIcon
                        size={36}
                        color={colors.accent.primary}
                        weight="duotone"
                    />
                    <View style={styles.comingSoonTextContainer}>
                        <Typo size={15} fontWeight="600" color={colors.text.primary}>
                            Vidéos à venir
                        </Typo>
                        <Typo
                            size={13}
                            color={colors.text.secondary}
                            style={styles.comingSoonText}
                        >
                            Les vidéos de démonstration de l'instructeur seront bientôt disponibles !
                        </Typo>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacingX._16,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholder: {
        width: 36,
    },
    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacingX._20,
        gap: 12,
    },
    errorIconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        borderWidth: 1,
    },
    errorText: {
        textAlign: "center",
        lineHeight: 20,
    },
    retryButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacingX._20,
        gap: 24,
    },
    avatarSection: {
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    specialityBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statsCard: {
        flexDirection: "row",
        justifyContent: "center",
        padding: spacingY._20,
        borderRadius: 16,
        borderWidth: 1,
    },
    statItem: {
        alignItems: "center",
        gap: 6,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sectionCard: {
        padding: spacingX._16,
        borderRadius: 12,
        borderWidth: 1,
    },
    bioText: {
        lineHeight: 22,
    },
    socialLinks: {
        gap: 12,
    },
    socialLink: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: spacingY._12,
        paddingHorizontal: spacingX._16,
        borderRadius: 12,
        borderWidth: 1,
    },
    socialIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    socialTextContainer: {
        flex: 1,
        gap: 2,
    },
    comingSoonCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacingY._16,
        paddingHorizontal: spacingX._16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 14,
    },
    comingSoonTextContainer: {
        flex: 1,
        gap: 4,
    },
    comingSoonText: {
        lineHeight: 18,
    },
});