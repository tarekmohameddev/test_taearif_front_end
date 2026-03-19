export interface SignInProps {
  onSubmit?: (data: { identifier: string; password: string }) => void;
  onForgotPassword?: () => void;
  onRegisterClick?: () => void;
  error?: string;
  isLoading?: boolean;
}

export type SignInCopyField =
  | "title"
  | "subtitle"
  | "identifier_placeholder"
  | "password_placeholder"
  | "forgot_password"
  | "submit_button"
  | "no_account"
  | "register_link";

export type SignInTranslationKeysMap = Record<SignInCopyField, string>;
export type SignInFallbackCopyMap = Record<SignInCopyField, string>;
