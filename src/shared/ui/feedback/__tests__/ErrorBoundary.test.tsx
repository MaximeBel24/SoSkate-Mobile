import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import ErrorBoundary from "../ErrorBoundary";
import { logger } from "@/src/shared/utils/logger";

const mockLogger = logger as jest.Mocked<typeof logger>;

const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <Text>Content OK</Text>;
};

const FallbackComponent = ({
  error,
  onReset,
}: {
  error: Error;
  onReset: () => void;
}) => (
  <>
    <Text testID="error-message">{error.message}</Text>
    <Text testID="reset-button" onPress={onReset}>
      Reset
    </Text>
  </>
);

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when no error", () => {
    const { getByText } = render(
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(getByText("Content OK")).toBeTruthy();
  });

  it("renders fallback when error is thrown", () => {
    // Silence React's error boundary console logging
    const spy = jest.spyOn(console, "error").mockImplementation();

    const { getByTestId, queryByText } = render(
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(queryByText("Content OK")).toBeNull();
    expect(getByTestId("error-message").props.children).toBe("Test error");

    spy.mockRestore();
  });

  it("logs the error via logger.error", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Error));

    spy.mockRestore();
  });

  it("resets error state when onReset is called", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();

    // We need a component that can toggle throwing
    let shouldThrow = true;
    const ToggleComponent = () => {
      if (shouldThrow) throw new Error("Test");
      return <Text>Recovered</Text>;
    };

    const { getByTestId, rerender } = render(
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ToggleComponent />
      </ErrorBoundary>,
    );

    expect(getByTestId("error-message")).toBeTruthy();

    // Now stop throwing and trigger reset
    shouldThrow = false;
    fireEvent.press(getByTestId("reset-button"));

    // After reset, it should re-render children
    rerender(
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ToggleComponent />
      </ErrorBoundary>,
    );

    spy.mockRestore();
  });
});
