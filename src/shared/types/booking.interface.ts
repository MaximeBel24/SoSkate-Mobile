// ============================================
// 🛹 SOSKATE - BOOKING TYPES
// ============================================
// Types pour les réservations

import { InstructorResponse } from "./instructor.interface";
import { ServiceResponse } from "./service.interface";
import { SpotResponse } from "./spot.interface";

/**
 * Statut d'une réservation
 */
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "FULL";

/**
 * Requête pour créer une réservation
 * POST /customers/{customerId}/bookings
 */
export interface CreateBookingRequest {
  instructorId: number;
  spotId: number;
  serviceId: number;
  startTime: string; // ISO format: "2026-01-29T14:00:00"
  durationMinutes: number; // 60, 90, 120, 150, 180, 240
  numberOfParticipants: number;
  participantsNotes: string | null;
}

/**
 * Réponse API pour une réservation
 */
export interface BookingResponse {
  id: number;
  instructor: InstructorResponse;
  spot: SpotResponse;
  service: ServiceResponse;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxParticipants: number;
  confirmedParticipants: number;
  availablePlaces: number;
  status: BookingStatus;
  participants: BookingParticipant[];
  createdAt: string;
}

/**
 * Participant à une réservation
 */
export interface BookingParticipant {
  id: number;
  customerId: number;
  firstName: string;
  lastName: string;
  joinedAt: string;
}

/**
 * Réponse simplifiée pour liste de réservations
 */
export interface BookingListItem {
  id: number;
  instructorName: string;
  spotName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  price: number;
}

/**
 * Requête pour annuler une réservation
 */
export interface CancelBookingRequest {
  reason?: string;
}
