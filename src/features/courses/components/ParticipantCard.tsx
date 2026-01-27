// ============================================
// SOSKATE - PARTICIPANT CARD
// ============================================
// Carte détail d'un participant avec actions contact

import React from "react";
import { View, StyleSheet, Pressable, Linking } from "react-native";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import Card from "@/src/shared/ui/card/Card";
import Avatar from "@/src/shared/ui/media/Avatar";
import { radius } from "@/src/shared/constants/theme";
import { ParticipantCardProps } from "../types/course.types";

// ============================================
// HELPERS
// ============================================
const formatBirthDate = (dateString?: string): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const age = Math.floor(
        (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return `${age} ans`;
};

// ============================================
// COMPONENT
// ============================================
const ParticipantCard: React.FC<ParticipantCardProps> = ({
    participant,
    onCallPress,
    onEmailPress,
}) => {
    const { colors } = useTheme();

    const handleCall = () => {
        if (!participant.phone) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onCallPress) {
            onCallPress(participant.phone);
        } else {
            Linking.openURL(`tel:${participant.phone}`);
        }
    };

    const handleEmail = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onEmailPress) {
            onEmailPress(participant.email);
        } else {
            Linking.openURL(`mailto:${participant.email}`);
        }
    };

    const age = formatBirthDate(participant.birthDate);

    return (
        <Card variant="outlined" padding="md">
            <View style={styles.container}>
                {/* Avatar + Info */}
                <View style={styles.main}>
                    <Avatar
                        imageUri={null}
                        name={`${participant.customerName}`}
                        size="sm"
                    />

                    <View style={styles.info}>
                        <Typo size={16} fontWeight="600" color={colors.text.primary}>
                            {participant.customerName}
                        </Typo>

                        <View style={styles.meta}>
                            {age && (
                                <>
                                    <Typo size={13} color={colors.text.secondary}>
                                        {age}
                                    </Typo>
                                    <View
                                        style={[
                                            styles.dot,
                                            { backgroundColor: colors.text.muted },
                                        ]}
                                    />
                                </>
                            )}
                            <Typo
                                size={13}
                                color={colors.text.secondary}
                                numberOfLines={1}
                            >
                                {participant.email}
                            </Typo>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {participant.phone && (
                        <Pressable
                            onPress={handleCall}
                            style={[
                                styles.actionButton,
                                { backgroundColor: colors.semantic.successBg },
                            ]}
                        >
                            <Icons.Phone
                                size={20}
                                color={colors.semantic.success}
                                weight="fill"
                            />
                        </Pressable>
                    )}

                    <Pressable
                        onPress={handleEmail}
                        style={[
                            styles.actionButton,
                            { backgroundColor: colors.semantic.infoBg },
                        ]}
                    >
                        <Icons.EnvelopeSimple
                            size={20}
                            color={colors.semantic.info}
                            weight="fill"
                        />
                    </Pressable>
                </View>
            </View>
        </Card>
    );
};

export default ParticipantCard;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    main: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    info: {
        flex: 1,
        gap: 2,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: radius._10,
        alignItems: "center",
        justifyContent: "center",
    },
});
