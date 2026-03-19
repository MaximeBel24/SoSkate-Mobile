import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";

export type AlertButton = {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void;
};

type CustomModalProps = {
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    onClose: () => void;
    layout?: "horizontal" | "vertical";
};


const CustomModal: React.FC<CustomModalProps> = ({
     visible,
     title,
     message,
     buttons = [{ text: "OK" }],
     onClose,
     layout = "horizontal",
 }) => {


    const { colors } = useTheme();

    const handlePress = (button: AlertButton) => {
        button.onPress?.();
        onClose();
    };

    const getButtonColor = (style?: AlertButton["style"]) => {
        switch (style) {
            case "destructive":
                return colors.semantic.danger;
            case "cancel":
                return colors.text.muted;
            default:
                return "#ff6b35";
        }
    };

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <View style={styles.overlay}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.backdrop}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    entering={ZoomIn.duration(250).springify()}
                    exiting={ZoomOut.duration(150)}
                    style={[
                        styles.modal,
                        {
                            backgroundColor: colors.background.surface,
                            borderColor: colors.border.subtle,
                        },
                    ]}
                >
                    <View style={styles.content}>
                        <Typo size={18} fontWeight="700" color={colors.text.primary}>
                            {title}
                        </Typo>
                        {message && (
                            <Typo
                                size={14}
                                color={colors.text.secondary}
                                style={styles.message}
                            >
                                {message}
                            </Typo>
                        )}
                    </View>

                    <View
                        style={[
                            styles.buttonsContainer,
                            { borderTopColor: colors.border.subtle },
                            layout === "vertical" && styles.buttonsVertical,
                        ]}
                    >
                        {buttons.map((button, index) => (
                            <Pressable
                                key={index}
                                onPress={() => handlePress(button)}
                                style={({ pressed }) => [
                                    styles.button,
                                    layout === "horizontal" && { flex: 1 },
                                    layout === "horizontal" && index > 0 && {
                                        borderLeftWidth: 1,
                                        borderLeftColor: colors.border.subtle,
                                    },
                                    layout === "vertical" && index > 0 && {
                                        borderTopWidth: 1,
                                        borderTopColor: colors.border.subtle,
                                    },
                                    layout === "vertical" && { width: "100%" },
                                    pressed && { backgroundColor: colors.background.subtle },
                                ]}
                            >

                                <Typo
                                    size={15}
                                    fontWeight={button.style === "cancel" ? "500" : "700"}
                                    color={getButtonColor(button.style)}
                                    style={{ textAlign: "center" }}
                                >
                                    {button.text}
                                </Typo>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scale(32),
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modal: {
        width: "100%",
        borderRadius: scale(16),
        borderWidth: 1,
        overflow: "hidden",
    },
    content: {
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(24),
        paddingBottom: verticalScale(20),
        alignItems: "center",
    },
    message: {
        marginTop: verticalScale(8),
        textAlign: "center",
        lineHeight: 20,
    },
    buttonsContainer: {
        flexDirection: "row",
        borderTopWidth: 1,
    },
    button: {
        paddingVertical: verticalScale(14),
        alignItems: "center",
        justifyContent: "center",
    },
    buttonsVertical: {
        flexDirection: "column",
    },
});


