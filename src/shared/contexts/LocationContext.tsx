import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@/src/shared/utils/logger";

const LOCATION_STORAGE_KEY = "@soskate_location_enabled";
const BANNER_DISMISSED_KEY = "@soskate_location_banner_dismissed";

type LocationContextType = {
    isLocationEnabled: boolean;
    setLocationEnabled: (enabled: boolean) => Promise<void>;
    isLocationLoaded: boolean;
    isBannerDismissed: boolean;
    setBannerDismissed: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType>({
    isLocationEnabled: true,
    setLocationEnabled: async () => {},
    isLocationLoaded: false,
    isBannerDismissed: false,
    setBannerDismissed: async () => {},
});

type LocationProviderProps = {
    children: React.ReactNode;
};

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const [isLocationEnabled, setIsLocationEnabledState] = useState(true);
    const [isLocationLoaded, setIsLocationLoaded] = useState(false);
    const [isBannerDismissed, setIsBannerDismissedState] = useState(false);

    // 1. Charger la préférence au démarrage
    useEffect(() => {
        const loadLocationPreference = async () => {
            try {
                const saved = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
                if (saved !== null) {
                    setIsLocationEnabledState(saved === "true");
                }
                const dismissedSaved = await AsyncStorage.getItem(BANNER_DISMISSED_KEY);
                if (dismissedSaved === "true") {
                    setIsBannerDismissedState(true);
                }

            } catch (error) {
                logger.warn("Failed to load location preference:", error);
            } finally {
                setIsLocationLoaded(true);
            }
        };

        loadLocationPreference();
    }, []);

    // 2. Fonction pour modifier la préférence
    const setLocationEnabled = useCallback(async (enabled: boolean) => {
        try {
            await AsyncStorage.setItem(LOCATION_STORAGE_KEY, String(enabled));
            setIsLocationEnabledState(enabled);
        } catch (error) {
            logger.warn("Failed to save location preference:", error);
            setIsLocationEnabledState(enabled);
        }
    }, []);

    const setBannerDismissed = useCallback(async () => {
        try {
            await AsyncStorage.setItem(BANNER_DISMISSED_KEY, "true");
            setIsBannerDismissedState(true);
        } catch (error) {
            logger.warn("Failed to save banner dismissed:", error);
            setIsBannerDismissedState(true);
        }
    }, []);


    // 3. Valeur du contexte mémorisée
    const contextValue = useMemo<LocationContextType>(
        () => ({
            isLocationEnabled,
            setLocationEnabled,
            isLocationLoaded,
            isBannerDismissed,
            setBannerDismissed,
        }),
        [isLocationEnabled, setLocationEnabled, isLocationLoaded, isBannerDismissed, setBannerDismissed],
    );

    // 4. Render du Provider
    return (
        <LocationContext.Provider value={contextValue}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationSettings = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocationSettings must be used within a LocationProvider");
    }
    return context;
};