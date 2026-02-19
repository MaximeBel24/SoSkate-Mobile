import HorizontalCardList from "@/src/features/spots/ui/SpotCard/HorizontalCardList";
import InstructorCard from "@/src/features/spots/ui/SpotCard/InstructorCard";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import Typo from "@/src/shared/ui/typography/Typo";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SpotCardInstructorViewProps {
  instructors: InstructorResponse[];
  currentInstructorId: number | null | undefined;
}

const SpotCardInstructorView = ({
  instructors,
  currentInstructorId,
}: SpotCardInstructorViewProps) => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleViewDetails = (instructorId: number) => {
    router.push(`/(modals)/instructor/${instructorId}`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Typo size={18} fontWeight="700" color={colors.text.primary}>
          Instructeurs sur ce spot
        </Typo>
        <Typo size={13} color={colors.text.muted}>
          {instructors.length} inscrit
          {instructors.length > 1 ? "s" : ""}
        </Typo>
      </View>

      {instructors.length > 0 ? (
        <HorizontalCardList
          data={instructors}
          keyExtractor={(instructor) => instructor.id}
          renderItem={(instructor) => (
            <InstructorCard
              instructor={instructor}
              isSelected={false}
              onSelect={() => {}}
              onViewDetails={handleViewDetails}
              isCurrentUser={
                String(instructor.id) === String(currentInstructorId)
              }
            />
          )}
          compact
        />
      ) : (
        <View style={styles.empty}>
          <Typo size={14} color={colors.text.muted}>
            Aucun instructeur inscrit
          </Typo>
        </View>
      )}
    </View>
  );
};

export default SpotCardInstructorView;

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  empty: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
