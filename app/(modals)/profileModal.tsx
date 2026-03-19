// ============================================
// 🛹 SOSKATE - PROFILE MODAL
// ============================================
// Modal d'édition du profil avec upload photo

import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { logger } from "@/src/shared/utils/logger";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import {
  SelectedImage,
  useImagePicker,
} from "@/src/shared/hooks/useImagePicker";
import { getInstructorById } from "@/src/shared/services/instructorService";
import {
  getCustomerAvatar,
  getInstructorAvatar,
  uploadAvatar,
} from "@/src/shared/services/photoService";
import {
  updateCustomerProfile,
  updateInstructorProfile,
} from "@/src/shared/services/profileService";
import { useTheme } from "@/src/shared/theme";
import Button from "@/src/shared/ui/button/Button";
import DatePickerInput from "@/src/shared/ui/form/DatePickerInput";
import FormInputGroup from "@/src/shared/ui/form/FormInputGroup";
import FormSection from "@/src/shared/ui/form/FormSection";
import InfoBox from "@/src/shared/ui/form/InfoBox";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import Avatar from "@/src/shared/ui/media/Avatar";
import Input from "@/src/shared/ui/typography/Input";
import Typo from "@/src/shared/ui/typography/Typo";
import { verticalScale } from "@/src/shared/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useCustomAlert} from "@/src/shared/ui/CustomModal/AlertContext";

// ============================================
// TYPES
// ============================================
type Specialty = "STREET" | "BOWL" | "FREESTYLE" | "PARK" | "VERT";

const SPECIALTY_OPTIONS: { value: Specialty; label: string }[] = [
  { value: "STREET", label: "Street" },
  { value: "BOWL", label: "Bowl" },
  { value: "FREESTYLE", label: "Freestyle" },
  { value: "PARK", label: "Park" },
  { value: "VERT", label: "Vert" },
];

