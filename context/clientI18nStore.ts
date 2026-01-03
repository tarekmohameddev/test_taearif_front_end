"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Locale,
  defaultLocale,
  locales,
  isValidLocale,
} from "@/lib/i18n/config";

// Import translation files
import arTranslations from "@/lib/i18n/locales/ar.json";
import enTranslations from "@/lib/i18n/locales/en.json";

const translations = {
  ar: arTranslations,
  en: enTranslations,
};

interface ClientI18nState {
  locale: Locale;
  translations: typeof translations;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getCurrentTranslations: () => typeof arTranslations;
}

export const useClientI18nStore = create<ClientI18nState>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      translations,

      setLocale: (locale: Locale) => {
        set({ locale });
      },

      t: (key: string, params?: Record<string, string | number>) => {
        const { locale, translations } = get();
        const currentTranslations = translations[locale];

        // Navigate through nested object using dot notation
        const keys = key.split(".");
        let value: any = currentTranslations;

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            // Fallback to default locale if key not found
            value = translations[defaultLocale];
            for (const fallbackKey of keys) {
              if (value && typeof value === "object" && fallbackKey in value) {
                value = value[fallbackKey];
              } else {
                return key; // Return key if not found anywhere
              }
            }
            break;
          }
        }

        if (typeof value !== "string") {
          return key;
        }

        // Replace parameters in the string
        if (params) {
          return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
            return params[paramKey]?.toString() || match;
          });
        }

        return value;
      },

      getCurrentTranslations: () => {
        const { locale, translations } = get();
        return translations[locale];
      },
    }),
    {
      name: "client-i18n-storage",
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
);

// Hook for easy access to translations
export const useClientT = () => {
  const t = useClientI18nStore((state) => state.t);
  return t;
};

// Hook for locale management
export const useClientLocale = () => {
  const locale = useClientI18nStore((state) => state.locale);
  const setLocale = useClientI18nStore((state) => state.setLocale);
  return { locale, setLocale };
};

// Hook for getting current translations object
export const useClientTranslations = () => {
  const getCurrentTranslations = useClientI18nStore(
    (state) => state.getCurrentTranslations,
  );
  return getCurrentTranslations();
};
