import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import EmptyState from "../EmptyState";

// Button mock - we need it to render properly
jest.mock("@/src/shared/ui/button/Button", () => {
  const { TouchableOpacity } = require("react-native");
  return {
    __esModule: true,
    default: ({ onPress, children }: any) => (
      <TouchableOpacity onPress={onPress} testID="action-button">
        {children}
      </TouchableOpacity>
    ),
  };
});

jest.mock("@/src/shared/ui/typography/Typo", () => {
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

describe("EmptyState", () => {
  it("renders title", () => {
    const { getByText } = render(<EmptyState title="Aucun résultat" />);
    expect(getByText("Aucun résultat")).toBeTruthy();
  });

  it("renders description when provided", () => {
    const { getByText } = render(
      <EmptyState title="Vide" description="Aucune donnée trouvée" />,
    );
    expect(getByText("Aucune donnée trouvée")).toBeTruthy();
  });

  it("does not render description when not provided", () => {
    const { queryByText } = render(<EmptyState title="Vide" />);
    expect(queryByText("Aucune donnée trouvée")).toBeNull();
  });

  it("renders icon when provided", () => {
    const icon = <Text testID="test-icon">icon</Text>;
    const { getByTestId } = render(<EmptyState title="Vide" icon={icon} />);
    expect(getByTestId("test-icon")).toBeTruthy();
  });

  it("does not render icon container when no icon", () => {
    const { queryByTestId } = render(
      <EmptyState title="Vide" testID="empty-state" />,
    );
    // The icon container should not exist
    expect(queryByTestId("test-icon")).toBeNull();
  });

  it("renders action button when actionLabel and onAction provided", () => {
    const onAction = jest.fn();
    const { getByTestId } = render(
      <EmptyState
        title="Vide"
        actionLabel="Réessayer"
        onAction={onAction}
      />,
    );
    expect(getByTestId("action-button")).toBeTruthy();
  });

  it("calls onAction when button is pressed", () => {
    const onAction = jest.fn();
    const { getByTestId } = render(
      <EmptyState
        title="Vide"
        actionLabel="Réessayer"
        onAction={onAction}
      />,
    );
    fireEvent.press(getByTestId("action-button"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("does not render button when actionLabel is missing", () => {
    const onAction = jest.fn();
    const { queryByTestId } = render(
      <EmptyState title="Vide" onAction={onAction} />,
    );
    expect(queryByTestId("action-button")).toBeNull();
  });

  it("does not render button when onAction is missing", () => {
    const { queryByTestId } = render(
      <EmptyState title="Vide" actionLabel="Réessayer" />,
    );
    expect(queryByTestId("action-button")).toBeNull();
  });

  it("passes testID to container", () => {
    const { getByTestId } = render(
      <EmptyState title="Vide" testID="my-empty-state" />,
    );
    expect(getByTestId("my-empty-state")).toBeTruthy();
  });
});
