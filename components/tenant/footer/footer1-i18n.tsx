"use client";

import React from "react";
import { useClientT } from "@/context/clientI18nStore";
import { useClientLocale } from "@/context/clientI18nStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface Footer1I18nProps {
  logo?: string;
  logoText?: Record<string, string>;
  companyInfo?: Record<string, string>;
  quickLinks?: Array<{
    label: Record<string, string>;
    href: string;
  }>;
  contactInfo?: {
    address?: Record<string, string>;
    phone?: string;
    email?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  className?: string;
}

export default function Footer1I18n({
  logo = "/placeholder-logo.png",
  logoText = {
    ar: "شركة العقارات",
    en: "Real Estate Company",
  },
  companyInfo = {
    ar: "نحن نقدم أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. نساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك.",
    en: "We provide the best real estate services with quality and reliability guarantee. We help you find the perfect property that suits your needs and budget.",
  },
  quickLinks = [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { label: { ar: "حول", en: "About" }, href: "/about" },
    { label: { ar: "العقارات", en: "Properties" }, href: "/properties" },
    { label: { ar: "اتصل بنا", en: "Contact" }, href: "/contact" },
  ],
  contactInfo = {
    address: {
      ar: "الرياض، المملكة العربية السعودية",
      en: "Riyadh, Saudi Arabia",
    },
    phone: "+966 50 123 4567",
    email: "info@company.com",
  },
  socialLinks = {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  className = "",
}: Footer1I18nProps) {
  const t = useClientT();
  const { locale } = useClientLocale();

  const getTranslatedText = (textObj: Record<string, string>) => {
    return textObj[locale] || textObj.ar || Object.values(textObj)[0] || "";
  };

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt={getTranslatedText(logoText)}
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">
                {getTranslatedText(logoText)}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {getTranslatedText(companyInfo)}
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.quick_links")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {getTranslatedText(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("footer.contact_info")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {getTranslatedText(contactInfo.address)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">
                  {contactInfo.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">
                  {contactInfo.email}
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.newsletter")}</h3>
            <p className="text-gray-300 text-sm">{t("footer.subscribe")}</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder={t("forms.email")}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 {getTranslatedText(logoText)}.{" "}
              {t("footer.all_rights_reserved")}
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.privacy_policy")}
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.terms_of_service")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
