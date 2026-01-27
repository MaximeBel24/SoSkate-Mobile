// ============================================
// SOSKATE - EMPTY STATE COMPONENT
// ============================================
// Composant générique pour les états vides de listes

import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import Button from "@/src/shared/ui/button/Button";
import { verticalScale } from "@/src/shared/utils/styling";

// ============================================
// TYPES
// ============================================
interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}

// ============================================
// COMPONENT
// ============================================
const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    style,
    testID,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, style]} testID={testID}>
            {icon && (
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.background.surface },
                    ]}
                >
                    {icon}
                </View>
            )}

            <Typo
                size={18}
                fontWeight="600"
                color={colors.text.primary}
                style={styles.title}
            >
                {title}
            </Typo>

            {description && (
                <Typo
                    size={14}
                    color={colors.text.secondary}
                    style={styles.description}
                >
                    {description}
                </Typo>
            )}

            {actionLabel && onAction && (
                <Button onPress={onAction} style={styles.button}>
                    <Typo size={14} fontWeight="600" color={colors.constant.white}>
                        {actionLabel}
                    </Typo>
                </Button>
            )}
        </View>
    );
};

export default EmptyState;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingVertical: verticalScale(60),
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    title: {
        textAlign: "center",
        marginBottom: 8,
    },
    description: {
        textAlign: "center",
        lineHeight: 20,
    },
    button: {
        marginTop: 24,
        paddingHorizontal: 24,
        minWidth: 160,
    },
});
