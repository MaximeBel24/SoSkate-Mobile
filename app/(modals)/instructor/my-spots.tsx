// ============================================
// 🛹 SOSKATE - MY SPOTS SCREEN
// ============================================
// Écran pour gérer les spots où l'instructeur enseigne

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
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

// Hooks
import { useInstructorSpots } from "@/src/features/instructor-spots/hooks/useInstructorSpots";
import InstructorSpotCard from "@/src/features/instructor-spots/components/InstructorSpotCard";
import AddSpotModal from "@/src/features/instructor-spots/components/AddSpotModal";
import {SpotResponse} from "@/src/shared/types/spot.interface";

export default function MySpotsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    spots,
    spotIds,
    isLoading,
    isAdding,
    isRemoving,
    error,
    refresh,
    addSpot,
    removeSpot,
  } = useInstructorSpots();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleAddSpot = async (spotId: number, spot: SpotResponse): Promise<boolean> => {
    return await addSpot(spotId, spot);
  };

  const handleRemoveSpot = async (spotId: number): Promise<boolean> => {
    return await removeSpot(spotId);
  };

  const openAddModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAddModal(true);
  };

  const isEmpty = spots.length === 0;

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
        <Pressable onPress={handleClose} style={styles.backButton}>
          <Icons.CaretLeftIcon
            size={24}
            color={colors.text.primary}
            weight="bold"
          />
        </Pressable>

        <Typo size={18} fontWeight="700" color={colors.text.primary}>
          Mes spots d'enseignement
        </Typo>

        <Pressable onPress={openAddModal} style={styles.addButton}>
          <Icons.PlusIcon
            size={24}
            color={colors.accent.primary}
            weight="bold"
          />
        </Pressable>
      </View>

      {/* Content */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Typo size={14} color={colors.text.muted}>
            Chargement de vos spots...
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
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                borderColor: colors.border.default,
              },
            ]}
          >
            <Icons.MapPinIcon
              size={56}
              color={colors.text.muted}
              weight="thin"
            />
          </View>
          <Typo size={18} fontWeight="600" color={colors.text.primary}>
            Aucun spot configuré
          </Typo>
          <Typo
            size={14}
            color={colors.text.muted}
            style={{ textAlign: "center", maxWidth: 280 }}
          >
            Ajoutez les spots où vous souhaitez donner des cours pour être
            visible par les élèves.
          </Typo>
          <Pressable
            style={[
              styles.addFirstButton,
              { backgroundColor: colors.accent.primary },
            ]}
            onPress={openAddModal}
          >
            <Icons.PlusIcon
              size={20}
              color={colors.constant.white}
              weight="bold"
            />
            <Typo size={15} fontWeight="600" color={colors.constant.white}>
              Ajouter mon premier spot
            </Typo>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent.primary}
              colors={[colors.accent.primary]}
            />
          }
        >
          {/* Info banner */}
          <Animated.View
            entering={FadeInDown.delay(50).springify()}
            style={[
              styles.infoBanner,
              {
                backgroundColor: colors.semantic.infoBg,
                borderColor: colors.semantic.infoBorder,
              },
            ]}
          >
            <Icons.InfoIcon
              size={18}
              color={colors.semantic.info}
              weight="fill"
            />
            <Typo size={13} color={colors.semantic.info} style={{ flex: 1 }}>
              Les élèves pourront vous trouver et réserver des cours sur ces
              spots.
            </Typo>
          </Animated.View>

          {/* Liste des spots */}
          <View style={styles.spotsList}>
            <View style={styles.sectionHeader}>
              <Typo size={14} fontWeight="600" color={colors.text.secondary}>
                {spots.length} spot{spots.length > 1 ? "s" : ""} configuré
                {spots.length > 1 ? "s" : ""}
              </Typo>
            </View>

            {spots.map((spot, index) => (
              <InstructorSpotCard
                key={spot.id}
                spot={spot}
                onRemove={handleRemoveSpot}
                isRemoving={isRemoving}
                animationDelay={100 + index * 50}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Floating add button (si pas vide) */}
      {!isEmpty && !isLoading && (
        <Pressable
          style={[
            styles.floatingButton,
            {
              backgroundColor: colors.accent.primary,
              bottom: insets.bottom + 20,
            },
          ]}
          onPress={openAddModal}
        >
          <Icons.PlusIcon
            size={24}
            color={colors.constant.white}
            weight="bold"
          />
        </Pressable>
      )}

      {/* Modal d'ajout */}
      <AddSpotModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSpot={handleAddSpot}
        associatedSpotIds={spotIds}
        isAdding={isAdding}
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  spotsList: {
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
  addFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  // Floating button
  floatingButton: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
