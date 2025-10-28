export interface CustomerResponse {
    customerId: string;
    email: string;
    firstname: string;
    lastname: string;
    phone?: string;
    birthDate?: string;
    createdAt: Date;
    updatedAt: Date;

}