"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Locale,
  defaultLocale,
  locales,
  isValidLocale,
} from "@/lib/i18n/config";

// Type for translations
type Translations = Record<string, any>;

interface ClientI18nState {
  locale: Locale;
  translations: Partial<Record<Locale, Translations>>;
  isLoading: boolean;
  loadTranslations: (locale: Locale) => Promise<void>;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getCurrentTranslations: () => Translations | null;
}

export const useClientI18nStore = create<ClientI18nState>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      translations: {},
      isLoading: false,

      loadTranslations: async (locale: Locale) => {
        // Skip if already loaded
        if (get().translations[locale]) {
          return;
        }

        set({ isLoading: true });
        try {
          // Dynamic import of translation file
          const translationModule = await import(
            `@/lib/i18n/locales/${locale}.json`
          );
          set((state) => ({
            translations: {
              ...state.translations,
              [locale]: translationModule.default,
            },
            isLoading: false,
          }));
        } catch (error) {
          console.error(`Failed to load translations for locale "${locale}":`, error);
          set({ isLoading: false });
        }
      },

      setLocale: async (locale: Locale) => {
        set({ locale });
        // Automatically load translations for the new locale
        await get().loadTranslations(locale);
      },

      t: (key: string, params?: Record<string, string | number>) => {
        const { locale, translations } = get();
        const currentTranslations = translations[locale];

        // If translations not loaded yet, return key
        if (!currentTranslations) {
          // Try to load translations synchronously (this is a fallback)
          get().loadTranslations(locale).catch(() => {});
          return key;
        }

        // Navigate through nested object using dot notation
        const keys = key.split(".");
        let value: any = currentTranslations;

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            // Fallback to default locale if key not found
            const defaultTranslations = translations[defaultLocale];
            if (defaultTranslations) {
              value = defaultTranslations;
              for (const fallbackKey of keys) {
                if (value && typeof value === "object" && fallbackKey in value) {
                  value = value[fallbackKey];
                } else {
                  return key; // Return key if not found anywhere
                }
              }
            } else {
              return key;
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
        return translations[locale] || null;
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
