import React, { useRef, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/src/shared/theme";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { verticalScale } from "@/src/shared/utils/styling";
import Typo from "@/src/shared/ui/typography/Typo";
import Input from "@/src/shared/ui/typography/Input";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import { useCustomAlert } from "@/src/shared/ui/CustomModal/AlertContext";
import { forgotPassword } from "@/src/shared/services/authService";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { logger } from "@/src/shared/utils/logger";

export default function ForgotPasswordScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { showAlert } = useCustomAlert();

    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        const email = emailRef.current.trim();

        if (!email) {
            showAlert("Erreur", "Veuillez saisir votre adresse email.");
            return;
        }

        try {
            setIsLoading(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            await forgotPassword({ email });

            router.push({
                pathname: "/(auth)/reset-password",
                params: { email },
            });
        } catch (error) {
            logger.error("Forgot password error:", error);
            showAlert(
                "Erreur",
                getErrorMessage(error, "Impossible d'envoyer le code de réinitialisation"),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: insets.top + spacingY._8,
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
                        onPress={() => router.back()}
                        style={[styles.backButton, { borderColor: colors.border.default }]}
                    >
                        <Icons.CaretLeftIcon
                            size={28}
                            color={colors.text.primary}
                            weight="bold"
                        />
                    </TouchableOpacity>
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                        <Typo size={28} fontWeight="900" color={colors.text.primary}>
                            Mot de passe oublié
                        </Typo>
                        <Typo
                            size={14}
                            color={colors.text.muted}
                            style={{ marginTop: spacingY._8 }}
                        >
                            Entrez votre adresse email pour recevoir un code de réinitialisation.
                        </Typo>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(300).springify()}
                        style={styles.form}
                    >
                        <Input
                            icon={
                                <Icons.EnvelopeSimpleIcon
                                    size={verticalScale(24)}
                                    color={colors.text.muted}
                                    weight="duotone"
                                />
                            }
                            placeholder="Adresse email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            onChangeText={(text) => (emailRef.current = text)}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).springify()}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isLoading}
                            style={[
                                styles.submitButton,
                                { backgroundColor: colors.accent.primary },
                            ]}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Typo size={16} fontWeight="700" color="#fff">
                                    Envoyer le code
                                </Typo>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
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
        paddingBottom: spacingY._8,
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
    content: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
        gap: spacingY._24,
    },
    form: {
        gap: spacingY._16,
    },
    submitButton: {
        height: verticalScale(56),
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
});