// API Types based on backend DTOs

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  totpCode?: string;
}

export interface LoginResponse {
  token: string;
  mfaRequired?: boolean;
}

export interface MfaSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface MfaVerificationRequest {
  mfaToken: string;
  totpCode: string;
}

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  mfaEnabled: boolean;
}

