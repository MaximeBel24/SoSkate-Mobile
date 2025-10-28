import apiClient from "@/api/axiosConfig";
import {ENDPOINTS} from "@/constants/constants";
import {Spot} from "@/interfaces/spot.interface";



/**
 * Service pour gérer les spots de skate
 */
const spotService = {
    /**
     * Récupère tous les spots
     * @returns {Promise<Array>} Liste des spots
     */
    getAllSpots: async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.SPOTS);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des spots:', error);
            throw error;
        }
    },

    /**
     * Récupère un spot par son ID
     * @param {number} spotId - ID du spot
     * @returns {Promise<Object>} Détails du spot
     */
    getSpotById: async (spotId: number) => {
        try {
            const response = await apiClient.get(`${ENDPOINTS.SPOTS}/${spotId}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du spot ${spotId}:`, error);
            throw error;
        }
    },

    /**
     * Récupère les spots par ville
     * @param {string} city - Nom de la ville
     * @returns {Promise<Array>} Liste des spots de la ville
     */
    getSpotsByCity: async (city: string) => {
        try {
            const response = await apiClient.get(ENDPOINTS.SPOTS, {
                params: { city },
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des spots de ${city}:`, error);
            throw error;
        }
    },

    /**
     * Filtre les spots actifs
     * @param {Array} spots - Liste de spots
     * @returns {Array} Spots actifs uniquement
     */
    filterActiveSpots: (spots: Spot[]) => {
        return spots.filter(spot => spot.isActive);
    },

    /**
     * Filtre les spots indoor/outdoor
     * @param {Array} spots - Liste de spots
     * @param {boolean} isIndoor - true pour indoor, false pour outdoor
     * @returns {Array} Spots filtrés
     */
    filterByType: (spots: Spot[], isIndoor: boolean) => {
        return spots.filter(spot => spot.isIndoor === isIndoor);
    },
};

export default spotService;