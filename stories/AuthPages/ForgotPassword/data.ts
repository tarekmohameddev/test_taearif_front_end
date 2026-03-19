import type {
  ForgotPasswordFallbackCopyMap,
  ForgotPasswordTranslationKeysMap,
} from "./ForgotPassword.types";

export const FORGOT_PASSWORD_KEYS = {
  title: "auth.forgot_password.title",
  identifier_placeholder: "auth.forgot_password.identifier_placeholder",
  submit_button: "auth.forgot_password.submit_button",
  remember_password: "auth.forgot_password.remember_password",
  login_link: "auth.forgot_password.login_link",
} as const satisfies ForgotPasswordTranslationKeysMap;

export const FORGOT_PASSWORD_FALLBACKS_AR: ForgotPasswordFallbackCopyMap = {
  title: "نسيت كلمة المرور؟",
  identifier_placeholder: "البريد الألكتروني إو رقم الجوال",
  submit_button: "إرسال رمز إعادة التعيين",
  remember_password: "تذكر كلمة المرور؟",
  login_link: "تسجيل الدخول",
};

export const FORGOT_PASSWORD_FALLBACKS_EN: ForgotPasswordFallbackCopyMap = {
  title: "Forgot Password?",
  identifier_placeholder: "Email or phone number",
  submit_button: "Send Reset Code",
  remember_password: "Remember your password?",
  login_link: "Sign In",
};
