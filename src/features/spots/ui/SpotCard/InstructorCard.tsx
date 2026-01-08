import { spacingX } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

type InstructorCardProps = {
    instructor: InstructorResponse;
    isSelected?: boolean;
    onSelect?: (instructor: InstructorResponse) => void;
    onViewDetails?: (instructorId: string) => void;
};

const InstructorCard = ({
                            instructor,
                            isSelected = false,
                            onSelect,
                            onViewDetails,
                        }: InstructorCardProps) => {
    const { colors, isDark } = useTheme();

    const getInitials = (firstname: string, lastname: string): string => {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    };

    const handleCardPress = () => {
        onSelect?.(instructor);
    };

    const handleViewDetails = () => {
        onViewDetails?.(instructor.id);
    };

    const handleInstagramPress = () => {
        if (instructor.instagramHandle) {
            const url = `https://instagram.com/${instructor.instagramHandle.replace("@", "")}`;
            Linking.openURL(url);
        }
    };

    const handleYoutubePress = () => {
        if (instructor.youtubeChannel) {
            Linking.openURL(instructor.youtubeChannel);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: isDark
                        ? "rgba(22, 20, 18, 0.8)"
                        : "rgba(255, 255, 255, 0.95)",
                    borderColor: isSelected ? colors.accent.primary : colors.border.default,
                    borderWidth: isSelected ? 2 : 1,
                },
            ]}
            onPress={handleCardPress}
            activeOpacity={0.8}
        >
            {/* Selection indicator */}
            {isSelected && (
                <View
                    style={[
                        styles.selectionIndicator,
                        { backgroundColor: colors.semantic.success },
                    ]}
                >
                    <Icons.Check size={12} color={colors.constant.white} weight="bold" />
                </View>
            )}

            {/* Details button */}
            <TouchableOpacity
                style={[
                    styles.detailsButton,
                    {
                        backgroundColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)",
                    },
                ]}
                onPress={handleViewDetails}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Icons.MagnifyingGlass
                    size={14}
                    color={colors.text.secondary}
                    weight="bold"
                />
            </TouchableOpacity>

            {/* Avatar */}
            <View
                style={[
                    styles.avatar,
                    {
                        backgroundColor: isSelected
                            ? colors.accent.primary
                            : colors.accent.primaryLight,
                    },
                ]}
            >
                {/* TODO: Remplacer par Image quand photoUrl sera disponible */}
                <Typo size={18} fontWeight="700" color={colors.constant.white}>
                    {getInitials(instructor.firstname, instructor.lastname)}
                </Typo>
            </View>

            {/* Infos */}
            <View style={styles.infoContainer}>
                <Typo
                    size={14}
                    fontWeight="700"
                    color={colors.text.primary}
                    numberOfLines={1}
                >
                    {instructor.firstname} {instructor.lastname}
                </Typo>

                {instructor.speciality && (
                    <View style={styles.infoRow}>
                        <Icons.Medal size={11} color={colors.accent.primary} weight="fill" />
                        <Typo
                            size={11}
                            color={colors.text.secondary}
                            numberOfLines={1}
                            style={styles.infoText}
                        >
                            {instructor.speciality}
                        </Typo>
                    </View>
                )}

                {instructor.yearsOfExperience && instructor.yearsOfExperience > 0 && (
                    <View style={styles.infoRow}>
                        <Icons.Timer size={11} color={colors.accent.primary} weight="fill" />
                        <Typo size={11} color={colors.text.secondary}>
                            {instructor.yearsOfExperience} ans d'exp.
                        </Typo>
                    </View>
                )}
            </View>

            {/* Social Links */}
            {(instructor.instagramHandle || instructor.youtubeChannel) && (
                <View style={styles.socialContainer}>
                    {instructor.instagramHandle && (
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: colors.ui.badge }]}
                            onPress={handleInstagramPress}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Icons.InstagramLogo
                                size={14}
                                color={colors.accent.primary}
                                weight="fill"
                            />
                        </TouchableOpacity>
                    )}
                    {instructor.youtubeChannel && (
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: colors.ui.badge }]}
                            onPress={handleYoutubePress}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Icons.YoutubeLogo
                                size={14}
                                color={colors.semantic.danger}
                                weight="fill"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default InstructorCard;

const styles = StyleSheet.create({
    card: {
        width: 140,
        borderRadius: 16,
        padding: spacingX._12,
        alignItems: "center",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    selectionIndicator: {
        position: "absolute",
        top: 8,
        left: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    detailsButton: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    infoContainer: {
        alignItems: "center",
        gap: 3,
        width: "100%",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    infoText: {
        flex: 1,
    },
    socialContainer: {
        flexDirection: "row",
        gap: 6,
        marginTop: 2,
    },
    socialButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
    },
});