"use client";

import React, { useMemo } from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";

const MULTI_VALUE_SEP = ",";

interface BadgeSelectFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  error?: string;
}

/** Parse stored value to array of selected values. For single mode: one item or []. For multi: split by comma. */
function parseValue(value: any, mode: "single" | "multi"): string[] {
  if (value == null || value === "") return [];
  const s = String(value).trim();
  if (!s) return [];
  if (mode === "single") return s ? [s] : [];
  return s.split(MULTI_VALUE_SEP).map((v) => v.trim()).filter(Boolean);
}

/** Serialize selected values to stored value. Single: one string or "". Multi: comma-separated. */
function serializeValue(selected: string[], mode: "single" | "multi"): string {
  if (selected.length === 0) return "";
  if (mode === "single") return selected[0] ?? "";
  return selected.join(MULTI_VALUE_SEP);
}

export const BadgeSelectFieldRenderer: React.FC<BadgeSelectFieldRendererProps> = ({
  def,
  normalizedPath,
  value,
  updateValue,
  error,
}) => {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const isRTL = locale === "ar";

  const options = def.options ?? [];
  const badgeConfig = (def as any).badgeConfig ?? {};
  const mode = badgeConfig.mode ?? "single";
  const requiredAtLeastOne = badgeConfig.requiredAtLeastOne ?? false;
  const requiredValues = badgeConfig.requiredValues ?? [];
  const allowUnset = badgeConfig.allowUnset ?? !requiredAtLeastOne;
  const styles = badgeConfig.styles ?? {};

  const selectedList = useMemo(() => parseValue(value, mode), [value, mode]);

  const toggle = (optValue: string) => {
    if (mode === "single") {
      const isSelected = selectedList.includes(optValue);
      if (isSelected && allowUnset) {
        updateValue(normalizedPath, "");
        return;
      }
      if (!isSelected) {
        updateValue(normalizedPath, optValue);
        return;
      }
      return;
    }
    // multi
    const next = selectedList.includes(optValue)
      ? selectedList.filter((v) => v !== optValue)
      : [...selectedList, optValue];
    updateValue(normalizedPath, serializeValue(next, mode));
  };

  // Validation: compute error message from config (same style as select: show below)
  const validationError = useMemo(() => {
    if (requiredAtLeastOne && selectedList.length === 0) {
      return t("editor_sidebar.at_least_one_required") ?? "At least one option must be selected.";
    }
    if (requiredValues.length > 0) {
      const missing = requiredValues.filter((v) => !selectedList.includes(v));
      if (missing.length > 0) {
        return (t("editor_sidebar.required_options_missing") ?? "Required options missing.") + " " + missing.join(", ");
      }
    }
    return null;
  }, [requiredAtLeastOne, requiredValues, selectedList, t]);

  const displayError = error ?? validationError;

  const hasCustomStyles = Boolean(
    styles.unselected?.bg ?? styles.unselected?.border ?? styles.unselected?.text ?? styles.selected?.bg ?? styles.selected?.text
  );
  const unselectedStyle: React.CSSProperties = hasCustomStyles && styles.unselected
    ? {
        backgroundColor: styles.unselected.bg,
        border: styles.unselected.border,
        color: styles.unselected.text,
      }
    : {};
  const selectedStyle: React.CSSProperties = hasCustomStyles && styles.selected
    ? { backgroundColor: styles.selected.bg, color: styles.selected.text }
    : {};

  return (
    <div
      className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <label className="flex items-center space-x-3 mb-3">
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-700">
            {def.label}
          </span>
          {def.description && (
            <p className="text-xs text-slate-500 mt-1">{def.description}</p>
          )}
        </div>
      </label>
      <div className="flex flex-wrap gap-2 justify-center">
        {options.map((opt) => {
          const isSelected = selectedList.includes(opt.value);
          const defaultUnselected = "bg-transparent border border-slate-200 text-slate-600";
          const defaultSelected = "bg-black text-white border border-black";
          const className = isSelected
            ? `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 border ${hasCustomStyles ? "" : defaultSelected}`
            : `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 border ${hasCustomStyles ? "" : defaultUnselected}`;
          const style = isSelected ? selectedStyle : unselectedStyle;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={className}
              style={Object.keys(style).length ? style : undefined}
            >
              {t(opt.label)}
            </button>
          );
        })}
      </div>
      {options.length === 0 && (
        <p className="text-xs text-amber-500 mt-2">
          {t("editor_sidebar.no_options_available")}
        </p>
      )}
      {displayError && (
        <p className="text-xs text-red-500 mt-2">{displayError}</p>
      )}
    </div>
  );
};
