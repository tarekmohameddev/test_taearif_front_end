"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageFormData } from "../../types/types";
import { useEditorT } from "@/context/editorI18nStore";

interface AdvancedSettingsSectionProps {
  formData: PageFormData;
  onFieldChange: (field: keyof PageFormData, value: string) => void;
}

export function AdvancedSettingsSection({
  formData,
  onFieldChange,
}: AdvancedSettingsSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const t = useEditorT();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-orange-50 text-orange-700">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {t("editor.advanced_settings")}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          {showAdvanced
            ? t("editor.hide_advanced")
            : t("editor.show_advanced")}{" "}
          {t("editor.advanced_settings_toggle")}
          <svg
            className={`w-4 h-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
          {/* Author & Robots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("editor.author_ar")}
              </Label>
              <Input
                placeholder="اسم المؤلف"
                value={formData.Author}
                onChange={(e) => onFieldChange("Author", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("editor.author_en")}
              </Label>
              <Input
                placeholder="Author Name"
                value={formData.AuthorEn}
                onChange={(e) => onFieldChange("AuthorEn", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("editor.robots_ar")}
              </Label>
              <Input
                placeholder="index, follow"
                value={formData.Robots}
                onChange={(e) => onFieldChange("Robots", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("editor.robots_en")}
              </Label>
              <Input
                placeholder="index, follow"
                value={formData.RobotsEn}
                onChange={(e) => onFieldChange("RobotsEn", e.target.value)}
              />
            </div>
          </div>

          {/* Open Graph */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Open Graph</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  og:title
                </Label>
                <Input
                  placeholder={t("editor.og_title")}
                  value={formData["og:title"]}
                  onChange={(e) => onFieldChange("og:title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  og:description
                </Label>
                <Input
                  placeholder={t("editor.og_description")}
                  value={formData["og:description"]}
                  onChange={(e) =>
                    onFieldChange("og:description", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  og:url
                </Label>
                <Input
                  placeholder={t("editor.og_url")}
                  value={formData["og:url"]}
                  onChange={(e) => onFieldChange("og:url", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  og:image
                </Label>
                <Input
                  placeholder={t("editor.og_image")}
                  value={formData["og:image"]}
                  onChange={(e) => onFieldChange("og:image", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
