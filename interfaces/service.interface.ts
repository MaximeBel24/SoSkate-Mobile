export interface Service {
    serviceId: string;
    name: string;
    type: any;
    description: string;
    durationMinutes: number;
    basePriceCents: number;
    isActive: boolean;
}
