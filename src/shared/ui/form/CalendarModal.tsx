import React, { useMemo } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import Typo from "@/src/shared/ui/typography/Typo";


// LOCALE FR
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


// TYPES
type CalendarModalProps = {
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: string) => void;
    selectedDate?: string;
    minDate?: string;
    maxDate?: string;
    title?: string;
};

// COMPONENT
const CalendarModal = ({
       visible,
       onClose,
       onSelectDate,
       selectedDate,
       minDate,
       maxDate,
       title = "Sélectionner une date",
   }: CalendarModalProps) => {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // === Theme du calendrier ===
    const calendarTheme = useMemo(
        () => ({
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            // Header (mois + flèches)
            monthTextColor: colors.text.primary,
            textMonthFontSize: 18,
            textMonthFontWeight: "800" as const,
            arrowColor: colors.accent.primary,
            // Jours de la semaine (Lun, Mar, ...)
            textSectionTitleColor: colors.text.muted,
            textDayHeaderFontSize: 13,
            textDayHeaderFontWeight: "600" as const,
            // Jours du mois
            dayTextColor: colors.text.primary,
            textDayFontSize: 15,
            textDayFontWeight: "500" as const,
            // Jour sélectionné
            selectedDayBackgroundColor: colors.accent.primary,
            selectedDayTextColor: "#fff",
            // Aujourd'hui
            todayTextColor: colors.accent.primary,
            todayBackgroundColor: isDark
                ? "rgba(255, 107, 53, 0.15)"
                : "rgba(255, 107, 53, 0.1)",
            // Jours désactivés
            textDisabledColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
            // Séparateur
            "stylesheet.calendar.header": {
                header: {
                    flexDirection: "row" as const,
                    justifyContent: "space-between" as const,
                    alignItems: "center" as const,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                },
            },
        }),
        [colors, isDark],
    );

    // === Dates marquées ===
    const markedDates = useMemo(() => {
        if (!selectedDate) return {};
        return {
            [selectedDate]: {
                selected: true,
                selectedColor: colors.accent.primary,
                selectedTextColor: "#fff",
            },
        };
    }, [selectedDate, colors.accent.primary]);

    // === Handlers ===
    const handleDayPress = (day: { dateString: string }) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelectDate(day.dateString);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            entering={FadeInDown.springify()}
                            style={[
                                styles.container,
                                {
                                    backgroundColor: isDark
                                        ? colors.neutral[900]
                                        : colors.background.primary,
                                    borderColor: colors.border.default,
                                    marginBottom: insets.bottom + spacingY._20,
                                },
                            ]}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <Typo size={18} fontWeight="800" color={colors.text.primary}>
                                    {title}
                                </Typo>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={[
                                        styles.closeButton,
                                        {
                                            backgroundColor: isDark
                                                ? "rgba(255,255,255,0.1)"
                                                : "rgba(0,0,0,0.05)",
                                        },
                                    ]}
                                    hitSlop={8}
                                >
                                    <Icons.XIcon
                                        size={18}
                                        color={colors.text.muted}
                                        weight="bold"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Calendar */}
                            <Calendar
                                theme={calendarTheme}
                                markedDates={markedDates}
                                onDayPress={handleDayPress}
                                minDate={minDate}
                                maxDate={maxDate}
                                enableSwipeMonths
                                renderArrow={(direction: string) => (
                                    direction === "left" ? (
                                        <Icons.CaretLeftIcon
                                            size={20}
                                            color={colors.accent.primary}
                                            weight="bold"
                                        />
                                    ) : (
                                        <Icons.CaretRightIcon
                                            size={20}
                                            color={colors.accent.primary}
                                            weight="bold"
                                        />
                                    )
                                )}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CalendarModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
        paddingHorizontal: spacingX._16,
    },
    container: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: "hidden",
        paddingBottom: spacingY._16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._16,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
});
