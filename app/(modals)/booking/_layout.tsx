// ============================================
// 🛹 SOSKATE - BOOKING MODAL LAYOUT
// ============================================
// Layout pour les écrans de réservation

import { Stack } from "expo-router";
import { useTheme } from "@/src/shared/theme";

export default function BookingLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                    backgroundColor: colors.background.primary,
                },
            }}
        >
            <Stack.Screen
                name="[spotId]"
                options={{
                    gestureEnabled: true,
                    gestureDirection: "vertical",
                }}
            />
        </Stack>
    );
}