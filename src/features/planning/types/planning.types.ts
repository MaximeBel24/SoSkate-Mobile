// ============================================
// 🛹 SOSKATE - PLANNING TYPES
// ============================================
// Types pour le planning et les disponibilités

/**
 * Statut d'une disponibilité
 */
export type AvailabilityStatus = "AVAILABLE" | "BOOKED" | "CANCELLED";

/**
 * Disponibilité d'un instructeur (réponse API)
 */
export interface AvailabilityResponse {
    id: number;
    instructorId: number;
    date: string; // "2026-01-27"
    startTime: string; // "09:00"
    endTime: string; // "12:00"
    status: AvailabilityStatus;
    createdAt: string;
    updatedAt: string;
}

/**
 * Requête pour créer une disponibilité
 */
export interface CreateAvailabilityRequest {
    date: string; // "2026-01-27"
    startTime: string; // "09:00"
    endTime: string; // "12:00"
}

/**
 * Requête pour modifier une disponibilité
 */
export interface UpdateAvailabilityRequest {
    startTime: string;
    endTime: string;
}

/**
 * Paramètres pour lister les disponibilités
 */
export interface AvailabilityFilters {
    from: string; // "2026-01-20"
    to: string; // "2026-01-31"
}

/**
 * Jour de la semaine pour l'affichage
 */
export interface WeekDay {
    date: string; // "2026-01-27"
    dayName: string; // "Lun"
    dayNumber: number; // 27
    isToday: boolean;
    isPast: boolean;
}

/**
 * Créneau horaire pour la grille
 */
export interface TimeSlot {
    hour: number; // 9
    label: string; // "09:00"
}

/**
 * Bloc affiché dans le calendrier
 */
export interface CalendarBlock {
    id: number;
    type: "availability" | "booking";
    date: string;
    startTime: string;
    endTime: string;
    status: AvailabilityStatus;
    // Position calculée pour l'affichage
    topPosition: number;
    height: number;
    // Infos supplémentaires pour les bookings
    bookingInfo?: {
        customerName: string;
        serviceName: string;
    };
}

/**
 * Données du planning pour une semaine
 */
export interface WeekPlanningData {
    weekDays: WeekDay[];
    availabilities: AvailabilityResponse[];
    // bookings: BookingResponse[]; // Pour plus tard
}

// ============================================
// CONSTANTES
// ============================================

/**
 * Heures affichées dans le calendrier (8h - 20h)
 */
export const PLANNING_START_HOUR = 8;
export const PLANNING_END_HOUR = 20;

/**
 * Hauteur d'une heure en pixels
 */
export const HOUR_HEIGHT = 60;

/**
 * Padding vertical du calendrier pour voir les heures de début et fin
 */
export const CALENDAR_PADDING_TOP = 20;
export const CALENDAR_PADDING_BOTTOM = 40;

/**
 * Génère les créneaux horaires pour l'affichage
 */
export const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = PLANNING_START_HOUR; hour <= PLANNING_END_HOUR; hour++) {
        slots.push({
            hour,
            label: `${hour.toString().padStart(2, "0")}:00`,
        });
    }
    return slots;
};

/**
 * Couleurs pour les différents types de blocs
 */
export const BLOCK_COLORS = {
    available: {
        background: "rgba(34, 197, 94, 0.2)", // Vert clair
        border: "#22c55e",
        text: "#16a34a",
    },
    booked: {
        background: "rgba(255, 107, 53, 0.2)", // Orange clair
        border: "#FF6B35",
        text: "#ea580c",
    },
    past: {
        background: "rgba(156, 163, 175, 0.2)", // Gris
        border: "#9ca3af",
        text: "#6b7280",
    },
};

// ============================================
// HELPERS
// ============================================

/**
 * Calcule la position top d'un bloc en fonction de l'heure
 */
export const calculateBlockTop = (startTime: string): number => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const hoursFromStart = hours - PLANNING_START_HOUR;
    const minutesFraction = minutes / 60;
    return (hoursFromStart + minutesFraction) * HOUR_HEIGHT;
};

/**
 * Calcule la hauteur d'un bloc en fonction de la durée
 */
export const calculateBlockHeight = (
    startTime: string,
    endTime: string
): number => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;
    const durationInMinutes = endInMinutes - startInMinutes;

    return (durationInMinutes / 60) * HOUR_HEIGHT;
};

/**
 * Formate une date pour l'affichage du jour
 */
export const formatDayName = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("fr-FR", { weekday: "short" });
};

/**
 * Vérifie si une date est aujourd'hui
 */
export const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString + "T00:00:00");
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

/**
 * Vérifie si une date est passée
 */
export const isPastDate = (dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString + "T00:00:00");
    return date < today;
};

/**
 * Génère les jours d'une semaine à partir d'une date
 */
export const generateWeekDays = (startOfWeek: Date): WeekDay[] => {
    const days: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        date.setHours(12, 0, 0, 0); // Éviter les problèmes de timezone

        // Formater en local, pas en UTC !
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const dayNum = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${dayNum}`;

        days.push({
            date: dateString,
            dayName: formatDayName(dateString),
            dayNumber: date.getDate(),
            isToday: isToday(dateString),
            isPast: isPastDate(dateString),
        });
    }

    return days;
};

/**
 * Obtient le lundi de la semaine d'une date
 */
export const getMonday = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // Midi pour éviter les problèmes UTC
    const day = d.getDay(); // 0=dim, 1=lun, ...
    const diff = day === 0 ? -6 : 1 - day; // Si dimanche → reculer de 6
    d.setDate(d.getDate() + diff);
    return d;
};

/**
 * Formate une plage horaire pour l'affichage
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${startTime} - ${endTime}`;
};

/**
 * Booking d'un instructeur (réponse API /instructors/{id}/bookings)
 */
export interface InstructorBookingResponse {
    id: number;
    instructor: {
        id: number;
        firstname: string;
        lastname: string;
        phone: string;
        status: string;
        specialty: string;
        yearsOfExperience: number;
    };
    spot: {
        id: number;
        name: string;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
    };
    service: {
        id: number;
        name: string;
        basePriceCents: number;
        durationMinutes: number;
    };
    customer: {
        id: number;
        firstname: string;
        lastname: string;
    };
    startTime: string; // ISO datetime
    endTime: string;
    durationMinutes: number;
    status: string;
    participantsNotes: string | null;
    createdAt: string;
}

/**
 * Calcule la durée en heures
 */
export const calculateDurationHours = (
    startTime: string,
    endTime: string
): number => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;

    return (endInMinutes - startInMinutes) / 60;
};