// ============================================
// 🛹 SOSKATE - BOOKING DETAIL MODAL
// ============================================
// Modal affichant les détails d'une réservation

import React, { useState } from "react";
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
import BookingStatusBadge from "./BookingStatusBadge";
import EditNotesModal from "./EditNotesModal";
import {
  MyBookingResponse,
  formatBookingDate,
  formatBookingTime,
  formatPrice,
  formatDuration,
  canCancelBooking,
  canEditNotes,
  isBookingPast,
} from "../types/my-bookings.types";

interface BookingDetailModalProps {
  visible: boolean;
  booking: MyBookingResponse | null;
  onClose: () => void;
  onCancel: (participationId: number) => Promise<boolean>;
  onUpdateNotes: (participationId: number, notes: string) => Promise<boolean>;
  isCancelling: boolean;
  isUpdatingNotes: boolean;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  highlight = false,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.detailRow,
        highlight && {
          backgroundColor: isDark
            ? "rgba(255, 107, 53, 0.1)"
            : "rgba(234, 88, 12, 0.08)",
          borderRadius: 12,
          padding: 12,
          marginHorizontal: -12,
        },
      ]}
    >
      <View style={styles.detailRowLeft}>
        {icon}
        <Typo size={14} color={colors.text.secondary}>
          {label}
        </Typo>
      </View>
      <Typo
        size={14}
        fontWeight={highlight ? "700" : "600"}
        color={highlight ? colors.accent.primary : colors.text.primary}
        style={{ flex: 1, textAlign: "right" }}
      >
        {value}
      </Typo>
    </View>
  );
};

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  visible,
  booking,
  onClose,
  onCancel,
  onUpdateNotes,
  isCancelling,
  isUpdatingNotes,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [showEditNotes, setShowEditNotes] = useState(false);

  if (!booking) return null;

  const isPast = isBookingPast(booking);
  const canCancel = canCancelBooking(booking);
  const canEdit = canEditNotes(booking);

  // Calculer la date limite d'annulation
  const getCancellationDeadline = (): string => {
    const startTime = new Date(booking.startTime);
    const deadline = new Date(startTime.getTime() - 48 * 60 * 60 * 1000);
    return deadline.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler la réservation",
      "Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.",
      [
        {
          text: "Non, garder",
          style: "cancel",
        },
        {
          text: "Oui, annuler",
          style: "destructive",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const success = await onCancel(booking.participationId);
            if (success) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              onClose();
            }
          },
        },
      ],
    );
  };

  const handleSaveNotes = async (notes: string): Promise<boolean> => {
    return await onUpdateNotes(booking.participationId, notes);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <>
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
            <View style={{ width: 40 }} />

            <Typo size={16} fontWeight="600" color={colors.text.primary}>
              Détails de la réservation
            </Typo>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Icons.XIcon
                size={24}
                color={colors.text.primary}
                weight="bold"
              />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <BookingStatusBadge
                participantStatus={booking.participantStatus}
                bookingStatus={booking.bookingStatus}
                isPast={isPast}
              />
            </View>

            {/* Détails */}
            <View
              style={[
                styles.detailsCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: colors.border.subtle,
                },
              ]}
            >
              <DetailRow
                icon={
                  <Icons.MapPinIcon
                    size={18}
                    color={colors.text.secondary}
                    weight="fill"
                  />
                }
                label="Lieu"
                value={booking.spotName}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.subtle },
                ]}
              />

              <DetailRow
                icon={
                  <Icons.UserIcon
                    size={18}
                    color={colors.text.secondary}
                    weight="fill"
                  />
                }
                label="Instructeur"
                value={`${booking.instructorFirstname} ${booking.instructorLastname}`}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.subtle },
                ]}
              />

              <DetailRow
                icon={
                  <Icons.HockeyIcon
                    size={18}
                    color={colors.text.secondary}
                    weight="fill"
                  />
                }
                label="Prestation"
                value={booking.serviceName}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.subtle },
                ]}
              />

              <DetailRow
                icon={
                  <Icons.CalendarIcon
                    size={18}
                    color={colors.text.secondary}
                    weight="fill"
                  />
                }
                label="Date"
                value={formatBookingDate(booking.startTime)}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.subtle },
                ]}
              />

              <DetailRow
                icon={
                  <Icons.ClockIcon
                    size={18}
                    color={colors.text.secondary}
                    weight="fill"
                  />
                }
                label="Horaire"
                value={`${formatBookingTime(booking.startTime)} → ${formatBookingTime(booking.endTime)}`}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.subtle },
                ]}
              />

              <DetailRow
                icon={
                  <Icons.HourglassIcon
                    size={18}
                    color={colors.text.secondary}
                    weight="fill"
                  />
                }
                label="Durée"
                value={formatDuration(booking.durationMinutes)}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.subtle },
                ]}
              />

              <DetailRow
                icon={
                  <Icons.CurrencyEurIcon
                    size={18}
                    color={colors.accent.primary}
                    weight="fill"
                  />
                }
                label="Prix total"
                value={formatPrice(booking.totalPriceCents)}
                highlight
              />
            </View>

            {/* Notes */}
            <View style={styles.notesSection}>
              <View style={styles.notesHeader}>
                <View style={styles.notesHeaderLeft}>
                  <Icons.NoteIcon size={18} color={colors.text.secondary} />
                  <Typo size={14} fontWeight="600" color={colors.text.primary}>
                    Notes
                  </Typo>
                </View>

                {canEdit && (
                  <Pressable
                    onPress={() => setShowEditNotes(true)}
                    style={styles.editButton}
                  >
                    <Icons.PencilSimpleIcon
                      size={16}
                      color={colors.accent.primary}
                    />
                    <Typo
                      size={13}
                      color={colors.accent.primary}
                      fontWeight="500"
                    >
                      Modifier
                    </Typo>
                  </Pressable>
                )}
              </View>

              <View
                style={[
                  styles.notesContent,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                    borderColor: colors.border.subtle,
                  },
                ]}
              >
                <Typo
                  size={14}
                  color={
                    booking.participantsNotes
                      ? colors.text.primary
                      : colors.text.muted
                  }
                  style={{
                    fontStyle: booking.participantsNotes ? "normal" : "italic",
                  }}
                >
                  {booking.participantsNotes || "Aucune note ajoutée"}
                </Typo>
              </View>
            </View>

            {/* Info annulation */}
            {!isPast && booking.participantStatus !== "CANCELLED" && (
              <View
                style={[
                  styles.infoBox,
                  {
                    backgroundColor: canCancel
                      ? colors.semantic.infoBg
                      : colors.semantic.warningBg,
                    borderColor: canCancel
                      ? colors.semantic.infoBorder
                      : colors.semantic.warningBorder,
                  },
                ]}
              >
                <Icons.InfoIcon
                  size={18}
                  color={
                    canCancel ? colors.semantic.info : colors.semantic.warning
                  }
                  weight="fill"
                />
                <Typo
                  size={12}
                  color={
                    canCancel ? colors.semantic.info : colors.semantic.warning
                  }
                  style={{ flex: 1 }}
                >
                  {canCancel
                    ? `Annulation gratuite jusqu'au ${getCancellationDeadline()}`
                    : "Le délai d'annulation gratuite (48h) est dépassé"}
                </Typo>
              </View>
            )}
          </ScrollView>

          {/* Footer avec actions */}
          {!isPast && booking.participantStatus !== "CANCELLED" && (
            <View
              style={[
                styles.footer,
                {
                  paddingBottom: insets.bottom + 16,
                  backgroundColor: colors.background.primary,
                  borderTopColor: colors.border.subtle,
                },
              ]}
            >
              {canCancel && (
                <Pressable
                  style={[
                    styles.cancelButton,
                    {
                      backgroundColor: colors.semantic.dangerBg,
                      borderColor: colors.semantic.dangerBorder,
                    },
                  ]}
                  onPress={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.semantic.danger}
                    />
                  ) : (
                    <>
                      <Icons.XCircleIcon
                        size={20}
                        color={colors.semantic.danger}
                        weight="fill"
                      />
                      <Typo
                        size={15}
                        fontWeight="600"
                        color={colors.semantic.danger}
                      >
                        Annuler la réservation
                      </Typo>
                    </>
                  )}
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Modal>

      {/* Modal édition notes */}
      <EditNotesModal
        visible={showEditNotes}
        currentNotes={booking.participantsNotes}
        onClose={() => setShowEditNotes(false)}
        onSave={handleSaveNotes}
        isLoading={isUpdatingNotes}
      />
    </>
  );
};

export default BookingDetailModal;

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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  statusContainer: {
    alignItems: "center",
  },
  detailsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  detailRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    height: 1,
  },
  notesSection: {
    gap: 10,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  notesContent: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    minHeight: 60,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
