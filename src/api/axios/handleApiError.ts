import { AxiosError } from "axios";
import { ApiError } from "@/src/api/axios/apiError";

interface BackendErrorResponse {
  message?: string;
  error?: string;
  title?: string;
  errors?: unknown;
}

export const handleApiError = (
  err: unknown,
  fallbackMessage: string,
): never => {
  const error = err as AxiosError<BackendErrorResponse>;

  const status = error.response?.status;
  const backend = error.response?.data;

  const backendMessage =
    (backend && (backend.message || backend.error || backend.title)) ??
    error.message;

  const details = backend?.errors ?? backend;

  throw new ApiError(backendMessage || fallbackMessage, status, details);
};
