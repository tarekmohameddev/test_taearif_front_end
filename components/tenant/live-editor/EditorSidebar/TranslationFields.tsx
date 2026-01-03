"use client";

import React from "react";
import { useEditorT } from "@/context/editorI18nStore";
import { locales, localeNames, localeFlags } from "@/lib/i18n/config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages } from "lucide-react";

interface TranslationFieldsProps {
  fieldKey: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  label?: string;
  type?: "input" | "textarea";
  placeholder?: string;
}

export function TranslationFields({
  fieldKey,
  value,
  onChange,
  label,
  type = "input",
  placeholder,
}: TranslationFieldsProps) {
  const t = useEditorT();

  const handleValueChange = (locale: string, newValue: string) => {
    onChange({
      ...value,
      [locale]: newValue,
    });
  };

  const getCurrentValue = (locale: string) => {
    return value[locale] || "";
  };

  const getPlaceholder = (locale: string) => {
    if (placeholder) return placeholder;
    return (
      t(`${fieldKey}.placeholder`) ||
      `Enter ${label || fieldKey} in ${localeNames[locale as keyof typeof localeNames]}`
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Languages className="h-4 w-4" />
          {label || fieldKey}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {locales.map((locale) => (
              <TabsTrigger
                key={locale}
                value={locale}
                className="flex items-center gap-1 text-xs"
              >
                <span>{localeFlags[locale]}</span>
                <span className="hidden sm:inline">{localeNames[locale]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {locales.map((locale) => (
            <TabsContent key={locale} value={locale} className="mt-4">
              <div className="space-y-2">
                <Label htmlFor={`${fieldKey}-${locale}`} className="text-xs">
                  {localeNames[locale]} {label || fieldKey}
                </Label>
                {type === "textarea" ? (
                  <Textarea
                    id={`${fieldKey}-${locale}`}
                    value={getCurrentValue(locale)}
                    onChange={(e) => handleValueChange(locale, e.target.value)}
                    placeholder={getPlaceholder(locale)}
                    className="min-h-[80px] text-sm"
                  />
                ) : (
                  <Input
                    id={`${fieldKey}-${locale}`}
                    value={getCurrentValue(locale)}
                    onChange={(e) => handleValueChange(locale, e.target.value)}
                    placeholder={getPlaceholder(locale)}
                    className="text-sm"
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Hook for easy access to translation fields
export function useTranslationFields(
  fieldKey: string,
  value: Record<string, string>,
  onChange: (value: Record<string, string>) => void,
) {
  const t = useEditorT();

  const getTranslation = (locale: string) => {
    return value[locale] || "";
  };

  const setTranslation = (locale: string, translation: string) => {
    onChange({
      ...value,
      [locale]: translation,
    });
  };

  const getPlaceholder = (locale: string) => {
    return t(`${fieldKey}.placeholder`) || `Enter ${fieldKey} in ${locale}`;
  };

  return {
    getTranslation,
    setTranslation,
    getPlaceholder,
    locales,
    localeNames,
    localeFlags,
  };
}
