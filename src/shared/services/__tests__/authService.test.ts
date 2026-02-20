import { login, registerCustomer, checkEmailExists } from "../authService";

jest.mock("@/src/api/axios/axiosConfig", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));
jest.mock("@/src/shared/storage/tokenStorage");

import apiClient from "@/src/api/axios/axiosConfig";
import { saveToken } from "@/src/shared/storage/tokenStorage";

const mockPost = apiClient.post as jest.Mock;
const mockGet = apiClient.get as jest.Mock;
const mockSaveToken = saveToken as jest.Mock;

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    const payload = { email: "test@example.com", password: "password123" };
    const loginResponse = {
      id: 1,
      customerId: 1,
      instructorId: null,
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      phone: null,
      role: "CUSTOMER" as const,
      message: "Login successful",
    };

    it("returns login response data", async () => {
      mockPost.mockResolvedValue({
        data: loginResponse,
        headers: { authorization: "Bearer abc123" },
      });

      const result = await login(payload);
      expect(result).toEqual(loginResponse);
    });

    it("extracts and saves token from authorization header", async () => {
      mockPost.mockResolvedValue({
        data: loginResponse,
        headers: { authorization: "Bearer my-jwt-token" },
      });

      await login(payload);
      expect(mockSaveToken).toHaveBeenCalledWith("my-jwt-token");
    });

    it("does not save token when authorization header is missing", async () => {
      mockPost.mockResolvedValue({
        data: loginResponse,
        headers: {},
      });

      await login(payload);
      expect(mockSaveToken).not.toHaveBeenCalled();
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockPost.mockRejectedValue(new Error("Network error"));

      await expect(login(payload)).rejects.toThrow(ApiError);
    });

    it("calls the correct endpoint", async () => {
      mockPost.mockResolvedValue({ data: loginResponse, headers: {} });

      await login(payload);
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        payload,
      );
    });
  });

  describe("registerCustomer", () => {
    const payload = {
      email: "new@example.com",
      password: "password123",
      firstName: "New",
      lastName: "User",
    };
    const registerResponse = {
      id: 2,
      email: "new@example.com",
      firstname: "New",
      lastname: "User",
      phone: null,
      birthDate: null,
      createdAt: "2026-01-01T00:00:00",
      updatedAt: "2026-01-01T00:00:00",
    };

    it("returns registered customer data", async () => {
      mockPost.mockResolvedValue({ data: registerResponse });

      const result = await registerCustomer(payload);
      expect(result).toEqual(registerResponse);
    });

    it("calls the correct endpoint", async () => {
      mockPost.mockResolvedValue({ data: registerResponse });

      await registerCustomer(payload);
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("/customer/auth/register"),
        payload,
      );
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockPost.mockRejectedValue(new Error("Network error"));

      await expect(registerCustomer(payload)).rejects.toThrow(ApiError);
    });
  });

  describe("checkEmailExists", () => {
    it("returns true when email exists", async () => {
      mockGet.mockResolvedValue({ data: true });

      const result = await checkEmailExists("existing@example.com");
      expect(result).toBe(true);
    });

    it("returns false when email does not exist", async () => {
      mockGet.mockResolvedValue({ data: false });

      const result = await checkEmailExists("new@example.com");
      expect(result).toBe(false);
    });

    it("calls the correct endpoint with email param", async () => {
      mockGet.mockResolvedValue({ data: false });

      await checkEmailExists("test@example.com");
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining("/auth/email-exists"),
        { params: { email: "test@example.com" } },
      );
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockGet.mockRejectedValue(new Error("Network error"));

      await expect(checkEmailExists("test@example.com")).rejects.toThrow(
        ApiError,
      );
    });
  });
});
