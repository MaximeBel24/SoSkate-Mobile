import { radius, spacingX } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

const Input = (props: InputProps) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? colors.accent.primary
            : colors.border.default,
          backgroundColor: isDark
            ? colors.neutral[100]
            : colors.background.input,
        },
        props.containerStyle,
      ]}
    >
      {props.icon}
      <TextInput
        style={[styles.input, { color: colors.text.primary }, props.inputStyle]}
        placeholderTextColor={colors.text.muted}
        ref={props.inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(56),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: radius.full,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    fontSize: verticalScale(14),
  },
});
