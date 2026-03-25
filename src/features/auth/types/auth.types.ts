// ============================================
// 🛹 SOSKATE - AUTH TYPES
// ============================================
// Types pour l'authentification unifiée Customer/Instructor

/**
 * Rôles possibles dans l'application
 */
export type UserRole = "CUSTOMER" | "INSTRUCTOR";

/**
 * Requête de connexion
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Requête d'inscription Customer
 */
export interface CustomerRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
}

/**
 * Requête de mot de passe oublié
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Requête de réinitialisation de mot de passe
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

/**
 * Réponse de connexion unifiée (nouveau endpoint /api/auth/login)
 * Supporte Customer et Instructor
 */
export interface UnifiedLoginResponse {
  // Identifiants
  id: number;
  customerId: number | null;
  instructorId: number | null;

  // Infos utilisateur
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;

  // Rôle
  role: UserRole;

  // Message
  message: string;

  // Token JWT (optionnel - fallback si le header Authorization n'est pas accessible)
  token?: string;
}

/**
 * Données utilisateur stockées localement (AsyncStorage)
 */
export interface StoredUser {
  id: number;
  customerId: number | null;
  instructorId: number | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
}

/**
 * État de l'authentification dans le contexte
 */
export interface AuthState {
  user: StoredUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================
// LEGACY TYPES (pour rétrocompatibilité)
// À supprimer après migration complète
// ============================================

/**
 * @deprecated Utiliser UnifiedLoginResponse à la place
 */
export interface LoginResponse {
  customer: CustomerResponse;
  message: string;
}

/**
 * Réponse Customer (utilisé par register et l'ancien login)
 */
export interface CustomerResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
}
