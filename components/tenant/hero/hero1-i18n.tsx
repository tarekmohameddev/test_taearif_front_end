"use client";

import React from "react";
import { useClientT } from "@/context/clientI18nStore";
import { useClientLocale } from "@/context/clientI18nStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  CircleDollarSign,
  Home,
  MapPin,
  Search,
} from "lucide-react";

interface Hero1I18nProps {
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  searchPlaceholder?: Record<string, string>;
  buttonText?: Record<string, string>;
  backgroundImage?: string;
  className?: string;
}

export default function Hero1I18n({
  title = {
    ar: "اكتشف عقارك المثالي في أفضل المواقع",
    en: "Discover your perfect property in the best locations",
  },
  subtitle = {
    ar: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
    en: "We offer you the best real estate options with quality and reliability guarantee",
  },
  searchPlaceholder = {
    ar: "ابحث عن عقار...",
    en: "Search for property...",
  },
  buttonText = {
    ar: "ابحث الآن",
    en: "Search Now",
  },
  backgroundImage = "https://dalel-lovat.vercel.app/images/hero.webp",
  className = "",
}: Hero1I18nProps) {
  const t = useClientT();
  const { locale } = useClientLocale();

  const getTranslatedText = (textObj: Record<string, string>) => {
    return textObj[locale] || textObj.ar || Object.values(textObj)[0] || "";
  };

  return (
    <div
      className={`relative min-h-[90vh] flex items-center justify-center bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-45"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          {getTranslatedText(title)}
        </h1>

        <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto">
          {getTranslatedText(subtitle)}
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select>
                <SelectTrigger className="pl-10 h-12 text-gray-700">
                  <SelectValue placeholder={t("property.location")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh">
                    {t("property.location")}
                  </SelectItem>
                  <SelectItem value="jeddah">
                    {t("property.location")}
                  </SelectItem>
                  <SelectItem value="dammam">
                    {t("property.location")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select>
                <SelectTrigger className="pl-10 h-12 text-gray-700">
                  <SelectValue placeholder={t("property.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">
                    {t("property.type")}
                  </SelectItem>
                  <SelectItem value="villa">{t("property.type")}</SelectItem>
                  <SelectItem value="office">{t("property.type")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="relative">
              <CircleDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select>
                <SelectTrigger className="pl-10 h-12 text-gray-700">
                  <SelectValue placeholder={t("property.price")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500k">{t("property.price")}</SelectItem>
                  <SelectItem value="500k-1m">{t("property.price")}</SelectItem>
                  <SelectItem value="1m+">{t("property.price")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              size="lg"
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              {getTranslatedText(buttonText)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
