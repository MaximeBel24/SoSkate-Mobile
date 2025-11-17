import { useMemo } from "react";

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/**
 * Hook personnalisé pour valider un mot de passe selon les critères backend
 * Correspond à la regex Spring Boot: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$
 */
export const usePasswordValidation = (password: string) => {
  const criteria = useMemo<PasswordCriteria>(() => {
    // Si le mot de passe est vide, tous les critères sont faux
    if (!password) {
      return {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      };
    }

    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&#]/.test(password),
    };
  }, [password]);

  // Vérifie si tous les critères sont remplis
  const isValid = useMemo(() => {
    return Object.values(criteria).every((criterion) => criterion === true);
  }, [criteria]);

  return { criteria, isValid };
};
