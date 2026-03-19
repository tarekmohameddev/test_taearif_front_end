export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  recaptcha_token?: string;
}

export interface LoginResponse {
  user: Record<string, unknown>;
  token: string;
}

export interface LoginApiError {
  message?: string;
  error?: string;
}
