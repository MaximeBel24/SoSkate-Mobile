import { useTheme } from "@/src/shared/theme";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// ============================================
// TYPES
// ============================================
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  /** URL de l'image ou null pour le placeholder */
  imageUri: string | null;

  /** Nom pour générer le placeholder avec initiales */
  name?: string;

  /** Taille prédéfinie */
  size?: AvatarSize;

  /** Taille personnalisée (override size) */
  customSize?: number;

  /** Afficher le bouton d'édition */
  editable?: boolean;

  /** Callback quand on clique sur le bouton d'édition */
  onEditPress?: () => void;

  /** Afficher un indicateur de chargement */
  loading?: boolean;

  /** Afficher le badge vérifié */
  verified?: boolean;

  /** Style personnalisé pour le container */
  containerStyle?: ViewStyle;
}

// ============================================
// SIZE CONFIG
// ============================================
const SIZES: Record<AvatarSize, number> = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 96,
  xl: 120,
};

const EDIT_BUTTON_SIZES: Record<AvatarSize, number> = {
  xs: 18,
  sm: 24,
  md: 28,
  lg: 34,
  xl: 40,
};

const VERIFIED_BADGE_SIZES: Record<AvatarSize, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 30,
};

// ============================================
// COMPONENT
// ============================================
export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  name = "User",
  size = "lg",
  customSize,
  editable = false,
  onEditPress,
  loading = false,
  verified = false,
  containerStyle,
}) => {
  const { colors } = useTheme();

  // Calcul des dimensions
  const avatarSize = customSize || SIZES[size];
  const editButtonSize = customSize
    ? Math.round(customSize * 0.3)
    : EDIT_BUTTON_SIZES[size];
  const verifiedBadgeSize = customSize
    ? Math.round(customSize * 0.22)
    : VERIFIED_BADGE_SIZES[size];
  const borderWidth = avatarSize > 64 ? 4 : 2;

  // Générer l'URL du placeholder avec initiales
  const placeholderUri = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=FF6B35&color=fff&size=${avatarSize * 2}&bold=true`;

  // URL finale à afficher
  const displayUri = imageUri || placeholderUri;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, containerStyle]}
    >
      {/* Avatar avec bordure */}
      <View
        style={[
          styles.avatarBorder,
          {
            padding: borderWidth,
            borderRadius: avatarSize,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        ]}
      >
        <View
          style={[
            styles.avatarContainer,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: colors.neutral[700],
            },
          ]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent.primary} />
            </View>
          ) : (
            <Image
              source={{ uri: displayUri }}
              style={[
                styles.avatar,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                },
              ]}
              contentFit="cover"
              transition={200}
            />
          )}
        </View>
      </View>

      {/* Bouton d'édition */}
      {editable && !loading && (
        <TouchableOpacity
          onPress={onEditPress}
          style={[
            styles.editButton,
            {
              width: editButtonSize,
              height: editButtonSize,
              borderRadius: editButtonSize / 2,
              backgroundColor: colors.constant.white,
              shadowColor: colors.constant.black,
            },
          ]}
          activeOpacity={0.8}
        >
          <Icons.PencilSimpleIcon
            size={editButtonSize * 0.55}
            color={colors.accent.primary}
            weight="bold"
          />
        </TouchableOpacity>
      )}

      {/* Badge vérifié */}
      {verified && !loading && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: verifiedBadgeSize,
              height: verifiedBadgeSize,
              borderRadius: verifiedBadgeSize / 2,
              backgroundColor: colors.constant.white,
            },
          ]}
        >
          <Icons.CheckCircleIcon
            size={verifiedBadgeSize}
            color="#10b981"
            weight="fill"
          />
        </View>
      )}
    </Animated.View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "center",
  },
  avatarBorder: {
    // padding et borderRadius définis dynamiquement
  },
  avatarContainer: {
    overflow: "hidden",
  },
  avatar: {
    // dimensions définies dynamiquement
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  verifiedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Avatar;
