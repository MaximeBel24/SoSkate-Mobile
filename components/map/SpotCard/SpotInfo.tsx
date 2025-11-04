// components/map/SpotCard/SpotInfo.tsx
import { View, StyleSheet } from "react-native";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";

type SpotInfoProps = {
    name: string;
    address: string;
    description?: string;
    rating?: number;
};

const SpotInfo = ({ name, address, description, rating = 4.5 }: SpotInfoProps) => {
    return (
        <>
            {/* Title & rating */}
            <View style={styles.spotHeader}>
                <View style={{ flex: 1 }}>
                    <Typo size={22} fontWeight="900" color={colors.white}>
                        {name}
                    </Typo>
                    <View style={styles.addressRow}>
                        <Icons.MapPinIcon size={14} color={colors.neutral400} weight="fill" />
                        <Typo size={13} color={colors.neutral400}>
                            {address}
                        </Typo>
                    </View>
                </View>

                {/* Rating */}
                <View style={styles.ratingBadge}>
                    <Icons.StarIcon size={16} color="#fbbf24" weight="fill" />
                    <Typo size={14} fontWeight="700" color={colors.white}>
                        {rating}
                    </Typo>
                </View>
            </View>

            {/* Description */}
            {description && (
                <Typo size={14} color={colors.neutral300} style={{ marginTop: 12 }}>
                    {description}
                </Typo>
            )}

            {/* Tags */}
            <View style={styles.tags}>
                <View style={styles.tag}>
                    <Icons.UsersIcon size={14} color={colors.primary} weight="duotone" />
                    <Typo size={12} fontWeight="600" color={colors.primary}>
                        Skatepark
                    </Typo>
                </View>
                <View style={styles.tag}>
                    <Icons.ClockIcon size={14} color={colors.primary} weight="duotone" />
                    <Typo size={12} fontWeight="600" color={colors.primary}>
                        Ouvert
                    </Typo>
                </View>
            </View>
        </>
    );
};

export default SpotInfo;

const styles = StyleSheet.create({
    spotHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(251, 191, 36, 0.15)",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    tags: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
    },
    tag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
});