import { useTheme } from "@/src/shared/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import { Text, TextProps, TextStyle, Pressable } from "react-native";

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
  numberOfLines?: number;
  onPress?: () => void;
};

const Typo = ({
                size = 16,
                color,
                fontWeight = "400",
                children,
                style,
                textProps = {},
                numberOfLines,
                onPress,
              }: TypoProps) => {
  const { colors } = useTheme();

  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color: color || colors.text.primary,
    fontWeight,
  };

  const textElement = (
      <Text
          style={[textStyle, style]}
          numberOfLines={numberOfLines}
          {...textProps}
      >
        {children}
      </Text>
  );

  if (onPress) {
    return (
        <Pressable onPress={onPress} hitSlop={8}>
          {textElement}
        </Pressable>
    );
  }

  return textElement;
};

export default Typo;