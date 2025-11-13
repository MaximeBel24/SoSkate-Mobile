import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

interface DatePickerInputProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  formatDate?: (date: Date) => string;
}

const DatePickerInput = ({
  value,
  onChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(),
  formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
}: DatePickerInputProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(true)}
      >
        <Icons.CalendarIcon
          size={24}
          color={colors.neutral400}
          weight="duotone"
        />
        <Typo size={16} color={colors.white} style={{ flex: 1 }}>
          {formatDate(value)}
        </Typo>
        <Icons.CaretDownIcon
          size={20}
          color={colors.neutral400}
          weight="bold"
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          accentColor={colors.primary}
          textColor={colors.white}
          themeVariant="dark"
        />
      )}
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});
