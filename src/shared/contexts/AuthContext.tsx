// ============================================
// 🛹 SOSKATE - AUTH CONTEXT
// ============================================
// Contexte d'authentification avec persistence AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthState,
  StoredUser,
  UnifiedLoginResponse,
} from "../../features/auth/types/auth.types";
import { removeToken } from "@/src/shared/storage/tokenStorage";
import { setLogoutCallback } from "@/src/api/axios/axiosConfig";
import { logger } from "@/src/shared/utils/logger";

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  USER_DATA: "@soskate/user",
  HAS_LOGGED_BEFORE: "@soskate/hasLoggedBefore",
} as const;

// ============================================
// CONTEXT TYPE
// ============================================
interface AuthContextType extends AuthState {
  // Actions
  login: (response: UnifiedLoginResponse) => Promise<void>;
  logout: () => Promise<void>;

  // Helpers
  hasLoggedBefore: boolean;
  isCustomer: boolean;
  isInstructor: boolean;
}

// ============================================
// CONTEXT CREATION
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // === State ===
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoggedBefore, setHasLoggedBefore] = useState(false);

  // === Computed values ===
  const isAuthenticated = useMemo(() => user !== null, [user]);
  const isCustomer = useMemo(() => user?.role === "CUSTOMER", [user?.role]);
  const isInstructor = useMemo(() => user?.role === "INSTRUCTOR", [user?.role]);

  // === Load stored data on mount ===
  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    setLogoutCallback(() => setUser(null));
  }, []);

  /**
   * Charge les données d'authentification depuis AsyncStorage
   */
  const loadStoredAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Charger les données en parallèle
      const [storedUser, hasLogged] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_LOGGED_BEFORE),
      ]);

      if (storedUser) {
        const parsedUser: StoredUser = JSON.parse(storedUser);
        setUser(parsedUser);
        logger.dev("Session restaurée pour:", parsedUser.email);
      }

      setHasLoggedBefore(hasLogged === "true");
    } catch (error) {
      logger.error("Erreur lors du chargement de la session:", error);
      // En cas d'erreur, on reset tout
      await clearStorage();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Connecte l'utilisateur et persiste les données
   */
  const login = useCallback(
    async (response: UnifiedLoginResponse): Promise<void> => {
      try {
        // Transformer la réponse API en données stockables
        const userData: StoredUser = {
          id: response.id,
          customerId: response.customerId,
          instructorId: response.instructorId,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          phone: response.phone,
          role: response.role,
        };

        // Persister les données
        await Promise.all([
          AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(userData),
          ),
          AsyncStorage.setItem(STORAGE_KEYS.HAS_LOGGED_BEFORE, "true"),
        ]);

        // Mettre à jour le state
        setUser(userData);
        setHasLoggedBefore(true);

        logger.dev("Connexion réussie:", userData.email, "| Rôle:", userData.role);
      } catch (error) {
        logger.error("Erreur lors de la sauvegarde de la session:", error);
        throw error;
      }
    },
    [],
  );

  /**
   * Déconnecte l'utilisateur et supprime les données persistées
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Supprimer uniquement les données utilisateur, garder hasLoggedBefore
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

      // Supprimer aussi le token JWT si présent (pour le futur)
      await removeToken();

      setUser(null);

      logger.dev("Déconnexion réussie");
    } catch (error) {
      logger.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  }, []);

  /**
   * Nettoie complètement le storage (utilisé en cas d'erreur)
   */
  const clearStorage = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.HAS_LOGGED_BEFORE,
      ]);
      await removeToken();
      setUser(null);
      setHasLoggedBefore(false);
    } catch (error) {
      logger.error("Erreur lors du nettoyage du storage:", error);
    }
  };

  // === Context value ===
  const contextValue = useMemo<AuthContextType>(
    () => ({
      // State
      user,
      isLoading,
      isAuthenticated,

      // Actions
      login,
      logout,

      // Helpers
      hasLoggedBefore,
      isCustomer,
      isInstructor,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      hasLoggedBefore,
      isCustomer,
      isInstructor,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// ============================================
// EXPORT STORAGE KEYS (pour tests/debug)
// ============================================
export { STORAGE_KEYS };
