// ============================================
// 🛹 SOSKATE - INSTRUCTOR SPOTS TYPES
// ============================================
// Types pour la gestion des spots d'un instructeur

/**
 * Spot associé à un instructeur (réponse API)
 * GET /instructors/{id}/spots
 */
export interface InstructorSpotResponse {
  id: number;
  instructorId: number;
  spot: SpotSummary;
  createdAt: string;
}

/**
 * Résumé d'un spot (dans la réponse InstructorSpot)
 */
export interface SpotSummary {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

/**
 * Requête pour associer un spot
 * POST /instructors/{id}/spots
 */
export interface AddSpotRequest {
  spotId: number;
}

/**
 * Spot disponible (pour la liste de sélection)
 * Réutilise le type SpotResponse existant
 */
export interface SpotForSelection {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  isAssociated: boolean; // true si l'instructeur est déjà associé
}
