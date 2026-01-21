// ============================================
// 🛹 SOSKATE - BOOKING STATUS BADGE
// ============================================
// Badge coloré pour afficher le statut d'une réservation

import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import {
    ParticipantStatus,
    BookingStatus,
} from "../types/my-bookings.types";

interface BookingStatusBadgeProps {
    participantStatus: ParticipantStatus;
    bookingStatus: BookingStatus;
    isPast: boolean;
}

type BadgeConfig = {
    label: string;
    backgroundColor: string;
    textColor: string;
};

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
                                                                   participantStatus,
                                                                   bookingStatus,
                                                                   isPast,
                                                               }) => {
    const { colors } = useTheme();

    const getBadgeConfig = (): BadgeConfig => {
        // Annulé par l'utilisateur
        if (participantStatus === "CANCELLED") {
            return {
                label: "Annulé",
                backgroundColor: colors.semantic.dangerBg,
                textColor: colors.semantic.danger,
            };
        }

        // Booking annulé par l'instructeur
        if (bookingStatus === "CANCELLED") {
            return {
                label: "Annulé",
                backgroundColor: colors.semantic.dangerBg,
                textColor: colors.semantic.danger,
            };
        }

        // Terminé
        if (bookingStatus === "COMPLETED" || isPast) {
            return {
                label: "Terminé",
                backgroundColor: colors.neutral[200],
                textColor: colors.neutral[600],
            };
        }

        // Confirmé
        if (participantStatus === "CONFIRMED" || bookingStatus === "CONFIRMED") {
            return {
                label: "Confirmé",
                backgroundColor: colors.semantic.successBg,
                textColor: colors.semantic.success,
            };
        }

        // En attente
        return {
            label: "En attente",
            backgroundColor: colors.semantic.warningBg,
            textColor: colors.semantic.warning,
        };
    };

    const config = getBadgeConfig();

    return (
        <View
            style={[
                styles.badge,
                { backgroundColor: config.backgroundColor },
            ]}
        >
            <Typo size={11} fontWeight="600" color={config.textColor}>
                {config.label}
            </Typo>
        </View>
    );
};

export default BookingStatusBadge;

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
});