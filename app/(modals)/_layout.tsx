import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerShown: false,
      }}
    >
      <Stack.Screen name="instructor/[id]" />
      <Stack.Screen name="instructor/courses" />
      <Stack.Screen name="instructor/course/[id]" />
    </Stack>
  );
}
