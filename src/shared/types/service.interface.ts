export interface ServiceResponse {
  id: string;
  name: string;
  type: any;
  description: string;
  durationMinutes: number;
  basePriceCents: number;
  maxParticipants: number;
  isActive: boolean;
}
