import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/src/shared/constants/constants';

// Création de l'instance Axios
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de requête - Ajout du token JWT
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur de réponse - Gestion des erreurs
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            // Le serveur a répondu avec un code d'erreur
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Token expiré ou invalide
                    await AsyncStorage.removeItem('authToken');
                    await AsyncStorage.removeItem('userData');
                    // Vous pouvez naviguer vers l'écran de connexion ici
                    console.log('Session expirée, redirection vers login');
                    break;

                case 403:
                    console.error('Accès refusé');
                    break;

                case 404:
                    console.error('Ressource non trouvée');
                    break;

                case 500:
                    console.error('Erreur serveur');
                    break;

                default:
                    console.error(`Erreur ${status}:`, data);
            }
        } else if (error.request) {
            // La requête a été faite mais pas de réponse
            console.error('Pas de réponse du serveur:', error.message);
        } else {
            // Erreur lors de la configuration de la requête
            console.error('Erreur de configuration:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;