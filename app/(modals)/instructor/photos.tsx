import React, {useCallback, useState} from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "@/src/shared/theme";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import { useInstructorPhotos } from "@/src/features/profile/hooks/useInstructorPhotos";
import { PhotoResponse } from "@/src/shared/types/photo.interface";
import ImageViewerModal from "@/src/shared/ui/media/ImageViewerModal";

const NUM_COLUMNS = 3;
const GRID_GAP = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - spacingX._20 * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function InstructorPhotosScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const {
        photos,
        isLoading,
        isUploading,
        loadPhotos,
        handleAddPhoto,
        handleDeletePhoto,
    } = useInstructorPhotos();

    // Charger les photos au focus
    useFocusEffect(
        useCallback(() => {
            loadPhotos();
        }, [loadPhotos]),
    );

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleAdd = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleAddPhoto();
    };

    const handleDelete = (photoId: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        handleDeletePhoto(photoId);
    };

    const handlePhotoPress = (index: number) => {
        setViewerIndex(index);
        setViewerVisible(true);
    };


    const renderPhoto = ({ item, index }: { item: PhotoResponse; index: number }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 50).springify()}
            style={[
                styles.photoContainer,
                {
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    marginRight: (index + 1) % NUM_COLUMNS === 0 ? 0 : GRID_GAP,
                    marginBottom: GRID_GAP,
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePhotoPress(index)}
            >
                <Image
                    source={{ uri: item.thumbnailUrl || item.url }}
                    style={styles.photo}
                    contentFit="cover"
                    transition={200}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
                onPress={() => handleDelete(item.id)}
                hitSlop={8}
            >
                <Icons.XIcon size={14} color="#fff" weight="bold" />
            </TouchableOpacity>
        </Animated.View>
    );


    const renderEmpty = () => {
        if (isLoading) return null;

        return (
            <View style={styles.emptyContainer}>
                <Icons.CameraIcon size={64} color={colors.text.muted} weight="duotone" />
                <Typo
                    size={18}
                    fontWeight="700"
                    color={colors.text.secondary}
                    style={{ marginTop: spacingY._16, textAlign: "center" }}
                >
                    Aucune photo pour le moment
                </Typo>
                <Typo
                    size={14}
                    color={colors.text.muted}
                    style={{ marginTop: spacingY._8, textAlign: "center" }}
                >
                    Ajoutez des photos de vos cours et tricks pour attirer de nouveaux élèves !
                </Typo>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.counterContainer}>
            <Typo size={13} color={colors.text.muted}>
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </Typo>
        </View>
    );

    return (
        <ScreenWrapper>
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: insets.top,
                        backgroundColor: colors.background.primary,
                    },
                ]}
            >
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.header}
                >
                    <TouchableOpacity
                        onPress={handleClose}
                        style={[styles.backButton, { borderColor: colors.border.default }]}
                    >
                        <Icons.CaretLeftIcon
                            size={28}
                            color={colors.text.primary}
                            weight="bold"
                        />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <View style={styles.headerTextContainer}>
                            <Typo size={24} fontWeight="900" color={colors.text.primary}>
                                Mes photos
                            </Typo>
                            <Typo size={14} color={colors.text.muted}>
                                Gérez votre galerie photo
                            </Typo>
                        </View>

                        <TouchableOpacity
                            onPress={handleAdd}
                            disabled={isUploading}
                            style={[
                                styles.addButton,
                                { backgroundColor: colors.accent.primary },
                            ]}
                        >
                            {isUploading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Icons.PlusIcon size={22} color="#fff" weight="bold" />
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Content */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.accent.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={photos}
                        renderItem={renderPhoto}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={NUM_COLUMNS}
                        contentContainerStyle={[
                            styles.grid,
                            { paddingBottom: insets.bottom + spacingY._20 },
                        ]}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={renderEmpty}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* Image Viewer */}
                <ImageViewerModal
                    visible={viewerVisible}
                    images={photos}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerVisible(false)}
                />

            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._16,
        gap: spacingY._12,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(128, 128, 128, 0.1)",
        borderRadius: 12,
        borderWidth: 1,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTextContainer: {
        gap: 4,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    grid: {
        paddingHorizontal: spacingX._20,
    },
    counterContainer: {
        marginBottom: spacingY._12,
    },
    photoContainer: {
        borderRadius: 8,
        overflow: "hidden",
    },
    photo: {
        width: "100%",
        height: "100%",
    },
    deleteButton: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
        paddingHorizontal: spacingX._20,
    },
});
