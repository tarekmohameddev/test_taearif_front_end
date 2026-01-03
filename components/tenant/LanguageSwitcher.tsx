"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientLocale } from "@/context/clientI18nStore";
import { locales, localeNames, localeFlags } from "@/lib/i18n/config";
import { Globe } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  addLocaleToPathname,
  removeLocaleFromPathname,
} from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale } = useClientLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as any);

    // Update URL with new locale
    // Use the current browser URL instead of pathname (which is after rewrite)
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      const pathWithoutLocale = removeLocaleFromPathname(currentUrl);
      const newPath = addLocaleToPathname(pathWithoutLocale, newLocale as any);

      router.push(newPath);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {localeFlags[locale]} {localeNames[locale]}
          </span>
          <span className="sm:hidden">{localeFlags[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center gap-2 cursor-pointer ${
              locale === loc ? "bg-accent" : ""
            }`}
          >
            <span className="text-lg">{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
            {locale === loc && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
