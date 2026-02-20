import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import BookingStepper from "../BookingStepper";

// Mock Typo to render as plain Text
jest.mock("@/src/shared/ui/typography/Typo", () => {
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => (
      <Text {...props}>{children}</Text>
    ),
  };
});

// Mock phosphor-react-native with all the specific icons BookingStepper uses
jest.mock("phosphor-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockIcon = (props: any) =>
    React.createElement(View, { testID: "mock-icon" });
  return {
    __esModule: true,
    CalendarIcon: MockIcon,
    ClockIcon: MockIcon,
    CheckCircleIcon: MockIcon,
    CheckIcon: MockIcon,
    CircleIcon: MockIcon,
  };
});

// Mock react-native-reanimated (already done globally but ensure Animated.View works)
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: any) => component,
      call: () => {},
    },
    useAnimatedStyle: () => ({}),
    withSpring: (val: any) => val,
    interpolateColor: () => "#000",
  };
});

describe("BookingStepper", () => {
  it("renders all step labels", () => {
    const { getByText } = render(<BookingStepper currentStep="date" />);
    expect(getByText("Date")).toBeTruthy();
    expect(getByText("Créneau")).toBeTruthy();
    expect(getByText("Confirmation")).toBeTruthy();
  });

  it("renders three steps", () => {
    const { getByText } = render(<BookingStepper currentStep="date" />);
    const labels = ["Date", "Créneau", "Confirmation"];
    labels.forEach((label) => {
      expect(getByText(label)).toBeTruthy();
    });
  });

  it("calls onStepPress for completed steps", () => {
    const onStepPress = jest.fn();
    const { getByText } = render(
      <BookingStepper currentStep="summary" onStepPress={onStepPress} />,
    );

    // "Date" step should be completed (index 0 < current index 2)
    fireEvent.press(getByText("Date"));
    expect(onStepPress).toHaveBeenCalledWith("date");
  });

  it("does not call onStepPress for upcoming steps", () => {
    const onStepPress = jest.fn();
    const { getByText } = render(
      <BookingStepper currentStep="date" onStepPress={onStepPress} />,
    );

    // "Confirmation" is upcoming, Pressable is disabled
    fireEvent.press(getByText("Confirmation"));
    expect(onStepPress).not.toHaveBeenCalled();
  });

  it("handles completedSteps prop", () => {
    const onStepPress = jest.fn();
    const { getByText } = render(
      <BookingStepper
        currentStep="slot"
        onStepPress={onStepPress}
        completedSteps={["date"]}
      />,
    );

    // "Date" should be completed
    fireEvent.press(getByText("Date"));
    expect(onStepPress).toHaveBeenCalledWith("date");
  });

  it("renders without onStepPress callback", () => {
    // Should not throw
    const { getByText } = render(<BookingStepper currentStep="slot" />);
    expect(getByText("Créneau")).toBeTruthy();
  });
});
