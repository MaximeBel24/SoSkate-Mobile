import { CustomerResponse } from "@/src/shared/types/customer.interface";

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  customer: CustomerResponse;
  message: string;
}
