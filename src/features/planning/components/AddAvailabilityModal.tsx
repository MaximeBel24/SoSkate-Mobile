// ============================================
// 🛹 SOSKATE - ADD AVAILABILITY MODAL
// ============================================
// Modal pour ajouter ou modifier une disponibilité

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";
import {
  PLANNING_START_HOUR,
  PLANNING_END_HOUR,
} from "../types/planning.types";
import { useCustomAlert } from "@/src/shared/ui/CustomModal/AlertContext";

interface AddAvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    date: string;
    startTime: string;
    endTime: string;
  }) => Promise<boolean>;
  onUpdate?: (
    availabilityId: number,
    data: { startTime: string; endTime: string },
  ) => Promise<boolean>;
  onDelete?: (availabilityId: number) => Promise<boolean>;
  selectedDate: string | null;
  selectedHour: number | null;
  existingAvailability: AvailabilityResponse | null;
  isLoading: boolean;
}

// Générer les options d'heures
const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let hour = PLANNING_START_HOUR; hour <= PLANNING_END_HOUR; hour++) {
    options.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < PLANNING_END_HOUR) {
      options.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// Générer les 14 prochains jours
const generateDateOptions = (): { date: string; label: string }[] => {
  const options: { date: string; label: string }[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateString = date.toISOString().split("T")[0];
    const label = date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    options.push({ date: dateString, label });
  }

  return options;
};

const AddAvailabilityModal: React.FC<AddAvailabilityModalProps> = ({
  visible,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  selectedDate,
  selectedHour,
  existingAvailability,
  isLoading,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");

  const isEditMode = !!existingAvailability;
  const dateOptions = useMemo(() => generateDateOptions(), []);

  const { showAlert } = useCustomAlert();

  // Initialiser les valeurs
  useEffect(() => {
    if (visible) {
      if (existingAvailability) {
        // Mode édition
        setDate(existingAvailability.date);
        setStartTime(existingAvailability.startTime);
        setEndTime(existingAvailability.endTime);
      } else if (selectedDate) {
        // Mode création avec date présélectionnée
        setDate(selectedDate);

        if (selectedHour !== null) {
          const start = `${selectedHour.toString().padStart(2, "0")}:00`;
          const endHour = Math.min(selectedHour + 2, PLANNING_END_HOUR);
          const end = `${endHour.toString().padStart(2, "0")}:00`;
          setStartTime(start);
          setEndTime(end);
        } else {
          setStartTime("09:00");
          setEndTime("12:00");
        }
      } else {
        // Mode création par défaut (aujourd'hui)
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        setStartTime("09:00");
        setEndTime("12:00");
      }
    }
  }, [visible, existingAvailability, selectedDate, selectedHour]);

  // Formater la date pour l'affichage
  const formatDateDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const dateObj = new Date(dateString + "T00:00:00");
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Valider les heures
  const isValidTimeRange = (): boolean => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Au moins 1h de différence
    return endMinutes - startMinutes >= 60;
  };

  // Calculer la durée
  const calculateDuration = (): string => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const durationMinutes = endMinutes - startMinutes;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!isValidTimeRange()) {
      showAlert("Durée invalide", "La durée minimum d'une disponibilité est d'1 heure.");
    }

    if (!date) {
      showAlert("Date manquante", "Veuillez sélectionner une date.");
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let success = false;

    if (isEditMode && onUpdate && existingAvailability) {
      success = await onUpdate(existingAvailability.id, { startTime, endTime });
    } else {
      success = await onSave({
        date,
        startTime,
        endTime,
      });
    }

    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    }
  };

  const handleDelete = () => {
    if (!existingAvailability || !onDelete) return;

    showAlert(
        "Supprimer la disponibilité",
        "Êtes-vous sûr de vouloir supprimer cette disponibilité ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              const success = await onDelete(existingAvailability.id);
              if (success) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onClose();
              }
            },
          },
        ],
    );
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  // Filtrer les options de fin (après l'heure de début + 1h minimum)
  const getEndTimeOptions = (): string[] => {
    const [startH, startM] = startTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;

    return TIME_OPTIONS.filter((time) => {
      const [h, m] = time.split(":").map(Number);
      const minutes = h * 60 + m;
      return minutes >= startMinutes + 60;
    });
  };

  const handleDateSelect = (selectedDateValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDate(selectedDateValue);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
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
            {isEditMode ? "Modifier" : "Ajouter"} une disponibilité
          </Typo>

          <View style={styles.headerButton} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Date - Sélectionnable si pas en mode édition */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icons.CalendarIcon
                size={20}
                color={colors.accent.primary}
                weight="fill"
              />
              <Typo size={14} fontWeight="600" color={colors.text.primary}>
                Date
              </Typo>
            </View>

            {isEditMode ? (
              // En mode édition, date non modifiable
              <View
                style={[
                  styles.dateDisplay,
                  {
                    backgroundColor: colors.background.subtle,
                    borderColor: colors.border.default,
                  },
                ]}
              >
                <Typo
                  size={15}
                  color={colors.text.primary}
                  style={{ textTransform: "capitalize" }}
                >
                  {formatDateDisplay(date)}
                </Typo>
              </View>
            ) : (
              // En mode création, dates sélectionnables
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateOptionsContainer}
              >
                {dateOptions.map((option) => (
                  <Pressable
                    key={option.date}
                    onPress={() => handleDateSelect(option.date)}
                    style={[
                      styles.dateOption,
                      {
                        backgroundColor:
                          date === option.date
                            ? colors.accent.primary
                            : colors.background.subtle,
                        borderColor:
                          date === option.date
                            ? colors.accent.primary
                            : colors.border.default,
                      },
                    ]}
                  >
                    <Typo
                      size={12}
                      fontWeight={date === option.date ? "600" : "400"}
                      color={
                        date === option.date
                          ? colors.constant.white
                          : colors.text.primary
                      }
                      style={{ textTransform: "capitalize" }}
                    >
                      {option.label}
                    </Typo>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Heure de début */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icons.ClockIcon
                size={20}
                color={colors.semantic.success}
                weight="fill"
              />
              <Typo size={14} fontWeight="600" color={colors.text.primary}>
                Heure de début
              </Typo>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeOptionsContainer}
            >
              {TIME_OPTIONS.slice(0, -2).map((time) => (
                <Pressable
                  key={`start-${time}`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setStartTime(time);
                    // Ajuster l'heure de fin si nécessaire
                    const [h, m] = time.split(":").map(Number);
                    const [endH, endM] = endTime.split(":").map(Number);
                    if (endH * 60 + endM <= h * 60 + m + 60) {
                      const newEndH = Math.min(h + 2, PLANNING_END_HOUR);
                      setEndTime(`${newEndH.toString().padStart(2, "0")}:00`);
                    }
                  }}
                  style={[
                    styles.timeOption,
                    {
                      backgroundColor:
                        startTime === time
                          ? colors.accent.primary
                          : colors.background.subtle,
                      borderColor:
                        startTime === time
                          ? colors.accent.primary
                          : colors.border.default,
                    },
                  ]}
                >
                  <Typo
                    size={14}
                    fontWeight={startTime === time ? "600" : "400"}
                    color={
                      startTime === time
                        ? colors.constant.white
                        : colors.text.primary
                    }
                  >
                    {time}
                  </Typo>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Heure de fin */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icons.ClockCountdownIcon
                size={20}
                color={colors.semantic.danger}
                weight="fill"
              />
              <Typo size={14} fontWeight="600" color={colors.text.primary}>
                Heure de fin
              </Typo>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeOptionsContainer}
            >
              {getEndTimeOptions().map((time) => (
                <Pressable
                  key={`end-${time}`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setEndTime(time);
                  }}
                  style={[
                    styles.timeOption,
                    {
                      backgroundColor:
                        endTime === time
                          ? colors.accent.primary
                          : colors.background.subtle,
                      borderColor:
                        endTime === time
                          ? colors.accent.primary
                          : colors.border.default,
                    },
                  ]}
                >
                  <Typo
                    size={14}
                    fontWeight={endTime === time ? "600" : "400"}
                    color={
                      endTime === time
                        ? colors.constant.white
                        : colors.text.primary
                    }
                  >
                    {time}
                  </Typo>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Résumé */}
          {isValidTimeRange() && (
            <View
              style={[
                styles.summary,
                {
                  backgroundColor: colors.semantic.successBg,
                  borderColor: colors.semantic.successBorder,
                },
              ]}
            >
              <Icons.CheckCircleIcon
                size={20}
                color={colors.semantic.success}
                weight="fill"
              />
              <View style={styles.summaryText}>
                <Typo
                  size={14}
                  fontWeight="600"
                  color={colors.semantic.success}
                >
                  Disponibilité de {calculateDuration()}
                </Typo>
                <Typo size={12} color={colors.semantic.success}>
                  {startTime} → {endTime}
                </Typo>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 16,
              borderTopColor: colors.border.subtle,
            },
          ]}
        >
          {/* Bouton supprimer (en mode édition) */}
          {isEditMode && onDelete && (
            <Pressable
              style={[
                styles.deleteButton,
                {
                  backgroundColor: colors.semantic.dangerBg,
                  borderColor: colors.semantic.dangerBorder,
                },
              ]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              <Icons.TrashIcon
                size={20}
                color={colors.semantic.danger}
                weight="fill"
              />
            </Pressable>
          )}

          {/* Bouton sauvegarder */}
          <Pressable
            style={[
              styles.saveButton,
              {
                backgroundColor: isValidTimeRange()
                  ? colors.accent.primary
                  : colors.border.default,
              },
            ]}
            onPress={handleSave}
            disabled={!isValidTimeRange() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.constant.white} />
            ) : (
              <>
                <Icons.CheckIcon
                  size={20}
                  color={
                    isValidTimeRange()
                      ? colors.constant.white
                      : colors.text.muted
                  }
                  weight="bold"
                />
                <Typo
                  size={16}
                  fontWeight="600"
                  color={
                    isValidTimeRange()
                      ? colors.constant.white
                      : colors.text.muted
                  }
                >
                  {isEditMode ? "Enregistrer" : "Ajouter"}
                </Typo>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AddAvailabilityModal;

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
    minWidth: 70,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateOptionsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  dateOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeOptionsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryText: {
    gap: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  deleteButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
});