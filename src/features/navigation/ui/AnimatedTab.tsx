import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import TabIcon from "./TabIcon";

type AnimatedTabProps = {
  route: any;
  isFocused: boolean;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
};

const LABEL_MAP: Record<string, string> = {
  index: "Accueil",
  map: "Carte",
  spots: "Spots",
  profile: "Profil",
};

const AnimatedTab = ({
  route,
  isFocused,
  label,
  onPress,
  onLongPress,
}: AnimatedTabProps) => {
  const { colors } = useTheme();

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isFocused ? 1 : 0, { damping: 15 }),
    transform: [{ scale: withSpring(isFocused ? 1 : 0.8, { damping: 15 }) }],
  }));

  const displayLabel = LABEL_MAP[label] || label;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}
      activeOpacity={0.7}
    >
      <View style={styles.tabContent}>
        {/* Background actif avec gradient */}
        <Animated.View
          style={[styles.activeBackground, animatedBackgroundStyle]}
        >
          <LinearGradient
            colors={[colors.accent.primary, colors.accent.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeGradient}
          />
        </Animated.View>

        {/* Icône */}
        <View style={styles.iconContainer}>
          <TabIcon name={route.name} isFocused={isFocused} />
        </View>

        {/* Label animé */}
        {isFocused ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Typo size={12} fontWeight="700" color={colors.accent.primary}>
              {displayLabel}
            </Typo>
          </Animated.View>
        ) : (
          <View
            style={[
              styles.dotIndicator,
              { backgroundColor: colors.neutral[600] },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AnimatedTab;

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: spacingY._8,
    paddingHorizontal: spacingX._12,
    minWidth: 70,
  },
  activeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  activeGradient: {
    flex: 1,
    opacity: 0.15,
  },
  iconContainer: {
    marginBottom: 4,
  },
  dotIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
