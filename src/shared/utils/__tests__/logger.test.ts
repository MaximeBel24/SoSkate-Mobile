// We need to test the actual logger module, not the mock
// So we unmock it for this test file
jest.unmock("@/src/shared/utils/logger");

describe("logger", () => {
  const originalDev = (global as any).__DEV__;

  afterEach(() => {
    (global as any).__DEV__ = originalDev;
    jest.resetModules();
  });

  describe("in development (__DEV__ = true)", () => {
    beforeEach(() => {
      (global as any).__DEV__ = true;
    });

    it("logger.dev calls console.log", () => {
      const spy = jest.spyOn(console, "log").mockImplementation();
      // Re-require to pick up the __DEV__ value
      const { logger } = require("@/src/shared/utils/logger");
      logger.dev("test message");
      expect(spy).toHaveBeenCalledWith("test message");
      spy.mockRestore();
    });
  });

  describe("in production (__DEV__ = false)", () => {
    beforeEach(() => {
      (global as any).__DEV__ = false;
    });

    it("logger.dev is a noop", () => {
      const spy = jest.spyOn(console, "log").mockImplementation();
      const { logger } = require("@/src/shared/utils/logger");
      logger.dev("should not log");
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("error and warn (always active)", () => {
    it("logger.error calls console.error", () => {
      const spy = jest.spyOn(console, "error").mockImplementation();
      const { logger } = require("@/src/shared/utils/logger");
      logger.error("error msg");
      expect(spy).toHaveBeenCalledWith("error msg");
      spy.mockRestore();
    });

    it("logger.warn calls console.warn", () => {
      const spy = jest.spyOn(console, "warn").mockImplementation();
      const { logger } = require("@/src/shared/utils/logger");
      logger.warn("warn msg");
      expect(spy).toHaveBeenCalledWith("warn msg");
      spy.mockRestore();
    });
  });
});
