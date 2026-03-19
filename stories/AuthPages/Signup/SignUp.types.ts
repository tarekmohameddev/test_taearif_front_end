/** Props for the SignUp form component. */
export interface SignUpProps {
  /** Called when form is submitted with the phone number. */
  onSubmit?: (phone: string) => void;
  /** Called when user clicks the login link. */
  onLoginClick?: () => void;
  /** Error message to display (e.g., phone validation error). */
  error?: string;
  /** Shows loading state on submit button. */
  isLoading?: boolean;
}

/** Fields that have both an i18n key and an Arabic fallback string. */
export type SignUpCopyField =
  | "title"
  | "subtitle"
  | "phone_placeholder"
  | "submit_button"
  | "has_account"
  | "login_link"
  | "phone_error";

/** Dot-notation keys under `auth.signup` in locale JSON. */
export type SignUpTranslationKeysMap = Record<SignUpCopyField, string>;

/** Fallback copy when client i18n is not loaded (e.g. Storybook). */
export type SignUpFallbackCopyMap = Record<SignUpCopyField, string>;

/** Static asset URLs for the signup component. */
export interface SignUpAssetUrls {
  saudiFlag: string;
  warningIcon: string;
}
