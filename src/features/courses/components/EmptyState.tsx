// ============================================
// SOSKATE - COURSES EMPTY STATE
// ============================================
// État vide spécifique aux cours (wrapper du shared EmptyState)

import React from "react";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import EmptyState from "@/src/shared/ui/feedback/EmptyState";
import { EmptyStateProps } from "../types/course.types";

// ============================================
// CONFIGURATION
// ============================================
const EMPTY_CONFIG = {
    upcoming: {
        title: "Aucun cours à venir",
        description: "Partagez votre lien de réservation pour recevoir de nouvelles demandes de cours.",
        actionLabel: "Partager mon profil",
        icon: Icons.CalendarPlus,
    },
    passed: {
        title: "Aucun cours passé",
        description: "Vos cours terminés apparaîtront ici.",
        actionLabel: undefined,
        icon: Icons.ClockCounterClockwise,
    },
};

// ============================================
// COMPONENT
// ============================================
const CoursesEmptyState: React.FC<EmptyStateProps> = ({
    variant,
    onActionPress,
}) => {
    const { colors } = useTheme();
    const config = EMPTY_CONFIG[variant];
    const IconComponent = config.icon;

    return (
        <EmptyState
            icon={
                <IconComponent
                    size={40}
                    color={colors.accent.primary}
                    weight="duotone"
                />
            }
            title={config.title}
            description={config.description}
            actionLabel={config.actionLabel}
            onAction={onActionPress}
        />
    );
};

export default CoursesEmptyState;
