import { spacingY } from "@/src/shared/theme/spacing";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const spots = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Button title="Show Date Picker" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          themeVariant="dark"
        />
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
