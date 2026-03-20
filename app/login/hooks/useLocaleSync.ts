"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useClientI18nStore } from "@/context/clientI18nStore";
import { getLocaleFromPathname, type Locale } from "@/lib/i18n/config";

export function useLocaleSync() {
  const pathname = usePathname();
  const { locale, setLocale } = useClientI18nStore();

  useEffect(() => {
    if (!pathname) return;
    
    const urlLocale = getLocaleFromPathname(pathname);
    
    if (urlLocale !== locale) {
      setLocale(urlLocale as Locale);
    }
  }, [pathname, locale, setLocale]);

  return locale;
}
