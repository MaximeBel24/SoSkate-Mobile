import Typo from "@/src/shared/ui/typography/Typo";
import { colors, spacingX, spacingY } from "@/src/shared/constants/theme";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MapSearchBarProps = {
  spots: SpotResponse[];
  onSpotSelect: (spot: SpotResponse) => void;
  onClose: () => void;
};

const MapSearchBar = ({ spots, onSpotSelect, onClose }: MapSearchBarProps) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState<SpotResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Animation values
  const searchBarScale = useSharedValue(0.95);
  const resultsHeight = useSharedValue(0);

  useEffect(() => {
    // Focus automatique à l'ouverture
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Animation d'entrée
    searchBarScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, []);

  // Filtrage des spots avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        const filtered = spots.filter((spot) =>
          spot.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSpots(filtered);
        setShowResults(true);

        // Animation de la hauteur des résultats
        resultsHeight.value = withTiming(
          filtered.length > 0 ? Math.min(filtered.length * 70, 300) : 80,
          { duration: 200 }
        );
      } else {
        setFilteredSpots([]);
        setShowResults(false);
        resultsHeight.value = withTiming(0, { duration: 200 });
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, spots]);

  const handleSpotSelect = useCallback(
    (spot: SpotResponse) => {
      Keyboard.dismiss();
      setSearchQuery("");
      setShowResults(false);
      onSpotSelect(spot);
      onClose();
    },
    [onSpotSelect, onClose]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setFilteredSpots([]);
    setShowResults(false);
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    searchBarScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
    setTimeout(() => {
      onClose();
    }, 100);
  }, [onClose]);

  // Styles animés
  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchBarScale.value }],
  }));

  const resultsAnimatedStyle = useAnimatedStyle(() => ({
    height: resultsHeight.value,
    opacity: resultsHeight.value > 0 ? 1 : 0,
  }));

  const renderSpotItem = ({ item }: { item: SpotResponse }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSpotSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultIconContainer}>
        <Icons.MapPinIcon size={20} color={colors.primary} weight="duotone" />
      </View>
      <View style={styles.resultContent}>
        <Typo size={15} fontWeight="600" color={colors.white}>
          {item.name}
        </Typo>
        {item.city && (
          <Typo size={12} color={colors.neutral400}>
            {item.city}
          </Typo>
        )}
      </View>
      <Icons.CaretRightIcon size={16} color={colors.neutral500} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icons.MagnifyingGlassIcon
        size={32}
        color={colors.neutral600}
        weight="light"
      />
      <Typo size={14} color={colors.neutral500} style={{ marginTop: 8 }}>
        Aucun spot trouvé pour "{searchQuery}"
      </Typo>
    </View>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[styles.overlay]}
    >
      {/* Background blur/dim */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* Search Container */}
      <Animated.View
        style={[
          styles.searchContainer,
          { paddingTop: insets.top + 10 },
          searchBarAnimatedStyle,
        ]}
      >
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Icons.MagnifyingGlassIcon
            size={20}
            color={colors.neutral400}
            weight="bold"
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Rechercher un spot..."
            placeholderTextColor={colors.neutral500}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            selectionColor={colors.primary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icons.XCircleIcon
                size={20}
                color={colors.neutral400}
                weight="fill"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icons.XIcon size={20} color={colors.white} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Results Dropdown */}
        {showResults && (
          <Animated.View
            style={[styles.resultsContainer, resultsAnimatedStyle]}
          >
            {filteredSpots.length > 0 ? (
              <FlatList
                data={filteredSpots}
                renderItem={renderSpotItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.resultsList}
              />
            ) : (
              renderEmptyState()
            )}
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default MapSearchBar;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  searchContainer: {
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 20, 0.95)",
    borderRadius: 16,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    fontFamily: "Inter-Medium",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  resultsContainer: {
    marginTop: spacingY._12,
    backgroundColor: "rgba(20, 20, 20, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultsList: {
    paddingVertical: spacingY._8,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._16,
    gap: 12,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resultContent: {
    flex: 1,
    gap: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacingY._24,
  },
});
