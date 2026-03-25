// ============================================
// SOSKATE - RESET PASSWORD SCREEN
// ============================================
// Étape 2 : Saisie du code + nouveau mot de passe

import React, { useRef, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import PasswordRequirements from "@/src/features/auth/components/PasswordRequirements";
import { useCustomAlert } from "@/src/shared/ui/CustomModal/AlertContext";
import { resetPassword } from "@/src/shared/services/authService";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { logger } from "@/src/shared/utils/logger";

export default function ResetPasswordScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { showAlert } = useCustomAlert();
    const { email } = useLocalSearchParams<{ email: string }>();

    const tokenRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");

    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const handlePasswordChange = (text: string) => {
        passwordRef.current = text;
        setPassword(text);
    };

    const handleSubmit = async () => {
        const token = tokenRef.current.trim();
        const newPassword = passwordRef.current;
        const confirmPassword = confirmPasswordRef.current;

        if (!token) {
            showAlert("Erreur", "Veuillez saisir le code reçu par email.");
            return;
        }

        if (!isPasswordValid) {
            showAlert("Erreur", "Le mot de passe ne respecte pas les critères requis.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert("Erreur", "Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setIsLoading(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            await resetPassword({
                email: email || "",
                token,
                newPassword,
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            showAlert(
                "Succès",
                "Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.",
                [
                    {
                        text: "Se connecter",
                        onPress: () => {
                            router.dismissAll();
                            router.replace("/(auth)/login");
                        },
                    },
                ],
            );
        } catch (error) {
            logger.error("Reset password error:", error);
            showAlert(
                "Erreur",
                getErrorMessage(error, "Impossible de réinitialiser le mot de passe"),
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
                            Nouveau mot de passe
                        </Typo>
                        <Typo
                            size={14}
                            color={colors.text.muted}
                            style={{ marginTop: spacingY._8 }}
                        >
                            Entrez le code reçu par email et choisissez votre nouveau mot de passe.
                        </Typo>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(300).springify()}
                        style={styles.form}
                    >
                        {/* Code */}
                        <Input
                            icon={
                                <Icons.KeyIcon
                                    size={verticalScale(24)}
                                    color={colors.text.muted}
                                    weight="duotone"
                                />
                            }
                            placeholder="Code à 6 chiffres"
                            keyboardType="number-pad"
                            maxLength={6}
                            onChangeText={(text) => (tokenRef.current = text)}
                        />

                        {/* Nouveau mot de passe */}
                        <Input
                            icon={
                                <Icons.LockIcon
                                    size={verticalScale(24)}
                                    color={colors.text.muted}
                                    weight="duotone"
                                />
                            }
                            placeholder="Nouveau mot de passe"
                            secureTextEntry
                            onChangeText={handlePasswordChange}
                        />

                        {/* Confirmation */}
                        <Input
                            icon={
                                <Icons.LockIcon
                                    size={verticalScale(24)}
                                    color={colors.text.muted}
                                    weight="duotone"
                                />
                            }
                            placeholder="Confirmer le mot de passe"
                            secureTextEntry
                            onChangeText={(text) => (confirmPasswordRef.current = text)}
                        />

                        {/* Password Requirements */}
                        <PasswordRequirements
                            password={password}
                            onValidationChange={setIsPasswordValid}
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
                                    Réinitialiser le mot de passe
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
