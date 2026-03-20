import type {
  SignInFallbackCopyMap,
  SignInTranslationKeysMap,
} from "./SignIn.types";

export const SIGNIN_KEYS = {
  title: "auth.signin.title",
  subtitle: "auth.signin.subtitle",
  identifier_placeholder: "auth.signin.identifier_placeholder",
  password_placeholder: "auth.signin.password_placeholder",
  forgot_password: "auth.signin.forgot_password",
  submit_button: "auth.signin.submit_button",
  no_account: "auth.signin.no_account",
  register_link: "auth.signin.register_link",
} as const satisfies SignInTranslationKeysMap;

export const SIGNIN_FALLBACKS_AR: SignInFallbackCopyMap = {
  title: "تسجيل الدخول",
  subtitle: "مرحباً بعودتك",
  identifier_placeholder: "البريد الألكتروني إو رقم الجوال....",
  password_placeholder: "كلمة المرور",
  forgot_password: "نسيت كلمة السر؟",
  submit_button: "تسجيل دخول",
  no_account: "ليس لديك حساب؟",
  register_link: "سجل مجاناً",
};

export const SIGNIN_FALLBACKS_EN: SignInFallbackCopyMap = {
  title: "Sign In",
  subtitle: "Welcome back",
  identifier_placeholder: "Email or phone number...",
  password_placeholder: "Password",
  forgot_password: "Forgot password?",
  submit_button: "Sign In",
  no_account: "Don't have an account?",
  register_link: "Register for free",
};
