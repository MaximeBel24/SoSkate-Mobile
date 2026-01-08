import { spacingX, spacingY } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import Typo from "@/src/shared/ui/typography/Typo";
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
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState<SpotResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchBarScale = useSharedValue(0.95);
  const resultsHeight = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    searchBarScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        const filtered = spots.filter((spot) =>
          spot.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSpots(filtered);
        setShowResults(true);

        resultsHeight.value = withTiming(
          filtered.length > 0 ? Math.min(filtered.length * 70, 300) : 80,
          { duration: 200 }
        );
      } else {
        setFilteredSpots([]);
        setShowResults(false);
        resultsHeight.value = withTiming(0, { duration: 200 });
      }
    }, 300);

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
      <View
        style={[
          styles.resultIconContainer,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)",
            borderColor: colors.border.default,
          },
        ]}
      >
        <Icons.MapPinIcon
          size={20}
          color={colors.accent.primary}
          weight="duotone"
        />
      </View>
      <View style={styles.resultContent}>
        <Typo size={15} fontWeight="600" color={colors.text.primary}>
          {item.name}
        </Typo>
        {item.city && (
          <Typo size={12} color={colors.text.muted}>
            {item.city}
          </Typo>
        )}
      </View>
      <Icons.CaretRightIcon size={16} color={colors.text.muted} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icons.MagnifyingGlassIcon
        size={32}
        color={colors.neutral[600]}
        weight="light"
      />
      <Typo size={14} color={colors.text.muted} style={{ marginTop: 8 }}>
        Aucun spot trouvé pour "{searchQuery}"
      </Typo>
    </View>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.searchContainer,
          { paddingTop: insets.top + 10 },
          searchBarAnimatedStyle,
        ]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark
                ? "rgba(20, 20, 20, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              borderColor: colors.border.default,
            },
          ]}
        >
          <Icons.MagnifyingGlassIcon
            size={20}
            color={colors.text.muted}
            weight="bold"
          />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text.primary }]}
            placeholder="Rechercher un spot..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            selectionColor={colors.accent.primary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icons.XCircleIcon
                size={20}
                color={colors.text.muted}
                weight="fill"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleClose}
            style={[
              styles.closeButton,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icons.XIcon size={20} color={colors.text.primary} weight="bold" />
          </TouchableOpacity>
        </View>

        {showResults && (
          <Animated.View
            style={[
              styles.resultsContainer,
              {
                backgroundColor: isDark
                  ? "rgba(20, 20, 20, 0.95)"
                  : "rgba(255, 255, 255, 0.98)",
                borderColor: colors.border.default,
              },
              resultsAnimatedStyle,
            ]}
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
    borderRadius: 16,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._12,
    gap: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    borderRadius: 8,
  },
  resultsContainer: {
    marginTop: spacingY._12,
    borderRadius: 16,
    borderWidth: 1,
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
    borderRadius: 12,
    borderWidth: 1,
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
