export interface OTPVerificationProps {
  /** Masked phone number, e.g. "+966 512***78" */
  phone: string;
  /** Called when OTP code is complete and submitted */
  onVerify?: (code: string) => void;
  /** Called when user clicks resend code */
  onResend?: () => void;
  /** Called when user wants to change phone number */
  onChangePhone?: () => void;
  /** Shows loading state */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
  /** Seconds remaining before resend is available */
  resendCountdown?: number;
  /** Test code to display (for development) */
  testCode?: string;
}

export type OTPCopyField =
  | "title"
  | "subtitle"
  | "resend_available_in"
  | "resend_now"
  | "change_phone"
  | "test_code_label";

export type OTPTranslationKeysMap = Record<OTPCopyField, string>;
export type OTPFallbackCopyMap = Record<OTPCopyField, string>;

export interface OTPAssetUrls {
  phoneIcon: string;
}
