// components/spotDetails/ServiceList.tsx
import Typo from "@/components/text/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { ServiceResponse } from "@/interfaces/service.interface";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ServiceCard from "./ServiceCard";

type ServiceListProps = {
    services: ServiceResponse[];
    onServicePress: (serviceId: number) => void;
};

const ServiceList = ({ services, onServicePress }: ServiceListProps) => {
    return (
        <View style={styles.container}>
            {/* Section header */}
            <View style={styles.header}>
                <Typo size={20} fontWeight="700" color={colors.white}>
                    Services disponibles
                </Typo>
                <View style={styles.countBadge}>
                    <Typo size={14} fontWeight="600" color={colors.primary}>
                        {services.length}
                    </Typo>
                </View>
            </View>

            {/* Liste scrollable des services */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onPress={onServicePress}
                    />
                ))}

                {/* Espace en bas pour le scroll */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
};

export default ServiceList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A0908",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
        paddingBottom: spacingY._16,
    },
    countBadge: {
        minWidth: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 107, 53, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(255, 107, 53, 0.3)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacingX._20,
        gap: 12,
    },
    bottomSpacer: {
        height: 40,
    },
});