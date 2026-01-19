"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useClientLocale, useClientI18nStore } from "@/context/clientI18nStore";
import { getLocaleFromPathname, isValidLocale } from "@/lib/i18n/config";

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const pathname = usePathname();
  const { setLocale } = useClientLocale();
  const loadTranslations = useClientI18nStore((state) => state.loadTranslations);
  const locale = useClientI18nStore((state) => state.locale);

  useEffect(() => {
    // Get locale from the original URL (before rewrite)
    // We need to check the browser's current URL
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      const detectedLocale = getLocaleFromPathname(currentUrl);
      if (isValidLocale(detectedLocale)) {
        setLocale(detectedLocale);
      }
    }
  }, [pathname, setLocale]);

  // Load translations for the current locale on mount
  useEffect(() => {
    if (locale) {
      loadTranslations(locale);
    }
  }, [locale, loadTranslations]);

  return <>{children}</>;
}
