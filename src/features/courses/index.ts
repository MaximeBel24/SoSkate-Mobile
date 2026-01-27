// ============================================
// SOSKATE - COURSES MODULE
// ============================================
// Barrel export pour le module courses

// Components
export { default as CourseCard } from "./components/CourseCard";
export { default as CoursesList } from "./components/CoursesList";
export { default as CourseTabs } from "./components/CourseTabs";
export { default as CourseStatusBadge } from "./components/CoursesStatusBadge";
export { default as CoursesEmptyState } from "./components/EmptyState";
export { default as ParticipantCard } from "./components/ParticipantCard";

// Hooks
export { useInstructorCourses } from "./hooks/useInstructorCourse";
export { useCourseFilters } from "./hooks/useCourseFilters";

// Types
export * from "./types/course.types";
