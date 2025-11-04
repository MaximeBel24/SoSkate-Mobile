import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {SpotResponse} from "@/interfaces/spot.interface";
import {colors, spacingX, spacingY} from "@/constants/theme";
import Animated, {SlideInDown, SlideOutDown} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import SpotImage from "@/components/map/SpotCard/SpotImage";
import * as Icons from 'phosphor-react-native';
import SpotInfo from "@/components/map/SpotCard/SpotInfo";
import SpotActions from "@/components/map/SpotCard/SpotActions";

type SpotCardProps = {
    spot: SpotResponse;
    bottomInset: number;
    onClose: () => void;
    onViewCourses: (spotId: number) => void;
};

const SpotCard = ({ spot, bottomInset, onClose, onViewCourses }: SpotCardProps) => {
    const imageUrl = spot.photos && spot.photos.length > 0 ? spot.photos[0] : undefined;

    return (
        <Animated.View
            entering={SlideInDown.springify()}
            exiting={SlideOutDown.springify()}
            style={[styles.spotCard, { paddingBottom: bottomInset + spacingY._70 }]}
        >
            {/*<LinearGradient*/}
            {/*    colors={['rgba(20, 20, 20, 0.98)', 'rgba(10, 10, 10, 0.95)']}*/}
            {/*    style={styles.spotCardGradient}*/}
            {/*>*/}
                <SpotImage imageUrl={imageUrl} />

                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Icons.XIcon size={20} color={colors.white} weight="bold" />
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.spotContent}>
                    <SpotInfo
                        name={spot.name}
                        address={spot.address}
                        description={spot.description}
                    />

                    <SpotActions spotId={spot.id} onViewCourses={onViewCourses} />
                </View>
            {/*</LinearGradient>*/}
        </Animated.View>
  )
}

export default SpotCard

const styles = StyleSheet.create({
    spotCard: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: colors.black,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 20,
    },
    spotCardGradient: {
        borderTopWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    closeButton: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        zIndex: 10,
    },
    spotContent: {
        padding: spacingX._20,
    },
});
