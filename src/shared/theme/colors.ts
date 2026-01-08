// ============================================
// 🛹 SOSKATE - COLOR SYSTEM
// ============================================
// Semantic color tokens for dark and light themes
// Inspired by the Angular backoffice _variables.scss

import { ColorSchemeName } from "react-native";

// ============================================
// TYPE DEFINITIONS
// ============================================
export type ThemeMode = "light" | "dark" | "auto";

export type SemanticColors = {
  // Backgrounds
  background: {
    primary: string;
    secondary: string;
    surface: string;
    surfaceHover: string;
    row: string;
    rowAlt: string;
    input: string;
    inputFocus: string;
    overlay: string;
  };

  // Text
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };

  // Borders
  border: {
    default: string;
    subtle: string;
    strong: string;
  };

  // Accent - Brand
  accent: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };

  // Semantic - States
  semantic: {
    success: string;
    successHover: string;
    successBg: string;
    successBorder: string;
    danger: string;
    dangerHover: string;
    dangerBg: string;
    dangerBorder: string;
    warning: string;
    warningHover: string;
    warningBg: string;
    warningBorder: string;
    info: string;
    infoHover: string;
    infoBg: string;
    infoBorder: string;
  };

  // UI Elements
  ui: {
    card: string;
    cardBorder: string;
    tabBar: string;
    tabBarBorder: string;
    skeleton: string;
    skeletonHighlight: string;
    divider: string;
    badge: string;
  };

  // Glassmorphism
  glass: {
    background: string;
    border: string;
    shadow: string;
  };

  // Chat bubbles (for future messaging feature)
  chat: {
    myBubble: string;
    otherBubble: string;
  };

  // Map
  map: {
    markerDefault: string;
    markerSelected: string;
    clusterBg: string;
  };

  // Neutrals (for direct access when needed)
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Constants (don't change between themes)
  constant: {
    white: string;
    black: string;
    transparent: string;
  };
};

