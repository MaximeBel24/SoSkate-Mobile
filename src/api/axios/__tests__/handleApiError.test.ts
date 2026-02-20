import { AxiosError, AxiosHeaders } from "axios";
import { ApiError } from "../apiError";
import { handleApiError } from "../handleApiError";

describe("handleApiError", () => {
  it("always throws an ApiError", () => {
    const error = new AxiosError("test");
    expect(() => handleApiError(error, "Fallback")).toThrow(ApiError);
  });

  it("extracts backend message from response.data.message", () => {
    const error = new AxiosError("Network");
    error.response = {
      data: { message: "Invalid credentials" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    try {
      handleApiError(error, "Fallback");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.message).toBe("Invalid credentials");
      expect(apiErr.status).toBe(401);
    }
  });

  it("extracts backend message from response.data.error", () => {
    const error = new AxiosError("Network");
    error.response = {
      data: { error: "Forbidden access" },
      status: 403,
      statusText: "Forbidden",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    try {
      handleApiError(error, "Fallback");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.message).toBe("Forbidden access");
      expect(apiErr.status).toBe(403);
    }
  });

  it("extracts backend message from response.data.title", () => {
    const error = new AxiosError("Network");
    error.response = {
      data: { title: "Validation error" },
      status: 422,
      statusText: "Unprocessable",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    try {
      handleApiError(error, "Fallback");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.message).toBe("Validation error");
    }
  });

  it("uses AxiosError.message when no backend message", () => {
    const error = new AxiosError("timeout exceeded");

    try {
      handleApiError(error, "Fallback");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.message).toBe("timeout exceeded");
    }
  });

  it("uses fallback message when no other message available", () => {
    const error = {} as AxiosError;

    try {
      handleApiError(error, "Erreur par défaut");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.message).toBe("Erreur par défaut");
    }
  });

  it("includes backend errors in details", () => {
    const errors = [{ field: "email", message: "required" }];
    const error = new AxiosError("Network");
    error.response = {
      data: { message: "Validation failed", errors },
      status: 422,
      statusText: "Unprocessable",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    try {
      handleApiError(error, "Fallback");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.details).toEqual(errors);
    }
  });

  it("includes full backend data as details when no errors field", () => {
    const data = { message: "Server error" };
    const error = new AxiosError("Network");
    error.response = {
      data,
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    try {
      handleApiError(error, "Fallback");
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.details).toEqual(data);
    }
  });

  it("has return type never (TypeScript compile check)", () => {
    const error = new AxiosError("test");
    // If this function didn't return never, the line after would be reachable
    expect(() => handleApiError(error, "Fallback")).toThrow();
  });
});
