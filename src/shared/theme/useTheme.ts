// ============================================
// 🛹 SOSKATE - USE THEME HOOK
// ============================================
// Custom hook for easy theme access throughout the app

import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "./ThemeContext";

/**
 * Hook to access theme context
 *
 * @example
 * ```tsx
 * const { colors, isDark, setThemeMode } = useTheme();
 *
 * // Use colors
 * <View style={{ backgroundColor: colors.background.primary }}>
 *   <Text style={{ color: colors.text.primary }}>Hello</Text>
 * </View>
 *
 * // Check theme
 * if (isDark) {
 *   // dark mode specific logic
 * }
 *
 * // Change theme
 * setThemeMode('light');  // or 'dark' or 'auto'
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook to get only the colors (lighter than full useTheme)
 *
 * @example
 * ```tsx
 * const colors = useThemeColors();
 * <View style={{ backgroundColor: colors.background.primary }} />
 * ```
 */
export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

/**
 * Hook to check if dark mode is active
 *
 * @example
 * ```tsx
 * const isDark = useIsDarkTheme();
 * const icon = isDark ? 'moon' : 'sun';
 * ```
 */
export const useIsDarkTheme = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Hook to get the map style for current theme
 *
 * @example
 * ```tsx
 * const mapStyle = useMapStyle();
 * <MapView customMapStyle={mapStyle} />
 * ```
 */
export const useMapStyle = () => {
  const { mapStyle } = useTheme();
  return mapStyle;
};
