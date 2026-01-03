"use client";

import React from "react";
import {
  useEditorT,
  useEditorLocale,
} from "@/context/editorI18nStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Languages } from "lucide-react";

export function TranslationTestComponent() {
  const t = useEditorT();
  const { locale, setLocale } = useEditorLocale();

  return (
    <Card className="m-4" style={{ zIndex: 999999 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translation Test Component
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Current Language: {locale}</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Save Changes:</strong> {t("editor.save_changes")}
            </p>
            <p>
              <strong>Add Component:</strong> {t("editor.add_component")}
            </p>
            <p>
              <strong>Delete Component:</strong> {t("editor.delete_component")}
            </p>
            <p>
              <strong>Cancel:</strong> {t("common.cancel")}
            </p>
            <p>
              <strong>Preview:</strong> {t("editor.preview")}
            </p>
            <p>
              <strong>Home:</strong> {t("navigation.home")}
            </p>
            <p>
              <strong>Contact:</strong> {t("navigation.contact")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setLocale("ar")}
            variant={locale === "ar" ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <img
              src="https://flagcdn.com/24x18/sa.png"
              alt="العربية"
              className="w-5 h-auto rounded-sm"
            />
            العربية
          </Button>
          <Button
            onClick={() => setLocale("en")}
            variant={locale === "en" ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <img
              src="https://flagcdn.com/24x18/us.png"
              alt="English"
              className="w-5 h-auto rounded-sm"
            />
            English
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
