import type { ReactNode } from "react";

/** Props for the auth split layout (marketing panel + form area). */
export interface AuthLayoutProps {
  children: ReactNode;
}

/** Fields that have both an i18n key and an Arabic fallback string. */
export type AuthCopyField =
  | "brand_name"
  | "title"
  | "subtitle"
  | "feature_1"
  | "feature_2"
  | "feature_3"
  | "feature_4"
  | "feature_5"
  | "copyright";

/** Dot-notation keys under `auth.layout` in locale JSON. */
export type AuthTranslationKeysMap = Record<AuthCopyField, string>;

/** Fallback copy when client i18n is not loaded (e.g. Storybook). */
export type AuthFallbackCopyMap = Record<AuthCopyField, string>;

/** Static asset URLs (served from `public/assets/AuthPages` and Storybook staticDirs). */
export interface AuthLayoutAssetUrls {
  buildingBg: string;
  logo: string;
}
