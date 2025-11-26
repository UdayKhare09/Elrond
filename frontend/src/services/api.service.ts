// API Service for backend communication

import type {
  ErrorResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  MfaSetupResponse,
  MfaVerificationRequest,
} from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiError extends Error {
  status: number;
  errorResponse: ErrorResponse;

  constructor(status: number, errorResponse: ErrorResponse) {
    super(errorResponse.message);
    this.name = 'ApiError';
    this.status = status;
    this.errorResponse = errorResponse;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new ApiError(response.status, error);
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return response.json();
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const authApi = {
  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async verifyEmail(token: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
    );
    return handleResponse(response);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async verifyMfa(data: MfaVerificationRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/mfa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async setupMfa(): Promise<MfaSetupResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/mfa/setup`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async enableMfa(totpCode: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/mfa/enable?totpCode=${totpCode}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  async disableMfa(totpCode: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/mfa/disable?totpCode=${totpCode}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },
};

export { ApiError };
export type { ErrorResponse };

