"use client";
import React, { useState } from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { ColorFieldRenderer } from "../../FieldRenderers";
import useTenantStore from "@/context/tenantStore";

interface BackgroundColorObjectRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
}

export const BackgroundColorObjectRenderer: React.FC<
  BackgroundColorObjectRendererProps
> = ({ def, normalizedPath, value, updateValue, getValueByPath }) => {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const isRTL = locale === "ar";
  const { tenantData } = useTenantStore();

  // Get useMainBgColor from field definition or data
  const useMainBgColorPath = `${normalizedPath}.useMainBgColor`;
  const valuePath = `${normalizedPath}.value`;

  // Get the current value from tempData or data, prioritizing tempData
  const currentUseMainBgColor = getValueByPath(useMainBgColorPath);
  const useMainBgColorValue =
    currentUseMainBgColor !== undefined
      ? currentUseMainBgColor
      : (def.useMainBgColor ?? true);

  // Get mainBgColor from WebsiteLayout
  const mainBgColor =
    tenantData?.WebsiteLayout?.branding?.mainBgColor || "#efe5dc";

  // Get custom color value
  const customColorValue = getValueByPath(valuePath) || "";

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const key = normalizedPath;
  const isOpen = expanded[key] ?? false;
  const toggle = () => setExpanded((s) => ({ ...s, [key]: !isOpen }));

  return (
    <div
      className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-800">{def.label}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            2 {t("editor_sidebar.fields")}
          </span>
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              className="w-5 h-5 text-slate-600"
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
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="p-6 bg-gradient-to-b from-white to-slate-50 space-y-6 border-t border-slate-200">
          {/* Use Main Background Color Toggle */}
          <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-slate-700">
                  {t("editor_sidebar.use_main_background_color") ||
                    "Use Main Background Color"}
                </span>
              </label>
              <button
                type="button"
                onClick={() =>
                  updateValue(useMainBgColorPath, !useMainBgColorValue)
                }
                dir={"ltr"}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 transform hover:scale-105 ${
                  useMainBgColorValue
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-pressed={useMainBgColorValue}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    useMainBgColorValue ? "translate-x-9" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {useMainBgColorValue
                ? t("editor_sidebar.using_main_background_color") ||
                  "Using main background color from general settings"
                : t("editor_sidebar.using_custom_color") ||
                  "Using custom color"}
            </p>
            {/* Show mainBgColor preview when toggle is on */}
            {useMainBgColorValue && (
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: mainBgColor,
                  }}
                />
                <span className="text-xs text-slate-600 font-mono">
                  {mainBgColor}
                </span>
              </div>
            )}
          </div>

          {/* Custom Color Field (only shown when useMainBgColor = false) */}
          {!useMainBgColorValue && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("editor_sidebar.background_color") || "Background Color"}
              </label>
              <ColorFieldRenderer
                label={t("editor_sidebar.background_color") || "Background Color"}
                path={valuePath}
                value={typeof customColorValue === "string" ? customColorValue : ""}
                updateValue={(colorPath, colorValue) => {
                  // When updating custom color, save it in backgroundColor.value
                  updateValue(valuePath, colorValue);
                  // Explicitly set useMainBgColor to false to prevent it from reverting to true
                  const currentUseMainBgColor = getValueByPath(useMainBgColorPath);
                  if (currentUseMainBgColor !== false) {
                    updateValue(useMainBgColorPath, false);
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
