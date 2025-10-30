export interface Service {
    id: string;
    name: string;
    type: any;
    description: string;
    durationMinutes: number;
    basePriceCents: number;
    isActive: boolean;
}
