// ============================================
// 🛹 SOSKATE - MY BOOKINGS MODAL LAYOUT
// ============================================

import { Stack } from "expo-router";
import { useTheme } from "@/src/shared/theme";

export default function MyBookingsLayout() {
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
                name="index"
                options={{
                    gestureEnabled: true,
                    gestureDirection: "vertical",
                }}
            />
        </Stack>
    );
}