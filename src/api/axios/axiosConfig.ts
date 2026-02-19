import { API_CONFIG } from "@/src/shared/constants/constants";
import { getToken, removeToken } from "@/src/shared/storage/tokenStorage";
import { logger } from "@/src/shared/utils/logger";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

let logoutCallback: (() => void) | null = null;

const inFlightRequests = new Map<string, Promise<any>>();

const buildRequestKey = (url: string, params?: any): string => {
  const serializedParams = params ? JSON.stringify(params) : "";
  return `get:${url}:${serializedParams}`;
};

// Création de l'instance Axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête - Ajout du token JWT
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      logger.error("Erreur lors de la récupération du token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

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
          await removeToken();
          await AsyncStorage.removeItem("userData");
          if (logoutCallback) {
            logoutCallback();
          }
          // Vous pouvez naviguer vers l'écran de connexion ici
          logger.dev("Session expirée, redirection vers login");
          break;

        case 403:
          logger.error("Accès refusé");
          break;

        case 404:
          // Les 404 sur certains endpoints sont normaux (avatar, etc.)
          const silentEndpoints = ["/avatar", "/photos/"];
          const isSilent = silentEndpoints.some((ep) =>
            error.config?.url?.includes(ep),
          );
          if (!isSilent) {
            logger.warn("Ressource non trouvée:", error.config?.url);
          }
          break;

        case 500:
          logger.error("Erreur serveur");
          break;

        default:
          logger.error(`Erreur ${status}:`, data);
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      logger.error("Pas de réponse du serveur:", error.message);
    } else {
      // Erreur lors de la configuration de la requête
      logger.error("Erreur de configuration:", error.message);
    }

    return Promise.reject(error);
  },
);

// Déduplication des requêtes GET en vol
const originalGet = apiClient.get.bind(apiClient);
apiClient.get = ((url: string, config?: any) => {
  const key = buildRequestKey(url, config?.params);

  const existing = inFlightRequests.get(key);
  if (existing) return existing;

  const request = originalGet(url, config).finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, request);
  return request;
}) as typeof apiClient.get;

export default apiClient;
