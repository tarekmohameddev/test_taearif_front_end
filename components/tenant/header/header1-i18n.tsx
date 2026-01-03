"use client";

import React from "react";
import { useClientT } from "@/context/clientI18nStore";
import { useClientLocale } from "@/context/clientI18nStore";
import { Button } from "@/components/ui/button";
import { LanguageDropdown } from "@/components/tenant/LanguageDropdown";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useState } from "react";

interface Header1I18nProps {
  logo?: string;
  logoText?: Record<string, string>;
  navigation?: Array<{
    label: Record<string, string>;
    href: string;
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  className?: string;
}

export default function Header1I18n({
  logo = "/placeholder-logo.png",
  logoText = {
    ar: "شركة العقارات",
    en: "Real Estate Company",
  },
  navigation = [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { label: { ar: "حول", en: "About" }, href: "/about" },
    { label: { ar: "العقارات", en: "Properties" }, href: "/properties" },
    { label: { ar: "اتصل بنا", en: "Contact" }, href: "/contact" },
  ],
  contactInfo = {
    phone: "+966 50 123 4567",
    email: "info@company.com",
  },
  className = "",
}: Header1I18nProps) {
  const t = useClientT();
  const { locale } = useClientLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getTranslatedText = (textObj: Record<string, string>) => {
    return textObj[locale] || textObj.ar || Object.values(textObj)[0] || "";
  };

  return (
    <header className={`bg-white shadow-lg sticky top-0 z-50 ${className}`}>
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{contactInfo.email}</span>
            </div>
          </div>
          <LanguageDropdown />
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt={getTranslatedText(logoText)}
              className="h-12 w-12 object-contain"
            />
            <span className="text-2xl font-bold text-gray-800">
              {getTranslatedText(logoText)}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {getTranslatedText(item.label)}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              {t("navigation.login")}
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              {t("navigation.register")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getTranslatedText(item.label)}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full">
                  {t("navigation.login")}
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {t("navigation.register")}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
