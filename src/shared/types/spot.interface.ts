/**
 * Spot response interface matching SpotResponseDTO from backend.
 * Photos are fetched separately via PhotoService using entityType and entityId.
 */
export interface SpotResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  isIndoor: boolean;
  isActive: boolean;
  // Photos are NOT included here - fetch via PhotoService
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}
