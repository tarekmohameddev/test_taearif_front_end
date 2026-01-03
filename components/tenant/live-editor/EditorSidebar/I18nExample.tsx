"use client";

import React, { useState } from "react";
import { TranslationFields } from "./TranslationFields";
import { useEditorT } from "@/context/editorI18nStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function I18nExample() {
  const t = useEditorT();

  const [heroData, setHeroData] = useState({
    title: {
      ar: "اكتشف عقارك المثالي في أفضل المواقع",
      en: "Discover your perfect property in the best locations",
    },
    subtitle: {
      ar: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
      en: "We offer you the best real estate options with quality and reliability guarantee",
    },
    buttonText: {
      ar: "ابحث الآن",
      en: "Search Now",
    },
  });

  const [headerData, setHeaderData] = useState({
    logoText: {
      ar: "شركة العقارات",
      en: "Real Estate Company",
    },
    navigation: [
      { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
      { label: { ar: "حول", en: "About" }, href: "/about" },
      { label: { ar: "العقارات", en: "Properties" }, href: "/properties" },
      { label: { ar: "اتصل بنا", en: "Contact" }, href: "/contact" },
    ],
  });

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t("editor.component_settings")} - {t("components.hero")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslationFields
            fieldKey="hero.title"
            value={heroData.title}
            onChange={(value) =>
              setHeroData((prev) => ({ ...prev, title: value }))
            }
            label={t("hero.title")}
            type="input"
          />

          <TranslationFields
            fieldKey="hero.subtitle"
            value={heroData.subtitle}
            onChange={(value) =>
              setHeroData((prev) => ({ ...prev, subtitle: value }))
            }
            label={t("hero.subtitle")}
            type="textarea"
          />

          <TranslationFields
            fieldKey="hero.buttonText"
            value={heroData.buttonText}
            onChange={(value) =>
              setHeroData((prev) => ({ ...prev, buttonText: value }))
            }
            label={t("hero.search_button")}
            type="input"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t("editor.component_settings")} - {t("components.header")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslationFields
            fieldKey="header.company_name"
            value={headerData.logoText}
            onChange={(value) =>
              setHeaderData((prev) => ({ ...prev, logoText: value }))
            }
            label={t("header.company_name")}
            type="input"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">Hero Component:</h3>
            <div className="space-y-2">
              <p>
                <strong>Title:</strong> {heroData.title.ar || heroData.title.en}
              </p>
              <p>
                <strong>Subtitle:</strong>{" "}
                {heroData.subtitle.ar || heroData.subtitle.en}
              </p>
              <p>
                <strong>Button:</strong>{" "}
                {heroData.buttonText.ar || heroData.buttonText.en}
              </p>
            </div>

            <h3 className="font-semibold">Header Component:</h3>
            <div className="space-y-2">
              <p>
                <strong>Company Name:</strong>{" "}
                {headerData.logoText.ar || headerData.logoText.en}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
