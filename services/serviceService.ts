import apiClient from "@/api/axiosConfig";
import {ENDPOINTS} from "@/constants/constants";
import {Service} from "@/interfaces/service.interface";

/**
 * Service pour gérer les services de cours
 */
const serviceService = {
    /**
     * Récupère tous les services
     * @returns {Promise<Array>} Liste des services
     */
    getAllServices: async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.SERVICES);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des services:', error);
            throw error;
        }
    },

    /**
     * Récupère un service par son ID
     * @param {number} serviceId - ID du service
     * @returns {Promise<Object>} Détails du service
     */
    getServiceById: async (serviceId: number) => {
        try {
            const response = await apiClient.get(`${ENDPOINTS.SERVICES}/${serviceId}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du service ${serviceId}:`, error);
            throw error;
        }
    },

    /**
     * Filtre les services actifs
     * @param {Array} services - Liste de services
     * @returns {Array} Services actifs uniquement
     */
    filterActiveServices: (services: Service[]) => {
        return services.filter(service => service.isActive);
    },

    /**
     * Groupe les services par type
     * @param {Array} services - Liste de services
     * @returns {Object} Services groupés par type (RENTAL, LESSON, etc.)
     */
    // groupByType: (services: Service[]) => {
    //     return services.reduce((acc, service) => {
    //         if (!acc[service.type]) {
    //             acc[service.type] = [];
    //         }
    //         acc[service.type].push(service);
    //         return acc;
    //     }, {});
    // },

    /**
     * Formate le prix en euros
     * @param {number} priceCents - Prix en centimes
     * @returns {string} Prix formaté (ex: "20,00 €")
     */
    formatPrice: (priceCents: number) => {
        return `${(priceCents / 100).toFixed(2)} €`;
    },
};

export default serviceService;