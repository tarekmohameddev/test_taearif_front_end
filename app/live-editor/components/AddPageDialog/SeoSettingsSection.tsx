"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageFormData } from "../../types/types";
import { useEditorT } from "@/context/editorI18nStore";

interface SeoSettingsSectionProps {
  formData: PageFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof PageFormData, value: string) => void;
}

export function SeoSettingsSection({
  formData,
  errors,
  onFieldChange,
}: SeoSettingsSectionProps) {
  const t = useEditorT();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          {t("editor.seo_settings")} الأساسية
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="TitleAr"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.page_title_ar")} *
          </Label>
          <Input
            id="TitleAr"
            placeholder={t("editor.page_title_ar_placeholder")}
            value={formData.TitleAr}
            onChange={(e) => onFieldChange("TitleAr", e.target.value)}
            className={`transition-all duration-200 ${
              errors.TitleAr
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.TitleAr && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.TitleAr}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="TitleEn"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.page_title_en")} *
          </Label>
          <Input
            id="TitleEn"
            placeholder={t("editor.page_title_en_placeholder")}
            value={formData.TitleEn}
            onChange={(e) => onFieldChange("TitleEn", e.target.value)}
            className={`transition-all duration-200 ${
              errors.TitleEn
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.TitleEn && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.TitleEn}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="DescriptionAr"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.page_description_ar")}
          </Label>
          <Textarea
            id="DescriptionAr"
            placeholder="وصف مختصر للصفحة باللغة العربية"
            value={formData.DescriptionAr}
            onChange={(e) => onFieldChange("DescriptionAr", e.target.value)}
            className="resize-none focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="DescriptionEn"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.page_description_en")}
          </Label>
          <Textarea
            id="DescriptionEn"
            placeholder="Brief description of the page in English"
            value={formData.DescriptionEn}
            onChange={(e) => onFieldChange("DescriptionEn", e.target.value)}
            className="resize-none focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="KeywordsAr"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.page_keywords_ar")}
          </Label>
          <Input
            id="KeywordsAr"
            placeholder={t("editor.page_keywords_ar_placeholder")}
            value={formData.KeywordsAr}
            onChange={(e) => onFieldChange("KeywordsAr", e.target.value)}
            className="focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="KeywordsEn"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.page_keywords_en")}
          </Label>
          <Input
            id="KeywordsEn"
            placeholder={t("editor.page_keywords_en_placeholder")}
            value={formData.KeywordsEn}
            onChange={(e) => onFieldChange("KeywordsEn", e.target.value)}
            className="focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
}
