import { CustomerResponse } from "@/interfaces/customer.interface";

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
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
