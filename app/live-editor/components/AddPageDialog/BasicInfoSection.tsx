"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageFormData } from "../../types/types";
import { useEditorT } from "@/context/editorI18nStore";

interface BasicInfoSectionProps {
  formData: PageFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof PageFormData, value: string) => void;
}

export function BasicInfoSection({
  formData,
  errors,
  onFieldChange,
}: BasicInfoSectionProps) {
  const t = useEditorT();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {t("editor.basic_info")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="slug"
            className="text-sm font-medium text-gray-700"
          >
            {t("editor.slug")} *
          </Label>
          <Input
            id="slug"
            placeholder="homepage"
            value={formData.slug}
            onChange={(e) => onFieldChange("slug", e.target.value)}
            className={`transition-all duration-200 ${
              errors.slug
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.slug && (
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
              {errors.slug}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
