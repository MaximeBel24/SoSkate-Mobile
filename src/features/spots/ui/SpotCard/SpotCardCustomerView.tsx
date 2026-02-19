import HorizontalCardList from "@/src/features/spots/ui/SpotCard/HorizontalCardList";
import InstructorCard from "@/src/features/spots/ui/SpotCard/InstructorCard";
import ServiceCard from "@/src/features/spots/ui/SpotCard/ServiceCard";
import { useTheme } from "@/src/shared/theme";
import { logger } from "@/src/shared/utils/logger";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import Badge from "@/src/shared/ui/badge/Badge";
import EmptyState from "@/src/shared/ui/feedback/EmptyState";
import Typo from "@/src/shared/ui/typography/Typo";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { spacingY } from "@/src/shared/constants/theme";

interface SpotCardCustomerViewProps {
  spot: SpotResponse;
  instructors: InstructorResponse[];
  services: ServiceResponse[];
  loadingInstructors: boolean;
  loadingServices: boolean;
  instructorsLoaded: boolean;
  servicesLoaded: boolean;
}

const SpotCardCustomerView = ({
  spot,
  instructors,
  services,
  loadingInstructors,
  loadingServices,
  instructorsLoaded,
  servicesLoaded,
}: SpotCardCustomerViewProps) => {
  const { colors } = useTheme();
  const router = useRouter();

  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );

  const handleSelectInstructor = (instructor: InstructorResponse) => {
    setSelectedInstructorId(
      selectedInstructorId === instructor.id ? null : instructor.id,
    );
  };

  const handleSelectService = (service: ServiceResponse) => {
    const id = Number(service.id);
    setSelectedServiceId(selectedServiceId === id ? null : id);
  };

  const handleViewInstructorDetails = (instructorId: number) => {
    router.push(`/(modals)/instructor/${instructorId}`);
  };

  const handleBooking = () => {
    if (!selectedInstructorId || !selectedServiceId) return;

    const selectedInstructor = instructors.find(
      (i) => String(i.id) === String(selectedInstructorId),
    );
    const selectedService = services.find(
      (s) => Number(s.id) === selectedServiceId,
    );

    if (!selectedInstructor || !selectedService) {
      logger.error("Instructeur ou service non trouve", {
        selectedInstructorId,
        selectedServiceId,
      });
      return;
    }

    router.push({
      pathname: "/(modals)/booking/[spotId]",
      params: {
        spotId: String(spot.id),
        spotName: spot.name || "",
        spotAddress: spot.address || "",
        instructorId: String(selectedInstructor.id),
        instructorFirstName: selectedInstructor.firstname || "",
        instructorLastName: selectedInstructor.lastname || "",
        serviceId: String(selectedService.id),
        serviceName: selectedService.name || "",
        basePriceCents: String(selectedService.basePriceCents ?? 0),
        maxParticipants: String(selectedService.maxParticipants ?? 1),
      },
    });
  };

  return (
    <>
      {/* Instructor selection */}
      {instructors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typo size={18} fontWeight="700" color={colors.text.primary}>
              Choisir un moniteur
            </Typo>
            <Typo size={13} color={colors.text.muted}>
              {instructors.length} disponible
              {instructors.length > 1 ? "s" : ""}
            </Typo>
          </View>

          {selectedInstructorId && (
            <Badge
              label="Instructeur selectionne"
              variant="success"
              icon={
                <Icons.CheckCircleIcon
                  size={14}
                  color={colors.semantic.success}
                  weight="fill"
                />
              }
            />
          )}

          <HorizontalCardList
            data={instructors}
            keyExtractor={(instructor) => instructor.id}
            renderItem={(instructor) => (
              <InstructorCard
                instructor={instructor}
                isSelected={selectedInstructorId === instructor.id}
                onSelect={handleSelectInstructor}
                onViewDetails={handleViewInstructorDetails}
              />
            )}
            compact
          />
        </View>
      )}

      {!loadingInstructors && instructors.length === 0 && instructorsLoaded && (
        <View style={styles.emptyInstructors}>
          <Typo size={14} color={colors.text.muted}>
            Aucun instructeur disponible
          </Typo>
        </View>
      )}

      {/* Service selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typo size={18} fontWeight="700" color={colors.text.primary}>
            Choisir une prestation
          </Typo>
          {services.length > 0 && (
            <Typo size={13} color={colors.text.muted}>
              {services.length} disponible
              {services.length > 1 ? "s" : ""}
            </Typo>
          )}
        </View>

        {loadingServices && (
          <View style={styles.sectionLoading}>
            <ActivityIndicator size="small" color={colors.accent.primary} />
          </View>
        )}

        {!loadingServices && services.length > 0 && (
          <>
            {selectedServiceId && (
              <Badge
                label="Service selectionne"
                variant="success"
                icon={
                  <Icons.CheckCircleIcon
                    size={14}
                    color={colors.semantic.success}
                    weight="fill"
                  />
                }
              />
            )}

            <HorizontalCardList
              data={services}
              keyExtractor={(service) => service.id}
              renderItem={(service) => (
                <ServiceCard
                  service={service}
                  isSelected={selectedServiceId === Number(service.id)}
                  onSelect={handleSelectService}
                />
              )}
              compact
            />
          </>
        )}

        {!loadingServices && services.length === 0 && servicesLoaded && (
          <EmptyState
            icon={
              <Icons.CalendarXIcon
                size={48}
                color={colors.text.muted}
                weight="thin"
              />
            }
            title="Aucun service disponible"
            description="Ce spot n'a pas encore de prestations actives."
            style={styles.emptyServices}
          />
        )}
      </View>

      {/* Booking button */}
      {selectedInstructorId && selectedServiceId && (
        <TouchableOpacity
          style={[
            styles.bookingButton,
            { backgroundColor: colors.accent.primary },
          ]}
          onPress={handleBooking}
          activeOpacity={0.8}
        >
          <Icons.CalendarPlusIcon
            size={20}
            color={colors.constant.white}
            weight="bold"
          />
          <Typo size={16} fontWeight="700" color={colors.constant.white}>
            Reserver un cours
          </Typo>
        </TouchableOpacity>
      )}
    </>
  );
};

export default SpotCardCustomerView;

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLoading: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyInstructors: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyServices: {
    flex: 0,
    paddingVertical: 40,
    paddingHorizontal: 0,
  },
  bookingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: spacingY._16,
    borderRadius: 14,
    marginTop: spacingY._8,
  },
});
