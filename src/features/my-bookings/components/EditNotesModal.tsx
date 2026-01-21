// ============================================
// 🛹 SOSKATE - EDIT NOTES MODAL
// ============================================
// Modal pour modifier les notes d'une réservation

import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Modal,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

interface EditNotesModalProps {
    visible: boolean;
    currentNotes: string | null;
    onClose: () => void;
    onSave: (notes: string) => Promise<boolean>;
    isLoading: boolean;
}

const MAX_NOTES_LENGTH = 500;

const EditNotesModal: React.FC<EditNotesModalProps> = ({
                                                           visible,
                                                           currentNotes,
                                                           onClose,
                                                           onSave,
                                                           isLoading,
                                                       }) => {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const [notes, setNotes] = useState(currentNotes || "");

    // Reset notes quand le modal s'ouvre
    useEffect(() => {
        if (visible) {
            setNotes(currentNotes || "");
        }
    }, [visible, currentNotes]);

    const handleSave = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const success = await onSave(notes);
        if (success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onClose();
        }
    };

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
    };

    const hasChanges = notes !== (currentNotes || "");
    const remainingChars = MAX_NOTES_LENGTH - notes.length;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[
                    styles.container,
                    { backgroundColor: colors.background.primary },
                ]}
            >
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        {
                            paddingTop: insets.top + 8,
                            borderBottomColor: colors.border.subtle,
                        },
                    ]}
                >
                    <Pressable onPress={handleClose} style={styles.headerButton}>
                        <Typo size={16} color={colors.text.secondary}>
                            Annuler
                        </Typo>
                    </Pressable>

                    <Typo size={16} fontWeight="600" color={colors.text.primary}>
                        Modifier les notes
                    </Typo>

                    <Pressable
                        onPress={handleSave}
                        disabled={!hasChanges || isLoading}
                        style={styles.headerButton}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={colors.accent.primary} />
                        ) : (
                            <Typo
                                size={16}
                                fontWeight="600"
                                color={
                                    hasChanges ? colors.accent.primary : colors.text.muted
                                }
                            >
                                Enregistrer
                            </Typo>
                        )}
                    </Pressable>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputHeader}>
                            <Icons.NoteIcon size={18} color={colors.text.secondary} />
                            <Typo size={14} fontWeight="600" color={colors.text.primary}>
                                Notes pour l'instructeur
                            </Typo>
                        </View>

                        <TextInput
                            style={[
                                styles.textInput,
                                {
                                    backgroundColor: isDark
                                        ? "rgba(255,255,255,0.05)"
                                        : "rgba(0,0,0,0.03)",
                                    borderColor: colors.border.default,
                                    color: colors.text.primary,
                                },
                            ]}
                            placeholder="Niveau, objectifs, besoins particuliers..."
                            placeholderTextColor={colors.text.muted}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            maxLength={MAX_NOTES_LENGTH}
                            textAlignVertical="top"
                            autoFocus
                        />

                        {/* Compteur de caractères */}
                        <Typo
                            size={12}
                            color={remainingChars < 50 ? colors.semantic.warning : colors.text.muted}
                            style={styles.charCount}
                        >
                            {remainingChars} caractères restants
                        </Typo>
                    </View>

                    {/* Info */}
                    <View
                        style={[
                            styles.infoBox,
                            {
                                backgroundColor: colors.semantic.infoBg,
                                borderColor: colors.semantic.infoBorder,
                            },
                        ]}
                    >
                        <Icons.InfoIcon
                            size={18}
                            color={colors.semantic.info}
                            weight="fill"
                        />
                        <Typo size={12} color={colors.semantic.info} style={{ flex: 1 }}>
                            Les notes peuvent être modifiées jusqu'à 24h avant le cours
                        </Typo>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default EditNotesModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    headerButton: {
        minWidth: 80,
    },
    content: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    inputContainer: {
        gap: 10,
    },
    inputHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        minHeight: 150,
        fontSize: 15,
        lineHeight: 22,
    },
    charCount: {
        textAlign: "right",
    },
    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
});