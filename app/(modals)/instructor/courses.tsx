// ============================================
// SOSKATE - INSTRUCTOR COURSES SCREEN
// ============================================
// Écran de liste des cours pour les instructeurs

import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import {
  CoursesList,
  CourseTabs,
  useInstructorCourses,
  CourseTab,
  CourseListItem,
} from "@/src/features/courses";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";

// ============================================
// COMPONENT
// ============================================
export default function InstructorCoursesScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State
  const [activeTab, setActiveTab] = useState<CourseTab>("upcoming");

  // Hook principal
  const {
    upcomingCourses,
    passedCourses,
    stats,
    isLoadingUpcoming,
    isLoadingPassed,
    isLoadingStats,
    isRefreshingUpcoming,
    isRefreshingPassed,
    errorUpcoming,
    errorPassed,
    refreshUpcoming,
    refreshPassed,
  } = useInstructorCourses();

  // ============================================
  // HANDLERS
  // ============================================
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleTabChange = useCallback((tab: CourseTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  }, []);

  const handleCoursePress = useCallback(
    (course: CourseListItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/(modals)/instructor/course/${course.id}`);
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    if (activeTab === "upcoming") {
      refreshUpcoming();
    } else {
      refreshPassed();
    }
  }, [activeTab, refreshUpcoming, refreshPassed]);

  // ============================================
  // DERIVED DATA
  // ============================================
  const currentCourses =
    activeTab === "upcoming" ? upcomingCourses : passedCourses;
  const isLoading =
    activeTab === "upcoming" ? isLoadingUpcoming : isLoadingPassed;
  const isRefreshing =
    activeTab === "upcoming" ? isRefreshingUpcoming : isRefreshingPassed;
  const error = activeTab === "upcoming" ? errorUpcoming : errorPassed;

  // ============================================
  // RENDER
  // ============================================
  return (
    <ScreenWrapper>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 8,
              borderBottomColor: colors.border.subtle,
            },
          ]}
        >
          <Pressable onPress={handleClose} style={styles.headerButton}>
            <Icons.CaretLeftIcon
              size={24}
              color={colors.text.primary}
              weight="bold"
            />
          </Pressable>

          <Typo size={18} fontWeight="700" color={colors.text.primary}>
            Mes cours
          </Typo>

          {/* Placeholder pour équilibrer le header */}
          <View style={styles.headerButton} />
        </View>

        {/* Stats rapides */}
        {!isLoadingStats && stats && (
          <View
            style={[
              styles.statsContainer,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)",
                borderBottomColor: colors.border.subtle,
              },
            ]}
          >
            <StatItem
              label="Ce mois"
              value={stats.totalCoursesThisMonth}
              icon={
                <Icons.CalendarCheckIcon
                  size={18}
                  color={colors.accent.primary}
                  weight="fill"
                />
              }
              colors={colors}
            />
            <View
              style={[
                styles.statDivider,
                { backgroundColor: colors.border.subtle },
              ]}
            />
            <StatItem
              label="À venir"
              value={stats.upcomingCoursesCount}
              icon={
                <Icons.Clock
                  size={18}
                  color={colors.semantic.info}
                  weight="fill"
                />
              }
              colors={colors}
            />
            <View
              style={[
                styles.statDivider,
                { backgroundColor: colors.border.subtle },
              ]}
            />
            <StatItem
              label="Revenus"
              value={`${(stats.totalRevenueThisMonth / 100).toFixed(0)}€`}
              icon={
                <Icons.CurrencyEur
                  size={18}
                  color={colors.semantic.success}
                  weight="fill"
                />
              }
              colors={colors}
            />
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <CourseTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            upcomingCount={upcomingCourses.length}
          />
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorBanner}>
            <Icons.WarningCircle
              size={20}
              color={colors.semantic.danger}
              weight="fill"
            />
            <Typo
              size={13}
              color={colors.semantic.danger}
              style={styles.errorText}
            >
              {error}
            </Typo>
            <Pressable onPress={handleRefresh}>
              <Typo size={13} fontWeight="600" color={colors.accent.primary}>
                Réessayer
              </Typo>
            </Pressable>
          </View>
        )}

        {/* Liste */}
        <View style={styles.listContainer}>
          <CoursesList
            courses={currentCourses}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onCoursePress={handleCoursePress}
            variant={activeTab}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

// ============================================
// STAT ITEM COMPONENT
// ============================================
interface StatItemProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colors: ReturnType<typeof useTheme>["colors"];
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, colors }) => (
  <View style={styles.statItem}>
    {icon}
    <Typo size={18} fontWeight="700" color={colors.text.primary}>
      {value}
    </Typo>
    <Typo size={11} color={colors.text.muted}>
      {label}
    </Typo>
  </View>
);

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  tabsContainer: {
    paddingTop: 16,
  },
  listContainer: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    flex: 1,
  },
});
