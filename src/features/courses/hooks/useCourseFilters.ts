// ============================================
// SOSKATE - USE COURSE FILTERS HOOK
// ============================================
// Hook pour filtrer et rechercher dans les cours

import { useState, useMemo, useCallback } from "react";
import {
    CourseListItem,
    BookingStatus,
    UseCourseFiltersReturn,
    CourseHelpers,
} from "../types/course.types";

// ============================================
// HOOK
// ============================================
export const useCourseFilters = (
    courses: CourseListItem[]
): UseCourseFiltersReturn => {
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // ============================================
    // FILTERED COURSES
    // ============================================
    const filteredCourses = useMemo(() => {
        let result = [...courses];

        // Filter by status
        if (statusFilter !== "ALL") {
            result = result.filter((course) => course.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((course) => {
                // Collect all participant names
                const participantNames = course.participants.map(p => p.customerName);

                const searchableFields = [
                    ...participantNames,
                    course.spot.name,
                    course.spot.city,
                    course.service.name,
                    course.notes,
                ].filter(Boolean);

                return searchableFields.some((field) =>
                    field?.toLowerCase().includes(query)
                );
            });
        }

        return result;
    }, [courses, statusFilter, searchQuery]);

    // ============================================
    // ACTIONS
    // ============================================
    const clearFilters = useCallback(() => {
        setStatusFilter("ALL");
        setSearchQuery("");
    }, []);

    // ============================================
    // RETURN
    // ============================================
    return {
        filteredCourses,
        statusFilter,
        searchQuery,
        setStatusFilter,
        setSearchQuery,
        clearFilters,
    };
};

export default useCourseFilters;
