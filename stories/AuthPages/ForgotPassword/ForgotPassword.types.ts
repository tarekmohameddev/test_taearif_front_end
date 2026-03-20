export interface ForgotPasswordProps {
  onSubmit?: (identifier: string) => void;
  onLoginClick?: () => void;
  error?: string;
  isLoading?: boolean;
}

export type ForgotPasswordCopyField =
  | "title"
  | "identifier_placeholder"
  | "submit_button"
  | "remember_password"
  | "login_link";

export type ForgotPasswordTranslationKeysMap = Record<ForgotPasswordCopyField, string>;
export type ForgotPasswordFallbackCopyMap = Record<ForgotPasswordCopyField, string>;
