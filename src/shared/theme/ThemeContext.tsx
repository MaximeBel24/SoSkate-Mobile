// ============================================
// 🛹 SOSKATE - THEME CONTEXT
// ============================================
// Theme provider with auto mode, persistence, and smooth transitions

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform, StatusBar, useColorScheme } from "react-native";
import { MapStyleElement } from "react-native-maps";
import {
  darkColors,
  getThemeColors,
  SemanticColors,
  ThemeMode,
} from "./colors";
import { darkMapStyle, lightMapStyle } from "./mapStyles";

// ============================================
// CONSTANTS
// ============================================
const THEME_STORAGE_KEY = "@soskate_theme_mode";

// ============================================
// CONTEXT TYPE
// ============================================
export type ThemeContextType = {
  // Current theme mode setting (what user selected)
  themeMode: ThemeMode;

  // Actual active theme (resolved from auto)
  activeTheme: "light" | "dark";

  // Is the active theme dark?
  isDark: boolean;

  // Semantic colors for current theme
  colors: SemanticColors;

  // Map style for current theme
  mapStyle: MapStyleElement[];

  // Actions
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;

  // Loading state (for splash screen sync)
  isThemeLoaded: boolean;
};

// ============================================
// DEFAULT CONTEXT
// ============================================
const defaultContext: ThemeContextType = {
  themeMode: "dark",
  activeTheme: "dark",
  isDark: true,
  colors: darkColors,
  mapStyle: darkMapStyle,
  setThemeMode: async () => {},
  toggleTheme: async () => {},
  isThemeLoaded: false,
};

// ============================================
// CREATE CONTEXT
// ============================================
export const ThemeContext = createContext<ThemeContextType>(defaultContext);

// ============================================
// THEME PROVIDER
// ============================================
type ThemeProviderProps = {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  // System color scheme
  const systemColorScheme = useColorScheme();

  // Theme state
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    initialTheme ?? "dark"
  );
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // ============================================
  // LOAD PERSISTED THEME ON MOUNT
  // ============================================
  useEffect(() => {
    const loadPersistedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadPersistedTheme();
  }, []);

  // ============================================
  // COMPUTE ACTIVE THEME
  // ============================================
  const activeTheme = useMemo((): "light" | "dark" => {
    if (themeMode === "auto") {
      return systemColorScheme === "light" ? "light" : "dark";
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const isDark = activeTheme === "dark";

  // ============================================
  // GET COLORS AND MAP STYLE
  // ============================================
  const colors = useMemo(
    () => getThemeColors(themeMode, systemColorScheme),
    [themeMode, systemColorScheme]
  );

  const mapStyle = useMemo(
    () => (isDark ? darkMapStyle : lightMapStyle),
    [isDark]
  );

  // ============================================
  // UPDATE STATUS BAR
  // ============================================
  useEffect(() => {
    if (isThemeLoaded) {
      StatusBar.setBarStyle(isDark ? "light-content" : "dark-content", true);

      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(
          isDark ? colors.background.primary : colors.background.primary,
          true
        );
      }
    }
  }, [isDark, isThemeLoaded, colors.background.primary]);

  // ============================================
  // SET THEME MODE (with persistence)
  // ============================================
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
      // Still update state even if persistence fails
      setThemeModeState(mode);
    }
  }, []);

  // ============================================
  // TOGGLE THEME (cycles: dark -> light -> auto -> dark)
  // ============================================
  const toggleTheme = useCallback(async () => {
    const nextMode: Record<ThemeMode, ThemeMode> = {
      dark: "light",
      light: "auto",
      auto: "dark",
    };
    await setThemeMode(nextMode[themeMode]);
  }, [themeMode, setThemeMode]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      themeMode,
      activeTheme,
      isDark,
      colors,
      mapStyle,
      setThemeMode,
      toggleTheme,
      isThemeLoaded,
    }),
    [
      themeMode,
      activeTheme,
      isDark,
      colors,
      mapStyle,
      setThemeMode,
      toggleTheme,
      isThemeLoaded,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
