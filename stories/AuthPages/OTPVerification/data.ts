import type {
  OTPAssetUrls,
  OTPFallbackCopyMap,
  OTPTranslationKeysMap,
} from "./OTPVerification.types";

export const OTP_KEYS = {
  title: "auth.otp.title",
  subtitle: "auth.otp.subtitle",
  resend_available_in: "auth.otp.resend_available_in",
  resend_now: "auth.otp.resend_now",
  change_phone: "auth.otp.change_phone",
  test_code_label: "auth.otp.test_code_label",
} as const satisfies OTPTranslationKeysMap;

export const OTP_FALLBACKS_AR: OTPFallbackCopyMap = {
  title: "ادخل رمز التحقق",
  subtitle: "أرسلنا رمزاً مكوناً من 5 أرقام إلى",
  resend_available_in: "إعادة الإرسال متاحة بعد {{seconds}} ثانية",
  resend_now: "إعادة الإرسال",
  change_phone: "تغيير رقم الهاتف",
  test_code_label: "الرمز للاختبار:",
};

export const OTP_ASSET_URLS: OTPAssetUrls = {
  phoneIcon: "/assets/AuthPages/phone-icon.svg",
};
