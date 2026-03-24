import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import Slider from "@react-native-community/slider";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type RadiusFilterProps = {
    selectedRadius: number | null;
    onSelectRadius: (radius: number | null) => void;
    userLocation: boolean;
    filteredCount: number;
    totalCount: number;
};

const RadiusFilter: React.FC<RadiusFilterProps> = ({
       selectedRadius,
       onSelectRadius,
       userLocation,
       filteredCount,
       totalCount,
   }) => {
    const { colors } = useTheme();

    if (!userLocation) return null;

    const isFiltering = selectedRadius !== null;

    return (
        <Animated.View
            entering={FadeInDown.duration(300).springify()}
            exiting={FadeOutDown.duration(200)}
            style={[
                styles.container,
                {
                    backgroundColor: colors.background.surface + "E6",
                    borderColor: colors.border.subtle,
                },
            ]}
        >
        {/* Header : label + bouton reset */}
            <View style={styles.header}>
                <Typo size={13} fontWeight="600" color={colors.text.primary}>
                    {isFiltering
                        ? `${filteredCount} spot${filteredCount > 1 ? "s" : ""} dans ${selectedRadius} km`
                        : `${totalCount} spots au total`}
                </Typo>

                {isFiltering && (
                    <Pressable
                        onPress={() => onSelectRadius(null)}
                        style={[styles.resetButton, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}
                    >
                        <Typo size={11} fontWeight="600" color="#ef4444">
                            Supprimer le filtre
                        </Typo>
                    </Pressable>

                )}
            </View>

            {/* Slider */}
            <Slider
                style={styles.slider}
                minimumValue={2}
                maximumValue={30}
                step={1}
                value={selectedRadius ?? 1}
                onValueChange={(value) => onSelectRadius(value)}
                minimumTrackTintColor="#ff6b35"
                maximumTrackTintColor={colors.neutral[600]}
                thumbTintColor="#ff6b35"
            />

            {/* Légende min/max */}
            <View style={styles.legend}>
                <Typo size={11} color={colors.text.muted}>2 km</Typo>
                <Typo size={11} color={colors.text.muted}>20 km</Typo>
            </View>
        </Animated.View>
    );
};

export default RadiusFilter;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        borderWidth: 1,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(8),
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: verticalScale(4),
    },
    resetButton: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(12),
    },
    slider: {
        width: "100%",
        height: 40,
    },
    legend: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: -4,
    },
});
