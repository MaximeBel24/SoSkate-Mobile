import ScreenWrapper from "@/components/ScreenWrapper";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Alert, StyleSheet, View, Text, Button} from "react-native";
import MapView, {Marker, Region} from "react-native-maps";
import {SpotResponse} from "@/interfaces/spot.interface";
import {getAllSpots} from "@/services/spotService";
import {colors} from "@/constants/theme";
// import Geolocation from "@react-native-community/geolocation";

const Map = () => {

    const [spots, setSpots] = useState<SpotResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [region, setRegion] = useState<Region>({
        latitude: 48.774159,
        longitude: 2.536275,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0221,
    });
    const [selectedSpot, setSelectedSpot] = useState<SpotResponse | null>(null);
    // const [userLocation, setUserLocation] = useState<{
    //     latitude: number;
    //     longitude: number;
    // } | null>(null);

    useEffect(() => {
        loadSpots();
    }, []);

    // const getUserLocation = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             setUserLocation({ latitude, longitude });
    //             setRegion({
    //                 latitude,
    //                 longitude,
    //                 latitudeDelta: 0.0522,
    //                 longitudeDelta: 0.0221,
    //             });
    //         },
    //         (error) => {
    //             console.error("Erreur géolocalisation:", error);
    //             Alert.alert("Erreur", "Impossible de récupérer votre position");
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //     );
    // };

    const loadSpots = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllSpots();
            setSpots(data);
        } catch (err: any) {
            console.error("Erreur lors du chargement des spots:", err);
            setError(err.message || "Impossible de charger les spots");
            Alert.alert(
                "Erreur",
                "Impossible de charger les spots. Vérifiez votre connexion.",
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Chargement des spots...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    if (error) {
        return (
            <ScreenWrapper style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                </View>
            </ScreenWrapper>
        );
    }

  return (
      <ScreenWrapper style={styles.container}>
          <MapView
              region={region}
              style={styles.map}
              userInterfaceStyle='dark'
          >
              {spots.filter((spot) => spot.latitude && spot.longitude).map((spot) => {
                  // Vérifie que le spot a des coordonnées valides
                  if (!spot.latitude || !spot.longitude) {
                      console.warn(`Spot ${spot.id} n'a pas de coordonnées valides`);
                      return null;
                  }

                  return (
                      <Marker
                          key={`spot-${spot.id}`} // ✅ Préfixe pour garantir l'unicité
                          coordinate={{
                              latitude: spot.latitude,
                              longitude: spot.longitude,
                          }}
                          title={spot.name} // 🎯 Affiche le nom au tap (optionnel)
                          description={spot.description} // 🎯 Affiche la description
                          onPress={() => setSelectedSpot(spot)}
                      />
                  );
              })}
          </MapView>

          {selectedSpot && (
              <View style={styles.spotCard}>
                  <Text style={styles.spotName}>{selectedSpot.name}</Text>
                  <Text style={styles.spotDescription}>{selectedSpot.description}</Text>
                  <Text style={styles.spotAddress}>{selectedSpot.address}</Text>
                  <View style={styles.buttonContainer}>
                      <Button
                          title="Voir les cours"
                          onPress={() => {/* Navigation vers les cours */}}
                          color={colors.primary}
                      />
                      <Button
                          title="Fermer"
                          onPress={() => setSelectedSpot(null)}
                          color={colors.primaryDark}
                      />
                  </View>
              </View>
          )}
      </ScreenWrapper>
  );
};

export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: "100%",
        height: "108%",
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#ff0000",
        textAlign: "center",
    },
    spotCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: colors.neutral700,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    spotName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    spotDescription: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 8,
    },
    spotAddress: {
        fontSize: 12,
        color: colors.neutral200,
        fontStyle: 'italic',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 50,
        gap: 10,
    },
});
