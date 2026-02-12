// ============================================
// SOSKATE - COURSES LIST
// ============================================
// Liste de cours avec FlatList optimisée

import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import * as Icons from "phosphor-react-native";
import { useTheme } from "@/src/shared/theme";
import EmptyState from "@/src/shared/ui/feedback/EmptyState";
import Loading from "@/src/shared/ui/feedback/Loading";
import CourseCard from "./CourseCard";
import { CoursesListProps, CourseListItem } from "../types/course.types";

// ============================================
// CONSTANTS
// ============================================
const ITEM_HEIGHT = 200; // Hauteur approximative d'une CourseCard
const EMPTY_MESSAGES = {
  upcoming: {
    title: "Aucun cours à venir",
    description: "Vous n'avez pas de cours planifié pour le moment.",
  },
  passed: {
    title: "Aucun cours passé",
    description: "Vos cours terminés apparaîtront ici.",
  },
};

// ============================================
// COMPONENT
// ============================================
const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  isLoading,
  isRefreshing,
  onRefresh,
  onCoursePress,
  onEndReached,
  emptyMessage,
  variant,
}) => {
  const { colors } = useTheme();

  // ============================================
  // RENDER ITEM
  // ============================================
  const renderItem: ListRenderItem<CourseListItem> = useCallback(
    ({ item }) => (
      <CourseCard course={item} onPress={onCoursePress} variant={variant} />
    ),
    [onCoursePress, variant],
  );

  // ============================================
  // KEY EXTRACTOR
  // ============================================
  const keyExtractor = useCallback(
    (item: CourseListItem) => `course-${item.id}`,
    [],
  );

  // ============================================
  // GET ITEM LAYOUT (Optimisation FlatList)
  // ============================================
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index + 16 * index, // height + gap
      index,
    }),
    [],
  );

  // ============================================
  // EMPTY COMPONENT
  // ============================================
  const ListEmptyComponent = useCallback(() => {
    const config = EMPTY_MESSAGES[variant];
    return (
      <EmptyState
        icon={
          <Icons.CalendarBlank
            size={40}
            color={colors.text.muted}
            weight="duotone"
          />
        }
        title={emptyMessage || config.title}
        description={config.description}
      />
    );
  }, [variant, emptyMessage, colors.text.muted]);

  // ============================================
  // FOOTER COMPONENT (Loading more)
  // ============================================
  const ListFooterComponent = useCallback(() => {
    if (!onEndReached) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.accent.primary} />
      </View>
    );
  }, [onEndReached, colors.accent.primary]);

  // ============================================
  // SEPARATOR
  // ============================================
  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading && courses.length === 0) {
    return <Loading />;
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <FlatList
      data={courses}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={courses.length > 0 ? ListFooterComponent : null}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={[
        styles.content,
        courses.length === 0 && styles.emptyContent,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
          colors={[colors.accent.primary]}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={5}
    />
  );
};

export default CoursesList;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyContent: {
    flexGrow: 1,
  },
  separator: {
    height: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
