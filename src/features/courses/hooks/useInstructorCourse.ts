// ============================================
// SOSKATE - USE INSTRUCTOR COURSES HOOK
// ============================================
// Hook principal pour gérer les cours côté instructeur
// Pattern: loading/error/data avec fetch par filtre

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import {
  CourseFilter,
  getCourses,
  getInstructorStats,
} from "@/src/shared/services/instructorCoursesService";
import {
  CourseListItem,
  CourseStatsResponse,
  UseInstructorCoursesReturn,
} from "../types/course.types";

// ============================================
// CONSTANTS
// ============================================
const INITIAL_STATS: CourseStatsResponse = {
  totalCoursesThisMonth: 0,
  totalRevenueThisMonth: 0,
  upcomingCoursesCount: 0,
  completedCoursesCount: 0,
};

// ============================================
// TYPES INTERNES
// ============================================
interface CoursesState {
  data: CourseListItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

const initialCoursesState: CoursesState = {
  data: [],
  isLoading: true,
  isRefreshing: false,
  error: null,
};

// ============================================
// HOOK
// ============================================
export const useInstructorCourses = (): UseInstructorCoursesReturn => {
  const { user } = useAuth();
  const instructorId = user?.instructorId;

  // Courses states
  const [upcoming, setUpcoming] = useState<CoursesState>(initialCoursesState);
  const [passed, setPassed] = useState<CoursesState>(initialCoursesState);

  // Stats state
  const [stats, setStats] = useState<CourseStatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // ============================================
  // GENERIC FETCH FUNCTION
  // ============================================
  const fetchCourses = useCallback(
    async (
      filter: CourseFilter,
      setState: React.Dispatch<React.SetStateAction<CoursesState>>,
      isRefresh = false,
    ) => {
      if (!instructorId) return;

      setState((prev) => ({
        ...prev,
        isLoading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      try {
        const data = await getCourses(instructorId, filter);
        setState((prev) => ({
          ...prev,
          data,
          isLoading: false,
          isRefreshing: false,
        }));
      } catch (err: unknown) {
        const message = extractErrorMessage(
          err,
          `Impossible de charger les cours ${filter === "upcoming" ? "à venir" : "passés"}`,
        );
        setState((prev) => ({
          ...prev,
          error: message,
          isLoading: false,
          isRefreshing: false,
        }));
        console.error(`[useInstructorCourses] fetch ${filter} error:`, err);
      }
    },
    [instructorId],
  );

  // ============================================
  // FETCH STATS
  // ============================================
  const fetchStats = useCallback(async () => {
    if (!instructorId) return;

    setIsLoadingStats(true);

    try {
      const data = await getInstructorStats(instructorId);
      setStats(data);
    } catch (err: unknown) {
      console.error("[useInstructorCourses] fetchStats error:", err);
      setStats(INITIAL_STATS);
    } finally {
      setIsLoadingStats(false);
    }
  }, [instructorId]);

  // ============================================
  // SPECIFIC FETCH FUNCTIONS
  // ============================================
  const fetchUpcoming = useCallback(
    (isRefresh = false) => fetchCourses("upcoming", setUpcoming, isRefresh),
    [fetchCourses],
  );

  const fetchPassed = useCallback(
    (isRefresh = false) => fetchCourses("passed", setPassed, isRefresh),
    [fetchCourses],
  );

  // ============================================
  // REFRESH FUNCTIONS
  // ============================================
  const refreshUpcoming = useCallback(async () => {
    await fetchUpcoming(true);
  }, [fetchUpcoming]);

  const refreshPassed = useCallback(async () => {
    await fetchPassed(true);
  }, [fetchPassed]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchUpcoming(true), fetchPassed(true), fetchStats()]);
  }, [fetchUpcoming, fetchPassed, fetchStats]);

  // ============================================
  // INITIAL LOAD
  // ============================================
  useEffect(() => {
    if (instructorId) {
      fetchUpcoming();
      fetchPassed();
      fetchStats();
    }
  }, [instructorId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // RETURN
  // ============================================
  return {
    // Data
    upcomingCourses: upcoming.data,
    passedCourses: passed.data,
    stats,

    // Loading states
    isLoadingUpcoming: upcoming.isLoading,
    isLoadingPassed: passed.isLoading,
    isLoadingStats,

    // Refresh states
    isRefreshingUpcoming: upcoming.isRefreshing,
    isRefreshingPassed: passed.isRefreshing,

    // Error states
    errorUpcoming: upcoming.error,
    errorPassed: passed.error,

    // Actions
    refreshUpcoming,
    refreshPassed,
    refreshAll,
  };
};

// ============================================
// UTILS
// ============================================
function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  return fallback;
}

export default useInstructorCourses;
