export type RegisterStep = 1 | 2 | 3;

export interface PhoneFormData {
  phone: string;
}

export interface OtpFormData {
  otp: string;
}

export interface ProfileFormData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterFlowState {
  step: RegisterStep;
  phone: string;
  verifiedToken: string | null;
}

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  verified_token: string;
}

export interface RegisterRequest {
  account_type: "tenant";
  email: string;
  username: string;
  password: string;
  phone: string;
  verified_token: string;
  recaptcha_token?: string;
}

export interface RegisterResponse {
  status: "success" | "error";
  user?: Record<string, unknown>;
  token?: string;
  membership?: {
    start_date: string;
    expire_date: string;
  };
  error?: string;
  message?: string;
}

export interface ApiError {
  success?: boolean;
  status?: string;
  error?: string;
  message?: string;
  /** Laravel-style validation errors: field -> array of messages */
  errors?: Record<string, string[]>;
}
