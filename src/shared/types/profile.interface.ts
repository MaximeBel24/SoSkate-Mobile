// ============================================
// TYPES
// ============================================

// === Customer ===
export interface CustomerProfileUpdateRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string | null;
  birthDate?: string; // Format: "YYYY-MM-DD"
}

export interface CustomerProfileResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// === Instructor ===
export type Specialty = "STREET" | "BOWL" | "FREESTYLE" | "PARK" | "VERT";

export interface InstructorProfileUpdateRequest {
  bio?: string | null;
  specialty?: Specialty;
  yearsOfExperience?: number | null;
  instagramHandle?: string | null;
  youtubeChannel?: string | null;
}

export interface InstructorProfileResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  bio: string | null;
  specialty: Specialty | null;
  yearsOfExperience: number | null;
  instagramHandle: string | null;
  youtubeChannel: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
