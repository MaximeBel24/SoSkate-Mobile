// ============================================
// 🛹 SOSKATE - PROFILE SERVICE
// ============================================
// Service pour la gestion des profils Customer et Instructor

import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG } from "@/src/shared/constants/constants";
import {
  CustomerProfileResponse,
  CustomerProfileUpdateRequest,
  InstructorProfileResponse,
  InstructorProfileUpdateRequest,
} from "@/src/shared/types/profile.interface";
import { AxiosError } from "axios";

// ============================================
// CUSTOMER PROFILE API
// ============================================

/**
 * Récupère le profil d'un customer
 */
export async function getCustomerProfile(
  customerId: number,
): Promise<CustomerProfileResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}/customer/${customerId}/profile`;
    const { data } = await apiClient.get<CustomerProfileResponse>(endpoint);
    return data;
  } catch (err) {
    throw handleApiError(err, "Erreur lors de la récupération du profil");
  }
}

/**
 * Met à jour le profil d'un customer
 */
export async function updateCustomerProfile(
  customerId: number,
  payload: CustomerProfileUpdateRequest,
): Promise<CustomerProfileResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}/customer/${customerId}/profile`;
    const { data } = await apiClient.put<CustomerProfileResponse>(
      endpoint,
      payload,
    );
    return data;
  } catch (err) {
    throw handleApiError(err, "Erreur lors de la mise à jour du profil");
  }
}

// ============================================
// INSTRUCTOR PROFILE API
// ============================================

/**
 * Récupère le profil d'un instructor
 */
export async function getInstructorProfile(
  instructorId: number,
): Promise<InstructorProfileResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}/instructors/${instructorId}/profile`;
    const { data } = await apiClient.get<InstructorProfileResponse>(endpoint);
    return data;
  } catch (err) {
    throw handleApiError(err, "Erreur lors de la récupération du profil");
  }
}

/**
 * Met à jour le profil d'un instructor
 */
export async function updateInstructorProfile(
  instructorId: number,
  payload: InstructorProfileUpdateRequest,
): Promise<InstructorProfileResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}/instructors/${instructorId}/profile`;
    const { data } = await apiClient.put<InstructorProfileResponse>(
      endpoint,
      payload,
    );
    return data;
  } catch (err) {
    throw handleApiError(err, "Erreur lors de la mise à jour du profil");
  }
}

// ============================================
// ERROR HANDLER
// ============================================

function handleApiError(err: unknown, defaultMessage: string): ApiError {
  const error = err as AxiosError<any>;

  const status = error.response?.status;
  const backend = error.response?.data;

  const backendMessage =
    (backend && (backend.message || backend.error || backend.title)) ??
    error.message;

  const details = backend?.errors ?? backend;

  return new ApiError(backendMessage || defaultMessage, status, details);
}
