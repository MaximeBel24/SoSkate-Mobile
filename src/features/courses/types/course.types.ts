// ============================================
// 🛹 SOSKATE - INSTRUCTOR COURSES TYPES
// ============================================
// Types alignés sur les réponses API réelles

// ============================================
// ENUMS
// ============================================
export type BookingStatus =
  | "OPEN"
  | "FULL"
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";
export type ParticipantStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "REFUNDED";
export type InvitedBy = "SELF" | "INSTRUCTOR" | "OTHER";
export type InstructorStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type Specialty = "STREET" | "PARK" | "BOWL" | "VERT" | "FREESTYLE";
export type CourseTab = "upcoming" | "passed";

// ============================================
// BASE INTERFACES (alignées sur l'API)
// ============================================

/**
 * Informations instructeur dans une réservation
 */
export interface InstructorSummary {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  status: InstructorStatus;
  specialty: Specialty;
  yearsOfExperience: number;
}

/**
 * Informations spot dans une réservation
 */
export interface SpotSummary {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

/**
 * Informations service dans une réservation
 */
export interface ServiceSummary {
  id: number;
  name: string;
  basePriceCents: number;
  maxParticipants: number;
}

/**
 * Participant dans une réservation
 */
export interface ParticipantSummary {
  id: number;
  customerId: number;
  customerName: string;
  numberOfParticipants: number;
  status: ParticipantStatus;
  amountCents: number;
  invitedBy: InvitedBy;
}

/**
 * Participant avec détails de contact (pour vue détaillée)
 */
export interface ParticipantDetail extends ParticipantSummary {
  email: string;
  phone?: string;
  birthDate?: string;
}

// ============================================
// COURSE INTERFACES
// ============================================

/**
 * Réservation pour l'affichage en liste
 * Correspond à GET /instructors/{id}/bookings
 */
export interface CourseListItem {
  id: number;
  instructor: InstructorSummary;
  spot: SpotSummary;
  service: ServiceSummary;
  startTime: string; // ISO datetime "2026-01-20T15:00:00"
  endTime: string; // ISO datetime "2026-01-20T16:30:00"
  durationMinutes: number;
  maxParticipants: number;
  confirmedParticipants: number;
  availablePlaces: number;
  status: BookingStatus;
  participants: ParticipantSummary[];
  createdAt: string; // ISO datetime
  notes?: string;
}

/**
 * Détail complet d'une réservation
 * Correspond à GET /bookings/{id}
 */
export interface CourseDetail extends Omit<CourseListItem, "participants"> {
  participants: ParticipantDetail[];
  updatedAt: string;
}

// ============================================
// COMPUTED HELPERS
// ============================================

/**
 * Helpers pour extraire des infos utiles d'un cours
 */
export const CourseHelpers = {
  /**
   * Nom du premier participant ou fallback
   */
  getMainParticipantName: (course: CourseListItem): string => {
    return course.participants[0]?.customerName ?? "Aucun participant";
  },

  /**
   * Nombre total de personnes (somme des numberOfParticipants)
   */
  getTotalParticipantsCount: (course: CourseListItem): number => {
    return course.participants.reduce(
      (sum, p) => sum + p.numberOfParticipants,
      0,
    );
  },

  /**
   * Montant total en euros
   */
  getTotalAmountEuros: (course: CourseListItem): number => {
    const totalCents = course.participants.reduce(
      (sum, p) => sum + p.amountCents,
      0,
    );
    return totalCents / 100;
  },

  /**
   * Vérifie si le cours a des participants confirmés
   */
  hasConfirmedParticipants: (course: CourseListItem): boolean => {
    return course.participants.some((p) => p.status === "CONFIRMED");
  },

  /**
   * Formatage de la durée
   */
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}`;
  },
};

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // pageNumber (0-indexed)
  size: number; // pageSize
  first: boolean;
  last: boolean;
}

export type CoursesResponse = PaginatedResponse<CourseListItem>;

export interface CourseStatsResponse {
  totalCoursesThisMonth: number;
  totalRevenueThisMonth: number;
  upcomingCoursesCount: number;
  completedCoursesCount: number;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface CourseCardProps {
  course: CourseListItem;
  onPress: (course: CourseListItem) => void;
  variant?: CourseTab;
}

export interface CoursesListProps {
  courses: CourseListItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onCoursePress: (course: CourseListItem) => void;
  onEndReached?: () => void;
  emptyMessage?: string;
  variant: CourseTab;
}

export interface CourseTabsProps {
  activeTab: CourseTab;
  onTabChange: (tab: CourseTab) => void;
  upcomingCount?: number;
}

export interface CourseStatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

export interface ParticipantStatusBadgeProps {
  status: ParticipantStatus;
  size?: "sm" | "md";
}

export interface CourseStatsProps {
  stats: CourseStatsResponse;
  isLoading?: boolean;
}

export interface ParticipantCardProps {
  participant: ParticipantDetail;
  onCallPress?: (phone: string) => void;
  onEmailPress?: (email: string) => void;
}

export interface EmptyStateProps {
  variant: CourseTab;
  onActionPress?: () => void;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseInstructorCoursesReturn {
  // Data
  upcomingCourses: CourseListItem[];
  passedCourses: CourseListItem[];
  stats: CourseStatsResponse | null;

  // Loading states
  isLoadingUpcoming: boolean;
  isLoadingPassed: boolean;
  isLoadingStats: boolean;

  // Refresh states
  isRefreshingUpcoming: boolean;
  isRefreshingPassed: boolean;

  // Error states
  errorUpcoming: string | null;
  errorPassed: string | null;

  // Actions
  refreshUpcoming: () => Promise<void>;
  refreshPassed: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export interface UseCourseFiltersReturn {
  // Filtered data
  filteredCourses: CourseListItem[];

  // Filter state
  statusFilter: BookingStatus | "ALL";
  searchQuery: string;

  // Actions
  setStatusFilter: (status: BookingStatus | "ALL") => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}
