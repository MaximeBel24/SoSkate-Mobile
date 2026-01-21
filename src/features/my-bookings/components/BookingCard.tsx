// ============================================
// 🛹 SOSKATE - BOOKING CARD
// ============================================
// Carte résumé d'une réservation pour la liste

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import BookingStatusBadge from "./BookingStatusBadge";
import {
    MyBookingResponse,
    formatBookingDate,
    formatBookingTime,
    formatPrice,
    formatDuration,
    isBookingPast,
} from "../types/my-bookings.types";

interface BookingCardProps {
    booking: MyBookingResponse;
    onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);
    const isPast = isBookingPast(booking);
    const isCancelled = booking.participantStatus === "CANCELLED";

    const handlePressIn = () => {
        scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Formater la date courte pour l'affichage
    const formatShortDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.card,
                {
                    backgroundColor: isDark
                        ? "rgba(255,255,255,0.03)"
                        : colors.constant.white,
                    borderColor: colors.border.subtle,
                    opacity: isPast || isCancelled ? 0.6 : 1,
                },
                animatedStyle,
            ]}
        >
            {/* Header: Date + Statut */}
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Icons.CalendarIcon
                        size={16}
                        color={colors.accent.primary}
                        weight="fill"
                    />
                    <Typo size={14} fontWeight="600" color={colors.text.primary}>
                        {formatShortDate(booking.startTime)}
                    </Typo>
                    <Typo size={14} color={colors.text.secondary}>
                        à {formatBookingTime(booking.startTime)}
                    </Typo>
                </View>

                <BookingStatusBadge
                    participantStatus={booking.participantStatus}
                    bookingStatus={booking.bookingStatus}
                    isPast={isPast}
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Instructeur */}
                <View style={styles.row}>
                    <Icons.UserIcon size={16} color={colors.text.muted} />
                    <Typo size={14} color={colors.text.primary}>
                        {booking.instructorFirstname} {booking.instructorLastname}
                    </Typo>
                </View>

                {/* Spot */}
                <View style={styles.row}>
                    <Icons.MapPinIcon size={16} color={colors.text.muted} />
                    <Typo
                        size={14}
                        color={colors.text.secondary}
                        numberOfLines={1}
                        style={{ flex: 1 }}
                    >
                        {booking.spotName}
                    </Typo>
                </View>

                {/* Service + Durée */}
                <View style={styles.row}>
                    <Icons.HockeyIcon size={16} color={colors.text.muted} />
                    <Typo size={14} color={colors.text.secondary}>
                        {booking.serviceName} • {formatDuration(booking.durationMinutes)}
                    </Typo>
                </View>
            </View>

            {/* Footer: Prix + Chevron */}
            <View style={styles.footer}>
                <Typo size={16} fontWeight="700" color={colors.accent.primary}>
                    {formatPrice(booking.totalPriceCents)}
                </Typo>

                <Icons.CaretRightIcon
                    size={20}
                    color={colors.text.muted}
                    weight="bold"
                />
            </View>
        </AnimatedPressable>
    );
};

export default BookingCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
    },
});