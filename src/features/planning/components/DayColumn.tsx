// ============================================
// 🛹 SOSKATE - DAY COLUMN
// ============================================
// Colonne représentant un jour dans le calendrier semaine

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import AvailabilityBlock from "./AvailabilityBlock";
import {
    WeekDay,
    PLANNING_START_HOUR,
    PLANNING_END_HOUR,
    HOUR_HEIGHT,
} from "../types/planning.types";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";

interface DayColumnProps {
    day: WeekDay;
    availabilities: AvailabilityResponse[];
    columnWidth: number;
    onAvailabilityPress: (availability: AvailabilityResponse) => void;
    onEmptySlotPress: (date: string, hour: number) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
                                                 day,
                                                 availabilities,
                                                 columnWidth,
                                                 onAvailabilityPress,
                                                 onEmptySlotPress,
                                             }) => {
    const { colors, isDark } = useTheme();

    // Calculer la hauteur totale
    const totalHours = PLANNING_END_HOUR - PLANNING_START_HOUR;
    const totalHeight = totalHours * HOUR_HEIGHT;

    // Générer les lignes des heures
    const hourLines = [];
    for (let i = 0; i <= totalHours; i++) {
        hourLines.push(
            <View
                key={i}
                style={[
                    styles.hourLine,
                    {
                        top: i * HOUR_HEIGHT,
                        backgroundColor: colors.border.subtle,
                    },
                ]}
            />
        );
    }

    const handleEmptyPress = (hour: number) => {
        if (!day.isPast) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onEmptySlotPress(day.date, hour);
        }
    };

    return (
        <View
            style={[
                styles.column,
                {
                    width: columnWidth,
                    borderRightColor: colors.border.subtle,
                },
            ]}
        >
            {/* Header du jour */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: day.isToday
                            ? colors.accent.primary
                            : isDark
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.02)",
                        borderBottomColor: colors.border.subtle,
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

            {/* Corps avec les créneaux */}
            <View
                style={[
                    styles.body,
                    { height: totalHeight, opacity: day.isPast ? 0.5 : 1 },
                ]}
            >
                {/* Lignes des heures */}
                {hourLines}

                {/* Zones cliquables pour ajouter */}
                {!day.isPast &&
                    Array.from({ length: totalHours }).map((_, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.hourSlot,
                                {
                                    top: index * HOUR_HEIGHT,
                                    height: HOUR_HEIGHT,
                                },
                            ]}
                            onPress={() => handleEmptyPress(PLANNING_START_HOUR + index)}
                        />
                    ))}

                {/* Blocs de disponibilités */}
                {availabilities.map((availability) => (
                    <AvailabilityBlock
                        key={availability.id}
                        availability={availability}
                        isPast={day.isPast}
                        onPress={onAvailabilityPress}
                        columnWidth={columnWidth}
                    />
                ))}
            </View>
        </View>
    );
};

export default DayColumn;

const styles = StyleSheet.create({
    column: {
        borderRightWidth: 1,
    },
    header: {
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        gap: 2,
    },
    body: {
        position: "relative",
    },
    hourLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
    },
    hourSlot: {
        position: "absolute",
        left: 0,
        right: 0,
    },
});