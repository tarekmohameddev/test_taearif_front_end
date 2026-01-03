"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu2";
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
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      // إغلاق الـ dropdown فوراً
      setIsOpen(false);

      // تحديث الحالة المحلية فوراً
      setSelectedLang(newLang);
      setIsChanging(true);

      // تحديث الـ locale في الـ store فوراً
      setLocale(newLang as any);

      // تحديث HTML attributes
      document.documentElement.style.transition = "all 0.1s ease-in-out";
      // Use LTR as natural default, RTL only when Arabic is explicitly selected
      document.documentElement.dir = getDirectionForLocale(newLang as any);
      document.documentElement.lang = newLang;

      // حفظ في localStorage
      localStorage.setItem("lang", newLang);

      // تحديث URL في الخلفية
      const newPath =
        pathname?.replace(/^\/[^\/]+/, `/${newLang}`) || `/${newLang}`;
      router.replace(newPath);

      // إعادة تعيين حالة التحميل بسرعة
      setTimeout(() => setIsChanging(false), 50);
    },
    [pathname, router, setLocale],
  );

  // استخدام الحالة المحلية أو الـ pathname
  const currentLang = selectedLang || pathname?.split("/")[1] || "en";

  // تهيئة الحالة المحلية عند تحميل المكون
  useEffect(() => {
    const initialLang = pathname?.split("/")[1] || "en";
    setSelectedLang(initialLang);
    setLocale(initialLang as any);
  }, [pathname, setLocale]);

  useEffect(() => {
    setLocale(currentLang as any);
  }, [currentLang, setLocale]);

  // إغلاق الـ dropdown عند تغيير اللغة
  useEffect(() => {
    if (isChanging) {
      setIsOpen(false);
    }
  }, [isChanging]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isChanging}
          className={`flex items-center gap-2 hover:scale-105 transition-all duration-150 ${
            isChanging ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <span className="hidden sm:inline-flex items-center gap-2">
            <img
              src={localeFlags[currentLang as keyof typeof localeFlags]}
              alt={localeNames[currentLang as keyof typeof localeNames]}
              className="w-5 h-auto rounded-sm"
            />
            <span className="flex-1">
              {localeNames[currentLang as keyof typeof localeNames]}
            </span>
          </span>

          <span className="sm:hidden">
            <img
              src={localeFlags[currentLang as keyof typeof localeFlags]}
              alt={localeNames[currentLang as keyof typeof localeNames]}
              className="w-5 h-auto rounded-sm"
            />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-[9999]"
        style={{ zIndex: 999999 }}
      >
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`flex items-center gap-2 cursor-pointer transition-all duration-150 hover:bg-accent/50 ${
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
