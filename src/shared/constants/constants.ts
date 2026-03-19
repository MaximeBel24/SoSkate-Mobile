// Configuration API
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api",
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 10000),
};

// Endpoints
export const ENDPOINTS = {
  SPOTS: "/spots",
  SERVICES: "/services",
  PHOTOS: "/photos",
  AUTH: {
    // Nouvel endpoint unifié (Customer + Instructor)
    UNIFIED_LOGIN: "/auth/login",
    EMAIL_EXISTS: "/auth/email-exists",
    CHANGE_PASSWORD: "/auth/change-password",
    DELETE_ACCOUNT: "/auth/delete-account",

    // Endpoints Customer spécifiques
    CUSTOMER_REGISTER: "/customer/auth/register",
    CUSTOMER_LOGIN: "/customer/auth/login",

  },
  ADMIN: {
    INSTRUCTOR: "/admin/instructors",
  },
};