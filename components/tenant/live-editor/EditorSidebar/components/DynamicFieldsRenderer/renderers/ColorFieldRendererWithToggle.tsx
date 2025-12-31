import React from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { ColorFieldRenderer } from "../../FieldRenderers";
import useTenantStore from "@/context-liveeditor/tenantStore";

interface ColorFieldRendererWithToggleProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
}

export const ColorFieldRendererWithToggle: React.FC<
  ColorFieldRendererWithToggleProps
> = ({ def, normalizedPath, value, updateValue, getValueByPath }) => {
  const t = useEditorT();
  const { tenantData } = useTenantStore();

  // Only show useDefaultColor toggle if the field definition explicitly has useDefaultColor property
  // This prevents showing toggle for nested color fields that don't have useDefaultColor in their definition
  const hasUseDefaultColorInDef = def.useDefaultColor !== undefined;

  // Get useDefaultColor and globalColorType from field definition or data
  const useDefaultColorPath = `${normalizedPath}.useDefaultColor`;
  const globalColorTypePath = `${normalizedPath}.globalColorType`;

  // Get the current value from tempData or data, prioritizing tempData
  const currentUseDefaultColor = getValueByPath(useDefaultColorPath);
  const useDefaultColorValue = hasUseDefaultColorInDef
    ? currentUseDefaultColor !== undefined
      ? currentUseDefaultColor
      : (def.useDefaultColor ?? true)
    : false;
  const globalColorTypeValue =
    getValueByPath(globalColorTypePath) ?? def.globalColorType ?? "primary";

  // Get branding colors from WebsiteLayout
  const primaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary || "#059669";
  const secondaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.secondary || "#059669";
  const accentColor =
    tenantData?.WebsiteLayout?.branding?.colors?.accent || "#059669";

  const getBrandingColor = (type: "primary" | "secondary" | "accent") => {
    switch (type) {
      case "primary":
        return primaryColor;
      case "secondary":
        return secondaryColor;
      case "accent":
        return accentColor;
      default:
        return primaryColor;
    }
  };

  // If useDefaultColor is not in the field definition, just show ColorFieldRenderer (no toggle)
  if (!hasUseDefaultColorInDef) {
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
    <div className="space-y-4 ">
      {/* Use Default Color Toggle */}
      <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-slate-700">
              {def.label} -{" "}
              {t("editor_sidebar.use_default_color") || "Use Default Color"}
            </span>
          </label>
          <button
            type="button"
            onClick={() =>
              updateValue(useDefaultColorPath, !useDefaultColorValue)
            }
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 transform hover:scale-105 ${
              useDefaultColorValue
                ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
                : "bg-slate-300 hover:bg-slate-400"
            }`}
            aria-pressed={useDefaultColorValue}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                useDefaultColorValue ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {useDefaultColorValue
            ? t("editor_sidebar.using_branding_color") ||
              "Using branding color from general settings"
            : t("editor_sidebar.using_custom_color") || "Using custom color"}
        </p>
      </div>

      {/* Global Color Type Dropdown (only shown when useDefaultColor = true) */}
      {useDefaultColorValue && (
        <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
          <label className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {t("editor_sidebar.branding_color_type") || "Branding Color Type"}
            </span>
          </label>
          <div className="relative">
            <select
              value={globalColorTypeValue}
              onChange={(e) => updateValue(globalColorTypePath, e.target.value)}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium appearance-none cursor-pointer pr-10 ${
                globalColorTypeValue && globalColorTypeValue.length > 0
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
              }}
            >
              <option value="primary">
                {t("editor_sidebar.primary_color") || "Primary Color"}
              </option>
              <option value="secondary">
                {t("editor_sidebar.secondary_color") || "Secondary Color"}
              </option>
              <option value="accent">
                {t("editor_sidebar.accent_color") || "Accent Color"}
              </option>
            </select>
            {/* Color preview */}
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{
                backgroundColor: getBrandingColor(globalColorTypeValue),
              }}
            />
          </div>
        </div>
      )}

      {/* Custom Color Field (only shown when useDefaultColor = false) */}
      {!useDefaultColorValue && (
        <ColorFieldRenderer
          label={def.label}
          path={normalizedPath}
          value={typeof value === "string" ? value : ""}
          updateValue={(colorPath, colorValue) => {
            // When updating custom color, ensure useDefaultColor remains false
            // Update both the color value and useDefaultColor in a single operation
            updateValue(colorPath, colorValue);
            // Explicitly set useDefaultColor to false to prevent it from reverting to true
            const currentUseDefaultColor = getValueByPath(useDefaultColorPath);
            if (currentUseDefaultColor !== false) {
              updateValue(useDefaultColorPath, false);
            }
          }}
        />
      )}
    </div>
  );
};
