// ============================================
// SOSKATE - COURSE STATUS BADGE
// ============================================
// Badge de statut pour les cours (utilise le Badge shared)

import React from "react";
import Badge from "@/src/shared/ui/badge/Badge";
import { BookingStatus, CourseStatusBadgeProps } from "../types/course.types";

// ============================================
// CONFIGURATION
// ============================================
type StatusConfig = {
    label: string;
    variant: "success" | "danger" | "warning" | "info" | "neutral" | "accent";
};

const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
    OPEN: {
        label: 'Ouvert',
        variant: 'success'
    },
    FULL: {
        label: 'Plein',
        variant: "warning"
    },
    CONFIRMED: {
        label: "Confirmé",
        variant: "success",
    },
    PENDING: {
        label: "En attente",
        variant: "warning",
    },
    COMPLETED: {
        label: "Terminé",
        variant: "info",
    },
    CANCELLED: {
        label: "Annulé",
        variant: "danger",
    },
    NO_SHOW: {
        label: "Pas venu",
        variant: "neutral"
    }
};

// ============================================
// FALLBACK CONFIG
// ============================================
const FALLBACK_CONFIG: StatusConfig = {
    label: "Inconnu",
    variant: "neutral",
};

// ============================================
// COMPONENT
// ============================================
const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({
    status,
    size = "md",
}) => {
    const config = STATUS_CONFIG[status] ?? FALLBACK_CONFIG;

    // Debug: log unknown status in development
    if (__DEV__ && !STATUS_CONFIG[status]) {
        console.warn(`[CourseStatusBadge] Unknown status: "${status}"`);
    }

    return (
        <Badge
            label={config.label}
            variant={config.variant}
            size={size}
            testID={`course-status-badge-${status?.toLowerCase() ?? "unknown"}`}
        />
    );
};

export default CourseStatusBadge;
