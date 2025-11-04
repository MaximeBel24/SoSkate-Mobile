// app/(modals)/profileModal.tsx
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform
} from "react-native";
import { useRouter } from "expo-router";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import Button from "@/components/button/Button";
import { useState, useRef } from "react";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Image } from "expo-image";
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileModal = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // États
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));

    // Refs pour les champs
    const firstnameRef = useRef("Jean");
    const lastnameRef = useRef("Dupont");
    const emailRef = useRef("jean.dupont@email.com");
    const phoneRef = useRef("+33 6 12 34 56 78");
    const [firstname, setFirstname] = useState("Jean");
    const [lastname, setLastname] = useState("Dupont");
    const [email, setEmail] = useState("jean.dupont@email.com");
    const [phone, setPhone] = useState("+33 6 12 34 56 78");

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleSubmit = async () => {
        if (!firstname || !lastname || !email) {
            Alert.alert(
                "Champs manquants",
                "Veuillez remplir tous les champs obligatoires"
            );
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Email invalide", "Veuillez entrer un email valide");
            return;
        }

        // Validation téléphone (format français)
        const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
        const cleanPhone = phone.replace(/\s/g, '');
        if (phone && !phoneRegex.test(cleanPhone)) {
            Alert.alert(
                "Téléphone invalide",
                "Format attendu : +33 6 12 34 56 78 ou 06 12 34 56 78"
            );
            return;
        }

        try {
            setIsLoading(true);

            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 1500));

            const payload = {
                firstname,
                lastname,
                email,
                phone: cleanPhone,
                birthDate: birthDate.toISOString().split('T')[0],
            };

            console.log("Payload:", payload);

            Alert.alert(
                "Succès",
                "Votre profil a été mis à jour avec succès !",
                [
                    {
                        text: "OK",
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert(
                "Erreur",
                error?.message || "Une erreur est survenue lors de la mise à jour"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleImagePick = () => {
        Alert.alert(
            "Changer la photo",
            "Cette fonctionnalité arrive bientôt !",
            [
                { text: "Prendre une photo", onPress: () => {} },
                { text: "Choisir dans la galerie", onPress: () => {} },
                { text: "Annuler", style: "cancel" }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={styles.header}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Icons.CaretLeftIcon size={28} color={colors.white} weight="bold" />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Typo size={24} fontWeight="900" color={colors.white}>
                        Éditer le profil
                    </Typo>
                    <Typo size={14} color={colors.neutral400}>
                        Mettez à jour vos informations
                    </Typo>
                </View>
            </Animated.View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + spacingY._30 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Section */}
                <Animated.View
                    entering={FadeInUp.delay(200).springify()}
                    style={styles.avatarSection}
                >
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBorder}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/300?img=12' }}
                                style={styles.avatar}
                                contentFit="cover"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={handleImagePick}
                        >
                            <LinearGradient
                                colors={[colors.primary, colors.primaryDark]}
                                style={styles.cameraGradient}
                            >
                                <Icons.CameraIcon size={20} color={colors.white} weight="bold" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <Typo size={14} color={colors.neutral400} style={{ textAlign: 'center' }}>
                        Appuyez pour changer votre photo
                    </Typo>
                </Animated.View>

                {/* Form Card */}
                <Animated.View
                    entering={FadeInUp.delay(300).springify()}
                    style={styles.formCard}
                >
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
                        style={styles.formGradient}
                    >
                        <View style={styles.form}>
                            {/* Informations personnelles */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icons.UserIcon size={20} color={colors.primary} weight="duotone" />
                                    <Typo size={15} fontWeight="700" color={colors.white}>
                                        Informations personnelles
                                    </Typo>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Input
                                        placeholder="Prénom *"
                                        value={firstname}
                                        onChangeText={setFirstname}
                                        icon={
                                            <Icons.UserIcon
                                                size={verticalScale(24)}
                                                color={colors.neutral400}
                                                weight="duotone"
                                            />
                                        }
                                    />
                                    <Input
                                        placeholder="Nom *"
                                        value={lastname}
                                        onChangeText={setLastname}
                                        icon={
                                            <Icons.UserIcon
                                                size={verticalScale(24)}
                                                color={colors.neutral400}
                                                weight="duotone"
                                            />
                                        }
                                    />
                                </View>
                            </View>

                            {/* Date de naissance */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icons.CakeIcon size={20} color={colors.primary} weight="duotone" />
                                    <Typo size={15} fontWeight="700" color={colors.white}>
                                        Date de naissance
                                    </Typo>
                                </View>

                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Icons.CalendarIcon
                                        size={verticalScale(24)}
                                        color={colors.neutral400}
                                        weight="duotone"
                                    />
                                    <Typo size={16} color={colors.white} style={{ flex: 1 }}>
                                        {formatDate(birthDate)}
                                    </Typo>
                                    <Icons.CaretDownIcon
                                        size={20}
                                        color={colors.neutral400}
                                        weight="bold"
                                    />
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={birthDate}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleDateChange}
                                        maximumDate={new Date()}
                                        minimumDate={new Date(1940, 0, 1)}
                                        textColor={colors.white}
                                        themeVariant="dark"
                                    />
                                )}
                            </View>

                            {/* Coordonnées */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icons.EnvelopeIcon size={20} color={colors.primary} weight="duotone" />
                                    <Typo size={15} fontWeight="700" color={colors.white}>
                                        Coordonnées
                                    </Typo>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Input
                                        placeholder="Email *"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        icon={
                                            <Icons.AtIcon
                                                size={verticalScale(24)}
                                                color={colors.neutral400}
                                                weight="duotone"
                                            />
                                        }
                                    />
                                    <Input
                                        placeholder="Téléphone (optionnel)"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        icon={
                                            <Icons.PhoneIcon
                                                size={verticalScale(24)}
                                                color={colors.neutral400}
                                                weight="duotone"
                                            />
                                        }
                                    />
                                </View>

                                <View style={styles.infoBox}>
                                    <Icons.InfoIcon size={16} color={colors.primary} weight="fill" />
                                    <Typo size={12} color={colors.neutral400} style={{ flex: 1 }}>
                                        Format téléphone: +33 6 12 34 56 78 ou 06 12 34 56 78
                                    </Typo>
                                </View>
                            </View>

                            {/* Champs obligatoires */}
                            <View style={styles.requiredNote}>
                                <Typo size={12} color={colors.neutral500}>
                                    * Champs obligatoires
                                </Typo>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Buttons */}
                <Animated.View
                    entering={FadeInUp.delay(400).springify()}
                    style={styles.buttonContainer}
                >
                    <Button
                        loading={isLoading}
                        onPress={handleSubmit}
                        style={styles.saveButton}
                    >
                        <Typo fontWeight="700" color={colors.white} size={17}>
                            Enregistrer les modifications
                        </Typo>
                    </Button>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.cancelButton}
                    >
                        <Typo fontWeight="600" color={colors.neutral400} size={15}>
                            Annuler
                        </Typo>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Gradient fade */}
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
                pointerEvents="none"
            />
        </View>
    );
};

export default ProfileModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral900,
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingBottom: spacingY._20,
        gap: spacingY._12,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTextContainer: {
        gap: 4,
    },
    scrollContent: {
        paddingHorizontal: spacingX._20,
    },
    avatarSection: {
        alignItems: 'center',
        gap: spacingY._12,
        marginBottom: spacingY._24,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarBorder: {
        padding: 4,
        borderRadius: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatar: {
        height: verticalScale(120),
        width: verticalScale(120),
        borderRadius: 200,
        backgroundColor: colors.neutral700,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 50,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cameraGradient: {
        padding: 12,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.neutral900,
    },
    formCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    formGradient: {
        padding: spacingX._20,
    },
    form: {
        gap: spacingY._24,
    },
    section: {
        gap: spacingY._12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: spacingY._4,
    },
    inputGroup: {
        gap: spacingY._12,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._12,
        paddingHorizontal: spacingX._16,
        paddingVertical: spacingY._14,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: spacingX._12,
        paddingVertical: spacingY._10,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    requiredNote: {
        paddingTop: spacingY._8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)',
    },
    buttonContainer: {
        gap: spacingY._12,
        marginTop: spacingY._24,
    },
    saveButton: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: spacingY._14,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});