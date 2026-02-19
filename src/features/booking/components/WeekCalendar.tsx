// ============================================
// 🛹 SOSKATE - WEEK CALENDAR (FIXED)
// ============================================
// Calendrier vue semaine avec navigation
// CORRECTION: Gestion des timezones pour éviter les décalages de dates

import React, { useState, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

interface WeekCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  hasAvailability?: (date: string) => boolean;
  minDate?: string;
}

// Jours de la semaine en français
const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// ============================================
// FONCTIONS UTILITAIRES POUR LES DATES
// ============================================
// Ces fonctions évitent les problèmes de timezone en travaillant
// uniquement avec des dates locales

/**
 * Crée une date locale à minuit (sans décalage timezone)
 */
const createLocalDate = (year: number, month: number, day: number): Date => {
  const date = new Date(year, month, day, 0, 0, 0, 0);
  return date;
};

/**
 * Retourne la date d'aujourd'hui à minuit (heure locale)
 */
const getTodayLocal = (): Date => {
  const now = new Date();
  return createLocalDate(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Formate une date en "YYYY-MM-DD" sans utiliser toISOString()
 * pour éviter les problèmes de timezone
 */
const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parse une date string "YYYY-MM-DD" en Date locale
 */
const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return createLocalDate(year, month - 1, day);
};

/**
 * Retourne le lundi de la semaine contenant la date donnée
 */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date.getTime());
  const day = d.getDay();
  // getDay() retourne 0 pour dimanche, 1 pour lundi, etc.
  // On veut le lundi, donc on soustrait (day - 1), sauf si c'est dimanche (0)
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return createLocalDate(d.getFullYear(), d.getMonth(), d.getDate());
};

/**
 * Génère les 7 jours d'une semaine à partir du lundi
 */
const getWeekDays = (weekStart: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart.getTime());
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
};

/**
 * Compare deux dates (uniquement jour/mois/année)
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Vérifie si date1 est avant date2
 */
const isBefore = (date1: Date, date2: Date): boolean => {
  const d1 = createLocalDate(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
  );
  const d2 = createLocalDate(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
  );
  return d1.getTime() < d2.getTime();
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDate,
  onSelectDate,
  hasAvailability = () => true,
  minDate,
}) => {
  const { colors } = useTheme();

  // Date d'aujourd'hui (locale)
  const today = useMemo(() => getTodayLocal(), []);

  // Date minimum sélectionnable
  const minSelectableDate = useMemo(() => {
    return minDate ? parseDateString(minDate) : today;
  }, [minDate, today]);

  // Semaine actuellement affichée
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(today),
  );

  // Générer les jours de la semaine
  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart],
  );

  // Titre du mois/année
  const headerTitle = useMemo(() => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];

    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${MONTHS[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
    }
    // Semaine à cheval sur 2 mois
    return `${MONTHS[firstDay.getMonth()].slice(0, 3)} - ${MONTHS[lastDay.getMonth()].slice(0, 3)} ${lastDay.getFullYear()}`;
  }, [weekDays]);

  // Navigation
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart.getTime());
    newStart.setDate(newStart.getDate() - 7);

    // Ne pas aller avant la semaine contenant aujourd'hui
    const todayWeekStart = getWeekStart(today);
    if (newStart.getTime() >= todayWeekStart.getTime()) {
      setCurrentWeekStart(newStart);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart.getTime());
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const canGoPrevious = useMemo(() => {
    const todayWeekStart = getWeekStart(today);
    return currentWeekStart.getTime() > todayWeekStart.getTime();
  }, [currentWeekStart, today]);

  // Sélection d'un jour
  const handleDayPress = (date: Date) => {
    const dateString = formatDateString(date);
    const hasSlots = hasAvailability(dateString);
    const isPast = isBefore(date, minSelectableDate);

    if (!isPast && hasSlots) {
      onSelectDate(dateString);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header avec navigation */}
      <View style={styles.header}>
        <Pressable
          onPress={goToPreviousWeek}
          disabled={!canGoPrevious}
          style={[
            styles.navButton,
            {
              backgroundColor: colors.background.subtle,
              opacity: canGoPrevious ? 1 : 0.3,
            },
          ]}
        >
          <Icons.CaretLeftIcon
            size={20}
            color={colors.text.primary}
            weight="bold"
          />
        </Pressable>

        <Typo size={16} fontWeight="600" color={colors.text.primary}>
          {headerTitle}
        </Typo>

        <Pressable
          onPress={goToNextWeek}
          style={[
            styles.navButton,
            {
              backgroundColor: colors.background.subtle,
            },
          ]}
        >
          <Icons.CaretRightIcon
            size={20}
            color={colors.text.primary}
            weight="bold"
          />
        </Pressable>
      </View>

      {/* Jours de la semaine */}
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => {
          const dateString = formatDateString(day);
          const isSelected = selectedDate === dateString;
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, minSelectableDate);
          const hasSlots = hasAvailability(dateString);
          const isDisabled = isPast || !hasSlots;

          return (
            <Pressable
              key={dateString}
              onPress={() => handleDayPress(day)}
              disabled={isDisabled}
              style={[
                styles.dayContainer,
                isSelected && {
                  backgroundColor: colors.accent.primary,
                },
                !isSelected &&
                  !isDisabled && {
                    backgroundColor: colors.background.subtle,
                  },
                isDisabled && {
                  opacity: 0.4,
                },
              ]}
            >
              {/* Nom du jour */}
              <Typo
                size={12}
                fontWeight="500"
                color={
                  isSelected
                    ? colors.constant.white
                    : isDisabled
                      ? colors.text.muted
                      : colors.text.secondary
                }
              >
                {DAYS_SHORT[index]}
              </Typo>

              {/* Numéro du jour */}
              <Typo
                size={18}
                fontWeight={isSelected || isToday ? "700" : "500"}
                color={
                  isSelected
                    ? colors.constant.white
                    : isDisabled
                      ? colors.text.muted
                      : colors.text.primary
                }
              >
                {day.getDate()}
              </Typo>

              {/* Indicateur aujourd'hui */}
              {isToday && !isSelected && (
                <View
                  style={[
                    styles.todayDot,
                    { backgroundColor: colors.accent.primary },
                  ]}
                />
              )}

              {/* Indicateur disponibilité */}
              {!isPast && hasSlots && !isSelected && (
                <View
                  style={[
                    styles.availabilityDot,
                    { backgroundColor: colors.semantic.success },
                  ]}
                />
              )}

              {/* Indicateur pas de dispo */}
              {!isPast && !hasSlots && (
                <Typo size={10} color={colors.text.muted}>
                  —
                </Typo>
              )}
            </Pressable>
          );
        })}
      </View>

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

export default WeekCalendar;

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
    minHeight: 80,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingTop: 8,
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
