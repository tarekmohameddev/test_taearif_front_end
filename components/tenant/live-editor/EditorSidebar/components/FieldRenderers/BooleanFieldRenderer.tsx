"use client";
import React from "react";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";

// مكون عرض حقل Boolean
export const BooleanFieldRenderer: React.FC<{
  label: string;
  path: string;
  value: boolean;
  updateValue: (path: string, value: any) => void;
}> = ({ label, path, value, updateValue }) => {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const isRTL = locale === "ar";
  return (
    <div
      className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </label>
        <button
          type="button"
          onClick={() => updateValue(path, !value)}
          dir={"ltr"}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 transform hover:scale-105 ${
            value
              ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
              : "bg-slate-300 hover:bg-slate-400"
          }`}
          aria-pressed={value}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
              value ? "translate-x-9" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {value ? t("editor_sidebar.enabled") : t("editor_sidebar.disabled")}
      </p>
    </div>
  );
};
