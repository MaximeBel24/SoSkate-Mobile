import { AxiosError, AxiosHeaders } from "axios";
import { ApiError } from "../apiError";
import { getErrorMessage } from "../getErrorMessage";

describe("getErrorMessage", () => {
  it("extracts message from ApiError", () => {
    const error = new ApiError("Token expiré", 401);
    expect(getErrorMessage(error)).toBe("Token expiré");
  });

  it("extracts backend .message from AxiosError", () => {
    const error = new AxiosError("Network Error");
    error.response = {
      data: { message: "Email déjà utilisé" },
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    expect(getErrorMessage(error)).toBe("Email déjà utilisé");
  });

  it("extracts backend .error from AxiosError", () => {
    const error = new AxiosError("Network Error");
    error.response = {
      data: { error: "Accès refusé" },
      status: 403,
      statusText: "Forbidden",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    expect(getErrorMessage(error)).toBe("Accès refusé");
  });

  it("extracts backend .title from AxiosError", () => {
    const error = new AxiosError("Network Error");
    error.response = {
      data: { title: "Erreur de validation" },
      status: 422,
      statusText: "Unprocessable Entity",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    expect(getErrorMessage(error)).toBe("Erreur de validation");
  });

  it("falls back to AxiosError.message when no backend data", () => {
    const error = new AxiosError("timeout of 10000ms exceeded");
    expect(getErrorMessage(error)).toBe("timeout of 10000ms exceeded");
  });

  it("returns empty string AxiosError.message when no backend data and message is empty", () => {
    const error = new AxiosError();
    // getErrorMessage uses ?? so empty string is not considered nullish
    error.message = "";
    // The ?? operator treats "" as a valid value (not nullish), so it returns ""
    expect(getErrorMessage(error)).toBe("");
  });

  it("extracts message from standard Error", () => {
    const error = new Error("Something broke");
    expect(getErrorMessage(error)).toBe("Something broke");
  });

  it("returns default fallback for unknown types", () => {
    expect(getErrorMessage("random string")).toBe("Une erreur est survenue");
    expect(getErrorMessage(42)).toBe("Une erreur est survenue");
    expect(getErrorMessage(null)).toBe("Une erreur est survenue");
    expect(getErrorMessage(undefined)).toBe("Une erreur est survenue");
  });

  it("returns custom fallback when provided", () => {
    expect(getErrorMessage("unknown", "Oops")).toBe("Oops");
  });
});
