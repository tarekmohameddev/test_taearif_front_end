import type {
  SignUpAssetUrls,
  SignUpFallbackCopyMap,
  SignUpTranslationKeysMap,
} from "./SignUp.types";

export const SIGNUP_KEYS = {
  title: "auth.signup.title",
  subtitle: "auth.signup.subtitle",
  phone_placeholder: "auth.signup.phone_placeholder",
  submit_button: "auth.signup.submit_button",
  has_account: "auth.signup.has_account",
  login_link: "auth.signup.login_link",
  phone_error: "auth.signup.phone_error",
} as const satisfies SignUpTranslationKeysMap;

export const SIGNUP_FALLBACKS_AR: SignUpFallbackCopyMap = {
  title: "إنشاء حساب",
  subtitle: "ابدأ بتأكيد رقم جوالك",
  phone_placeholder: "5xxxxxxxx",
  submit_button: "إرسال رمز التحقق",
  has_account: "لديك حساب؟",
  login_link: "سجل الدخول",
  phone_error: "رقم الجوال غير صالح يجب أن يبدأ بـ 5 ويتكون من 9 أرقام",
};

export const SIGNUP_ASSET_URLS: SignUpAssetUrls = {
  saudiFlag: "/assets/AuthPages/saudi-flag.svg",
  warningIcon: "/assets/AuthPages/triangle-warning.svg",
};
