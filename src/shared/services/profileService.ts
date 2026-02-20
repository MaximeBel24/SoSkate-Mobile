// ============================================
// 🛹 SOSKATE - PROFILE SERVICE
// ============================================
// Service pour la gestion des profils Customer et Instructor

import apiClient from "@/src/api/axios/axiosConfig";
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
    const { data } = await apiClient.put<CustomerProfileResponse>(
      `/customer/${customerId}`,
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
    const { data } = await apiClient.put<InstructorProfileResponse>(
      `/instructors/${instructorId}`,
      payload,
    );
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la mise à jour du profil");
  }
};
