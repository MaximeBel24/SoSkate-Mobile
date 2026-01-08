// ============================================
// 🛹 SOSKATE - THEME MODULE
// ============================================
// Barrel export for theme system

// Colors
export {
  darkColors,
  getThemeColors,
  legacyColors,
  lightColors,
  type SemanticColors,
  type ThemeMode,
} from "./colors";

// Map styles
export { darkMapStyle, getMapStyle, lightMapStyle } from "./mapStyles";

// Context & Provider
export {
  ThemeContext,
  ThemeProvider,
  type ThemeContextType,
} from "./ThemeContext";

// Hooks
export {
  useIsDarkTheme,
  useMapStyle,
  useTheme,
  useThemeColors,
} from "./useTheme";
