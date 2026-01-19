import { spacingX } from "@/src/shared/constants/theme";
import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

// ============================================
// 🛹 SOSKATE - HORIZONTAL CARD LIST
// ============================================
// Composant générique réutilisable pour afficher
// une liste de cartes en scroll horizontal
// Remplace InstructorList et ServiceList

type HorizontalCardListProps<T> = {
  /** Les données à afficher */
  data: T[];
  /** Fonction de rendu pour chaque élément */
  renderItem: (item: T, index: number) => ReactNode;
  /** Fonction pour extraire la clé unique de chaque élément */
  keyExtractor: (item: T) => string | number;
  /** Mode compact (moins de padding) */
  compact?: boolean;
  /** Espacement entre les cartes */
  gap?: number;
  /** Style personnalisé pour le conteneur */
  containerStyle?: ViewStyle;
  /** Style personnalisé pour le contenu scrollable */
  contentStyle?: ViewStyle;
  /** Afficher ou non les indicateurs de scroll */
  showsScrollIndicator?: boolean;
};

function HorizontalCardList<T>({
  data,
  renderItem,
  keyExtractor,
  compact = false,
  gap = 12,
  containerStyle,
  contentStyle,
  showsScrollIndicator = false,
}: HorizontalCardListProps<T>) {
  if (data.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        compact && styles.compactContainer,
        containerStyle,
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={showsScrollIndicator}
        contentContainerStyle={[
          styles.scrollContent,
          compact && styles.compactScrollContent,
          { gap },
          contentStyle,
        ]}
        nestedScrollEnabled
      >
        {data.map((item, index) => (
          <View key={keyExtractor(item)}>{renderItem(item, index)}</View>
        ))}
      </ScrollView>
    </View>
  );
}

export default HorizontalCardList;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  compactContainer: {
    gap: 8,
  },
  scrollContent: {
    paddingHorizontal: spacingX._20,
  },
  compactScrollContent: {
    paddingHorizontal: 0,
  },
});
