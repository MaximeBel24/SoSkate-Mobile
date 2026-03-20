import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import { changePassword, verifyPassword } from "@/src/shared/services/authService";
import { useCustomAlert } from "@/src/shared/ui/CustomModal/AlertContext";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import PasswordRequirements from "@/src/features/auth/components/PasswordRequirements";

type ChangePasswordModalProps = {
    visible: boolean;
    onClose: () => void;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
                                                                     visible,
                                                                     onClose,
                                                                 }) => {
    const { colors } = useTheme();
    const { showAlert } = useCustomAlert();

    const [step, setStep] = useState<1 | 2>(1);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const resetForm = () => {
        setStep(1);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordValid(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Étape 1 : vérifier le mot de passe actuel
    const handleVerify = async () => {
        if (!currentPassword) {
            showAlert("Erreur", "Veuillez entrer votre mot de passe actuel");
            return;
        }

        setIsLoading(true);
        try {
            const isValid = await verifyPassword(currentPassword);
            if (isValid) {
                setStep(2);
            } else {
                showAlert("Erreur", "Mot de passe incorrect");
            }
        } catch (error) {
            showAlert("Erreur", getErrorMessage(error, "Impossible de vérifier le mot de passe"));
        } finally {
            setIsLoading(false);
        }
    };

    // Étape 2 : changer le mot de passe
    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            showAlert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        if (!isPasswordValid) {
            showAlert("Erreur", "Le mot de passe ne respecte pas tous les critères");
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert("Erreur", "Les mots de passe ne correspondent pas");
            return;
        }

        if (currentPassword === newPassword) {
            showAlert("Erreur", "Le nouveau mot de passe doit être différent de l'ancien");
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            handleClose();
            showAlert("Succès ✅", "Votre mot de passe a été modifié avec succès");
        } catch (error) {
            showAlert("Erreur", getErrorMessage(error, "Impossible de changer le mot de passe"));
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = [
        styles.input,
        {
            backgroundColor: colors.background.subtle,
            borderColor: colors.border.subtle,
            color: colors.text.primary,
        },
    ];

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <View style={styles.overlay}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.backdrop}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
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
                    {step === 1 ? (
                        <>
                            <Typo size={18} fontWeight="700" color={colors.text.primary} style={styles.title}>
                                Vérification
                            </Typo>

                            <Typo size={13} color={colors.text.secondary} style={styles.subtitle}>
                                Entrez votre mot de passe actuel pour continuer
                            </Typo>

                            <TextInput
                                style={inputStyle}
                                placeholder="Mot de passe actuel"
                                placeholderTextColor={colors.text.muted}
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />

                            <View style={styles.buttons}>
                                <Pressable
                                    onPress={handleClose}
                                    style={[styles.button, { backgroundColor: colors.background.subtle }]}
                                >
                                    <Typo size={14} fontWeight="600" color={colors.text.secondary}>
                                        Annuler
                                    </Typo>
                                </Pressable>

                                <Pressable
                                    onPress={handleVerify}
                                    disabled={isLoading}
                                    style={[
                                        styles.button,
                                        { backgroundColor: "#ff6b35", opacity: isLoading ? 0.6 : 1 },
                                    ]}
                                >
                                    <Typo size={14} fontWeight="700" color="#fff">
                                        {isLoading ? "Vérification..." : "Continuer"}
                                    </Typo>
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <>
                            <Typo size={18} fontWeight="700" color={colors.text.primary} style={styles.title}>
                                Nouveau mot de passe
                            </Typo>

                            <TextInput
                                style={inputStyle}
                                placeholder="Nouveau mot de passe"
                                placeholderTextColor={colors.text.muted}
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />

                            <PasswordRequirements
                                password={newPassword}
                                onValidationChange={setIsPasswordValid}
                            />

                            <TextInput
                                style={[inputStyle, { marginTop: verticalScale(12) }]}
                                placeholder="Confirmer le nouveau mot de passe"
                                placeholderTextColor={colors.text.muted}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <View style={styles.buttons}>
                                <Pressable
                                    onPress={() => setStep(1)}
                                    style={[styles.button, { backgroundColor: colors.background.subtle }]}
                                >
                                    <Typo size={14} fontWeight="600" color={colors.text.secondary}>
                                        Retour
                                    </Typo>
                                </Pressable>

                                <Pressable
                                    onPress={handleSubmit}
                                    disabled={isLoading || !isPasswordValid}
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: "#ff6b35",
                                            opacity: isLoading || !isPasswordValid ? 0.6 : 1,
                                        },
                                    ]}
                                >
                                    <Typo size={14} fontWeight="700" color="#fff">
                                        {isLoading ? "Modification..." : "Confirmer"}
                                    </Typo>
                                </Pressable>
                            </View>
                        </>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scale(24),
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modal: {
        width: "100%",
        borderRadius: scale(16),
        borderWidth: 1,
        padding: scale(24),
    },
    title: {
        textAlign: "center",
        marginBottom: verticalScale(8),
    },
    subtitle: {
        textAlign: "center",
        marginBottom: verticalScale(16),
    },
    input: {
        borderWidth: 1,
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        fontSize: 14,
        marginBottom: verticalScale(12),
    },
    buttons: {
        flexDirection: "row",
        gap: scale(12),
        marginTop: verticalScale(8),
    },
    button: {
        flex: 1,
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: "center",
    },
});
