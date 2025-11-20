import { colors } from "@/constants/theme";
import { Photo } from "@/interfaces/photo.interface";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type PhotoGalleryProps = {
  photos: Photo[];
  height?: number;
  borderRadius?: number;
  showIndicators?: boolean;
  onPhotoPress?: (photo: Photo, index: number) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PhotoGallery = ({
  photos,
  height = 200,
  borderRadius = 0,
  showIndicators = true,
  onPhotoPress,
}: PhotoGalleryProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cas : pas de photos
  if (!photos || photos.length === 0) {
    return (
      <View style={[styles.placeholder, { height, borderRadius }]}>
        <Icons.ImageIcon size={48} color={colors.neutral600} weight="duotone" />
      </View>
    );
  }

  // Cas : une seule photo
  if (photos.length === 1) {
    return (
      <TouchableOpacity
        activeOpacity={onPhotoPress ? 0.8 : 1}
        onPress={() => onPhotoPress?.(photos[0], 0)}
        disabled={!onPhotoPress}
      >
        <Image
          source={{ uri: photos[0].thumbnailUrl || photos[0].url }}
          style={[styles.image, { height, borderRadius }]}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>
    );
  }

  // Cas : plusieurs photos (carrousel)
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
    <TouchableOpacity
      activeOpacity={onPhotoPress ? 0.8 : 1}
      onPress={() => onPhotoPress?.(item, index)}
      disabled={!onPhotoPress}
      style={{ width: SCREEN_WIDTH }}
    >
      <Image
        source={{ uri: item.thumbnailUrl || item.url }}
        style={[styles.image, { height, borderRadius }]}
        contentFit="cover"
        transition={200}
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      />

      {/* Indicateurs de pagination */}
      {showIndicators && photos.length > 1 && (
        <View style={styles.indicatorContainer}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default PhotoGallery;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    backgroundColor: colors.neutral800,
  },
  placeholder: {
    width: "100%",
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  indicatorActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});
