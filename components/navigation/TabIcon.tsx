import { colors } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { JSX } from "react";

type TabIconProps = {
  name: string;
  isFocused: boolean;
};

const TabIcon = ({ name, isFocused }: TabIconProps) => {
  const iconSize = 26;
  const iconColor = isFocused ? colors.primary : colors.neutral400;
  const weight = isFocused ? "fill" : "regular";

  const icons: Record<string, JSX.Element> = {
    index: (
      <Icons.HouseIcon size={iconSize} color={iconColor} weight={weight} />
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