// ============================================
// SOSKATE - BADGE COMPONENT
// ============================================
// Badge/Tag réutilisable pour statuts et labels

import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { radius } from "@/src/shared/constants/theme";

// ============================================
// TYPES
// ============================================
type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: React.ReactNode;
    testID?: string;
}

// ============================================
// COMPONENT
// ============================================
const Badge: React.FC<BadgeProps> = ({
    label,
    variant = "neutral",
    size = "md",
    icon,
    testID,
}) => {
    const { colors } = useTheme();

    // ============================================
    // VARIANT STYLES
    // ============================================
    const getVariantStyles = (): { container: ViewStyle; text: string } => {
        switch (variant) {
            case "success":
                return {
                    container: {
                        backgroundColor: colors.semantic.successBg,
                        borderColor: colors.semantic.successBorder,
                    },
                    text: colors.semantic.success,
                };
            case "danger":
                return {
                    container: {
                        backgroundColor: colors.semantic.dangerBg,
                        borderColor: colors.semantic.dangerBorder,
                    },
                    text: colors.semantic.danger,
                };
            case "warning":
                return {
                    container: {
                        backgroundColor: colors.semantic.warningBg,
                        borderColor: colors.semantic.warningBorder,
                    },
                    text: colors.semantic.warning,
                };
            case "info":
                return {
                    container: {
                        backgroundColor: colors.semantic.infoBg,
                        borderColor: colors.semantic.infoBorder,
                    },
                    text: colors.semantic.info,
                };
            case "accent":
                return {
                    container: {
                        backgroundColor: colors.ui.badge,
                        borderColor: colors.accent.primary,
                    },
                    text: colors.accent.primary,
                };
            case "neutral":
            default:
                return {
                    container: {
                        backgroundColor: colors.background.surface,
                        borderColor: colors.border.default,
                    },
                    text: colors.text.secondary,
                };
        }
    };

    const variantStyles = getVariantStyles();

    // ============================================
    // SIZE STYLES
    // ============================================
    const getSizeStyles = (): { container: ViewStyle; fontSize: number } => {
        switch (size) {
            case "sm":
                return {
                    container: {
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                    },
                    fontSize: 11,
                };
            case "md":
            default:
                return {
                    container: {
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    },
                    fontSize: 12,
                };
        }
    };

    const sizeStyles = getSizeStyles();

    // ============================================
    // RENDER
    // ============================================
    return (
        <View
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
            ]}
            testID={testID}
        >
            {icon && <View style={styles.icon}>{icon}</View>}
            <Typo
                size={sizeStyles.fontSize}
                fontWeight="600"
                color={variantStyles.text}
            >
                {label}
            </Typo>
        </View>
    );
};

export default Badge;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: radius._6,
        borderWidth: 1,
        alignSelf: "flex-start",
    },
    icon: {
        marginRight: 4,
    },
});
