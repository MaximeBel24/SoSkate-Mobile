import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

const Login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Login", "Please fill all the fields");
            return;
        }

        // good to go
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            <ScreenWrapper showPattern={true}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={28} route={"/(auth)/welcome"}/>
                        <Typo size={17} color={colors.white}>
                            Mot de passe oublié ?
                        </Typo>
                    </View>

                    <View style={styles.content}>
                        <ScrollView
                            contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={"600"}>
                                    Bon retour
                                </Typo>
                                <Typo color={colors.neutral600}>Nous sommes heureux de vous revoir !</Typo>
                            </View>
                            <Input
                                placeholder={"Entrez votre email"}
                                onChangeText={(value: string) => (emailRef.current = value)}
                                icon={
                                    <Icons.AtIcon
                                        size={verticalScale(26)}
                                        color={colors.neutral600}
                                    />
                                }
                            />
                            <Input
                                placeholder={"Entrez votre mot de passe"}
                                onChangeText={(value: string) => (passwordRef.current = value)}
                                icon={
                                    <Icons.LockIcon
                                        size={verticalScale(26)}
                                        color={colors.neutral600}
                                    />
                                }
                            />

                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={isLoading} onPress={handleSubmit}>
                                    <Typo fontWeight={"bold"} color={colors.white} size={20}>
                                        Se connecter
                                    </Typo>
                                </Button>
                            </View>

                            <View style={styles.footer}>
                                <Typo>Vous n'avez pas de compte ?</Typo>
                                <Pressable onPress={() => router.push("/(auth)/register")}>
                                    <Typo fontWeight={"bold"} color={colors.primaryDark}>
                                        S'inscrire
                                    </Typo>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //  gap: spacingY._30,
        //  marginHorizontal: spacingX._20,
        justifyContent: "space-between",
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._45,
        paddingBottom: spacingY._25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: radius._50,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
        marginBottom: spacingY._50,
    },

    form: {
        gap: spacingY._15,
        marginTop: spacingY._20,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
});
