import { spacingY } from "@/src/shared/theme/spacing";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "@/src/shared/ui/typography/Typo";

const spots = () => {

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Typo>Spot</Typo>
      </View>
    </ScreenWrapper>
  );
};

export default spots;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacingY._12,
  },
});
