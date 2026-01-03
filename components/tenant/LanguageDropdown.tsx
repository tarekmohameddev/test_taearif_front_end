"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import {
  locales,
  localeNames,
  localeFlags,
  getDirectionForLocale,
  getDefaultDirection,
} from "@/lib/i18n/config";
import { useEditorLocale } from "@/context/editorI18nStore";

export function LanguageDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const { setLocale } = useEditorLocale();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setIsChanging(true);

      setLocale(newLang as any);

      document.documentElement.style.transition = "all 0.1s ease-in-out";
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLang;

      localStorage.setItem("lang", newLang);

      const newPath = pathname.replace(/^\/[^\/]+/, `/${newLang}`);
      router.replace(newPath);

      setTimeout(() => setIsChanging(false), 100);
    },
    [pathname, router, setLocale],
  );

  const currentLang = pathname.split("/")[1] || "en";

  useEffect(() => {
    setLocale(currentLang as any);
  }, [currentLang, setLocale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isChanging}
          className={`flex items-center gap-2 hover:scale-105 transition-all duration-200  ${
            isChanging ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="hidden sm:inline-flex items-center gap-2">
            <img
              src={localeFlags[currentLang]}
              alt={localeNames[currentLang]}
              className="w-5 h-auto rounded-sm"
            />
            <span className="flex-1">{localeNames[currentLang]}</span>
          </span>

          <span className="sm:hidden">
            <img
              src={localeFlags[currentLang]}
              alt={localeNames[currentLang]}
              className="w-5 h-auto rounded-sm"
            />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ zIndex: 999999 }}>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLang === locale ? "bg-accent" : ""
            }`}
          >
            <img
              src={localeFlags[locale]}
              alt={localeNames[locale]}
              className="w-5 h-auto rounded-sm"
            />
            <span className="flex-1">{localeNames[locale]}</span>
            {currentLang === locale && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
