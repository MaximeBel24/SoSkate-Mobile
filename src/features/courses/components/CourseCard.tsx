// ============================================
// SOSKATE - COURSE CARD
// ============================================
// Carte de cours pour la liste instructeur

import React from "react";
import { View, StyleSheet } from "react-native";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import Card from "@/src/shared/ui/card/Card";
import CourseStatusBadge from "./CoursesStatusBadge";
import { CourseCardProps, CourseHelpers } from "../types/course.types";

// ============================================
// HELPERS
// ============================================
const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
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

// ============================================
// COMPONENT
// ============================================
const CourseCard: React.FC<CourseCardProps> = ({
    course,
    onPress,
    variant = "upcoming",
}) => {
    const { colors } = useTheme();

    const isPast = variant === "passed";
    const isCancelled = course.status === "CANCELLED";
    const isInactive = isPast || isCancelled;

    return (
        <Card
            variant="elevated"
            padding="md"
            onPress={() => onPress(course)}
            style={isInactive && styles.inactive}
            testID={`course-card-${course.id}`}
        >
            {/* Header: Date + Status */}
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Icons.CalendarCheckIcon
                        size={16}
                        color={colors.accent.primary}
                        weight="fill"
                    />
                    <Typo size={14} fontWeight="600" color={colors.text.primary}>
                        {formatShortDate(course.startTime)}
                    </Typo>
                    <Typo size={14} color={colors.text.secondary}>
                        {formatTime(course.startTime)} - {formatTime(course.endTime)}
                    </Typo>
                </View>

                <CourseStatusBadge status={course.status} size="sm" />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Participant principal */}
                <View style={styles.row}>
                    <Icons.User size={16} color={colors.text.muted} />
                    <Typo size={14} fontWeight="500" color={colors.text.primary}>
                        {CourseHelpers.getMainParticipantName(course)}
                    </Typo>
                    {course.participants.length > 1 && (
                        <Typo size={12} color={colors.text.muted}>
                            +{course.participants.length - 1} participant{course.participants.length > 2 ? "s" : ""}
                        </Typo>
                    )}
                </View>

                {/* Spot */}
                <View style={styles.row}>
                    <Icons.MapPin size={16} color={colors.text.muted} />
                    <Typo
                        size={14}
                        color={colors.text.secondary}
                        numberOfLines={1}
                        style={styles.flex}
                    >
                        {course.spot.name}, {course.spot.city}
                    </Typo>
                </View>

                {/* Service */}
                <View style={styles.row}>
                    <Icons.PersonSimpleRun size={16} color={colors.text.muted} />
                    <Typo size={14} color={colors.text.secondary}>
                        {course.service.name}
                    </Typo>
                    <View style={styles.serviceMeta}>
                        <Typo size={12} color={colors.text.muted}>
                            {CourseHelpers.formatDuration(course.durationMinutes)}
                        </Typo>
                    </View>
                </View>

                {/* Notes (if any) */}
                {course.notes && (
                    <View style={styles.row}>
                        <Icons.Note size={16} color={colors.text.muted} />
                        <Typo
                            size={13}
                            color={colors.text.muted}
                            numberOfLines={2}
                            style={styles.notesText}
                        >
                            {course.notes}
                        </Typo>
                    </View>
                )}
            </View>

            {/* Footer: Price + Chevron */}
            <View style={[styles.footer, { borderTopColor: colors.border.subtle }]}>
                <Typo size={16} fontWeight="700" color={colors.accent.primary}>
                    {formatPrice(CourseHelpers.getTotalAmountEuros(course) * 100)}
                </Typo>

                <Icons.CaretRight size={20} color={colors.text.muted} weight="bold" />
            </View>
        </Card>
    );
};

export default CourseCard;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    inactive: {
        opacity: 0.6,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    content: {
        gap: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    flex: {
        flex: 1,
    },
    serviceMeta: {
        marginLeft: "auto",
    },
    notesText: {
        flex: 1,
        fontStyle: "italic",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
    },
});
