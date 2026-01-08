import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";
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
  const { colors, isDark } = useTheme();

  return (
    <>
      {/* Title & rating */}
      <View style={styles.spotHeader}>
        <View style={{ flex: 1 }}>
          <Typo size={22} fontWeight="900" color={colors.text.primary}>
            {name}
          </Typo>
          <View style={styles.addressRow}>
            <Icons.MapPinIcon
              size={14}
              color={colors.text.muted}
              weight="fill"
            />
            <Typo size={13} color={colors.text.muted}>
              {address}, {zipCode} {city}
            </Typo>
          </View>
        </View>
      </View>

      {/* Description */}
      {description && (
        <Typo size={14} color={colors.text.secondary} style={{ marginTop: 12 }}>
          {description}
        </Typo>
      )}

      {/* Tags */}
      <View style={styles.tags}>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
              borderColor: colors.border.default,
            },
          ]}
        >
          <Icons.MapPinIcon
            size={14}
            color={colors.accent.primary}
            weight="duotone"
          />
          <Typo size={12} fontWeight="600" color={colors.accent.primary}>
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
  tags: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
});
