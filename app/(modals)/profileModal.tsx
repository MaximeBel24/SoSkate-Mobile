import ProfileAvatar from "@/src/features/profile/ui/ProfileAvatar";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import Button from "@/src/shared/ui/button/Button";
import DatePickerInput from "@/src/shared/ui/form/DatePickerInput";
import FormInputGroup from "@/src/shared/ui/form/FormInputGroup";
import FormSection from "@/src/shared/ui/form/FormSection";
import InfoBox from "@/src/shared/ui/form/InfoBox";
import Input from "@/src/shared/ui/typography/Input";
import Typo from "@/src/shared/ui/typography/Typo";
import { verticalScale } from "@/src/shared/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileModal = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [firstname, setFirstname] = useState("Jean");
  const [lastname, setLastname] = useState("Dupont");
  const [email, setEmail] = useState("jean.dupont@email.com");
  const [phone, setPhone] = useState("+33 6 12 34 56 78");

  const handleSubmit = async () => {
    if (!firstname || !lastname || !email) {
      Alert.alert(
        "Champs manquants",
        "Veuillez remplir tous les champs obligatoires"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email invalide", "Veuillez entrer un email valide");
      return;
    }

    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    const cleanPhone = phone.replace(/\s/g, "");
    if (phone && !phoneRegex.test(cleanPhone)) {
      Alert.alert(
        "Téléphone invalide",
        "Format attendu : +33 6 12 34 56 78 ou 06 12 34 56 78"
      );
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const payload = {
        firstname,
        lastname,
        email,
        phone: cleanPhone,
        birthDate: birthDate.toISOString().split("T")[0],
      };

      console.log("Payload:", payload);

      Alert.alert("Succès", "Votre profil a été mis à jour avec succès !", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
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
    Alert.alert("Changer la photo", "Cette fonctionnalité arrive bientôt !", [
      { text: "Prendre une photo", onPress: () => {} },
      { text: "Choisir dans la galerie", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background.primary },
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

        <View style={styles.headerTextContainer}>
          <Typo size={24} fontWeight="900" color={colors.text.primary}>
            Éditer le profil
          </Typo>
          <Typo size={14} color={colors.text.muted}>
            Mettez à jour vos informations
          </Typo>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacingY._30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <ProfileAvatar
          imageUri="https://i.pravatar.cc/300?img=12"
          onEdit={handleImagePick}
        />

        {/* Form Card */}
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={[styles.formCard, { borderColor: colors.border.subtle }]}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.04)"]
                : ["rgba(0, 0, 0, 0.02)", "rgba(0, 0, 0, 0.04)"]
            }
            style={styles.formGradient}
          >
            <View style={styles.form}>
              {/* Informations personnelles */}
              <FormSection icon="UserIcon" title="Informations personnelles">
                <FormInputGroup>
                  <Input
                    placeholder="Prénom *"
                    value={firstname}
                    onChangeText={setFirstname}
                    icon={
                      <Icons.UserIcon
                        size={verticalScale(24)}
                        color={colors.text.muted}
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
                        color={colors.text.muted}
                        weight="duotone"
                      />
                    }
                  />
                </FormInputGroup>
              </FormSection>

              {/* Date de naissance */}
              <FormSection icon="CakeIcon" title="Date de naissance">
                <DatePickerInput value={birthDate} onChange={setBirthDate} />
              </FormSection>

              {/* Coordonnées */}
              <FormSection icon="EnvelopeIcon" title="Coordonnées">
                <FormInputGroup>
                  <Input
                    placeholder="Email *"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon={
                      <Icons.AtIcon
                        size={verticalScale(24)}
                        color={colors.text.muted}
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
                        color={colors.text.muted}
                        weight="duotone"
                      />
                    }
                  />
                </FormInputGroup>

                <InfoBox message="Format téléphone: +33 6 12 34 56 78 ou 06 12 34 56 78" />
              </FormSection>

              {/* Champs obligatoires */}
              <View
                style={[
                  styles.requiredNote,
                  { borderTopColor: colors.border.subtle },
                ]}
              >
                <Typo size={12} color={colors.text.muted}>
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
            style={[styles.saveButton, { shadowColor: colors.accent.primary }]}
          >
            <Typo fontWeight="700" color={colors.constant.white} size={17}>
              Enregistrer les modifications
            </Typo>
          </Button>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Typo fontWeight="600" color={colors.text.muted} size={15}>
              Annuler
            </Typo>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Gradient fade */}
      <LinearGradient
        colors={[
          "transparent",
          isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.6)",
        ]}
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
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._20,
    gap: spacingY._12,
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
  headerTextContainer: {
    gap: 4,
  },
  scrollContent: {
    paddingHorizontal: spacingX._20,
  },
  formCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  formGradient: {
    padding: spacingX._20,
  },
  form: {
    gap: spacingY._24,
  },
  requiredNote: {
    paddingTop: spacingY._8,
    borderTopWidth: 1,
  },
  buttonContainer: {
    gap: spacingY._12,
    marginTop: spacingY._24,
  },
  saveButton: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: spacingY._14,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
