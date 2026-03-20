import type {
  AuthFallbackCopyMap,
  AuthLayoutAssetUrls,
  AuthTranslationKeysMap,
} from "./AuthLayout.types";

export const AUTH_KEYS = {
  brand_name: "auth.layout.brand_name",
  title: "auth.layout.title",
  subtitle: "auth.layout.subtitle",
  feature_1: "auth.layout.feature_1",
  feature_2: "auth.layout.feature_2",
  feature_3: "auth.layout.feature_3",
  feature_4: "auth.layout.feature_4",
  feature_5: "auth.layout.feature_5",
  copyright: "auth.layout.copyright",
} as const satisfies AuthTranslationKeysMap;

export const FALLBACKS_AR: AuthFallbackCopyMap = {
  brand_name: "تعاريف",
  title: "ابنِ حضورك الرقمي بثقة",
  subtitle:
    "أنشئ موقعك العقاري الاحترافي في دقائق، وإدارته بسهولة من مكان واحد.",
  feature_1: "موقع احترافي جاهز في دقائق",
  feature_2: "لوحة تحكم ذكية وسهلة الاستخدام",
  feature_3: "دعم كامل للغة العربية",
  feature_4: "تحليلات وتقارير مباشرة",
  feature_5: "التوافق الذكي بالطلبات والعروض",
  copyright: "كل الحقوق محفوظة © ٢٠٢٦",
};

export const AUTH_LAYOUT_ASSET_URLS: AuthLayoutAssetUrls = {
  buildingBg: "/assets/AuthPages/building-bg.svg",
  logo: "/assets/AuthPages/logo.svg",
};

/** Social media icon URLs for the right panel footer. */
export const AUTH_LAYOUT_SOCIAL_URLS = {
  instagram: "/assets/AuthPages/instagram.svg",
  facebook: "/assets/AuthPages/facebook.svg",
  linkedin: "/assets/AuthPages/linkedin.svg",
} as const;

/** Convenience: ordered feature i18n keys for list rendering. */
export const AUTH_FEATURE_KEYS = [
  AUTH_KEYS.feature_1,
  AUTH_KEYS.feature_2,
  AUTH_KEYS.feature_3,
  AUTH_KEYS.feature_4,
  AUTH_KEYS.feature_5,
] as const;

/** Convenience: ordered Arabic fallbacks for features. */
export const AUTH_FEATURE_FALLBACKS_AR = [
  FALLBACKS_AR.feature_1,
  FALLBACKS_AR.feature_2,
  FALLBACKS_AR.feature_3,
  FALLBACKS_AR.feature_4,
  FALLBACKS_AR.feature_5,
] as const;
