import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth, STORAGE_KEYS } from "../AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UnifiedLoginResponse } from "@/src/features/auth/types/auth.types";

jest.mock("@/src/shared/storage/tokenStorage", () => ({
  removeToken: jest.fn().mockResolvedValue(undefined),
  getToken: jest.fn().mockResolvedValue(null),
  saveToken: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/src/api/axios/axiosConfig", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
  setLogoutCallback: jest.fn(),
}));

import { removeToken } from "@/src/shared/storage/tokenStorage";
import { setLogoutCallback } from "@/src/api/axios/axiosConfig";

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockRemoveToken = removeToken as jest.Mock;
const mockSetLogoutCallback = setLogoutCallback as jest.Mock;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockLoginResponse: UnifiedLoginResponse = {
  id: 1,
  customerId: 1,
  instructorId: null,
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  phone: null,
  role: "CUSTOMER",
  message: "Login successful",
};

const mockInstructorResponse: UnifiedLoginResponse = {
  id: 2,
  customerId: null,
  instructorId: 5,
  email: "instructor@example.com",
  firstName: "Coach",
  lastName: "Pro",
  phone: "+33612345678",
  role: "INSTRUCTOR",
  message: "Login successful",
};

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
    mockAsyncStorage.removeItem.mockResolvedValue(undefined);
    mockAsyncStorage.multiRemove.mockResolvedValue(undefined);
  });

  describe("initial state", () => {
    it("starts with user as null", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("sets isLoading to false after loading stored auth", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("registers logout callback", async () => {
      renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(mockSetLogoutCallback).toHaveBeenCalledWith(expect.any(Function));
      });
    });
  });

  describe("loadStoredAuth", () => {
    it("restores user from AsyncStorage", async () => {
      const storedUser = {
        id: 1,
        customerId: 1,
        instructorId: null,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: null,
        role: "CUSTOMER",
      };
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === STORAGE_KEYS.USER_DATA)
          return Promise.resolve(JSON.stringify(storedUser));
        if (key === STORAGE_KEYS.HAS_LOGGED_BEFORE)
          return Promise.resolve("true");
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(storedUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.hasLoggedBefore).toBe(true);
    });

    it("clears storage on parse error", async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error("corrupt data"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.HAS_LOGGED_BEFORE,
      ]);
      expect(result.current.user).toBeNull();
    });
  });

  describe("login", () => {
    it("persists user data and sets state", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(mockLoginResponse);
      });

      expect(result.current.user).toEqual({
        id: 1,
        customerId: 1,
        instructorId: null,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: null,
        role: "CUSTOMER",
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.hasLoggedBefore).toBe(true);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        expect.any(String),
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.HAS_LOGGED_BEFORE,
        "true",
      );
    });

    it("throws on AsyncStorage error", async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error("Storage full"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login(mockLoginResponse);
        }),
      ).rejects.toThrow("Storage full");
    });
  });

  describe("logout", () => {
    it("clears user data and token", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login first
      await act(async () => {
        await result.current.login(mockLoginResponse);
      });

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
      );
      expect(mockRemoveToken).toHaveBeenCalled();
    });

    it("throws on error", async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(
        new Error("Storage error"),
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.logout();
        }),
      ).rejects.toThrow("Storage error");
    });
  });

  describe("computed values", () => {
    it("isCustomer is true for CUSTOMER role", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(mockLoginResponse);
      });

      expect(result.current.isCustomer).toBe(true);
      expect(result.current.isInstructor).toBe(false);
    });

    it("isInstructor is true for INSTRUCTOR role", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(mockInstructorResponse);
      });

      expect(result.current.isInstructor).toBe(true);
      expect(result.current.isCustomer).toBe(false);
    });

    it("both isCustomer and isInstructor are false when logged out", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isCustomer).toBe(false);
      expect(result.current.isInstructor).toBe(false);
    });
  });

  describe("useAuth outside provider", () => {
    it("throws when used outside AuthProvider", () => {
      // Silence the console.error from React during this test
      const spy = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      spy.mockRestore();
    });
  });
});
