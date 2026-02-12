// ============================================
// 🛹 SOSKATE - AUTH SERVICE
// ============================================
// Service d'authentification avec endpoint unifié

import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import {
  CustomerRegisterRequest,
  CustomerResponse,
  LoginRequest,
  UnifiedLoginResponse,
} from "@/src/features/auth/types/auth.types";
import { AxiosError } from "axios";
import { handleApiError } from "@/src/api/axios/handleApiError";

/**
 * Connexion unifiée pour Customer et Instructor
 * Utilise le nouvel endpoint /api/auth/login
 *
 * @param payload - Email et mot de passe
 * @returns Réponse unifiée avec rôle (CUSTOMER ou INSTRUCTOR)
 */
export const login = async (
  payload: LoginRequest,
): Promise<UnifiedLoginResponse> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.UNIFIED_LOGIN}`;
    const { data } = await apiClient.post<UnifiedLoginResponse>(
      endpoint,
      payload,
    );
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la connexion");
  }
};

/**
 * Inscription d'un nouveau Customer
 *
 * @param payload - Données d'inscription
 * @returns Customer créé
 */
export const registerCustomer = async (
  payload: CustomerRegisterRequest,
): Promise<CustomerResponse> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.CUSTOMER_REGISTER}`;
    const { data } = await apiClient.post<CustomerResponse>(endpoint, payload);
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de l'inscription");
  }
};

// ============================================
// EMAIL VERIFICATION
// ============================================

/**
 * Vérifie si un email existe déjà (Customer OU Instructor)
 *
 * @param email - Email à vérifier
 * @returns true si l'email existe déjà
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.EMAIL_EXISTS}`;
    const { data } = await apiClient.get<boolean>(endpoint, {
      params: { email },
    });
    return data;
  } catch (err) {
    // En cas d'erreur réseau, on considère que l'email n'existe pas
    // pour ne pas bloquer l'utilisateur
    console.error("Erreur vérification email:", (err as AxiosError).message);
    return false;
  }
};
