import { useTheme } from "@/src/shared/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import { TypoProps } from "@/src/shared/utils/types";
import { Text, TextStyle } from "react-native";

const Typo = ({
  size = 16,
  color,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const { colors } = useTheme();

  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color: color || colors.text.primary,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
