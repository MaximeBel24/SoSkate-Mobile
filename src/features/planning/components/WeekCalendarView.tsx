// ============================================
// 🛹 SOSKATE - WEEK CALENDAR VIEW
// ============================================
// Vue calendrier semaine avec disponibilités et réservations

import React from "react";
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import {
    WeekDay,
    PLANNING_START_HOUR,
    PLANNING_END_HOUR,
    HOUR_HEIGHT,
    CALENDAR_PADDING_TOP,
    CALENDAR_PADDING_BOTTOM,
    generateTimeSlots,
    InstructorBookingResponse,
} from "../types/planning.types";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";

interface WeekCalendarViewProps {
    weekDays: WeekDay[];
    availabilities: AvailabilityResponse[];
    bookings: InstructorBookingResponse[];
    onAvailabilityPress: (availability: AvailabilityResponse) => void;
    onBookingPress: (booking: InstructorBookingResponse) => void;
    onEmptySlotPress: (date: string, hour: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TIME_COLUMN_WIDTH = 45;
const DAY_COLUMN_WIDTH = (SCREEN_WIDTH - TIME_COLUMN_WIDTH) / 7;

const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
                                                               weekDays,
                                                               availabilities,
                                                               bookings,
                                                               onAvailabilityPress,
                                                               onBookingPress,
                                                               onEmptySlotPress,
                                                           }) => {
    const { colors, isDark } = useTheme();

    const timeSlots = generateTimeSlots();
    const totalHours = PLANNING_END_HOUR - PLANNING_START_HOUR;
    const bodyHeight = totalHours * HOUR_HEIGHT + CALENDAR_PADDING_TOP + CALENDAR_PADDING_BOTTOM;

    // Grouper les disponibilités par date
    const getAvailabilitiesForDate = (date: string): AvailabilityResponse[] => {
        return (availabilities || []).filter((a) => a.date === date);
    };

    // Grouper les bookings par date
    const getBookingsForDate = (date: string): InstructorBookingResponse[] => {
        return (bookings || []).filter((b) => {
            const bookingDate = b.startTime.split("T")[0];
            return bookingDate === date;
        });
    };

    // Extraire l'heure d'un datetime ISO
    const extractTime = (isoDatetime: string): string => {
        const date = new Date(isoDatetime);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    // Handler pour clic sur case vide
    const handleEmptySlotPress = (date: string, hour: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onEmptySlotPress(date, hour);
    };

    return (
        <View style={styles.container}>
            {/* Header avec les jours */}
            <View
                style={[
                    styles.headerRow,
                    {
                        backgroundColor: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.01)",
                        borderBottomColor: colors.border.subtle,
                    },
                ]}
            >
                {/* Coin vide (colonne des heures) */}
                <View
                    style={[
                        styles.timeColumnHeader,
                        { width: TIME_COLUMN_WIDTH, borderRightColor: colors.border.subtle },
                    ]}
                />

                {/* Headers des jours */}
                {weekDays.map((day) => (
                    <View
                        key={day.date}
                        style={[
                            styles.dayHeader,
                            {
                                width: DAY_COLUMN_WIDTH,
                                backgroundColor: day.isToday
                                    ? colors.accent.primary
                                    : "transparent",
                                borderRightColor: colors.border.subtle,
                            },
                        ]}
                    >
                        <Typo
                            size={11}
                            fontWeight="500"
                            color={day.isToday ? colors.constant.white : colors.text.muted}
                            style={{ textTransform: "capitalize" }}
                        >
                            {day.dayName}
                        </Typo>
                        <Typo
                            size={16}
                            fontWeight="700"
                            color={
                                day.isToday
                                    ? colors.constant.white
                                    : day.isPast
                                        ? colors.text.muted
                                        : colors.text.primary
                            }
                        >
                            {day.dayNumber}
                        </Typo>
                    </View>
                ))}
            </View>

            {/* Corps scrollable */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ paddingTop: CALENDAR_PADDING_TOP }}
            >
                <View style={[styles.body, { height: bodyHeight - CALENDAR_PADDING_TOP }]}>
                    {/* Colonne des heures */}
                    <View
                        style={[
                            styles.timeColumn,
                            {
                                width: TIME_COLUMN_WIDTH,
                                borderRightColor: colors.border.subtle,
                            },
                        ]}
                    >
                        {timeSlots.map((slot, index) => (
                            <View
                                key={slot.hour}
                                style={[
                                    styles.timeSlot,
                                    { top: index * HOUR_HEIGHT - 8 },
                                ]}
                            >
                                <Typo size={10} color={colors.text.muted}>
                                    {slot.label}
                                </Typo>
                            </View>
                        ))}
                    </View>

                    {/* Colonnes des jours */}
                    <View style={styles.daysContainer}>
                        {weekDays.map((day) => (
                            <View
                                key={day.date}
                                style={[
                                    styles.dayColumn,
                                    {
                                        width: DAY_COLUMN_WIDTH,
                                        borderRightColor: colors.border.subtle,
                                        opacity: day.isPast ? 0.5 : 1,
                                    },
                                ]}
                            >
                                {/* Lignes horizontales des heures */}
                                {timeSlots.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.hourLine,
                                            {
                                                top: index * HOUR_HEIGHT,
                                                backgroundColor: colors.border.subtle,
                                            },
                                        ]}
                                    />
                                ))}

                                {/* Zone cliquable pour ajouter */}
                                {!day.isPast && (
                                    <View style={StyleSheet.absoluteFill}>
                                        {Array.from({ length: totalHours }).map((_, index) => (
                                            <Pressable
                                                key={`empty-${day.date}-${index}`}
                                                style={[
                                                    styles.emptySlot,
                                                    {
                                                        top: index * HOUR_HEIGHT,
                                                        height: HOUR_HEIGHT,
                                                    },
                                                ]}
                                                onPress={() =>
                                                    handleEmptySlotPress(
                                                        day.date,
                                                        PLANNING_START_HOUR + index
                                                    )
                                                }
                                            />
                                        ))}
                                    </View>
                                )}

                                {/* Blocs de disponibilités - pointerEvents="box-none" pour laisser passer les clics sur zones vides */}
                                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                                    {getAvailabilitiesForDate(day.date).map((availability) => (
                                        <AvailabilityBlockInline
                                            key={`avail-${availability.date}-${availability.startTime}`}
                                            availability={availability}
                                            isPast={day.isPast}
                                            onPress={onAvailabilityPress}
                                            columnWidth={DAY_COLUMN_WIDTH}
                                        />
                                    ))}
                                </View>

                                {/* Blocs de réservations */}
                                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                                    {getBookingsForDate(day.date).map((booking) => (
                                        <BookingBlockInline
                                            key={`book-${booking.id}-${booking.startTime}`}
                                            booking={booking}
                                            isPast={day.isPast}
                                            onPress={onBookingPress}
                                            columnWidth={DAY_COLUMN_WIDTH}
                                            extractTime={extractTime}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Composant inline pour les blocs de disponibilité
const AvailabilityBlockInline: React.FC<{
    availability: AvailabilityResponse;
    isPast: boolean;
    onPress: (availability: AvailabilityResponse) => void;
    columnWidth: number;
}> = ({ availability, isPast, onPress, columnWidth }) => {
    const [startH, startM] = availability.startTime.split(":").map(Number);
    const [endH, endM] = availability.endTime.split(":").map(Number);

    const top = (startH - PLANNING_START_HOUR + startM / 60) * HOUR_HEIGHT;
    const height = (endH - startH + (endM - startM) / 60) * HOUR_HEIGHT - 2;

    const isBooked = availability.status === "BOOKED";

    // Ne pas afficher les dispo "BOOKED" car on affiche les bookings séparément
    if (isBooked) return null;

    const bgColor = isPast
        ? "rgba(156, 163, 175, 0.3)"
        : "rgba(34, 197, 94, 0.25)";

    const borderColor = isPast ? "#9ca3af" : "#22c55e";
    const textColor = isPast ? "#6b7280" : "#16a34a";

    const handlePress = () => {
        if (!isPast) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress(availability);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={[
                styles.availabilityBlock,
                {
                    top,
                    height: Math.max(height, 20),
                    width: columnWidth - 6,
                    backgroundColor: bgColor,
                    borderLeftColor: borderColor,
                },
            ]}
        >
            <Typo size={8} fontWeight="600" color={textColor} numberOfLines={1}>
                {availability.startTime}
            </Typo>
            {height >= 35 && (
                <Typo size={8} color={textColor} numberOfLines={1}>
                    {availability.endTime}
                </Typo>
            )}
        </Pressable>
    );
};

// Composant inline pour les blocs de réservation
const BookingBlockInline: React.FC<{
    booking: InstructorBookingResponse;
    isPast: boolean;
    onPress: (booking: InstructorBookingResponse) => void;
    columnWidth: number;
    extractTime: (iso: string) => string;
}> = ({ booking, isPast, onPress, columnWidth, extractTime }) => {
    const startTime = extractTime(booking.startTime);
    const endTime = extractTime(booking.endTime);

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const top = (startH - PLANNING_START_HOUR + startM / 60) * HOUR_HEIGHT;
    const height = (endH - startH + (endM - startM) / 60) * HOUR_HEIGHT - 2;

    const bgColor = isPast
        ? "rgba(156, 163, 175, 0.3)"
        : "rgba(255, 107, 53, 0.25)";

    const borderColor = isPast ? "#9ca3af" : "#FF6B35";
    const textColor = isPast ? "#6b7280" : "#ea580c";

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(booking);
    };

    return (
        <Pressable
            onPress={handlePress}
            style={[
                styles.bookingBlock,
                {
                    top,
                    height: Math.max(height, 20),
                    width: columnWidth - 6,
                    backgroundColor: bgColor,
                    borderLeftColor: borderColor,
                },
            ]}
        >
            {height >= 35 && (
                <Typo size={8} color={textColor} numberOfLines={1}>
                    {startTime}
                </Typo>
            )}
            <Typo size={8} color={textColor} numberOfLines={1}>
                {endTime}
            </Typo>
        </Pressable>
    );
};

export default WeekCalendarView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
    },
    timeColumnHeader: {
        height: 56,
        borderRightWidth: 1,
    },
    dayHeader: {
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        gap: 2,
    },
    scrollView: {
        flex: 1,
    },
    body: {
        flexDirection: "row",
    },
    timeColumn: {
        borderRightWidth: 1,
        position: "relative",
    },
    timeSlot: {
        position: "absolute",
        left: 0,
        right: 4,
        alignItems: "flex-end",
    },
    daysContainer: {
        flexDirection: "row",
        flex: 1,
    },
    dayColumn: {
        borderRightWidth: 1,
        position: "relative",
    },
    hourLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
    },
    emptySlot: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    availabilityBlock: {
        position: "absolute",
        left: 3,
        borderLeftWidth: 3,
        borderRadius: 4,
        paddingHorizontal: 3,
        paddingVertical: 2,
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 1,
    },
    bookingBlock: {
        position: "absolute",
        left: 3,
        borderLeftWidth: 3,
        borderRadius: 4,
        paddingHorizontal: 3,
        paddingVertical: 2,
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 2,
    },
});