// ============================================
// DARK THEME PALETTE
// ============================================
export const darkColors: SemanticColors = {
  background: {
    primary: "#1c1917",
    secondary: "rgba(44, 58, 71, 0.9)",
    surface: "rgba(28, 25, 23, 0.95)",
    surfaceHover: "rgba(44, 58, 71, 0.8)",
    row: "rgba(28, 25, 23, 0.6)",
    rowAlt: "transparent",
    input: "rgba(28, 25, 23, 0.9)",
    inputFocus: "rgba(28, 25, 23, 1)",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  text: {
    primary: "#f5f5f5",
    secondary: "#b0b3b8",
    muted: "#6b7280",
    inverse: "#1c1917",
  },

  border: {
    default: "rgba(176, 179, 184, 0.2)",
    subtle: "rgba(176, 179, 184, 0.1)",
    strong: "rgba(176, 179, 184, 0.3)",
  },

  accent: {
    primary: "#FF6B35",
    primaryLight: "#FF8C42",
    primaryDark: "#D44A1C",
    secondary: "#FFD24C",
  },

  semantic: {
    success: "#22c55e",
    successHover: "#16a34a",
    successBg: "rgba(34, 197, 94, 0.2)",
    successBorder: "rgba(34, 197, 94, 0.3)",
    danger: "#dc2626",
    dangerHover: "#b91c1c",
    dangerBg: "rgba(220, 38, 38, 0.2)",
    dangerBorder: "rgba(220, 38, 38, 0.3)",
    warning: "#f59e0b",
    warningHover: "#d97706",
    warningBg: "rgba(245, 158, 11, 0.2)",
    warningBorder: "rgba(245, 158, 11, 0.3)",
    info: "#2294c9",
    infoHover: "#1d7fb0",
    infoBg: "rgba(34, 148, 201, 0.2)",
    infoBorder: "rgba(34, 148, 201, 0.3)",
  },

  ui: {
    card: "rgba(28, 25, 23, 0.95)",
    cardBorder: "rgba(176, 179, 184, 0.1)",
    tabBar: "#1c1917",
    tabBarBorder: "rgba(255, 107, 53, 0.3)",
    skeleton: "#292524",
    skeletonHighlight: "#44403c",
    divider: "rgba(176, 179, 184, 0.15)",
    badge: "rgba(255, 107, 53, 0.2)",
  },

  glass: {
    background: "rgba(28, 25, 23, 0.7)",
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "rgba(0, 0, 0, 0.3)",
  },

  chat: {
    myBubble: "#FFE1CC",
    otherBubble: "#FFF1BF",
  },

  map: {
    markerDefault: "#FF6B35",
    markerSelected: "#FFD24C",
    clusterBg: "rgba(255, 107, 53, 0.9)",
  },

  neutral: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
  },

  constant: {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
};

// ============================================
// LIGHT THEME PALETTE
// ============================================
export const lightColors: SemanticColors = {
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    row: "#f8fafc",
    rowAlt: "#ffffff",
    input: "#ffffff",
    inputFocus: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.3)",
  },

  text: {
    primary: "#1c1917",
    secondary: "#475569",
    muted: "#94a3b8",
    inverse: "#f5f5f5",
  },

  border: {
    default: "#e2e8f0",
    subtle: "#f1f5f9",
    strong: "#cbd5e1",
  },

  accent: {
    primary: "#ea580c", // Slightly darker for better contrast on light bg
    primaryLight: "#f97316",
    primaryDark: "#c2410c",
    secondary: "#eab308",
  },

  semantic: {
    success: "#16a34a",
    successHover: "#15803d",
    successBg: "rgba(22, 163, 74, 0.1)",
    successBorder: "rgba(22, 163, 74, 0.2)",
    danger: "#dc2626",
    dangerHover: "#b91c1c",
    dangerBg: "rgba(220, 38, 38, 0.1)",
    dangerBorder: "rgba(220, 38, 38, 0.2)",
    warning: "#d97706",
    warningHover: "#b45309",
    warningBg: "rgba(217, 119, 6, 0.1)",
    warningBorder: "rgba(217, 119, 6, 0.2)",
    info: "#0284c7",
    infoHover: "#0369a1",
    infoBg: "rgba(2, 132, 199, 0.1)",
    infoBorder: "rgba(2, 132, 199, 0.2)",
  },

  ui: {
    card: "#ffffff",
    cardBorder: "#e2e8f0",
    tabBar: "#ffffff",
    tabBarBorder: "rgba(234, 88, 12, 0.2)",
    skeleton: "#f1f5f9",
    skeletonHighlight: "#e2e8f0",
    divider: "#e2e8f0",
    badge: "rgba(234, 88, 12, 0.1)",
  },

  glass: {
    background: "rgba(255, 255, 255, 0.8)",
    border: "rgba(0, 0, 0, 0.05)",
    shadow: "rgba(0, 0, 0, 0.08)",
  },

  chat: {
    myBubble: "#FFF0E6",
    otherBubble: "#FFF8E6",
  },

  map: {
    markerDefault: "#ea580c",
    markerSelected: "#eab308",
    clusterBg: "rgba(234, 88, 12, 0.9)",
  },

  neutral: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
  },

  constant: {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
};

// ============================================
// HELPER FUNCTION
// ============================================
export const getThemeColors = (
  mode: ThemeMode,
  systemColorScheme: ColorSchemeName
): SemanticColors => {
  if (mode === "auto") {
    return systemColorScheme === "dark" ? darkColors : lightColors;
  }
  return mode === "dark" ? darkColors : lightColors;
};

// ============================================
// LEGACY COLORS (for backward compatibility)
// Keep this during migration, remove after full migration
// ============================================
export const legacyColors = {
  primary: "#FF6B35",
  primaryLight: "#FF8C42",
  primaryDark: "#D44A1C",
  yellowAccent: "#ffc107",
  secondary: "#FFD24C",
  warning: "#FFD24C",
  text: "#fff",
  textLight: "#e5e5e5",
  textLighter: "#d4d4d4",
  white: "#fff",
  danger: "#E63900",
  black: "#000",
  blackOutline: "#1a1a1a",
  rose: "#ef4444",
  otherBubble: "#FFF1BF",
  myBubble: "#FFE1CC",
  green: "#16a34a",
  success: "#16a34a",
  neutral50: "#fafaf9",
  neutral100: "#f5f5f4",
  neutral200: "#e7e5e4",
  neutral300: "#d6d3d1",
  neutral350: "#CCCCCC",
  neutral400: "#a8a29e",
  neutral500: "#78716c",
  neutral600: "#57534e",
  neutral700: "#44403c",
  neutral800: "#292524",
  neutral900: "#1c1917",
};
