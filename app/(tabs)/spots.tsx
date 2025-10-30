import { StyleSheet, ActivityIndicator, View, Text } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import ClusteredMapView from "react-native-map-clustering";
import { Ionicons } from '@expo/vector-icons';
import {getAllSpots} from "@/services/spotService";
import {SpotResponse} from "@/interfaces/spot.interface"; // Si tu utilises Expo

const INITIAL_REGION = {
    latitude: 48.7667, // Paris region par défaut
    longitude: 2.4333,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
};

const Spots = () => {
    const mapRef = useRef(null);
    const [spots, setSpots] = useState<SpotResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpots();
    }, []);

    const fetchSpots = async () => {
        try {
            const data = await getAllSpots();
            setSpots(data);
        } catch (error) {
            console.error('Error fetching spots:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderMarker = (spot: SpotResponse) => (
        <Marker
            key={spot.id}
            coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude
            }}
            title={spot.name}
            description={spot.description}
        >
            {/* Icône personnalisée pour SoSkate */}
            <View style={styles.markerContainer}>
                <Ionicons name="bicycle" size={24} color="#FF6B35" />
            </View>
        </Marker>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        );
    }

    return (
        <ClusteredMapView
            ref={mapRef}
            initialRegion={INITIAL_REGION}
            style={styles.map}
            clusterColor="#FF6B35"
            clusterTextColor="#FFFFFF"
            radius={50}
            maxZoom={18}
            minZoom={3}
            extent={512}
            nodeSize={64}
            animationEnabled={true}
            provider={PROVIDER_GOOGLE}
            spiralEnabled={true}
            // Personnalisation du rendu des clusters
            renderCluster={(cluster) => {
                const { id, geometry, onPress, properties } = cluster;
                console.log('Cluster: ', cluster)
                const points = properties.point_count;

                return (
                    <Marker
                        key={`cluster-${id}`}
                        coordinate={{
                            longitude: geometry.coordinates[0],
                            latitude: geometry.coordinates[1],
                        }}
                        onPress={onPress}
                    >
                        <View style={styles.clusterContainer}>
                            <Text style={styles.clusterText}>{points}</Text>
                        </View>
                    </Marker>
                );
            }}
        >
            {spots.map(renderMarker)}
        </ClusteredMapView>
    )
}

export default Spots

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FF6B35',
    },
    clusterContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    clusterText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
})