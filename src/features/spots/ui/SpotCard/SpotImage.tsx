import { useTheme } from "@/src/shared/theme";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import { StyleSheet, View } from "react-native";

type SpotImageProps = {
  imageUrl?: string;
};

const SpotImage = ({ imageUrl }: SpotImageProps) => {
  const { colors } = useTheme();

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.spotImage, { backgroundColor: colors.neutral[800] }]}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.spotImagePlaceholder,
        { backgroundColor: colors.neutral[800] },
      ]}
    >
      <Icons.ImageIcon size={48} color={colors.neutral[600]} weight="duotone" />
    </View>
  );
};

export default SpotImage;

const styles = StyleSheet.create({
  spotImage: {
    width: "100%",
    height: 160,
  },
  spotImagePlaceholder: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
});
