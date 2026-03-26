import { radius, spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CalendarModal from "@/src/shared/ui/form/CalendarModal";

interface DatePickerInputProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  title?: string;
  formatDate?: (date: Date) => string;
}

const DatePickerInput = ({
  value,
  onChange,
  minimumDate = new Date(1940, 0, 1),
  maximumDate = new Date(),
  placeholder,
  title = "Sélectionner une date",
  formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
}: DatePickerInputProps) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  // Convertir Date en string YYYY-MM-DD pour le calendrier
  const selectedDateString = value
      ? value.toISOString().split("T")[0]
      : undefined;

  // Convertir les limites en string YYYY-MM-DD
  const minDateString = minimumDate.toISOString().split("T")[0];
  const maxDateString = maximumDate.toISOString().split("T")[0];

  const handleSelectDate = (dateString: string) => {
    // dateString est au format YYYY-MM-DD
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    onChange(date);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.datePickerButton,
          {
            backgroundColor: colors.background.subtle,
            borderColor: colors.border.default,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Icons.CalendarIcon
          size={24}
          color={colors.text.muted}
          weight="duotone"
        />
        <Typo
          size={16}
          color={value ? colors.text.primary : colors.text.muted}
          style={{ flex: 1 }}
        >
          {value ? formatDate(value) : placeholder}
        </Typo>
        <Icons.CaretDownIcon
          size={20}
          color={colors.text.muted}
          weight="bold"
        />
      </TouchableOpacity>

      <CalendarModal
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onSelectDate={handleSelectDate}
          selectedDate={selectedDateString}
          minDate={minDateString}
          maxDate={maxDateString}
          title={title}
      />
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
    borderRadius: radius.full,
    borderWidth: 1,
  },
});
