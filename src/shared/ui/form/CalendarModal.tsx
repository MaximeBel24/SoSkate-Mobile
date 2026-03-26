import React, { useCallback, useMemo, useState } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
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

const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

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
    const [pickerMode, setPickerMode] = useState<"calendar" | "year" | "month">("calendar");
    const [tempYear, setTempYear] = useState<number>(
        selectedDate ? parseInt(selectedDate.split("-")[0]) : new Date().getFullYear()
    );
    const [currentDate, setCurrentDate] = useState<string>(
        selectedDate || new Date().toISOString().split("T")[0]
    );

    // Calculer la plage d'années depuis minDate/maxDate
    const minYear = minDate ? parseInt(minDate.split("-")[0]) : 1940;
    const maxYear = maxDate ? parseInt(maxDate.split("-")[0]) : new Date().getFullYear();

    const years = useMemo(() => {
        const list: number[] = [];
        for (let y = maxYear; y >= minYear; y--) {
            list.push(y);
        }
        return list;
    }, [minYear, maxYear]);

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

    const handleYearSelect = useCallback((year: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTempYear(year);
        setPickerMode("month");
    }, []);

    const handleMonthSelect = useCallback((monthIndex: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const month = String(monthIndex + 1).padStart(2, "0");
        const newDate = `${tempYear}-${month}-01`;
        setCurrentDate(newDate);
        setPickerMode("calendar");
    }, [tempYear]);

    const handleHeaderPress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPickerMode("year");
    }, []);
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

                            {/* Content */}
                            {pickerMode === "calendar" && (
                                <Calendar
                                    key={currentDate}
                                    theme={calendarTheme}
                                    markedDates={markedDates}
                                    onDayPress={handleDayPress}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    current={currentDate}
                                    enableSwipeMonths
                                    onPressArrowLeft={(subtractMonth: () => void) => subtractMonth()}
                                    onPressArrowRight={(addMonth: () => void) => addMonth()}
                                    renderArrow={(direction: string) =>
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
                                    }
                                    renderHeader={(date: any) => {
                                        const d = new Date(date);
                                        return (
                                            <TouchableOpacity
                                                onPress={handleHeaderPress}
                                                style={styles.monthHeaderButton}
                                            >
                                                <Typo size={18} fontWeight="800" color={colors.text.primary}>
                                                    {MONTHS[d.getMonth()]} {d.getFullYear()}
                                                </Typo>
                                                <Icons.CaretDownIcon
                                                    size={16}
                                                    color={colors.accent.primary}
                                                    weight="bold"
                                                    style={{ marginLeft: 4 }}
                                                />
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            )}

                            {pickerMode === "year" && (
                                <View style={styles.pickerContainer}>
                                    <FlatList
                                        data={years}
                                        keyExtractor={(item) => item.toString()}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.pickerList}
                                        initialScrollIndex={Math.max(0, years.indexOf(tempYear) - 2)}
                                        getItemLayout={(_, index) => ({
                                            length: 52,
                                            offset: 52 * index,
                                            index,
                                        })}
                                        renderItem={({ item: year }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.pickerItem,
                                                    year === tempYear && {
                                                        backgroundColor: isDark
                                                            ? "rgba(255, 107, 53, 0.15)"
                                                            : "rgba(255, 107, 53, 0.1)",
                                                    },
                                                ]}
                                                onPress={() => handleYearSelect(year)}
                                            >
                                                <Typo
                                                    size={18}
                                                    fontWeight={year === tempYear ? "800" : "500"}
                                                    color={
                                                        year === tempYear
                                                            ? colors.accent.primary
                                                            : colors.text.primary
                                                    }
                                                >
                                                    {year}
                                                </Typo>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}

                            {pickerMode === "month" && (
                                <View style={styles.pickerContainer}>
                                    <View style={styles.pickerHeader}>
                                        <TouchableOpacity onPress={() => setPickerMode("year")}>
                                            <Icons.CaretLeftIcon
                                                size={20}
                                                color={colors.accent.primary}
                                                weight="bold"
                                            />
                                        </TouchableOpacity>
                                        <Typo size={18} fontWeight="800" color={colors.text.primary}>
                                            {tempYear}
                                        </Typo>
                                        <View style={{ width: 20 }} />
                                    </View>
                                    <View style={styles.monthGrid}>
                                        {MONTHS.map((month, index) => {
                                            const isCurrentMonth =
                                                currentDate.startsWith(`${tempYear}-${String(index + 1).padStart(2, "0")}`);
                                            return (
                                                <TouchableOpacity
                                                    key={month}
                                                    style={[
                                                        styles.monthItem,
                                                        isCurrentMonth && {
                                                            backgroundColor: colors.accent.primary,
                                                        },
                                                    ]}
                                                    onPress={() => handleMonthSelect(index)}
                                                >
                                                    <Typo
                                                        size={14}
                                                        fontWeight={isCurrentMonth ? "700" : "500"}
                                                        color={isCurrentMonth ? "#fff" : colors.text.primary}
                                                    >
                                                        {month.substring(0, 4)}
                                                    </Typo>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}

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
    monthHeaderButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    pickerContainer: {
        height: 320,
        paddingHorizontal: spacingX._16,
    },
    pickerList: {
        paddingVertical: spacingY._8,
    },
    pickerItem: {
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacingY._12,
        paddingHorizontal: spacingX._8,
    },
    monthGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingTop: spacingY._8,
    },
    monthItem: {
        width: "30%",
        paddingVertical: spacingY._14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginBottom: spacingY._8,
    },
});
