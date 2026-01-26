// ============================================
// 🛹 SOSKATE - USE WEEK NAVIGATION HOOK
// ============================================
// Hook pour gérer la navigation entre les semaines

import { useState, useCallback, useMemo } from "react";
import {
    WeekDay,
    generateWeekDays,
    getMonday,
} from "../types/planning.types";

interface UseWeekNavigationReturn {
    // Data
    currentWeekStart: Date;
    weekDays: WeekDay[];
    weekLabel: string;

    // Dates formatées pour l'API
    fromDate: string;
    toDate: string;

    // Actions
    goToPreviousWeek: () => void;
    goToNextWeek: () => void;
    goToCurrentWeek: () => void;

    // Checks
    isCurrentWeek: boolean;
}

export const useWeekNavigation = (): UseWeekNavigationReturn => {

    // Dans useWeekNavigation.ts, au début du hook
    console.log("Today:", new Date());
    console.log("Monday:", getMonday(new Date()));

    // Initialiser au lundi de la semaine actuelle
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
        getMonday(new Date())
    );

    // Générer les jours de la semaine
    const weekDays = useMemo(
        () => generateWeekDays(currentWeekStart),
        [currentWeekStart]
    );

    // Dates pour l'API (from = lundi, to = dimanche)
    const fromDate = useMemo(() => {
        return currentWeekStart.toISOString().split("T")[0];
    }, [currentWeekStart]);

    const toDate = useMemo(() => {
        const sunday = new Date(currentWeekStart);
        sunday.setDate(currentWeekStart.getDate() + 6);
        return sunday.toISOString().split("T")[0];
    }, [currentWeekStart]);

    // Label de la semaine pour l'affichage
    const weekLabel = useMemo(() => {
        const monday = currentWeekStart;
        const sunday = new Date(currentWeekStart);
        sunday.setDate(currentWeekStart.getDate() + 6);

        const formatOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
        };

        const startLabel = monday.toLocaleDateString("fr-FR", formatOptions);
        const endLabel = sunday.toLocaleDateString("fr-FR", {
            ...formatOptions,
            year:
                monday.getFullYear() !== sunday.getFullYear() ? "numeric" : undefined,
        });

        return `${startLabel} - ${endLabel}`;
    }, [currentWeekStart]);

    // Vérifier si c'est la semaine actuelle
    const isCurrentWeek = useMemo(() => {
        const today = getMonday(new Date());
        return currentWeekStart.getTime() === today.getTime();
    }, [currentWeekStart]);

    // Navigation
    const goToPreviousWeek = useCallback(() => {
        setCurrentWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    }, []);

    const goToNextWeek = useCallback(() => {
        setCurrentWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    }, []);

    const goToCurrentWeek = useCallback(() => {
        setCurrentWeekStart(getMonday(new Date()));
    }, []);

    return {
        currentWeekStart,
        weekDays,
        weekLabel,
        fromDate,
        toDate,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        isCurrentWeek,
    };
};