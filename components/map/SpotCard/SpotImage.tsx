import { colors } from "@/constants/theme";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import { StyleSheet, View } from "react-native";

type SpotImageProps = {
  imageUrl?: string;
};

const SpotImage = ({ imageUrl }: SpotImageProps) => {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.spotImage}
        contentFit="cover"
      />
    );
  }

  return (
    <View style={styles.spotImagePlaceholder}>
      <Icons.ImageIcon size={48} color={colors.neutral600} weight="duotone" />
    </View>
  );
};

export default SpotImage;

const styles = StyleSheet.create({
  spotImage: {
    width: "100%",
    height: 160,
    backgroundColor: colors.neutral800,
  },
  spotImagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
  },
});
