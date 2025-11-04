import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const accountOptions: accountOptionType[] = [
    {
      title: "Éditer le profil",
      icon: (
        <Icons.UserCircleIcon size={24} color={colors.white} weight="duotone" />
      ),
      routeName: "/(modals)/profileModal",
      bgColor: colors.primary,
    },
    {
      title: "Mes réservations",
      icon: (
        <Icons.CalendarCheckIcon
          size={24}
          color={colors.white}
          weight="duotone"
        />
      ),
      // routeName: "/(modals)/bookingsModal",
      bgColor: "#8b5cf6",
    },
    {
      title: "Mes spots favoris",
      icon: <Icons.HeartIcon size={24} color={colors.white} weight="duotone" />,
      // routeName: "/(modals)/favoritesModal",
      bgColor: "#ec4899",
    },
    {
      title: "Paramètres",
      icon: (
        <Icons.GearSixIcon size={24} color={colors.white} weight="duotone" />
      ),
      // routeName: "/(modals)/settingsModal",
      bgColor: "#06b6d4",
    },
    {
      title: "Politique de confidentialité",
      icon: (
        <Icons.ShieldCheckIcon
          size={24}
          color={colors.white}
          weight="duotone"
        />
      ),
      // routeName: "/(modals)/privacyModal",
      bgColor: "#10b981",
    },
    {
      title: "Aide & Support",
      icon: (
        <Icons.QuestionIcon size={24} color={colors.white} weight="duotone" />
      ),
      // routeName: "/(modals)/helpModal",
      bgColor: "#f59e0b",
    },
    {
      title: "Déconnexion",
      icon: (
        <Icons.SignOutIcon size={24} color={colors.white} weight="duotone" />
      ),
      bgColor: "#ef4444",
    },
  ];

  const handleLogout = async () => {
    // await signOut(auth);
    router.replace("/(auth)/login");
  };

  const showLogoutAlert = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        onPress: () => console.log("Cancel logout"),
        style: "cancel",
      },
      {
        text: "Se déconnecter",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const handlePress = async (item: accountOptionType) => {
    if (item.title === "Déconnexion") {
      showLogoutAlert();
      return;
    }

    if (item.routeName) {
      router.push(item.routeName);
    } else {
      Alert.alert(
        "Bientôt disponible",
        "Cette fonctionnalité arrive prochainement !"
      );
    }
  };

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.2}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacingY._20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <Header title="Profil" style={{ marginVertical: spacingY._10 }} />

          {/* User Info Card */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.userCard}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userCardGradient}
            >
              {/* Background pattern decoratif */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />

              <View style={styles.userInfo}>
                {/* Avatar avec bordure animée */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarBorder}>
                    <Image
                      source={{ uri: "https://i.pravatar.cc/300?img=12" }}
                      style={styles.avatar}
                      contentFit="cover"
                      transition={100}
                    />
                  </View>

                  {/* Edit button */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push("/(modals)/profileModal")}
                  >
                    <Icons.PencilSimpleIcon
                      size={18}
                      color={colors.primary}
                      weight="bold"
                    />
                  </TouchableOpacity>

                  {/* Badge vérifié */}
                  <View style={styles.verifiedBadge}>
                    <Icons.CheckCircleIcon
                      size={24}
                      color="#10b981"
                      weight="fill"
                    />
                  </View>
                </View>

                {/* Name & email */}
                <View style={styles.nameContainer}>
                  <Typo size={26} fontWeight="900" color={colors.white}>
                    Jean Dupont
                  </Typo>
                  <Typo size={15} color="rgba(255, 255, 255, 0.8)">
                    jean.dupont@email.com
                  </Typo>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Icons.CalendarCheckIcon
                      size={20}
                      color={colors.white}
                      weight="duotone"
                    />
                    <Typo size={18} fontWeight="700" color={colors.white}>
                      12
                    </Typo>
                    <Typo size={12} color="rgba(255, 255, 255, 0.7)">
                      Cours suivis
                    </Typo>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Icons.HeartIcon
                      size={20}
                      color={colors.white}
                      weight="duotone"
                    />
                    <Typo size={18} fontWeight="700" color={colors.white}>
                      8
                    </Typo>
                    <Typo size={12} color="rgba(255, 255, 255, 0.7)">
                      Spots favoris
                    </Typo>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Icons.TrophyIcon
                      size={20}
                      color={colors.white}
                      weight="duotone"
                    />
                    <Typo size={18} fontWeight="700" color={colors.white}>
                      5
                    </Typo>
                    <Typo size={12} color="rgba(255, 255, 255, 0.7)">
                      Niveau
                    </Typo>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Section title */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={styles.sectionHeader}
          >
            <Typo size={18} fontWeight="700" color={colors.white}>
              Mon compte
            </Typo>
            <Typo size={14} color={colors.neutral400}>
              Gérez vos paramètres et préférences
            </Typo>
          </Animated.View>

          {/* Account options */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.accountOptions}
          >
            {accountOptions.map((item, index) => {
              const isLastItem = index === accountOptions.length - 1;
              const isLogout = item.title === "Déconnexion";

              return (
                <Animated.View
                  key={index.toString()}
                  entering={FadeInUp.delay(350 + index * 50).springify()}
                >
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      isLogout && styles.logoutItem,
                      !isLastItem && styles.listItemBorder,
                    ]}
                    onPress={() => handlePress(item)}
                    activeOpacity={0.7}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        styles.listIcon,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      {item.icon}
                    </View>

                    {/* Title */}
                    <Typo
                      size={16}
                      style={styles.listTitle}
                      fontWeight="600"
                      color={isLogout ? "#ef4444" : colors.white}
                    >
                      {item.title}
                    </Typo>

                    {/* Arrow */}
                    <Icons.CaretRightIcon
                      size={20}
                      weight="bold"
                      color={isLogout ? "#ef4444" : colors.neutral400}
                    />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Version info */}
          <Animated.View
            entering={FadeInUp.delay(800).springify()}
            style={styles.versionContainer}
          >
            <Typo
              size={12}
              color={colors.neutral500}
              style={{ textAlign: "center" }}
            >
              SoSkate v1.0.0
            </Typo>
            <Typo
              size={12}
              color={colors.neutral500}
              style={{ textAlign: "center" }}
            >
              Made with 🛹 in France
            </Typo>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Gradient bottom */}
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.3)"]}
        style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
        pointerEvents="none"
      />
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userCard: {
    marginTop: spacingY._20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: colors.primary,
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
    backgroundColor: colors.neutral700,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
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
  sectionHeader: {
    marginTop: spacingY._30,
    marginBottom: spacingY._16,
    gap: 4,
  },
  accountOptions: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._14,
    paddingVertical: spacingY._16,
    paddingHorizontal: spacingX._16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  logoutItem: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  listIcon: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    flex: 1,
  },
  versionContainer: {
    marginTop: spacingY._30,
    marginBottom: spacingY._20,
    gap: 4,
    alignItems: "center",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
