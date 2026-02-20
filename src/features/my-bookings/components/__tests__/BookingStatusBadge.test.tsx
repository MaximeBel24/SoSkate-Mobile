import React from "react";
import { render } from "@testing-library/react-native";
import BookingStatusBadge from "../BookingStatusBadge";

// Mock Typo to render as plain Text
jest.mock("@/src/shared/ui/typography/Typo", () => {
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

describe("BookingStatusBadge", () => {
  it("shows 'Annulé' when participantStatus is CANCELLED", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CANCELLED"
        bookingStatus="CONFIRMED"
        isPast={false}
      />,
    );
    expect(getByText("Annulé")).toBeTruthy();
  });

  it("shows 'Annulé' when bookingStatus is CANCELLED (instructor cancelled)", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CONFIRMED"
        bookingStatus="CANCELLED"
        isPast={false}
      />,
    );
    expect(getByText("Annulé")).toBeTruthy();
  });

  it("shows 'Terminé' when bookingStatus is COMPLETED", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CONFIRMED"
        bookingStatus="COMPLETED"
        isPast={false}
      />,
    );
    expect(getByText("Terminé")).toBeTruthy();
  });

  it("shows 'Terminé' when isPast is true", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CONFIRMED"
        bookingStatus="CONFIRMED"
        isPast={true}
      />,
    );
    expect(getByText("Terminé")).toBeTruthy();
  });

  it("shows 'Confirmé' when participantStatus is CONFIRMED (and not past/cancelled)", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CONFIRMED"
        bookingStatus="PENDING"
        isPast={false}
      />,
    );
    expect(getByText("Confirmé")).toBeTruthy();
  });

  it("shows 'Confirmé' when bookingStatus is CONFIRMED", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="PENDING"
        bookingStatus="CONFIRMED"
        isPast={false}
      />,
    );
    expect(getByText("Confirmé")).toBeTruthy();
  });

  it("shows 'En attente' as default (pending status)", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="PENDING"
        bookingStatus="PENDING"
        isPast={false}
      />,
    );
    expect(getByText("En attente")).toBeTruthy();
  });

  it("participant CANCELLED takes priority over booking CONFIRMED", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CANCELLED"
        bookingStatus="CONFIRMED"
        isPast={false}
      />,
    );
    expect(getByText("Annulé")).toBeTruthy();
  });

  it("booking CANCELLED takes priority over COMPLETED", () => {
    const { getByText } = render(
      <BookingStatusBadge
        participantStatus="CONFIRMED"
        bookingStatus="CANCELLED"
        isPast={true}
      />,
    );
    // CANCELLED check comes before COMPLETED/isPast check
    expect(getByText("Annulé")).toBeTruthy();
  });
});
