import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

type LocationDeniedBannerProps = {
    onDismiss: () => void;
};

const LocationDeniedBanner: React.FC<LocationDeniedBannerProps> = ({ onDismiss }) => {
    const { colors } = useTheme();
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background.surface + "F0",
                    borderColor: colors.border.subtle,
                },
            ]}
        >
            <Icons.WarningIcon size={20} color="#ff6b35" weight="fill" />

            <View style={styles.textContainer}>
                <Typo size={13} fontWeight="600" color={colors.text.primary}>
                    Localisation désactivée
                </Typo>
                <Typo size={12} color={colors.text.muted}>
                    Activez la localisation pour voir les spots près de chez vous
                </Typo>
            </View>

            <Pressable
                onPress={() => Linking.openSettings()}
                style={[styles.settingsButton, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}
            >
                <Typo size={12} fontWeight="700" color="#3b82f6">
                    Réglages
                </Typo>
            </Pressable>
            <Pressable onPress={onDismiss} style={styles.closeButton}>
                <Icons.XIcon size={18} color={colors.text.muted} weight="bold" />
            </Pressable>
        </View>
    );
};

export default LocationDeniedBanner;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 122,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1,
    },
    textContainer: {
        flex: 1,
        gap: 2,
    },
    settingsButton: {
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(8),
        backgroundColor: "rgba(255, 107, 53, 0.15)",
    },
    closeButton: {
        padding: scale(4),
    },
});
