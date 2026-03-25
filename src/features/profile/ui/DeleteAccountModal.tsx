import React, { useState } from "react";
import {Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { scale, verticalScale } from "@/src/shared/utils/styling";
import { deleteAccount } from "@/src/shared/services/authService";
import { useCustomAlert } from "@/src/shared/ui/CustomModal/AlertContext";
import {useAuth} from "@/src/shared/contexts/AuthContext";
import {getErrorMessage} from "@/src/api/axios/getErrorMessage";
import {useRouter} from "expo-router";
import * as Icons from "phosphor-react-native";

type DeleteAccountModalProps = {
    visible: boolean;
    onClose: () => void;
};

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
       visible,
       onClose,
   }) => {

    const { colors } = useTheme();
    const { showAlert } = useCustomAlert();
    const { logout } = useAuth();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const resetForm = () => {
        setPassword("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleDelete = async () => {
        if (!password) {
            showAlert("Erreur", "Veuillez entrer votre mot de passe pour confirmer");
            return;
        }

        setIsLoading(true);
        try {
            await deleteAccount(password);
            handleClose();
            showAlert(
                "Compte supprimé",
                "Votre compte a été supprimé avec succès. Vous allez être déconnecté.",
                [{ text: "OK" }]
            );
            await logout()
            router.replace("/(auth)/welcome");
        } catch (error) {
            showAlert("Erreur", getErrorMessage(error, "Impossible de supprimer le compte"));
        } finally {
            setIsLoading(false);
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
                    <Typo size={18} fontWeight="700" color={colors.semantic.danger} style={styles.title}>
                        Supprimer mon compte
                    </Typo>

                    <Typo size={14} color={colors.text.secondary} style={styles.warning}>
                        Cette action est irréversible. Toutes vos données seront supprimées.
                        Entrez votre mot de passe pour confirmer.
                    </Typo>

                    <View
                        style={[
                            styles.input,
                            styles.inputRow,
                            {
                                backgroundColor: colors.background.subtle,
                                borderColor: colors.semantic.danger + "40",
                            },
                        ]}
                    >
                        <TextInput
                            style={[styles.inputText, { color: colors.text.primary }]}
                            placeholder="Votre mot de passe"
                            placeholderTextColor={colors.text.muted}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                            {showPassword ? (
                                <Icons.EyeIcon size={20} color={colors.text.muted} weight="duotone" />
                            ) : (
                                <Icons.EyeSlashIcon size={20} color={colors.text.muted} weight="duotone" />
                            )}
                        </TouchableOpacity>
                    </View>


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
                            onPress={handleDelete}
                            disabled={isLoading}
                            style={[
                                styles.button,
                                { backgroundColor: colors.semantic.danger, opacity: isLoading ? 0.6 : 1 },
                            ]}
                        >
                            <Typo size={14} fontWeight="700" color="#fff">
                                {isLoading ? "Suppression..." : "Supprimer"}
                            </Typo>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default DeleteAccountModal;

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
        marginBottom: verticalScale(12),
    },
    warning: {
        textAlign: "center",
        marginBottom: verticalScale(20),
        lineHeight: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        fontSize: 14,
        marginBottom: verticalScale(16),
    },
    buttons: {
        flexDirection: "row",
        gap: scale(12),
    },
    button: {
        flex: 1,
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: "center",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputText: {
        flex: 1,
        fontSize: 14,
    },

});
