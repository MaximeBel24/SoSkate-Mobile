// ============================================
// 🛹 SOSKATE - AUTH SERVICE
// ============================================
// Service d'authentification avec endpoint unifié

import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import {
  CustomerRegisterRequest,
  CustomerResponse,
  LoginRequest,
  UnifiedLoginResponse,
} from "@/src/features/auth/types/auth.types";
import { AxiosError } from "axios";

// ============================================
// UNIFIED LOGIN (nouveau endpoint)
// ============================================

/**
 * Connexion unifiée pour Customer et Instructor
 * Utilise le nouvel endpoint /api/auth/login
 *
 * @param payload - Email et mot de passe
 * @returns Réponse unifiée avec rôle (CUSTOMER ou INSTRUCTOR)
 */
export async function login(
  payload: LoginRequest,
): Promise<UnifiedLoginResponse> {
  try {
    // Utiliser le nouvel endpoint unifié
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.UNIFIED_LOGIN}`;
    const { data } = await apiClient.post<UnifiedLoginResponse>(
      endpoint,
      payload,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;

    const status = error.response?.status;
    const backend = error.response?.data;

    const backendMessage =
      (backend && (backend.message || backend.error || backend.title)) ??
      error.message;

    const details = backend?.errors ?? backend;

    throw new ApiError(
      backendMessage || "Erreur lors de la connexion",
      status,
      details,
    );
  }
}

// ============================================
// CUSTOMER REGISTRATION
// ============================================

/**
 * Inscription d'un nouveau Customer
 *
 * @param payload - Données d'inscription
 * @returns Customer créé
 */
export async function registerCustomer(
  payload: CustomerRegisterRequest,
): Promise<CustomerResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.CUSTOMER_REGISTER}`;
    const { data } = await apiClient.post<CustomerResponse>(endpoint, payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;

    const status = error.response?.status;
    const backend = error.response?.data;

    const backendMessage =
      (backend && (backend.message || backend.error || backend.title)) ??
      error.message;

    const details = backend?.errors ?? backend;

    throw new ApiError(
      backendMessage || "Erreur lors de l'inscription",
      status,
      details,
    );
  }
}

// ============================================
// EMAIL VERIFICATION
// ============================================

/**
 * Vérifie si un email existe déjà (Customer OU Instructor)
 *
 * @param email - Email à vérifier
 * @returns true si l'email existe déjà
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.EMAIL_EXISTS}`;
    const { data } = await apiClient.get<boolean>(endpoint, {
      params: { email },
    });
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;

    // En cas d'erreur réseau, on considère que l'email n'existe pas
    // pour ne pas bloquer l'utilisateur
    console.error("Erreur vérification email:", error.message);
    return false;
  }
}
