import { AxiosError } from "axios";
import { ApiError } from "@/src/api/axios/apiError";

export const handleApiError = (
  err: unknown,
  fallbackMessage: string,
): never => {
  const error = err as AxiosError<any>;

  const status = error.response?.status;
  const backend = error.response?.data;

  const backendMessage =
    (backend && (backend.message || backend.error || backend.title)) ??
    error.message;

  const details = backend?.errors ?? backend;

  throw new ApiError(backendMessage || fallbackMessage, status, details);
};
