// ============================================
// 🛹 SOSKATE - ADD SPOT MODAL
// ============================================
// Modal pour qu'un instructeur ajoute un nouveau spot

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/src/shared/theme";
import { logger } from "@/src/shared/utils/logger";
import Typo from "@/src/shared/ui/typography/Typo";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import { getAllSpots } from "@/src/shared/services/spotService";

interface AddSpotModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSpot: (spotId: number, spot: SpotResponse) => Promise<boolean>;
  associatedSpotIds: number[];
  isAdding: boolean;
}

const AddSpotModal: React.FC<AddSpotModalProps> = ({
  visible,
  onClose,
  onAddSpot,
  associatedSpotIds,
  isAdding,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [spots, setSpots] = useState<SpotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  // Charger les spots au montage
  useEffect(() => {
    if (visible) {
      loadSpots();
      setSearchQuery("");
      setSelectedSpotId(null);
    }
  }, [visible]);

  const loadSpots = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSpots();
      setSpots(data);
    } catch (error) {
      logger.error("Erreur chargement spots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les spots disponibles (non associés) et par recherche
  const availableSpots = useMemo(() => {
    return spots
      .filter((spot) => !associatedSpotIds.includes(spot.id))
      .filter((spot) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          spot.name.toLowerCase().includes(query) ||
          spot.city.toLowerCase().includes(query) ||
          spot.address?.toLowerCase().includes(query)
        );
      });
  }, [spots, associatedSpotIds, searchQuery]);

  const handleSelectSpot = (spotId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSpotId(spotId === selectedSpotId ? null : spotId);
  };

  const handleConfirm = async () => {
    if (!selectedSpotId) return;

    const selectedSpot = spots.find((s) => s.id === selectedSpotId);
    if (!selectedSpot) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await onAddSpot(selectedSpotId, selectedSpot);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const renderSpotItem = ({
    item,
    index,
  }: {
    item: SpotResponse;
    index: number;
  }) => {
    const isSelected = selectedSpotId === item.id;

    return (
      <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
        <Pressable
          onPress={() => handleSelectSpot(item.id)}
          style={[
            styles.spotItem,
            {
              backgroundColor: isSelected
                ? colors.accent.tint
                : colors.background.subtle,
              borderColor: isSelected
                ? colors.accent.primary
                : colors.border.subtle,
            },
          ]}
        >
          <View
            style={[
              styles.spotIcon,
              {
                backgroundColor: isSelected
                  ? colors.accent.primary
                  : colors.background.elevated,
              },
            ]}
          >
            <Icons.MapPinIcon
              size={20}
              color={isSelected ? colors.constant.white : colors.text.muted}
              weight="fill"
            />
          </View>

          <View style={styles.spotContent}>
            <Typo
              size={14}
              fontWeight="600"
              color={colors.text.primary}
              numberOfLines={1}
            >
              {item.name}
            </Typo>
            <Typo size={12} color={colors.text.secondary} numberOfLines={1}>
              {item.city}
            </Typo>
          </View>

          {isSelected && (
            <View
              style={[
                styles.checkIcon,
                { backgroundColor: colors.accent.primary },
              ]}
            >
              <Icons.CheckIcon
                size={16}
                color={colors.constant.white}
                weight="bold"
              />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
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
            Ajouter un spot
          </Typo>

          <View style={styles.headerButton} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInput,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                borderColor: colors.border.default,
              },
            ]}
          >
            <Icons.MagnifyingGlassIcon size={20} color={colors.text.muted} />
            <TextInput
              style={[styles.searchTextInput, { color: colors.text.primary }]}
              placeholder="Rechercher un spot..."
              placeholderTextColor={colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Icons.XCircleIcon
                  size={20}
                  color={colors.text.muted}
                  weight="fill"
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.primary} />
            <Typo size={14} color={colors.text.muted}>
              Chargement des spots...
            </Typo>
          </View>
        ) : availableSpots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icons.MapPinIcon
              size={48}
              color={colors.text.muted}
              weight="thin"
            />
            <Typo size={16} fontWeight="600" color={colors.text.primary}>
              {searchQuery ? "Aucun résultat" : "Aucun spot disponible"}
            </Typo>
            <Typo
              size={14}
              color={colors.text.muted}
              style={{ textAlign: "center" }}
            >
              {searchQuery
                ? "Essayez avec d'autres termes"
                : "Vous êtes déjà associé à tous les spots !"}
            </Typo>
          </View>
        ) : (
          <FlatList
            data={availableSpots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSpotItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}

        {/* Footer */}
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
          <Pressable
            style={[
              styles.confirmButton,
              {
                backgroundColor: selectedSpotId
                  ? colors.accent.primary
                  : colors.border.default,
              },
            ]}
            onPress={handleConfirm}
            disabled={!selectedSpotId || isAdding}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color={colors.constant.white} />
            ) : (
              <>
                <Icons.PlusIcon
                  size={20}
                  color={
                    selectedSpotId ? colors.constant.white : colors.text.muted
                  }
                  weight="bold"
                />
                <Typo
                  size={16}
                  fontWeight="600"
                  color={
                    selectedSpotId ? colors.constant.white : colors.text.muted
                  }
                >
                  Ajouter ce spot
                </Typo>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AddSpotModal;

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
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 15,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  spotItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  spotIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  spotContent: {
    flex: 1,
    gap: 2,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
});
