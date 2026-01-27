import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarContainerProps = {
  children: ReactNode;
};

const TabBarContainer = ({ children }: TabBarContainerProps) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          backgroundColor: colors.ui.tabBar,
        },
      ]}
    >
      <View
        style={[styles.topBorder, { backgroundColor: colors.accent.primary }]}
      />
      <View style={styles.tabBar}>{children}</View>
    </View>
  );
};

export default TabBarContainer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.3,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: spacingX._12,
    paddingTop: spacingY._12,
  },
});
