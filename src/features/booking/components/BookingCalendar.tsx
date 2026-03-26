import React, { useMemo } from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as Haptics from "expo-haptics";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

LocaleConfig.locales["fr"] = {
    monthNames: [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ],
    monthNamesShort: [
        "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
        "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.",
    ],
    dayNames: [
        "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
    ],
    dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

interface BookingCalendarProps {
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
    hasAvailability?: (date: string) => boolean;
    minDate?: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
         selectedDate,
         onSelectDate,
         hasAvailability = () => true,
         minDate,
     }) => {

    const { colors, isDark } = useTheme();

    // === Theme du calendrier ===
    const calendarTheme = useMemo(
        () => ({
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            // Header
            monthTextColor: colors.text.primary,
            textMonthFontSize: 18,
            textMonthFontWeight: "800" as const,
            arrowColor: colors.accent.primary,
            // Jours de la semaine
            textSectionTitleColor: colors.text.muted,
            textDayHeaderFontSize: 13,
            textDayHeaderFontWeight: "600" as const,
            // Jours
            dayTextColor: colors.text.primary,
            textDayFontSize: 15,
            textDayFontWeight: "500" as const,
            // Sélection
            selectedDayBackgroundColor: colors.accent.primary,
            selectedDayTextColor: "#fff",
            // Aujourd'hui
            todayTextColor: colors.accent.primary,
            todayBackgroundColor: isDark
                ? "rgba(255, 107, 53, 0.15)"
                : "rgba(255, 107, 53, 0.1)",
            // Désactivés
            textDisabledColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
        }),
        [colors, isDark],
    );

    // === Dates marquées ===
    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        // Marquer la date sélectionnée
        if (selectedDate) {
            marks[selectedDate] = {
                selected: true,
                selectedColor: colors.accent.primary,
                selectedTextColor: "#fff",
            };
        }

        return marks;
    }, [selectedDate, colors.accent.primary]);

    // === Day press handler ===
    const handleDayPress = (day: { dateString: string }) => {
        const hasSlots = hasAvailability(day.dateString);
        if (hasSlots) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSelectDate(day.dateString);
        }
    };

    return (
        <View style={styles.container}>
            <Calendar
                theme={calendarTheme}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                minDate={minDate}
                enableSwipeMonths
                firstDay={1}
                renderArrow={(direction: string) => (
                    <View
                        style={[
                            styles.arrowButton,
                            { backgroundColor: colors.background.subtle },
                        ]}
                    >
                        {direction === "left" ? (
                            <Icons.CaretLeftIcon
                                size={18}
                                color={colors.accent.primary}
                                weight="bold"
                            />
                        ) : (
                            <Icons.CaretRightIcon
                                size={18}
                                color={colors.accent.primary}
                                weight="bold"
                            />
                        )}
                    </View>
                )}
                dayComponent={({ date, state, marking }: any) => {
                    if (!date) return null;

                    const isSelected = marking?.selected;
                    const isDisabled = state === "disabled";
                    const isToday = state === "today";
                    const hasSlots = !isDisabled && hasAvailability(date.dateString);
                    const isClickable = !isDisabled && hasSlots;

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={!isClickable}
                            onPress={() => handleDayPress({ dateString: date.dateString })}
                            style={[
                                styles.dayContainer,
                                isSelected && {
                                    backgroundColor: colors.accent.primary,
                                },
                            ]}
                        >
                            <Typo
                                size={15}
                                fontWeight={isSelected || isToday ? "700" : "500"}
                                color={
                                    isSelected
                                        ? "#fff"
                                        : isDisabled
                                            ? isDark
                                                ? "rgba(255,255,255,0.2)"
                                                : "rgba(0,0,0,0.2)"
                                            : isToday
                                                ? colors.accent.primary
                                                : colors.text.primary
                                }
                            >
                                {date.day}
                            </Typo>

                            {/* Indicateur disponibilité */}
                            {!isDisabled && !isSelected && hasSlots && (
                                <View
                                    style={[
                                        styles.availabilityDot,
                                        { backgroundColor: colors.semantic.success },
                                    ]}
                                />
                            )}

                            {/* Indicateur pas de dispo */}
                            {!isDisabled && !isSelected && !hasSlots && (
                                <Typo size={8} color={colors.text.muted}>
                                    —
                                </Typo>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Légende */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.legendDot,
                            { backgroundColor: colors.semantic.success },
                        ]}
                    />
                    <Typo size={11} color={colors.text.muted}>
                        Disponible
                    </Typo>
                </View>
                <View style={styles.legendItem}>
                    <Typo size={11} color={colors.text.muted}>
                        — Indisponible
                    </Typo>
                </View>
            </View>
        </View>
    );
};

export default BookingCalendar;

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    arrowButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    dayContainer: {
        width: 36,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        gap: 2,
    },
    availabilityDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    legend: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        paddingTop: 4,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});