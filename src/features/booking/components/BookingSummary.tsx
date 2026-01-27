// ============================================
// 🛹 SOSKATE - BOOKING SUMMARY
// ============================================
// Récapitulatif de la réservation avant confirmation

import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { TimeSlot } from "@/src/shared/services/availableSlotsService";
import {
    BookingParams,
    formatDuration,
    formatPrice,
    calculateTotalPrice,
} from "../types/booking.types";

interface BookingSummaryProps {
    params: BookingParams;
    selectedDate: string;
    selectedDuration: number;
    selectedSlot: TimeSlot;
    notes: string;
    onNotesChange: (notes: string) => void;
}

interface SummaryRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
                                                   icon,
                                                   label,
                                                   value,
                                                   highlight = false,
                                               }) => {
    const { colors, isDark } = useTheme();

    return (
        <View
            style={[
                styles.row,
                {
                    backgroundColor: highlight
                        ? isDark
                            ? "rgba(255, 107, 53, 0.1)"
                            : "rgba(234, 88, 12, 0.08)"
                        : "transparent",
                    borderRadius: highlight ? 12 : 0,
                    paddingHorizontal: highlight ? 12 : 0,
                    paddingVertical: highlight ? 12 : 8,
                },
            ]}
        >
            <View style={styles.rowLeft}>
                {icon}
                <Typo size={14} color={colors.text.secondary}>
                    {label}
                </Typo>
            </View>
            <Typo
                size={14}
                fontWeight={highlight ? "700" : "600"}
                color={highlight ? colors.accent.primary : colors.text.primary}
            >
                {value}
            </Typo>
        </View>
    );
};

const BookingSummary: React.FC<BookingSummaryProps> = ({
                                                           params,
                                                           selectedDate,
                                                           selectedDuration,
                                                           selectedSlot,
                                                           notes,
                                                           onNotesChange,
                                                       }) => {
    const { colors, isDark } = useTheme();

    // Formatage de la date
    const formatSelectedDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        return date.toLocaleDateString("fr-FR", options);
    };

    // Calcul du prix total
    const totalPriceCents = calculateTotalPrice(
        params.basePriceCents,
        selectedDuration
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.semantic.successBg },
                    ]}
                >
                    <Icons.CheckCircleIcon
                        size={32}
                        color={colors.semantic.success}
                        weight="fill"
                    />
                </View>
                <Typo size={18} fontWeight="700" color={colors.text.primary}>
                    Récapitulatif
                </Typo>
                <Typo
                    size={14}
                    color={colors.text.secondary}
                    style={{ textAlign: "center" }}
                >
                    Vérifiez les détails avant de confirmer
                </Typo>
            </View>

            {/* Détails de la réservation */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: isDark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.02)",
                        borderColor: colors.border.subtle,
                    },
                ]}
            >
                {/* Spot */}
                <SummaryRow
                    icon={
                        <Icons.MapPinIcon
                            size={18}
                            color={colors.text.secondary}
                            weight="fill"
                        />
                    }
                    label="Lieu"
                    value={params.spotName}
                />

                {/* Divider */}
                <View
                    style={[styles.divider, { backgroundColor: colors.border.subtle }]}
                />

                {/* Instructeur */}
                <SummaryRow
                    icon={
                        <Icons.UserIcon
                            size={18}
                            color={colors.text.secondary}
                            weight="fill"
                        />
                    }
                    label="Instructeur"
                    value={`${params.instructorFirstName} ${params.instructorLastName}`}
                />

                {/* Divider */}
                <View
                    style={[styles.divider, { backgroundColor: colors.border.subtle }]}
                />

                {/* Service */}
                <SummaryRow
                    icon={
                        <Icons.HockeyIcon
                            size={18}
                            color={colors.text.secondary}
                            weight="fill"
                        />
                    }
                    label="Prestation"
                    value={params.serviceName}
                />

                {/* Divider */}
                <View
                    style={[styles.divider, { backgroundColor: colors.border.subtle }]}
                />

                {/* Date */}
                <SummaryRow
                    icon={
                        <Icons.CalendarIcon
                            size={18}
                            color={colors.text.secondary}
                            weight="fill"
                        />
                    }
                    label="Date"
                    value={formatSelectedDate(selectedDate)}
                />

                {/* Divider */}
                <View
                    style={[styles.divider, { backgroundColor: colors.border.subtle }]}
                />

                {/* Horaire */}
                <SummaryRow
                    icon={
                        <Icons.ClockIcon
                            size={18}
                            color={colors.text.secondary}
                            weight="fill"
                        />
                    }
                    label="Horaire"
                    value={`${selectedSlot.startTime} → ${selectedSlot.endTime}`}
                />

                {/* Divider */}
                <View
                    style={[styles.divider, { backgroundColor: colors.border.subtle }]}
                />

                {/* Durée */}
                <SummaryRow
                    icon={
                        <Icons.HourglassIcon
                            size={18}
                            color={colors.text.secondary}
                            weight="fill"
                        />
                    }
                    label="Durée"
                    value={formatDuration(selectedDuration)}
                />

                {/* Divider */}
                <View
                    style={[styles.divider, { backgroundColor: colors.border.subtle }]}
                />

                {/* Prix */}
                <SummaryRow
                    icon={
                        <Icons.CurrencyEurIcon
                            size={18}
                            color={colors.accent.primary}
                            weight="fill"
                        />
                    }
                    label="Prix total"
                    value={formatPrice(totalPriceCents)}
                    highlight
                />
            </View>

            {/* Notes */}
            <View style={styles.notesSection}>
                <View style={styles.notesHeader}>
                    <Icons.NoteIcon size={18} color={colors.text.secondary} />
                    <Typo size={14} fontWeight="600" color={colors.text.primary}>
                        Notes pour l'instructeur
                    </Typo>
                    <Typo size={12} color={colors.text.muted}>
                        (optionnel)
                    </Typo>
                </View>

                <TextInput
                    style={[
                        styles.notesInput,
                        {
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.03)",
                            borderColor: colors.border.default,
                            color: colors.text.primary,
                        },
                    ]}
                    placeholder="Niveau, objectifs, besoins particuliers..."
                    placeholderTextColor={colors.text.muted}
                    value={notes}
                    onChangeText={onNotesChange}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />
            </View>

            {/* Info annulation */}
            <View
                style={[
                    styles.infoBox,
                    {
                        backgroundColor: colors.semantic.infoBg,
                        borderColor: colors.semantic.infoBorder,
                    },
                ]}
            >
                <Icons.InfoIcon size={18} color={colors.semantic.info} weight="fill" />
                <Typo size={12} color={colors.semantic.info} style={{ flex: 1 }}>
                    Annulation gratuite jusqu'à 48h avant le cours
                </Typo>
            </View>
        </KeyboardAvoidingView>
    );
};

export default BookingSummary;

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    header: {
        alignItems: "center",
        gap: 8,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    divider: {
        height: 1,
        marginVertical: 8,
    },
    notesSection: {
        gap: 10,
    },
    notesHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    notesInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        minHeight: 80,
        fontSize: 14,
    },
    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
});