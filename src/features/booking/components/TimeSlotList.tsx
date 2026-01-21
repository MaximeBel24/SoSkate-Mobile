// ============================================
// 🛹 SOSKATE - TIME SLOT LIST
// ============================================
// Liste des créneaux horaires disponibles

import React from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { TimeSlot } from "@/src/shared/types/availability.interface";

interface TimeSlotListProps {
    slots: TimeSlot[];
    selectedSlot: TimeSlot | null;
    onSelectSlot: (slot: TimeSlot) => void;
    isLoading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SlotItemProps {
    slot: TimeSlot;
    isSelected: boolean;
    onPress: () => void;
    index: number;
}

const SlotItem: React.FC<SlotItemProps> = ({
                                               slot,
                                               isSelected,
                                               onPress,
                                               index,
                                           }) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.97);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.slotItem,
                {
                    backgroundColor: isSelected
                        ? colors.accent.primary
                        : isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                    borderColor: isSelected
                        ? colors.accent.primary
                        : colors.border.default,
                },
                animatedStyle,
            ]}
        >
            <View style={styles.slotContent}>
                <Icons.ClockIcon
                    size={18}
                    color={isSelected ? colors.constant.white : colors.text.secondary}
                    weight={isSelected ? "fill" : "regular"}
                />

                <Typo
                    size={16}
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? colors.constant.white : colors.text.primary}
                >
                    {slot.startTime}
                </Typo>

                <Icons.ArrowRightIcon
                    size={14}
                    color={isSelected ? colors.constant.white : colors.text.muted}
                />

                <Typo
                    size={16}
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? colors.constant.white : colors.text.primary}
                >
                    {slot.endTime}
                </Typo>
            </View>

            {isSelected && (
                <Icons.CheckCircleIcon
                    size={22}
                    color={colors.constant.white}
                    weight="fill"
                />
            )}
        </AnimatedPressable>
    );
};

const TimeSlotList: React.FC<TimeSlotListProps> = ({
                                                       slots,
                                                       selectedSlot,
                                                       onSelectSlot,
                                                       isLoading = false,
                                                   }) => {
    const { colors, isDark } = useTheme();

    // Skeleton loading
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Typo size={14} fontWeight="600" color={colors.text.primary}>
                        Créneaux disponibles
                    </Typo>
                </View>
                <View style={styles.skeletonContainer}>
                    {[1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.skeletonItem,
                                { backgroundColor: colors.ui.skeleton },
                            ]}
                        />
                    ))}
                </View>
            </View>
        );
    }

    // Aucun créneau
    if (slots.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Typo size={14} fontWeight="600" color={colors.text.primary}>
                        Créneaux disponibles
                    </Typo>
                </View>
                <View
                    style={[
                        styles.emptyContainer,
                        {
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.02)",
                            borderColor: colors.border.subtle,
                        },
                    ]}
                >
                    <Icons.CalendarXIcon
                        size={40}
                        color={colors.text.muted}
                        weight="thin"
                    />
                    <Typo
                        size={14}
                        color={colors.text.muted}
                        style={{ textAlign: "center" }}
                    >
                        Aucun créneau disponible pour cette durée.{"\n"}
                        Essayez une durée plus courte.
                    </Typo>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typo size={14} fontWeight="600" color={colors.text.primary}>
                    Créneaux disponibles
                </Typo>
                <Typo size={14} color={colors.text.secondary}>
                    {slots.length} créneau{slots.length > 1 ? "x" : ""}
                </Typo>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.slotsContainer}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                {slots.map((slot, index) => (
                    <Animated.View
                        key={slot.id}
                        entering={FadeInDown.delay(index * 50).springify()}
                    >
                        <SlotItem
                            slot={slot}
                            isSelected={selectedSlot?.id === slot.id}
                            onPress={() => onSelectSlot(slot)}
                            index={index}
                        />
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};

export default TimeSlotList;

const styles = StyleSheet.create({
    container: {
        gap: 12,
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    scrollView: {
        flex: 1,
        maxHeight: 250,
    },
    slotsContainer: {
        gap: 8,
        paddingHorizontal: 4,
        paddingBottom: 8,
    },
    slotItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    slotContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    // Empty state
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 32,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "dashed",
        gap: 12,
    },
    // Skeleton
    skeletonContainer: {
        gap: 8,
        paddingHorizontal: 4,
    },
    skeletonItem: {
        height: 52,
        borderRadius: 12,
    },
});