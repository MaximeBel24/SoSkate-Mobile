import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

const Profile = () => {
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Editer le profile",
      icon: <Icons.UserIcon size={26} color={colors.white} weight={"fill"} />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Paramètres",
      icon: (
        <Icons.GearSixIcon size={26} color={colors.white} weight={"fill"} />
      ),
      // routeName: "/(modals)/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Politique de confidentialité",
      icon: <Icons.LockIcon size={26} color={colors.white} weight={"fill"} />,
      // routeName: "/(modals)/profileModal",
      bgColor: colors.neutral600,
    },
    {
      title: "Déconnexion",
      icon: <Icons.PowerIcon size={26} color={colors.white} weight={"fill"} />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#e11d48",
    },
  ];

  const handleLogout = async () => {
    // await signOut(auth);
  };

  const showLogoutAlert = () => {
    Alert.alert("Confirmation", "Êtes vous sûr de vouloir vous déconnectez ?", [
      {
        text: "Annulez",
        onPress: () => console.log("Cancel logout"),
        style: "cancel",
      },
      {
        text: "Se deconnectez",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const handlePress = async (item: accountOptionType) => {
    if (item.title === "Déconnexion") {
      showLogoutAlert();
    }

    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container]}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* user info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            {/* user image */}
            <Image
              // source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit={"cover"}
              transition={100}
            />
          </View>
          {/* name & email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {/*{user?.name}*/}Nom
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {/*{user?.email}*/}Email
            </Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <View style={styles.listItem} key={index.toString()}>
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  {/* icon */}
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item.title}
                  </Typo>
                  <Icons.CaretRightIcon
                    size={verticalScale(20)}
                    weight={"bold"}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    // overflow: "hidden",
    // position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
