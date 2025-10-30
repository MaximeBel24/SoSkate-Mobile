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
    photos: string[];
    createdAt: Date;
    updatedAt: Date;
}