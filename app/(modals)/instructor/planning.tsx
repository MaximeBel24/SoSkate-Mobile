// ============================================
// 🛹 SOSKATE - MY PLANNING SCREEN
// ============================================
// Écran de planning pour les instructeurs

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

// Components
import WeekCalendarView from "@/src/features/planning/components/WeekCalendarView";
import AddAvailabilityModal from "@/src/features/planning/components/AddAvailabilityModal";

// Hooks
import { useWeekNavigation } from "@/src/features/planning/hooks/useWeekNavigation";
import { usePlanningData } from "@/src/features/planning/hooks/usePlanningData";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";
import { InstructorBookingResponse } from "@/src/features/planning/types/planning.types";
import {useCustomAlert} from "@/src/shared/ui/CustomModal/AlertContext";

export default function PlanningScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useCustomAlert();

  // Navigation semaine
  const {
    weekDays,
    weekLabel,
    fromDate,
    toDate,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
  } = useWeekNavigation();

  // Données du planning
  const {
    availabilities,
    bookings,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    refresh,
    addAvailability,
    editAvailability,
    removeAvailability,
  } = usePlanningData({ fromDate, toDate });

  // États locaux
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedAvailability, setSelectedAvailability] =
    useState<AvailabilityResponse | null>(null);

  const handleClose = () => {
    router.back();
  };

  const handlePreviousWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    goToPreviousWeek();
  };

  const handleNextWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    goToNextWeek();
  };

  const handleTodayPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    goToCurrentWeek();
  };

  // Ouvrir modal pour ajouter (bouton header)
  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedAvailability(null);
    setShowModal(true);
  };

  // Ouvrir modal pour ajouter (clic sur calendrier)
  const handleEmptySlotPress = (date: string, hour: number) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setSelectedAvailability(null);
    setShowModal(true);
  };

  // Ouvrir modal pour modifier
  const handleAvailabilityPress = (availability: AvailabilityResponse) => {
    setSelectedDate(availability.date);
    setSelectedHour(null);
    setSelectedAvailability(availability);
    setShowModal(true);
  };

  // Clic sur une réservation (afficher un message pour l'instant)
  const handleBookingPress = (booking: InstructorBookingResponse) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const startTime = new Date(booking.startTime).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(booking.endTime).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    showAlert(
      "Réservation",
      `${booking.customer?.firstname || "Client"} ${booking.customer?.lastname || ""}\n\n` +
        `📍 ${booking.spot?.name || "Spot"}\n` +
        `🕐 ${startTime} - ${endTime}\n` +
        `📝 ${booking.service?.name || "Service"}\n\n` +
        `${booking.participantsNotes ? `Notes: ${booking.participantsNotes}` : ""}`,
      [{ text: "OK" }],
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedAvailability(null);
  };

  const handleSaveAvailability = async (data: {
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<boolean> => {
    return await addAvailability(data);
  };

  const handleUpdateAvailability = async (
    availabilityId: number,
    data: { startTime: string; endTime: string },
  ): Promise<boolean> => {
    return await editAvailability(availabilityId, data);
  };

  const handleDeleteAvailability = async (
    availabilityId: number,
  ): Promise<boolean> => {
    return await removeAvailability(availabilityId);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
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
          <Icons.CaretLeftIcon
            size={24}
            color={colors.text.primary}
            weight="bold"
          />
        </Pressable>

        <Typo size={18} fontWeight="700" color={colors.text.primary}>
          Mon planning
        </Typo>

        {/* Bouton ajouter dans le header */}
        <Pressable onPress={handleAddPress} style={styles.headerButton}>
          <Icons.PlusIcon
            size={24}
            color={colors.accent.primary}
            weight="bold"
          />
        </Pressable>
      </View>

      {/* Navigation semaine */}
      <View
        style={[
          styles.weekNav,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.01)",
            borderBottomColor: colors.border.subtle,
          },
        ]}
      >
        <Pressable onPress={handlePreviousWeek} style={styles.navButton}>
          <Icons.CaretLeftIcon
            size={20}
            color={colors.text.primary}
            weight="bold"
          />
        </Pressable>

        <Pressable onPress={handleTodayPress}>
          <View style={styles.weekLabelContainer}>
            <Typo size={15} fontWeight="600" color={colors.text.primary}>
              {weekLabel}
            </Typo>
            {!isCurrentWeek && (
              <Typo size={11} color={colors.accent.primary}>
                (Aujourd'hui)
              </Typo>
            )}
          </View>
        </Pressable>

        <Pressable onPress={handleNextWeek} style={styles.navButton}>
          <Icons.CaretRightIcon
            size={20}
            color={colors.text.primary}
            weight="bold"
          />
        </Pressable>
      </View>

      {/* Légende */}
      <View
        style={[
          styles.legend,
          {
            borderBottomColor: colors.border.subtle,
          },
        ]}
      >
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
          <Typo size={11} color={colors.text.muted}>
            Disponible
          </Typo>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FF6B35" }]} />
          <Typo size={11} color={colors.text.muted}>
            Réservé
          </Typo>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#9ca3af" }]} />
          <Typo size={11} color={colors.text.muted}>
            Passé
          </Typo>
        </View>
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Typo size={14} color={colors.text.muted}>
            Chargement du planning...
          </Typo>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icons.WarningCircleIcon
            size={48}
            color={colors.semantic.danger}
            weight="thin"
          />
          <Typo size={16} fontWeight="600" color={colors.text.primary}>
            Oups !
          </Typo>
          <Typo
            size={14}
            color={colors.text.muted}
            style={{ textAlign: "center" }}
          >
            {error}
          </Typo>
          <Pressable
            style={[
              styles.retryButton,
              { backgroundColor: colors.accent.primary },
            ]}
            onPress={refresh}
          >
            <Typo size={14} fontWeight="600" color={colors.constant.white}>
              Réessayer
            </Typo>
          </Pressable>
        </View>
      ) : (
        <View style={styles.calendarContainer}>
          <WeekCalendarView
            weekDays={weekDays}
            availabilities={availabilities}
            bookings={bookings}
            onAvailabilityPress={handleAvailabilityPress}
            onBookingPress={handleBookingPress}
            onEmptySlotPress={handleEmptySlotPress}
          />
        </View>
      )}

      {/* Info en bas */}
      {!isLoading && !error && (
        <View
          style={[
            styles.infoBar,
            {
              backgroundColor: colors.background.subtle,
              paddingBottom: insets.bottom + 12,
              borderTopColor: colors.border.subtle,
            },
          ]}
        >
          <Icons.InfoIcon size={14} color={colors.text.muted} weight="fill" />
          <Typo size={11} color={colors.text.muted}>
            Tapez sur une case vide pour ajouter une disponibilité
          </Typo>
        </View>
      )}

      {/* Modal ajout/modification */}
      <AddAvailabilityModal
        visible={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveAvailability}
        onUpdate={handleUpdateAvailability}
        onDelete={handleDeleteAvailability}
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        existingAvailability={selectedAvailability}
        isLoading={isCreating || isUpdating || isDeleting}
      />
    </View>
  );
}

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
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  weekLabelContainer: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  calendarContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
  },
});
