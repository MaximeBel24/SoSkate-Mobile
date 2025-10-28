import { ApiError } from "@/api/apiError";
import apiClient from "@/api/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/constants/constants";
import {
  CustomerRegisterRequest,
  LoginRequest,
  LoginResponse,
} from "@/interfaces/auth.interface";
import { CustomerResponse } from "@/interfaces/customer.interface";
import { AxiosError } from "axios";

export async function registerCustomer(
  payload: CustomerRegisterRequest
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
      backendMessage || "Erreur lors de l’inscription",
      status,
      details
    );
  }
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.LOGIN}`;
    const { data } = await apiClient.post<LoginResponse>(endpoint, payload);
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
      details
    );
  }
}