// ============================================
// COMPONENT
// ============================================
const ProfileModal = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { showAlert } = useCustomAlert()

  const { user, isCustomer, isInstructor, login } = useAuth();
  const { showImagePickerAlert, isLoading: isPickerLoading } = useImagePicker();

  // === Form State - Commun ===
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // === Avatar State ===
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  // === Form State - Customer uniquement ===
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));

  // === Form State - Instructor uniquement ===
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState<Specialty>("STREET");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");

  // === Bio focus state ===
  const [isBioFocused, setIsBioFocused] = useState(false);

  // === Placeholder avatar avec initiales ===
  const placeholderAvatar = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user.firstName} ${user.lastName}`,
      )}&background=FF6B35&color=fff&size=200&bold=true`
    : null;

  // === Charger l'avatar existant ===
  useEffect(() => {
    const loadAvatar = async () => {
      if (!user) return;

      try {
        setIsLoadingAvatar(true);

        let avatar = null;

        if (isCustomer && user.customerId) {
          avatar = await getCustomerAvatar(user.customerId);
        } else if (isInstructor && user.instructorId) {
          avatar = await getInstructorAvatar(user.instructorId);
        }

        if (avatar) {
          setAvatarUri(avatar.url);
        }
      } catch (error) {
        logger.error("Error loading avatar:", error);
      } finally {
        setIsLoadingAvatar(false);
      }
    };

    loadAvatar();
  }, [user, isCustomer, isInstructor]);

  // === Charger les données existantes ===
  useEffect(() => {
    if (user) {
      // Données communes
      setFirstname(user.firstName || "");
      setLastname(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // === Charger les données spécifiques Instructor ===
  useEffect(() => {
    const loadInstructorData = async () => {
      if (!user || !isInstructor || !user.instructorId) return;

      try {
        // Tu dois créer cette fonction dans profileService
        const instructorData = await getInstructorById(user.instructorId);

        setBio(instructorData.bio || "");
        setSpecialty(instructorData.specialty || "STREET");
        setYearsOfExperience(
          instructorData.yearsOfExperience?.toString() || "",
        );
        setInstagramHandle(instructorData.instagramHandle || "");
        setYoutubeChannel(instructorData.youtubeChannel || "");
      } catch (error) {
        logger.error("Error loading instructor profile:", error);
      }
    };

    loadInstructorData();
  }, [user, isInstructor]);

  // === Upload de l'avatar ===
  const handleImageSelected = useCallback(
    async (image: SelectedImage) => {
      if (!user) return;

      try {
        setIsUploadingPhoto(true);

        const entityType = isCustomer ? "CUSTOMER" : "INSTRUCTOR";
        const entityId = isCustomer ? user.customerId! : user.instructorId!;

        logger.dev("Uploading avatar...", { entityType, entityId, fileName: image.name });

        const result = await uploadAvatar({
          file: {
            uri: image.uri,
            type: image.type,
            name: image.name,
          },
          entityType,
          entityId,
          uploadedBy: user.id,
        });

        // Mettre à jour l'avatar affiché
        setAvatarUri(result.url);

        showAlert("Succès", "Votre photo de profil a été mise à jour !");
      } catch (error) {
        logger.error("Error uploading avatar:", error);
        showAlert(
          "Erreur",
          getErrorMessage(error, "Impossible de mettre à jour la photo"),
        );
      } finally {
        setIsUploadingPhoto(false);
      }
    },
    [user, isCustomer],
  );

  // === Handler pour ouvrir le picker ===
  const handleAvatarPress = useCallback(() => {
    showImagePickerAlert(handleImageSelected);
  }, [showImagePickerAlert, handleImageSelected]);

  // === Validation ===
  const validateForm = (): boolean => {
    if (!firstname.trim() || !lastname.trim() || !email.trim()) {
      showAlert(
        "Champs manquants",
        "Veuillez remplir tous les champs obligatoires",
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Email invalide", "Veuillez entrer un email valide");
      return false;
    }

    if (phone) {
      const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
      const cleanPhone = phone.replace(/\s/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        showAlert(
          "Téléphone invalide",
          "Format attendu : +33 6 12 34 56 78 ou 06 12 34 56 78",
        );
        return false;
      }
    }

    if (isInstructor) {
      if (yearsOfExperience && isNaN(Number(yearsOfExperience))) {
        showAlert(
          "Années d'expérience invalides",
          "Veuillez entrer un nombre valide",
        );
        return false;
      }
    }

    return true;
  };

  // === Soumission ===
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user) return;

    const cleanPhone = phone.replace(/\s/g, "");

    try {
      setIsLoading(true);

      if (isCustomer && user.customerId) {
        const payload = {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone || null,
          birthDate: birthDate.toISOString().split("T")[0],
        };

        logger.dev("Customer payload:", payload);

        const updatedCustomer = await updateCustomerProfile(
          user.customerId,
          payload,
        );

        await login({
          id: user.id,
          customerId: user.customerId,
          instructorId: null,
          email: updatedCustomer.email,
          firstName: updatedCustomer.firstname,
          lastName: updatedCustomer.lastname,
          phone: updatedCustomer.phone,
          role: "CUSTOMER",
          message: "Profil mis à jour",
        });
      } else if (isInstructor && user.instructorId) {
        const payload = {
          bio: bio.trim() || null,
          specialty: specialty,
          yearsOfExperience: yearsOfExperience
            ? Number(yearsOfExperience)
            : null,
          instagramHandle: instagramHandle.trim() || null,
          youtubeChannel: youtubeChannel.trim() || null,
        };

        logger.dev("Instructor payload:", payload);

        await updateInstructorProfile(user.instructorId, payload);
      }

      showAlert("Succès", "Votre profil a été mis à jour avec succès !", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      logger.error("Erreur mise à jour profil:", error);
      showAlert(
        "Erreur",
        getErrorMessage(error, "Une erreur est survenue lors de la mise à jour"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // === Render ===
  return (
    <ScreenWrapper>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
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

          <View style={styles.headerTextContainer}>
            <Typo size={24} fontWeight="900" color={colors.text.primary}>
              Éditer le profil
            </Typo>
            <Typo size={14} color={colors.text.muted}>
              {isInstructor
                ? "Mettez à jour votre profil instructeur"
                : "Mettez à jour vos informations"}
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
          {/* === Avatar avec upload === */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={styles.avatarSection}
          >
            <Avatar
              imageUri={avatarUri}
              name={user ? `${user.firstName} ${user.lastName}` : "User"}
              size="xl"
              editable
              onEditPress={handleAvatarPress}
              loading={isLoadingAvatar || isUploadingPhoto || isPickerLoading}
              verified={isInstructor}
            />
            <Typo
              size={13}
              color={colors.text.muted}
              style={{ marginTop: spacingY._10, textAlign: "center" }}
            >
              Appuyez pour changer la photo
            </Typo>
          </Animated.View>

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
                {/* === Informations personnelles === */}
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

                {/* === Date de naissance (Customer) === */}
                {isCustomer && (
                  <FormSection icon="CakeIcon" title="Date de naissance">
                    <DatePickerInput
                      value={birthDate}
                      onChange={setBirthDate}
                    />
                  </FormSection>
                )}

                {/* === Coordonnées === */}
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

                {/* === Section Instructor === */}
                {isInstructor && (
                  <>
                    <FormSection
                      icon="IdentificationCardIcon"
                      title="Votre profil instructeur"
                    >
                      {/* Bio TextArea */}
                      <View
                        style={[
                          styles.textAreaContainer,
                          {
                            backgroundColor: colors.background.input,
                            borderColor: isBioFocused
                              ? colors.accent.primary
                              : colors.border.default,
                          },
                        ]}
                      >
                        <View style={styles.textAreaIconContainer}>
                          <Icons.TextAlignLeftIcon
                            size={verticalScale(24)}
                            color={colors.text.muted}
                            weight="duotone"
                          />
                        </View>
                        <TextInput
                          placeholder="Bio / Description"
                          placeholderTextColor={colors.text.muted}
                          value={bio}
                          onChangeText={setBio}
                          multiline
                          numberOfLines={5}
                          textAlignVertical="top"
                          onFocus={() => setIsBioFocused(true)}
                          onBlur={() => setIsBioFocused(false)}
                          style={[
                            styles.textAreaInput,
                            { color: colors.text.primary },
                          ]}
                        />
                      </View>

                      <Typo
                        size={12}
                        color={colors.text.muted}
                        style={{ marginTop: 4, marginLeft: 4 }}
                      >
                        Décrivez votre parcours et votre style d'enseignement
                      </Typo>

                      {/* Spécialité */}
                      <View style={styles.specialtyContainer}>
                        <Typo
                          size={14}
                          fontWeight="600"
                          color={colors.text.secondary}
                          style={{ marginBottom: 8 }}
                        >
                          Spécialité principale
                        </Typo>
                        <View style={styles.specialtyOptions}>
                          {SPECIALTY_OPTIONS.map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              onPress={() => setSpecialty(option.value)}
                              style={[
                                styles.specialtyChip,
                                {
                                  backgroundColor:
                                    specialty === option.value
                                      ? colors.accent.primary
                                      : colors.background.input,
                                  borderColor:
                                    specialty === option.value
                                      ? colors.accent.primary
                                      : colors.border.default,
                                },
                              ]}
                            >
                              <Typo
                                size={13}
                                fontWeight="600"
                                color={
                                  specialty === option.value
                                    ? colors.constant.white
                                    : colors.text.secondary
                                }
                              >
                                {option.label}
                              </Typo>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Années d'expérience */}
                      <Input
                        placeholder="Années d'expérience"
                        value={yearsOfExperience}
                        onChangeText={setYearsOfExperience}
                        keyboardType="numeric"
                        icon={
                          <Icons.TrophyIcon
                            size={verticalScale(24)}
                            color={colors.text.muted}
                            weight="duotone"
                          />
                        }
                      />
                    </FormSection>

                    {/* Réseaux sociaux */}
                    <FormSection
                      icon="ShareNetworkIcon"
                      title="Réseaux sociaux"
                    >
                      <FormInputGroup>
                        <Input
                          placeholder="Instagram (@handle)"
                          value={instagramHandle}
                          onChangeText={setInstagramHandle}
                          autoCapitalize="none"
                          icon={
                            <Icons.InstagramLogoIcon
                              size={verticalScale(24)}
                              color={colors.text.muted}
                              weight="duotone"
                            />
                          }
                        />
                        <Input
                          placeholder="Chaîne YouTube"
                          value={youtubeChannel}
                          onChangeText={setYoutubeChannel}
                          autoCapitalize="none"
                          icon={
                            <Icons.YoutubeLogo
                              size={verticalScale(24)}
                              color={colors.text.muted}
                              weight="duotone"
                            />
                          }
                        />
                      </FormInputGroup>

                      <InfoBox message="Ces informations seront visibles sur votre profil public" />
                    </FormSection>
                  </>
                )}

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
              style={[
                styles.saveButton,
                { shadowColor: colors.accent.primary },
              ]}
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
            colors.background.scrim,
          ]}
          style={[styles.bottomGradient, { height: insets.bottom + 50 }]}
          pointerEvents="none"
        />
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModal;

// ============================================
// STYLES
// ============================================
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
  avatarSection: {
    alignItems: "center",
    marginBottom: spacingY._20,
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
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 140,
  },
  textAreaIconContainer: {
    paddingTop: 2,
    marginRight: 12,
  },
  textAreaInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "System",
    minHeight: 110,
    paddingTop: 0,
    paddingBottom: 0,
  },
  specialtyContainer: {
    marginTop: spacingY._16,
  },
  specialtyOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
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
