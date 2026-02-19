import { AxiosError } from "axios";
import { ApiError } from "@/src/api/axios/apiError";

export const getErrorMessage = (
  err: unknown,
  fallback = "Une erreur est survenue",
): string => {
  if (err instanceof ApiError) {
    return err.message;
  }

  if (err instanceof AxiosError) {
    const backend = err.response?.data as Record<string, unknown> | undefined;
    const backendMessage =
      backend &&
      (typeof backend.message === "string"
        ? backend.message
        : typeof backend.error === "string"
          ? backend.error
          : typeof backend.title === "string"
            ? backend.title
            : null);

    return backendMessage ?? err.message ?? fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
};
