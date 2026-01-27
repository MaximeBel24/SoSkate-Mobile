// ============================================
// SOSKATE - COURSE TABS
// ============================================
// Onglets pour basculer entre cours à venir et historique

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { radius } from "@/src/shared/constants/theme";
import { CourseTabsProps, CourseTab } from "../types/course.types";

// ============================================
// CONSTANTS
// ============================================
const TABS: Array<{ key: CourseTab; label: string }> = [
    { key: "upcoming", label: "À venir" },
    { key: "passed", label: "Passés" },
];

// ============================================
// COMPONENT
// ============================================
const CourseTabs: React.FC<CourseTabsProps> = ({
    activeTab,
    onTabChange,
    upcomingCount,
}) => {
    const { colors, isDark } = useTheme();

    const handleTabPress = (tab: CourseTab) => {
        if (tab !== activeTab) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onTabChange(tab);
        }
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : colors.background.surface,
                    borderColor: colors.border.subtle,
                },
            ]}
        >
            {TABS.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                    <TabItem
                        key={tab.key}
                        label={tab.label}
                        isActive={isActive}
                        count={tab.key === "upcoming" ? upcomingCount : undefined}
                        onPress={() => handleTabPress(tab.key)}
                        colors={colors}
                    />
                );
            })}
        </View>
    );
};

// ============================================
// TAB ITEM COMPONENT
// ============================================
interface TabItemProps {
    label: string;
    isActive: boolean;
    count?: number;
    onPress: () => void;
    colors: ReturnType<typeof useTheme>["colors"];
}

const TabItem: React.FC<TabItemProps> = ({
    label,
    isActive,
    count,
    onPress,
    colors,
}) => {
    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(
            isActive ? colors.accent.primary : "transparent",
            { duration: 200, easing: Easing.inOut(Easing.ease) }
        ),
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        color: withTiming(
            isActive ? colors.constant.white : colors.text.secondary,
            { duration: 200 }
        ),
    }));

    return (
        <Pressable onPress={onPress} style={styles.tabPressable}>
            <Animated.View style={[styles.tab, animatedBackgroundStyle]}>
                <Animated.Text
                    style={[styles.tabText, animatedTextStyle]}
                >
                    {label}
                </Animated.Text>

                {typeof count === "number" && count > 0 && (
                    <View
                        style={[
                            styles.badge,
                            {
                                backgroundColor: isActive
                                    ? colors.constant.white
                                    : colors.accent.primary,
                            },
                        ]}
                    >
                        <Typo
                            size={11}
                            fontWeight="700"
                            color={isActive ? colors.accent.primary : colors.constant.white}
                        >
                            {count > 99 ? "99+" : count}
                        </Typo>
                    </View>
                )}
            </Animated.View>
        </Pressable>
    );
};

export default CourseTabs;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 16,
        borderRadius: radius._12,
        borderWidth: 1,
        padding: 4,
    },
    tabPressable: {
        flex: 1,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: radius._10,
        gap: 8,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
    },
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },
});
