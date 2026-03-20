export interface CompleteProfileProps {
  /** Called when form is submitted with username, email and password */
  onSubmit?: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
  /** Shows loading state on submit button */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
}

export type CompleteProfileCopyField =
  | "title"
  | "subtitle"
  | "username_placeholder"
  | "email_placeholder"
  | "password_placeholder"
  | "submit_button";

export type CompleteProfileTranslationKeysMap = Record<
  CompleteProfileCopyField,
  string
>;
export type CompleteProfileFallbackCopyMap = Record<
  CompleteProfileCopyField,
  string
>;
