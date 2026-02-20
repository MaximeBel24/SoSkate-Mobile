// ============================================
// SOSKATE - JEST SETUP
// ============================================
// Global mocks for native modules unavailable in Jest

// --- expo-secure-store ---
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// --- @react-native-async-storage/async-storage ---
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

// --- expo-haptics ---
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "Light", Medium: "Medium", Heavy: "Heavy" },
  NotificationFeedbackType: {
    Success: "Success",
    Warning: "Warning",
    Error: "Error",
  },
}));

// --- react-native-reanimated ---
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// --- expo-router ---
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  Redirect: jest.fn(() => null),
  useLocalSearchParams: jest.fn(() => ({})),
}));

// --- logger ---
jest.mock("@/src/shared/utils/logger", () => ({
  logger: {
    dev: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// --- theme ---
jest.mock("@/src/shared/theme", () => ({
  useTheme: jest.fn(() => ({
    colors: {
      accent: {
        primary: "#FF6B35",
        primaryLight: "#FF8C42",
        primaryDark: "#D44A1C",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#A0A0A0",
        muted: "#666666",
      },
      background: { surface: "#1A1A1A" },
      border: { default: "#333333" },
      constant: { white: "#FFFFFF" },
      semantic: {
        danger: "#E63900",
        dangerBg: "#3D1010",
        success: "#16a34a",
        successBg: "#103D1A",
        warning: "#FFD24C",
        warningBg: "#3D3410",
      },
      neutral: {
        200: "#e7e5e4",
        600: "#57534e",
      },
    },
    mode: "dark",
  })),
  useThemeColors: jest.fn(() => ({})),
  useIsDarkTheme: jest.fn(() => true),
  useMapStyle: jest.fn(() => []),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// --- styling utils ---
jest.mock("@/src/shared/utils/styling", () => ({
  scale: (size: number) => size,
  verticalScale: (size: number) => size,
}));

// --- phosphor-react-native ---
jest.mock("phosphor-react-native", () => {
  const React = require("react");
  const MockIcon = (props: any) =>
    React.createElement("View", { testID: `icon-${props.name || "mock"}` });
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop === "string" && prop !== "__esModule") {
          return MockIcon;
        }
        return undefined;
      },
    },
  );
});
