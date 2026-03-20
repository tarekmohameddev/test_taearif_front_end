import type {
  CompleteProfileFallbackCopyMap,
  CompleteProfileTranslationKeysMap,
} from "./CompleteProfile.types";

export const COMPLETE_PROFILE_KEYS = {
  title: "auth.complete_profile.title",
  subtitle: "auth.complete_profile.subtitle",
  username_placeholder: "auth.complete_profile.username_placeholder",
  email_placeholder: "auth.complete_profile.email_placeholder",
  password_placeholder: "auth.complete_profile.password_placeholder",
  submit_button: "auth.complete_profile.submit_button",
} as const satisfies CompleteProfileTranslationKeysMap;

export const COMPLETE_PROFILE_FALLBACKS_AR: CompleteProfileFallbackCopyMap = {
  title: "أكمل بياناتك",
  subtitle: "خطوة أخيرة لإنشاء حسابك",
  username_placeholder: "اسم المستخدم (اسم الموقع الفرعي)",
  email_placeholder: "أدخل البريد الألكتروني....",
  password_placeholder: "أدخل كلمة المرور ( ٨ أحرف على الأقل)",
  submit_button: "إنشاء حساب",
};
