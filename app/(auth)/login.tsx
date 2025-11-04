import BackButton from "@/components/button/BackButton";
import Button from "@/components/button/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { LoginRequest } from "@/interfaces/auth.interface";
import { login } from "@/services/authService";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Connexion", "Veuillez remplir tous les champs");
            return;
        }

        const payload: LoginRequest = {
            email: emailRef.current,
            password: passwordRef.current,
        };

        try {
            setIsLoading(true);
            const response = await login(payload);

            router.push("/(tabs)");
        } catch (error: any) {
            Alert.alert(
                "Erreur de connexion",
                error?.message || "Une erreur est survenue."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.3}>
            <View style={[styles.container, {
                paddingTop: insets.top + spacingY._20,
                paddingBottom: insets.bottom + spacingY._20
            }]}>
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.header}
                >
                    <BackButton iconSize={28} />
                    <View style={styles.headerTextContainer}>
                        <Typo size={32} fontWeight="900" color={colors.white}>
                            Connexion
                        </Typo>
                        <Typo size={15} fontWeight="500" color={colors.neutral300}>
                            Bon retour parmi nous ! 👋
                        </Typo>
                    </View>
                </Animated.View>

                {/* Logo compact */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    style={styles.logoContainer}
                >
                    <View style={styles.logoBadge}>
                        <Typo size={20} fontWeight="900" color={colors.white}>
                            So<Typo size={20} fontWeight="900" color={colors.primary}>Skate</Typo>
                        </Typo>
                    </View>
                </Animated.View>

                <View style={styles.spacer} />

                {/* Form Card */}
                <Animated.View
                    entering={FadeInUp.delay(300).springify()}
                    style={styles.formCard}
                >
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                        style={styles.formGradient}
                    >
                        <View style={styles.form}>
                            <View style={styles.formHeader}>
                                <Typo size={18} fontWeight="700" color={colors.white}>
                                    Accédez à votre compte
                                </Typo>
                                <Typo size={14} color={colors.neutral300}>
                                    Entrez vos identifiants
                                </Typo>
                            </View>

                            <View style={styles.inputGroup}>
                                <Input
                                    placeholder="Email"
                                    autoComplete="email"
                                    keyboardType="email-address"
                                    onChangeText={(value) => (emailRef.current = value)}
                                    icon={
                                        <Icons.AtIcon
                                            size={verticalScale(24)}
                                            color={colors.neutral400}
                                            weight="duotone"
                                        />
                                    }
                                />
                                <Input
                                    placeholder="Mot de passe"
                                    secureTextEntry
                                    onChangeText={(value) => (passwordRef.current = value)}
                                    icon={
                                        <Icons.LockIcon
                                            size={verticalScale(24)}
                                            color={colors.neutral400}
                                            weight="duotone"
                                        />
                                    }
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.forgotPassword}
                                onPress={() => Alert.alert("Mot de passe oublié", "Fonctionnalité bientôt disponible")}
                            >
                                <Typo size={14} color={colors.primary} fontWeight="600">
                                    Mot de passe oublié ?
                                </Typo>
                            </TouchableOpacity>

                            <Button loading={isLoading} onPress={handleSubmit}>
                                <Typo fontWeight="700" color={colors.white} size={17}>
                                    Se connecter
                                </Typo>
                            </Button>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Typo size={12} color={colors.neutral400}>OU</Typo>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Social buttons (optionnel) */}
                            <View style={styles.socialButtons}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Icons.GoogleLogo size={20} color={colors.white} weight="bold" />
                                    <Typo size={14} fontWeight="600" color={colors.white}>
                                        Google
                                    </Typo>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialButton}>
                                    <Icons.AppleLogo size={20} color={colors.white} weight="bold" />
                                    <Typo size={14} fontWeight="600" color={colors.white}>
                                        Apple
                                    </Typo>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Footer */}
                <Animated.View
                    entering={FadeInUp.delay(400).springify()}
                    style={styles.footer}
                >
                    <Typo size={15} color={colors.neutral300}>
                        Pas encore de compte ?
                    </Typo>
                    <Pressable onPress={() => router.navigate("/(auth)/register")}>
                        <Typo size={15} fontWeight="700" color={colors.primary}>
                            S'inscrire gratuitement
                        </Typo>
                    </Pressable>
                </Animated.View>
            </View>

            {/* Gradient bottom */}
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
                pointerEvents="none"
            />
        </ScreenWrapper>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    header: {
        marginBottom: spacingY._16,
        gap: spacingY._16,
    },
    headerTextContainer: {
        gap: 4,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: spacingY._12,
    },
    logoBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    spacer: {
        flex: 0.3,
    },
    formCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    formGradient: {
        padding: spacingX._20,
    },
    form: {
        gap: spacingY._16,
    },
    formHeader: {
        gap: 4,
        marginBottom: spacingY._4,
    },
    inputGroup: {
        gap: spacingY._12,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: spacingY._8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    socialButtons: {
        flexDirection: 'row',
        gap: spacingX._12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: spacingY._12,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginTop: spacingY._20,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});