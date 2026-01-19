import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Avatar from "@/src/shared/ui/media/Avatar";
import Typo from "@/src/shared/ui/typography/Typo";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// ============================================
// TYPES
// ============================================
interface ProfileStats {
  coursesCount?: number;
  favoritesCount?: number;
  level?: number;
}

interface ProfileInfoCardProps {
  /** Nom complet de l'utilisateur */
  name: string;
  /** Email de l'utilisateur */
  email: string;
  /** URL de l'avatar ou null pour placeholder */
  avatarUri: string | null;
  /** Afficher le badge vérifié (instructeurs) */
  isVerified?: boolean;
  /** Callback quand on clique sur le bouton d'édition */
  onEditPress: () => void;
  /** Statistiques optionnelles */
  stats?: ProfileStats;
  /** Délai d'animation */
  animationDelay?: number;
  /** Avatar en cours de chargement */
  isLoadingAvatar?: boolean;
}

// ============================================
// COMPONENT
// ============================================
export const ProfileInfoCard = ({
  name,
  email,
  avatarUri,
  isVerified = false,
  onEditPress,
  stats,
  animationDelay = 100,
  isLoadingAvatar = false,
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
          {/* Avatar avec composant réutilisable */}
          <Avatar
            imageUri={avatarUri}
            name={name}
            size="xl"
            editable
            onEditPress={onEditPress}
            loading={isLoadingAvatar}
            verified={isVerified}
          />

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
          {/*{stats && (*/}
          {/*    <View style={styles.statsContainer}>*/}
          {/*      {stats.coursesCount !== undefined && (*/}
          {/*          <>*/}
          {/*            <View style={styles.statItem}>*/}
          {/*              <Icons.CalendarCheck*/}
          {/*                  size={20}*/}
          {/*                  color={colors.constant.white}*/}
          {/*                  weight="duotone"*/}
          {/*              />*/}
          {/*              <Typo*/}
          {/*                  size={18}*/}
          {/*                  fontWeight="700"*/}
          {/*                  color={colors.constant.white}*/}
          {/*              >*/}
          {/*                {stats.coursesCount}*/}
          {/*              </Typo>*/}
          {/*              <Typo size={12} color="rgba(255, 255, 255, 0.7)">*/}
          {/*                Cours suivis*/}
          {/*              </Typo>*/}
          {/*            </View>*/}
          {/*            <View style={styles.statDivider} />*/}
          {/*          </>*/}
          {/*      )}*/}

          {/*      {stats.favoritesCount !== undefined && (*/}
          {/*          <>*/}
          {/*            <View style={styles.statItem}>*/}
          {/*              <Icons.Heart*/}
          {/*                  size={20}*/}
          {/*                  color={colors.constant.white}*/}
          {/*                  weight="duotone"*/}
          {/*              />*/}
          {/*              <Typo*/}
          {/*                  size={18}*/}
          {/*                  fontWeight="700"*/}
          {/*                  color={colors.constant.white}*/}
          {/*              >*/}
          {/*                {stats.favoritesCount}*/}
          {/*              </Typo>*/}
          {/*              <Typo size={12} color="rgba(255, 255, 255, 0.7)">*/}
          {/*                Spots favoris*/}
          {/*              </Typo>*/}
          {/*            </View>*/}
          {/*            <View style={styles.statDivider} />*/}
          {/*          </>*/}
          {/*      )}*/}

          {/*      {stats.level !== undefined && (*/}
          {/*          <View style={styles.statItem}>*/}
          {/*            <Icons.Trophy*/}
          {/*                size={20}*/}
          {/*                color={colors.constant.white}*/}
          {/*                weight="duotone"*/}
          {/*            />*/}
          {/*            <Typo*/}
          {/*                size={18}*/}
          {/*                fontWeight="700"*/}
          {/*                color={colors.constant.white}*/}
          {/*            >*/}
          {/*              {stats.level}*/}
          {/*            </Typo>*/}
          {/*            <Typo size={12} color="rgba(255, 255, 255, 0.7)">*/}
          {/*              Niveau*/}
          {/*            </Typo>*/}
          {/*          </View>*/}
          {/*      )}*/}
          {/*    </View>*/}
          {/*)}*/}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// ============================================
// STYLES
// ============================================
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

export default ProfileInfoCard;
