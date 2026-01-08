import { spacingX } from "@/src/shared/constants/theme";
import { useTheme } from "@/src/shared/theme";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import InstructorCard from "./InstructorCard";

type InstructorListProps = {
    instructors: InstructorResponse[];
    selectedInstructorId?: string | null;
    onSelectInstructor?: (instructor: InstructorResponse) => void;
    onViewInstructorDetails?: (instructorId: string) => void;
    compact?: boolean;
};

const InstructorList = ({
                            instructors,
                            selectedInstructorId,
                            onSelectInstructor,
                            onViewInstructorDetails,
                            compact = false,
                        }: InstructorListProps) => {

    if (instructors.length === 0) {
        return null;
    }

    return (
        <View style={[styles.container, compact && styles.compactContainer]}>
            {/* Horizontal ScrollView */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    compact && styles.compactScrollContent,
                ]}
                nestedScrollEnabled
            >
                {instructors.map((instructor) => (
                    <InstructorCard
                        key={instructor.id}
                        instructor={instructor}
                        isSelected={selectedInstructorId === instructor.id}
                        onSelect={onSelectInstructor}
                        onViewDetails={onViewInstructorDetails}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default InstructorList;

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    compactContainer: {
        gap: 8,
    },
    scrollContent: {
        paddingHorizontal: spacingX._20,
        gap: 12,
    },
    compactScrollContent: {
        paddingHorizontal: 0,
        gap: 10,
    },
});