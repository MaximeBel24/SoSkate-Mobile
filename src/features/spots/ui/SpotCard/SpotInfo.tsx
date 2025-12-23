// components/map/SpotCard/SpotInfo.tsx
import Typo from "@/src/shared/ui/typography/Typo";
import { colors } from "@/src/shared/constants/theme";
import * as Icons from "phosphor-react-native";
import { StyleSheet, View } from "react-native";

type SpotInfoProps = {
  name: string;
  address: string;
  zipCode: string;
  city: string;
  isIndoor: boolean;
  description?: string;
};

const SpotInfo = ({
  name,
  address,
  zipCode,
  city,
  isIndoor,
  description,
}: SpotInfoProps) => {
  return (
    <>
      {/* Title & rating */}
      <View style={styles.spotHeader}>
        <View style={{ flex: 1 }}>
          <Typo size={22} fontWeight="900" color={colors.white}>
            {name}
          </Typo>
          <View style={styles.addressRow}>
            <Icons.MapPinIcon
              size={14}
              color={colors.neutral400}
              weight="fill"
            />
            <Typo size={13} color={colors.neutral400}>
              {address}, {zipCode} {city}
            </Typo>
          </View>
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
          <Icons.MapPinIcon size={14} color={colors.primary} weight="duotone" />
          <Typo size={12} fontWeight="600" color={colors.primary}>
            {isIndoor ? "Intérieur" : "Extérieur"}
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
