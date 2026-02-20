import { ApiError } from "../apiError";

describe("ApiError", () => {
  it("creates an instance with message only", () => {
    const error = new ApiError("Something went wrong");
    expect(error.message).toBe("Something went wrong");
    expect(error.status).toBeUndefined();
    expect(error.details).toBeUndefined();
  });

  it("creates an instance with message and status", () => {
    const error = new ApiError("Not Found", 404);
    expect(error.message).toBe("Not Found");
    expect(error.status).toBe(404);
    expect(error.details).toBeUndefined();
  });

  it("creates an instance with all properties", () => {
    const details = { field: "email", reason: "invalid" };
    const error = new ApiError("Validation failed", 422, details);
    expect(error.message).toBe("Validation failed");
    expect(error.status).toBe(422);
    expect(error.details).toEqual(details);
  });

  it("is an instance of Error", () => {
    const error = new ApiError("test");
    expect(error).toBeInstanceOf(Error);
  });

  it("is an instance of ApiError", () => {
    const error = new ApiError("test");
    expect(error).toBeInstanceOf(ApiError);
  });

  it("has name set to ApiError", () => {
    const error = new ApiError("test");
    expect(error.name).toBe("ApiError");
  });
});
