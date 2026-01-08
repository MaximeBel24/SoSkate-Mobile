import { useTheme } from "@/src/shared/theme";
import * as Icons from "phosphor-react-native";
import { JSX } from "react";
import { Image } from "react-native";

type TabIconProps = {
  name: string;
  isFocused: boolean;
};

const TabIcon = ({ name, isFocused }: TabIconProps) => {
  const { colors } = useTheme();

  const iconSize = 26;
  const iconColor = isFocused ? colors.accent.primary : colors.neutral[400];
  const weight = isFocused ? "fill" : "regular";

  const icons: Record<string, JSX.Element> = {
    index: (
      <Image
        source={require("@/assets/images/soskate_logo_mobile.png")}
        style={{
          width: 35,
          height: 35,
        }}
        resizeMode="contain"
      />
    ),
    map: <Icons.MapPinIcon size={iconSize} color={iconColor} weight={weight} />,
    spots: (
      <Icons.CompassIcon size={iconSize} color={iconColor} weight={weight} />
    ),
    profile: (
      <Icons.UserCircleIcon size={iconSize} color={iconColor} weight={weight} />
    ),
  };

  return icons[name] || icons.index;
};

export default TabIcon;
