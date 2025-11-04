import { useNavigation } from "@/contexts/NavigationContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import AnimatedTab from "./AnimatedTab";
import TabBarContainer from "./TabBarContainer";

const CustomTabs = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { isTabBarVisible } = useNavigation();

  if (!isTabBarVisible) {
    return null;
  }

  return (
    <TabBarContainer>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <AnimatedTab
            key={route.key}
            route={route}
            isFocused={isFocused}
            label={label as string}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </TabBarContainer>
  );
};

export default CustomTabs;
