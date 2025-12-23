import { colors } from "@/src/shared/constants/theme";
import { TypoProps } from "@/src/shared/utils/types";
import { verticalScale } from "@/src/shared/utils/styling";
import { StyleSheet, Text, TextStyle } from "react-native";

const Typo = ({
  size = 16,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color,
    fontWeight,
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
