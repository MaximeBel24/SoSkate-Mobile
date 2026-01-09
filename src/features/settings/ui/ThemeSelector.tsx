import { ThemeMode, useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import * as Haptics from "expo-haptics";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ThemeOption = {
  mode: ThemeMode;
  label: string;
  icon: React.ReactNode;
  description: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ThemeOptionCardProps = {
  option: ThemeOption;
  isSelected: boolean;
  onSelect: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
  index: number;
};

const ThemeOptionCard: React.FC<ThemeOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  colors,
  index,
}) => {
  // Animation values
  const selected = useDerivedValue(() => (isSelected ? 1 : 0), [isSelected]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      selected.value,
      [0, 1],
      [colors.background.surface, colors.accent.primary + "20"]
    );

    const borderColor = interpolateColor(
      selected.value,
      [0, 1],
      [colors.border.default, colors.accent.primary]
    );

    return {
      backgroundColor: withTiming(backgroundColor, { duration: 200 }),
      borderColor: withTiming(borderColor, { duration: 200 }),
      transform: [
        {
          scale: withSpring(isSelected ? 1.02 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isSelected ? 1 : 0, { damping: 15 }),
    transform: [
      {
        scale: withSpring(isSelected ? 1 : 0.5, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.optionCard, animatedContainerStyle]}
      entering={FadeIn.delay(100 * index).duration(300)}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSelected
              ? colors.accent.primary
              : colors.neutral[700],
          },
        ]}
      >
        {option.icon}
      </View>

      {/* Content */}
      <View style={styles.optionContent}>
        <Typo
          size={16}
          fontWeight="600"
          color={isSelected ? colors.accent.primary : colors.text.primary}
        >
          {option.label}
        </Typo>
        <Typo size={13} color={colors.text.secondary} style={{ marginTop: 2 }}>
          {option.description}
        </Typo>
      </View>

      {/* Check indicator */}
      <Animated.View style={[styles.checkContainer, animatedCheckStyle]}>
        <View
          style={[
            styles.checkCircle,
            { backgroundColor: colors.accent.primary },
          ]}
        >
          <Icons.CheckIcon
            size={14}
            color={colors.constant.white}
            weight="bold"
          />
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
};

type ThemeSelectorProps = {
  title?: string;
  showDescription?: boolean;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  title = "Apparence",
  showDescription = true,
}) => {
  const { colors, themeMode, setThemeMode, activeTheme } = useTheme();

  // Theme options configuration
  const themeOptions: ThemeOption[] = [
    {
      mode: "dark",
      label: "Sombre",
      icon: (
        <Icons.MoonIcon size={22} color={colors.constant.white} weight="fill" />
      ),
      description: "Thème sombre pour les sessions nocturnes",
    },
    {
      mode: "light",
      label: "Clair",
      icon: (
        <Icons.SunIcon size={22} color={colors.constant.white} weight="fill" />
      ),
      description: "Thème lumineux pour une meilleure lisibilité",
    },
    {
      mode: "auto",
      label: "Automatique",
      icon: (
        <Icons.DeviceMobileIcon
          size={22}
          color={colors.constant.white}
          weight="fill"
        />
      ),
      description: `Suit le thème système (${
        activeTheme === "dark" ? "sombre" : "clair"
      })`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Section title */}
      {!title && (
        <View style={styles.header}>
          <Typo size={18} fontWeight="700" color={colors.text.primary}>
            {title}
          </Typo>
          {showDescription && (
            <Typo size={13} color={colors.text.muted} style={{ marginTop: 4 }}>
              Personnalisez l'apparence de l'application
            </Typo>
          )}
        </View>
      )}

      {/* Theme options */}
      <View style={styles.optionsContainer}>
        {themeOptions.map((option, index) => (
          <ThemeOptionCard
            key={option.mode}
            option={option}
            isSelected={themeMode === option.mode}
            onSelect={() => setThemeMode(option.mode)}
            colors={colors}
            index={index}
          />
        ))}
      </View>

      {/* Current theme indicator */}
      <Animated.View
        style={[styles.currentTheme, { backgroundColor: colors.ui.badge }]}
        entering={FadeIn.delay(400).duration(300)}
      >
        <Icons.PaletteIcon
          size={16}
          color={colors.accent.primary}
          weight="duotone"
        />
        <Typo size={12} color={colors.text.secondary} style={{ marginLeft: 8 }}>
          Thème actif : {activeTheme === "dark" ? "Sombre" : "Clair"}
        </Typo>
      </Animated.View>
    </View>
  );
};

export default ThemeSelector;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    marginBottom: verticalScale(16),
  },
  optionsContainer: {
    gap: verticalScale(12),
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: scale(16),
    borderWidth: 2,
  },
  iconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
    marginLeft: scale(14),
  },
  checkContainer: {
    marginLeft: scale(8),
  },
  checkCircle: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  currentTheme: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(16),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(10),
  },
});
