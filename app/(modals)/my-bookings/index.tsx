// ============================================
// 🛹 SOSKATE - MY BOOKINGS SCREEN
// ============================================
// Écran "Mes réservations" avec liste et détails

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

// Components

// Hooks & Types
import { useMyBookings } from "@/src/features/my-bookings/hooks/useMyBookings";
import { MyBookingResponse } from "@/src/features/my-bookings/types/my-bookings.types";
import BookingCard from "@/src/features/my-bookings/components/BookingCard";
import BookingDetailModal from "@/src/features/my-bookings/components/BookingDetailsModal";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import CustomModal from "@/src/shared/ui/CustomModal/CustomModal";

export default function MyBookingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    groupedBookings,
    isLoading,
    isRefreshing,
    isCancelling,
    isUpdatingNotes,
    error,
    refresh,
    cancel,
    updateNotes,
  } = useMyBookings();

  const [selectedBooking, setSelectedBooking] =
    useState<MyBookingResponse | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleBookingPress = (booking: MyBookingResponse) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedBooking(null);
  };

  const handleCancel = async (participationId: number): Promise<boolean> => {
    const success = await cancel(participationId);
    return success;
  };

  const handleUpdateNotes = async (
    participationId: number,
    notes: string,
  ): Promise<boolean> => {
    const success = await updateNotes(participationId, notes);
    if (success && selectedBooking) {
      // Mettre à jour le booking sélectionné
      setSelectedBooking({
        ...selectedBooking,
        participantsNotes: notes,
      });
    }
    return success;
  };

  const hasUpcoming = groupedBookings.upcoming.length > 0;
  const hasPast = groupedBookings.past.length > 0;
  const isEmpty = !hasUpcoming && !hasPast;

  // Rendu section
  const renderSection = (
    title: string,
    icon: React.ReactNode,
    bookings: MyBookingResponse[],
    emptyMessage: string,
  ) => {
    if (bookings.length === 0 && !isLoading) {
      return null;
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {icon}
          <Typo size={16} fontWeight="700" color={colors.text.primary}>
            {title}
          </Typo>
          <View
            style={[
              styles.countBadge,
              { backgroundColor: colors.accent.primary },
            ]}
          >
            <Typo size={12} fontWeight="600" color={colors.constant.white}>
              {bookings.length}
            </Typo>
          </View>
        </View>

        <View style={styles.bookingsList}>
          {bookings.map((booking, index) => (
            <Animated.View
              key={booking.participationId}
              entering={FadeInDown.delay(index * 50).springify()}
            >
              <BookingCard
                booking={booking}
                onPress={() => handleBookingPress(booking)}
              />
            </Animated.View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
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

          <Typo size={18} fontWeight="700" color={colors.text.primary}>
            Mes réservations
          </Typo>

          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Icons.XIcon size={24} color={colors.text.primary} weight="bold" />
          </Pressable>
        </View>

        {/* Content */}
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.primary} />
            <Typo size={14} color={colors.text.muted}>
              Chargement de vos réservations...
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
        ) : isEmpty ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconContainer,
                {
                  backgroundColor: colors.background.subtle,
                  borderColor: colors.border.default,
                },
              ]}
            >
              <Icons.CalendarBlankIcon
                size={56}
                color={colors.text.muted}
                weight="thin"
              />
            </View>
            <Typo size={18} fontWeight="600" color={colors.text.primary}>
              Aucune réservation
            </Typo>
            <Typo
              size={14}
              color={colors.text.muted}
              style={{ textAlign: "center", maxWidth: 280 }}
            >
              Vous n'avez pas encore de réservation. Explorez la carte pour
              trouver un spot et réserver un cours !
            </Typo>
            <Pressable
              style={[
                styles.exploreButton,
                { backgroundColor: colors.accent.primary },
              ]}
              onPress={handleClose}
            >
              <Icons.MapPinIcon
                size={20}
                color={colors.constant.white}
                weight="fill"
              />
              <Typo size={15} fontWeight="600" color={colors.constant.white}>
                Explorer la carte
              </Typo>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                tintColor={colors.accent.primary}
                colors={[colors.accent.primary]}
              />
            }
          >
            {/* Section À venir */}
            {renderSection(
              "À venir",
              <Icons.CalendarCheckIcon
                size={20}
                color={colors.semantic.success}
                weight="fill"
              />,
              groupedBookings.upcoming,
              "Aucune réservation à venir",
            )}

            {/* Section Passées */}
            {renderSection(
              "Passées",
              <Icons.ClockCounterClockwiseIcon
                size={20}
                color={colors.text.muted}
                weight="fill"
              />,
              groupedBookings.past,
              "Aucune réservation passée",
            )}
          </ScrollView>
        )}

        {/* Modal détail */}
        <BookingDetailModal
          visible={showDetail}
          booking={selectedBooking}
          onClose={handleCloseDetail}
          onCancel={handleCancel}
          onUpdateNotes={handleUpdateNotes}
          isCancelling={isCancelling}
          isUpdatingNotes={isUpdatingNotes}
        />
      </View>
    </ScreenWrapper>
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
    gap: 28,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  bookingsList: {
    gap: 12,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  // Error
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
  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 8,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
});
