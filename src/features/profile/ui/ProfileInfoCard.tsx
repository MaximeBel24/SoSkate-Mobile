import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { verticalScale } from "@/src/shared/utils/styling";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ProfileStats {
  coursesCount?: number;
  favoritesCount?: number;
  level?: number;
}

interface ProfileInfoCardProps {
  name: string;
  email: string;
  avatarUri: string;
  isVerified?: boolean;
  onEditPress: () => void;
  stats?: ProfileStats;
  animationDelay?: number;
}

export const ProfileInfoCard = ({
  name,
  email,
  avatarUri,
  isVerified = false,
  onEditPress,
  stats,
  animationDelay = 100,
}: ProfileInfoCardProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay).springify()}
      style={[styles.userCard, { shadowColor: colors.accent.primary }]}
    >
      <LinearGradient
        colors={[colors.accent.primary, colors.accent.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.userCardGradient}
      >
        {/* Background pattern décoratif */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.userInfo}>
          {/* Avatar avec bordure animée */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: avatarUri }}
                style={[
                  styles.avatar,
                  { backgroundColor: colors.neutral[700] },
                ]}
                contentFit="cover"
                transition={100}
              />
            </View>

            {/* Edit button */}
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.constant.white },
              ]}
              onPress={onEditPress}
            >
              <Icons.PencilSimpleIcon
                size={18}
                color={colors.accent.primary}
                weight="bold"
              />
            </TouchableOpacity>

            {/* Badge vérifié */}
            {isVerified && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.constant.white },
                ]}
              >
                <Icons.CheckCircleIcon
                  size={24}
                  color="#10b981"
                  weight="fill"
                />
              </View>
            )}
          </View>

          {/* Name & email */}
          <View style={styles.nameContainer}>
            <Typo size={26} fontWeight="900" color={colors.constant.white}>
              {name}
            </Typo>
            <Typo size={15} color="rgba(255, 255, 255, 0.8)">
              {email}
            </Typo>
          </View>

          {/* Stats (optionnel) */}
          {stats && (
            <View style={styles.statsContainer}>
              {stats.coursesCount !== undefined && (
                <>
                  <View style={styles.statItem}>
                    <Icons.CalendarCheckIcon
                      size={20}
                      color={colors.constant.white}
                      weight="duotone"
                    />
                    <Typo
                      size={18}
                      fontWeight="700"
                      color={colors.constant.white}
                    >
                      {stats.coursesCount}
                    </Typo>
                    <Typo size={12} color="rgba(255, 255, 255, 0.7)">
                      Cours suivis
                    </Typo>
                  </View>
                  <View style={styles.statDivider} />
                </>
              )}

              {stats.favoritesCount !== undefined && (
                <>
                  <View style={styles.statItem}>
                    <Icons.HeartIcon
                      size={20}
                      color={colors.constant.white}
                      weight="duotone"
                    />
                    <Typo
                      size={18}
                      fontWeight="700"
                      color={colors.constant.white}
                    >
                      {stats.favoritesCount}
                    </Typo>
                    <Typo size={12} color="rgba(255, 255, 255, 0.7)">
                      Spots favoris
                    </Typo>
                  </View>
                  <View style={styles.statDivider} />
                </>
              )}

              {stats.level !== undefined && (
                <View style={styles.statItem}>
                  <Icons.TrophyIcon
                    size={20}
                    color={colors.constant.white}
                    weight="duotone"
                  />
                  <Typo
                    size={18}
                    fontWeight="700"
                    color={colors.constant.white}
                  >
                    {stats.level}
                  </Typo>
                  <Typo size={12} color="rgba(255, 255, 255, 0.7)">
                    Niveau
                  </Typo>
                </View>
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    marginTop: spacingY._20,
    borderRadius: 24,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  userCardGradient: {
    padding: spacingX._20,
    paddingVertical: spacingY._30,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  userInfo: {
    alignItems: "center",
    gap: spacingY._20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 200,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  avatar: {
    height: verticalScale(120),
    width: verticalScale(120),
    borderRadius: 200,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  verifiedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 50,
    padding: 2,
  },
  nameContainer: {
    alignItems: "center",
    gap: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: spacingY._12,
    paddingTop: spacingY._20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
