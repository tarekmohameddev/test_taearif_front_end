import type {
  ResetPasswordFallbackCopyMap,
  ResetPasswordTranslationKeysMap,
} from "./ResetPassword.types";

export const RESET_PASSWORD_KEYS = {
  title: "auth.reset_password.title",
  subtitle: "auth.reset_password.subtitle",
  code_placeholder: "auth.reset_password.code_placeholder",
  new_password_placeholder: "auth.reset_password.new_password_placeholder",
  confirm_password_placeholder: "auth.reset_password.confirm_password_placeholder",
  submit_button: "auth.reset_password.submit_button",
  resend_code: "auth.reset_password.resend_code",
  resend_available_in: "auth.reset_password.resend_available_in",
  back_link: "auth.reset_password.back_link",
} as const satisfies ResetPasswordTranslationKeysMap;

export const RESET_PASSWORD_FALLBACKS_AR: ResetPasswordFallbackCopyMap = {
  title: "إعادة تعيين كلمة المرور",
  subtitle: "أدخل رمز التحقق وكلمة المرور الجديدة",
  code_placeholder: "رمز التحقق (5 أرقام)",
  new_password_placeholder: "كلمة المرور الجديدة",
  confirm_password_placeholder: "تأكيد كلمة المرور",
  submit_button: "إعادة تعيين كلمة المرور",
  resend_code: "إعادة إرسال الرمز",
  resend_available_in: "إعادة الإرسال متاحة بعد {{seconds}} ثانية",
  back_link: "العودة",
};

export const RESET_PASSWORD_FALLBACKS_EN: ResetPasswordFallbackCopyMap = {
  title: "Reset Password",
  subtitle: "Enter the verification code and your new password",
  code_placeholder: "Verification code (5 digits)",
  new_password_placeholder: "New password",
  confirm_password_placeholder: "Confirm password",
  submit_button: "Reset Password",
  resend_code: "Resend Code",
  resend_available_in: "Resend available in {{seconds}} seconds",
  back_link: "Back",
};
