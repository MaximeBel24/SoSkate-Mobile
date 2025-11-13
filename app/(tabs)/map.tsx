import ScreenWrapper from "@/components/screen/ScreenWrapper";
import ErrorState from "@/components/map/MapLoadingStates/ErrorState";
import LoadingState from "@/components/map/MapLoadingStates/LoadingState";
import CustomMarker from "@/components/map/MapView/CustomMarker";
import MapControls from "@/components/map/MapView/MapControls";
import MapHeader from "@/components/map/MapView/MapHeader";
import SpotCard from "@/components/map/SpotCard/SpotCard";
import { darkMapStyle } from "@/constants/mapStyle";
import { SpotResponse } from "@/interfaces/spot.interface";
import {getActiveSpots} from "@/services/spotService";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Map = () => {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const [spots, setSpots] = useState<SpotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<SpotResponse | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [region] = useState<Region>({
    latitude: 48.774159,
    longitude: 2.536275,
    latitudeDelta: 0.0522,
    longitudeDelta: 0.0221,
  });

    const NAVBAR_HEIGHT = 80;
  const SPOT_CARD_HEIGHT = 400;

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveSpots();
      setSpots(data);
    } catch (err: any) {
      console.error("Erreur lors du chargement des spots:", err);
      setError(err.message || "Impossible de charger les spots");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (spot: SpotResponse) => {
    setSelectedSpot(spot);

      if (mapRef.current && spot.latitude && spot.longitude) {

          mapRef.current.animateToRegion(
              {
                  latitude: spot.latitude + 0.008, // Décalage vers le haut
                  longitude: spot.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
              },
              500
          );
      }
  };

  const handleRecenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 500);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <LoadingState />
      </ScreenWrapper>
    );
  }

  if (error) {
    <ScreenWrapper style={styles.container}>
      <ErrorState error={error} onRetry={loadSpots} />
    </ScreenWrapper>;
  }

  return (
    <ScreenWrapper style={styles.container}>
      <MapView
        ref={mapRef}
        initialRegion={region}
        style={styles.map}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
          // ✅ Cache les contrôles Google Maps natifs
        toolbarEnabled={false}  // Android
        showsIndoors={false}
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
          // ✅ Cache le logo Google et les contrôles de zoom
        liteMode={false}
        loadingEnabled={true}
          // ✅ Désactive les boutons natifs
        zoomEnabled={true}
        zoomControlEnabled={false}  // Android
        zoomTapEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        customMapStyle={mapType === "standard" ? darkMapStyle : undefined}
        mapPadding={{
            top: 0,
            right: 0,
            bottom: selectedSpot
                ? SPOT_CARD_HEIGHT + insets.bottom
                : NAVBAR_HEIGHT + insets.bottom,
            left: 0,
        }}
      >
        {spots
          .filter((spot) => spot.latitude && spot.longitude)
          .map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => handleMarkerPress(spot)}
            >
              <CustomMarker isSelected={selectedSpot?.id === spot.id} />
            </Marker>
          ))}
      </MapView>

      <MapHeader spotsCount={spots.length} topInset={insets.top}/>
      <MapControls
        topInset={insets.top}
        onRecenter={handleRecenterMap}
        onRefresh={loadSpots}
      />
      {selectedSpot && <SpotCard
        spot={selectedSpot}
        bottomInset={insets.bottom}
        onClose={() => setSelectedSpot(null)}
      />}
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
    height: "100%",
  },
});
