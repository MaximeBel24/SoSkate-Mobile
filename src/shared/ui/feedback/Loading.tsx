import { useTheme } from "@/src/shared/theme";
import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

const Loading = ({ size = "large", color }: ActivityIndicatorProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator
        size={size}
        color={color || colors.accent.primaryDark}
      />
    </View>
  );
};

export default Loading;
