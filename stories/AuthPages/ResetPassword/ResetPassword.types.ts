export interface ResetPasswordProps {
  onSubmit?: (data: { code: string; newPassword: string; confirmPassword: string }) => void;
  onResendCode?: () => void;
  onBackClick?: () => void;
  error?: string;
  isLoading?: boolean;
  isResending?: boolean;
  resendCountdown?: number;
}

export type ResetPasswordCopyField =
  | "title"
  | "subtitle"
  | "code_placeholder"
  | "new_password_placeholder"
  | "confirm_password_placeholder"
  | "submit_button"
  | "resend_code"
  | "resend_available_in"
  | "back_link";

export type ResetPasswordTranslationKeysMap = Record<ResetPasswordCopyField, string>;
export type ResetPasswordFallbackCopyMap = Record<ResetPasswordCopyField, string>;
