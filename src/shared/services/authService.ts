import apiClient from "@/src/api/axios/axiosConfig";
import { ENDPOINTS } from "@/src/shared/constants/constants";
import {
  CustomerRegisterRequest,
  CustomerResponse,
  ForgotPasswordRequest,
  LoginRequest, ResetPasswordRequest,
  UnifiedLoginResponse,
} from "@/src/features/auth/types/auth.types";
import { handleApiError } from "@/src/api/axios/handleApiError";
import { saveToken } from "@/src/shared/storage/tokenStorage";
import { logger } from "@/src/shared/utils/logger";

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
    const { data, headers } = await apiClient.post<UnifiedLoginResponse>(
      ENDPOINTS.AUTH.UNIFIED_LOGIN,
      payload,
    );

    // Extraction du token : header (principal) ou body (fallback)
    const headerToken = headers["authorization"]?.replace(/^Bearer\s+/i, "");
    const token = headerToken || data.token;

    if (token) {
      await saveToken(token);
      logger.dev("[Auth] Token JWT sauvegardé avec succès");
    } else {
      logger.warn(
        "[Auth] Aucun token JWT trouvé dans la réponse de login (ni header, ni body)",
      );
    }

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
    const { data } = await apiClient.post<CustomerResponse>(
      ENDPOINTS.AUTH.CUSTOMER_REGISTER,
      payload,
    );
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de l'inscription");
  }
};

/**
 * Change le mot de passe de l'utilisateur connecté
 */
export const changePassword = async (
    currentPassword: string,
    newPassword: string,
): Promise<void> => {
  try {
    await apiClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  } catch (err) {
    return handleApiError(err, "Erreur lors du changement de mot de passe");
  }
};

/**
 * Supprime le compte de l'utilisateur connecté (soft delete)
 */
export const deleteAccount = async (password: string): Promise<void> => {
  try {
    await apiClient.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      data: { password },
    });
  } catch (err) {
    return handleApiError(err, "Erreur lors de la suppression du compte");
  }
};

export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<boolean>("/auth/verify-password", { password });
    return response.data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la vérification du mot de passe");
  }
};

/**
 * Demande un code de réinitialisation de mot de passe
 * Envoie un code à 6 chiffres par email
 */
export const forgotPassword = async (
    payload: ForgotPasswordRequest,
): Promise<void> => {
  try {
    await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  } catch (err) {
    return handleApiError(err, "Erreur lors de la demande de réinitialisation");
  }
};

/**
 * Réinitialise le mot de passe avec le code reçu par email
 */
export const resetPassword = async (
    payload: ResetPasswordRequest,
): Promise<void> => {
  try {
    await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  } catch (err) {
    return handleApiError(err, "Erreur lors de la réinitialisation du mot de passe");
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
 * @throws ApiError si l'API est injoignable ou retourne une erreur
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.get<boolean>(ENDPOINTS.AUTH.EMAIL_EXISTS, {
      params: { email },
    });
    return data;
  } catch (err) {
    return handleApiError(err, "Impossible de vérifier la disponibilité de l'email");
  }
};