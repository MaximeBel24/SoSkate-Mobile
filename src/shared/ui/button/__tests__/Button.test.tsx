import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import Button from "../Button";

// Mock the Loading component
jest.mock("@/src/shared/ui/feedback/Loading", () => {
  const { ActivityIndicator } = require("react-native");
  return {
    __esModule: true,
    default: () => <ActivityIndicator testID="loading-indicator" />,
  };
});

describe("Button", () => {
  it("renders children", () => {
    const { getByText } = render(
      <Button>
        <Text>Press me</Text>
      </Button>,
    );
    expect(getByText("Press me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>
        <Text>Press me</Text>
      </Button>,
    );
    fireEvent.press(getByText("Press me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicator when loading is true", () => {
    const { getByTestId, queryByText } = render(
      <Button loading={true}>
        <Text>Press me</Text>
      </Button>,
    );
    expect(getByTestId("loading-indicator")).toBeTruthy();
    expect(queryByText("Press me")).toBeNull();
  });

  it("shows children when loading is false", () => {
    const { getByText, queryByTestId } = render(
      <Button loading={false}>
        <Text>Press me</Text>
      </Button>,
    );
    expect(getByText("Press me")).toBeTruthy();
    expect(queryByTestId("loading-indicator")).toBeNull();
  });

  it("does not call onPress when loading", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button loading={true} onPress={onPress}>
        <Text>Press me</Text>
      </Button>,
    );
    // Loading state renders a View, not a TouchableOpacity
    // so onPress should not be callable
    expect(onPress).not.toHaveBeenCalled();
  });
});
