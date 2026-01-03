"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useClientLocale } from "@/context/clientI18nStore";
import { getLocaleFromPathname, isValidLocale } from "@/lib/i18n/config";

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const pathname = usePathname();
  const { setLocale } = useClientLocale();

  useEffect(() => {
    // Get locale from the original URL (before rewrite)
    // We need to check the browser's current URL
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      const locale = getLocaleFromPathname(currentUrl);
      if (isValidLocale(locale)) {
        setLocale(locale);
      }
    }
  }, [pathname, setLocale]);

  return <>{children}</>;
}
