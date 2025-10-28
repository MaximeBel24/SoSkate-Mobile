import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {Spot} from "@/interfaces/spot.interface";
import {COLORS, COMMON_STYLES} from "@/constants/constants";

interface SpotCardProps {
    spot: Spot;
    onPress: () => void;
}

const SpotCard = ({ spot, onPress }: SpotCardProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Image ou placeholder */}
            {spot.photos && spot.photos.length > 0 ? (
                <Image
                    source={{ uri: spot.photos[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Text style={styles.placeholderEmoji}>🛹</Text>
                </View>
            )}

            {/* Badge Indoor/Outdoor */}
            <View style={[styles.badge, spot.isIndoor ? styles.indoorBadge : styles.outdoorBadge]}>
                <Text style={styles.badgeText}>
                    {spot.isIndoor ? 'Indoor' : 'Outdoor'}
                </Text>
            </View>

            {/* Informations */}
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {spot.name}
                </Text>
                <Text style={styles.address} numberOfLines={1}>
                    📍 {spot.city}
                </Text>
                {spot.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {spot.description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        ...COMMON_STYLES.shadow,
    },
    image: {
        width: '100%',
        height: 150,
    },
    placeholderImage: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 48,
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    indoorBadge: {
        backgroundColor: COLORS.info,
    },
    outdoorBadge: {
        backgroundColor: COLORS.success,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: COLORS.mediumGray,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
    },
});

export default SpotCard;