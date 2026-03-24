// ============================================
// SOSKATE - IMAGE VIEWER MODAL
// ============================================
// Modal fullscreen pour visualiser une photo avec swipe entre photos

import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// ============================================
// TYPES
// ============================================
interface ImageItem {
    id: number;
    url: string;
    thumbnailUrl?: string;
}

interface ImageViewerModalProps {
    visible: boolean;
    images: ImageItem[];
    initialIndex?: number;
    onClose: () => void;
}

// ============================================
// CONSTANTS
// ============================================
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============================================
// COMPONENT
// ============================================
const ImageViewerModal = ({
                              visible,
                              images,
                              initialIndex = 0,
                              onClose,
                          }: ImageViewerModalProps) => {
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(index);
    };

    const renderImage = ({ item }: { item: ImageItem }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item.url }}
                style={styles.fullImage}
                contentFit="contain"
                transition={200}
            />
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Header */}
                <Animated.View
                    entering={FadeIn.delay(200)}
                    exiting={FadeOut}
                    style={[styles.header, { paddingTop: insets.top + 8 }]}
                >
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                        hitSlop={12}
                    >
                        <Icons.XIcon size={24} color="#fff" weight="bold" />
                    </TouchableOpacity>

                    {images.length > 1 && (
                        <View style={styles.counter}>
                            <Icons.ImagesIcon size={16} color="rgba(255,255,255,0.7)" />
                            <Animated.Text style={styles.counterText}>
                                {currentIndex + 1} / {images.length}
                            </Animated.Text>
                        </View>
                    )}
                </Animated.View>

                {/* Image Carousel */}
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderImage}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    initialScrollIndex={initialIndex}
                    getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                />
            </View>
        </Modal>
    );
};

export default ImageViewerModal;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    counter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    counterText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
    },
});
