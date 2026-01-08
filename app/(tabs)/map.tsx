import ErrorState from "@/src/features/map/ui/MapLoadingStates/ErrorState";
import LoadingState from "@/src/features/map/ui/MapLoadingStates/LoadingState";
import CustomMarker from "@/src/features/map/ui/MapView/CustomMarker";
import MapControls from "@/src/features/map/ui/MapView/MapControls";
import MapHeader from "@/src/features/map/ui/MapView/MapHeader";
import MapSearchBar from "@/src/features/map/ui/MapView/MapSearchBar";
import SpotCard from "@/src/features/spots/ui/SpotCard/SpotCard";
import { getActiveSpots } from "@/src/shared/services/spotService";
import { useTheme } from "@/src/shared/theme";
import { getMapStyle } from "@/src/shared/theme/mapStyles";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Map = () => {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const [spots, setSpots] = useState<SpotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<SpotResponse | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [showSearch, setShowSearch] = useState(false);
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
          latitude: spot.latitude + 0.008,
          longitude: spot.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  };

  const handleSearchSpotSelect = (spot: SpotResponse) => {
    Keyboard.dismiss();
    setSelectedSpot(spot);

    if (mapRef.current && spot.latitude && spot.longitude) {
      mapRef.current.animateToRegion(
        {
          latitude: spot.latitude + 0.008,
          longitude: spot.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800
      );
    }
  };

  const handleRecenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 500);
    }
  };

  const handleOpenSearch = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <LoadingState />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper style={styles.container}>
        <ErrorState error={error} onRetry={loadSpots} />
      </ScreenWrapper>
    );
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
        toolbarEnabled={false}
        showsIndoors={false}
        showsTraffic={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        liteMode={false}
        loadingEnabled={true}
        zoomEnabled={true}
        zoomControlEnabled={false}
        zoomTapEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        customMapStyle={
          mapType === "standard" ? getMapStyle(isDark) : undefined
        }
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

      <MapHeader
        spotsCount={spots.length}
        topInset={insets.top}
        onSearchPress={handleOpenSearch}
      />

      <MapControls
        topInset={insets.top}
        onRecenter={handleRecenterMap}
        onRefresh={loadSpots}
      />

      {selectedSpot && (
        <SpotCard
          spot={selectedSpot}
          bottomInset={insets.bottom}
          onClose={() => setSelectedSpot(null)}
        />
      )}

      {showSearch && (
        <MapSearchBar
          spots={spots}
          onSpotSelect={handleSearchSpotSelect}
          onClose={handleCloseSearch}
        />
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
    height: "100%",
  },
});
