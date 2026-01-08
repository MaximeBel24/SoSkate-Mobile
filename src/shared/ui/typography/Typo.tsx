import { useTheme } from "@/src/shared/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import { Text, TextProps, TextStyle } from "react-native";

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
  numberOfLines?: number;
};

const Typo = ({
                size = 16,
                color,
                fontWeight = "400",
                children,
                style,
                textProps = {},
                numberOfLines,
              }: TypoProps) => {
  const { colors } = useTheme();

  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color: color || colors.text.primary,
    fontWeight,
  };

  return (
      <Text
          style={[textStyle, style]}
          numberOfLines={numberOfLines}
          {...textProps}
      >
        {children}
      </Text>
  );
};

export default Typo;