// Configuration API
export const API_CONFIG = {
  BASE_URL: "http://192.168.1.27:8080/api",
  TIMEOUT: 10000,
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

    // Endpoints Customer spécifiques
    CUSTOMER_REGISTER: "/customer/auth/register",
    CUSTOMER_LOGIN: "/customer/auth/login",
  },
  ADMIN: {
    INSTRUCTOR: "/admin/instructors",
  },
};

// Configuration de la carte
export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 48.8566, // Paris
    longitude: 2.3522,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  },
  MARKER_SIZE: 40,
};

