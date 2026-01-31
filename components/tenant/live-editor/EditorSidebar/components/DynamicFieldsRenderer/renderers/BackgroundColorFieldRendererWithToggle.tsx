import React from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { ColorFieldRenderer } from "../../FieldRenderers";
import useTenantStore from "@/context/tenantStore";

interface BackgroundColorFieldRendererWithToggleProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
}

export const BackgroundColorFieldRendererWithToggle: React.FC<
  BackgroundColorFieldRendererWithToggleProps
> = ({ def, normalizedPath, value, updateValue, getValueByPath }) => {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const isRTL = locale === "ar";
  const { tenantData } = useTenantStore();

  // Only show useMainBgColor toggle if the field definition explicitly has useMainBgColor property
  const hasUseMainBgColorInDef = def.useMainBgColor !== undefined;

  // Get useMainBgColor from field definition or data
  const useMainBgColorPath = `${normalizedPath}.useMainBgColor`;

  // Get the current value from tempData or data, prioritizing tempData
  const currentUseMainBgColor = getValueByPath(useMainBgColorPath);
  const useMainBgColorValue = hasUseMainBgColorInDef
    ? currentUseMainBgColor !== undefined
      ? currentUseMainBgColor
      : (def.useMainBgColor ?? true)
    : false;

  // Get mainBgColor from WebsiteLayout
  const mainBgColor =
    tenantData?.WebsiteLayout?.branding?.mainBgColor || "#efe5dc";

  // If useMainBgColor is not in the field definition, just show ColorFieldRenderer (no toggle)
  if (!hasUseMainBgColorInDef) {
    return (
      <ColorFieldRenderer
        label={def.label}
        path={normalizedPath}
        value={value || ""}
        updateValue={updateValue}
      />
    );
  }

  return (
    <div 
      className="space-y-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Use Main Background Color Toggle */}
      <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-slate-700">
              {def.label} -{" "}
              {t("editor_sidebar.use_main_background_color") || "Use Main Background Color"}
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
            : t("editor_sidebar.using_custom_color") || "Using custom color"}
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
        <ColorFieldRenderer
          label={def.label}
          path={`${normalizedPath}.value`}
          value={typeof value === "object" && value !== null && !Array.isArray(value) && value.value ? value.value : ""}
          updateValue={(colorPath, colorValue) => {
            // When updating custom color, save it in backgroundColor.value
            // The colorPath should already be normalizedPath.value, but ensure it's correct
            const valuePath = colorPath.includes(".value") ? colorPath : `${normalizedPath}.value`;
            updateValue(valuePath, colorValue);
            // Explicitly set useMainBgColor to false to prevent it from reverting to true
            const currentUseMainBgColor = getValueByPath(useMainBgColorPath);
            if (currentUseMainBgColor !== false) {
              updateValue(useMainBgColorPath, false);
            }
          }}
        />
      )}
    </div>
  );
};
