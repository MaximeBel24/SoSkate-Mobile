import ErrorState from "@/src/features/map/ui/MapLoadingStates/ErrorState";
import LoadingState from "@/src/features/map/ui/MapLoadingStates/LoadingState";
import CustomMarker from "@/src/features/map/ui/MapView/CustomMarker";
import UserMarker from "@/src/features/map/ui/MapView/UserMarker";
import MapControls from "@/src/features/map/ui/MapView/MapControls";
import MapHeader from "@/src/features/map/ui/MapView/MapHeader";
import MapSearchBar from "@/src/features/map/ui/MapView/MapSearchBar";
import SpotCard from "@/src/features/spots/ui/SpotCard/SpotCard";
import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { getActiveSpots } from "@/src/shared/services/spotService";
import { logger } from "@/src/shared/utils/logger";
import { useTheme } from "@/src/shared/theme";
import { getMapStyle } from "@/src/shared/theme/mapStyles";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import ScreenWrapper from "@/src/shared/ui/layout/ScreenWrapper";
import { useUserLocation } from "@/src/features/map/hooks/useUserLocation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RadiusFilter from "@/src/features/map/ui/MapView/RadiusFilter";
import { getDistanceKm } from "@/src/shared/utils/geo";


const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  // Géolocalisation : récupère la position de l'utilisateur au mount
  const { userLocation, refresh: refreshLocation } = useUserLocation();

  const [spots, setSpots] = useState<SpotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<SpotResponse | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [showRadiusFilter, setShowRadiusFilter] = useState(false);

  // Fallback Paris si la géoloc n'est pas disponible (permission refusée, etc.)
  const DEFAULT_REGION: Region = {
    latitude: 48.774159,
    longitude: 2.536275,
    latitudeDelta: 0.0522,
    longitudeDelta: 0.0221,
  };

  // Région initiale : position de l'utilisateur si disponible, sinon Paris
  // useMemo évite de recréer l'objet à chaque render
  const initialRegion = useMemo<Region>(() => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0221,
      };
    }
    return DEFAULT_REGION;
  }, [userLocation]);

  const filteredSpots = useMemo(() => {
    if (!selectedRadius || !userLocation) return spots;

    return spots.filter((spot) => {
      if (!spot.latitude || !spot.longitude) return false;
      const distance = getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude,
      );
      return distance <= selectedRadius;
    });
  }, [spots, selectedRadius, userLocation]);

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
    } catch (err) {
      logger.error("Erreur lors du chargement des spots:", err);
      setError(getErrorMessage(err, "Impossible de charger les spots"));
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
        500,
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
        800,
      );
    }
  };

  // Recentrer sur l'utilisateur si sa position est connue, sinon fallback Paris
  const handleRecenterMap = async () => {
    if (!mapRef.current) return;

    // Si on a déjà la position, on y va directement
    if (userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0221,
        },
        500,
      );
      return;
    }

    // Sinon on retente la géoloc (peut-être que l'utilisateur a changé d'avis)
    await refreshLocation();

    // Fallback Paris si toujours pas de position
    mapRef.current.animateToRegion(DEFAULT_REGION, 500);
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
        initialRegion={initialRegion}
        style={styles.map}
        mapType={mapType}
        showsUserLocation={false}
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
        {filteredSpots
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

        {/* Marqueur utilisateur : affiché uniquement si la géoloc est disponible */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            tracksViewChanges={true}
          >
            <UserMarker />
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutText}>Vous êtes ici</Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>

      <MapHeader
          spotsCount={filteredSpots.length}
          topInset={insets.top}
          onSearchPress={handleOpenSearch}
          onFilterPress={() => setShowRadiusFilter(!showRadiusFilter)}
          isFilterActive={selectedRadius !== null}
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

      {showRadiusFilter && !selectedSpot && (
          <RadiusFilter
              selectedRadius={selectedRadius}
              onSelectRadius={setSelectedRadius}
              userLocation={!!userLocation}
              filteredCount={filteredSpots.length}
              totalCount={spots.length}
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

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  callout: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  calloutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});