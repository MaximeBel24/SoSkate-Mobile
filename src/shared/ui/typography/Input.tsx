import { radius, spacingX } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle, TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import * as Icons from "phosphor-react-native";

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

const Input = (props: InputProps) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? colors.accent.primary
            : colors.border.default,
          backgroundColor: isDark
            ? colors.neutral[800]
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
          secureTextEntry={props.secureTextEntry && !passwordVisible}
      />
      {props.secureTextEntry && (
          <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              hitSlop={8}
          >
            {passwordVisible ? (
                <Icons.EyeIcon
                    size={verticalScale(20)}
                    color={colors.text.muted}
                    weight="duotone"
                />
            ) : (
                <Icons.EyeSlashIcon
                    size={verticalScale(20)}
                    color={colors.text.muted}
                    weight="duotone"
                />
            )}
          </TouchableOpacity>
      )}
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
