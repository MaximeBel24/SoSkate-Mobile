// ============================================
// 🛹 SOSKATE - PROFILE SERVICE
// ============================================
// Service pour la gestion des profils Customer et Instructor

import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG } from "@/src/shared/constants/constants";
import {
  CustomerProfileResponse,
  CustomerProfileUpdateRequest,
  InstructorProfileResponse,
  InstructorProfileUpdateRequest,
} from "@/src/shared/types/profile.interface";
import { handleApiError } from "@/src/api/axios/handleApiError";

/**
 * Met à jour le profil d'un customer
 */
export const updateCustomerProfile = async (
  customerId: number,
  payload: CustomerProfileUpdateRequest,
): Promise<CustomerProfileResponse> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}/customer/${customerId}`;
    const { data } = await apiClient.put<CustomerProfileResponse>(
      endpoint,
      payload,
    );
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la mise à jour du profil");
  }
};

/**
 * Met à jour le profil d'un instructor
 */
export const updateInstructorProfile = async (
  instructorId: number,
  payload: InstructorProfileUpdateRequest,
): Promise<InstructorProfileResponse> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}/instructors/${instructorId}`;
    const { data } = await apiClient.put<InstructorProfileResponse>(
      endpoint,
      payload,
    );
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la mise à jour du profil");
  }
};
