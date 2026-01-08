/**
 * Photo entity types that can have associated photos.
 * Maps to PhotoEntityType enum in backend.
 */
export enum PhotoEntityType {
  SPOT = "SPOT",
  INSTRUCTOR = "INSTRUCTOR",
  EVENT = "EVENT",
  CUSTOMER = "CUSTOMER",
}

/**
 * Types of photos for categorization.
 * Maps to PhotoType enum in backend.
 */
export enum PhotoType {
  AVATAR = "AVATAR",
  GALLERY = "GALLERY",
  THUMBNAIL = "THUMBNAIL",
}

/**
 * Photo response interface matching PhotoResponse DTO from backend.
 * Contains all public photo information.
 */
export interface PhotoResponse {
  id: number;
  url: string;
  thumbnailUrl: string;
  entityType: PhotoEntityType;
  entityId: number;
  photoType: PhotoType;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  displayOrder: number;
  uploadedBy: number;
  uploadedAt: string; // ISO string format
}

/**
 * Simplified Photo interface for display purposes.
 * Used in components that don't need full metadata.
 */
export interface Photo {
  id: number;
  url: string;
  thumbnailUrl?: string;
}
