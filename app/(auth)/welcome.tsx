import React from 'react';
import {Text, View, StyleSheet} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import {spacingX, spacingY, colors} from "@/constants/theme";
import {verticalScale} from "@/utils/styling";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import Animated, { FadeIn } from "react-native-reanimated";
import {useRouter} from "expo-router";


const Welcome = () => {

    const router = useRouter();
    return (
        <ScreenWrapper showPattern={true} bgOpacity={0.5}>
            <View style={styles.container}>
                <View style={{ alignItems: "center"}}>
                    <Typo color={colors.white} size={43} fontWeight={"900"}>
                        SoSkate
                    </Typo>
                </View>

                <Animated.Image
                    entering={FadeIn.duration(700).springify()}
                    source={require("../../assets/images/logo.png")}
                    style={styles.welcomeImage}
                    resizeMethod="scale"
                />

                <View>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        Trouvez des cours
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        de skateboard prêt
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                         de chez vous
                    </Typo>
                </View>

                <Button
                    onPress={() => router.push("/(auth)/register")}
                >
                    <Typo size={23} fontWeight={"bold"} color={colors.white}>
                        Commencer
                    </Typo>
                </Button>
            </View>

        </ScreenWrapper>

    );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        paddingHorizontal: spacingX._20,
        marginVertical: spacingY._90,
    },
    background: {
        flex: 1,
        backgroundColor: colors.neutral900,
    },
    welcomeImage: {
        height: verticalScale(300),
        aspectRatio: 1,
        alignSelf: "center",
    },
});