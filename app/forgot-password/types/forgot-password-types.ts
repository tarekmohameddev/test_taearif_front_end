export type ForgotPasswordStep = 1 | 2;

export interface IdentifierFormData {
  identifier: string;
}

export interface ResetFormData {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  method: "email" | "phone";
  identifier: string;
  country_code?: string;
  recaptcha_token?: string;
}

export interface ForgotPasswordResponse {
  message: string;
  via: "email" | "phone";
  attempts_used: number;
  attempts_remaining: number;
}

export interface ResetPasswordRequest {
  code: string;
  new_password: string;
  new_password_confirmation: string;
  recaptcha_token?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ForgotPasswordApiError {
  message?: string;
  error?: string;
}

export interface ForgotPasswordFlowState {
  step: ForgotPasswordStep;
  identifier: string;
  method: "email" | "phone";
}
