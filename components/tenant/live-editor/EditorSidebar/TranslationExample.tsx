"use client";

import React, { useState } from "react";
import { TranslationFields } from "./TranslationFields";
import { useEditorT } from "@/context/editorI18nStore";

export function TranslationExample() {
  const t = useEditorT();

  const [title, setTitle] = useState<Record<string, string>>({
    ar: "عنوان باللغة العربية",
    en: "Title in English",
  });

  const [description, setDescription] = useState<Record<string, string>>({
    ar: "وصف باللغة العربية",
    en: "Description in English",
  });

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold">
        {t("editor.component_settings")}
      </h3>

      <TranslationFields
        fieldKey="title"
        value={title}
        onChange={setTitle}
        label={t("components.hero")}
        type="input"
      />

      <TranslationFields
        fieldKey="description"
        value={description}
        onChange={setDescription}
        label={t("common.description")}
        type="textarea"
      />

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Preview:</h4>
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {title.ar || title.en}
          </p>
          <p>
            <strong>Description:</strong> {description.ar || description.en}
          </p>
        </div>
      </div>
    </div>
  );
}
