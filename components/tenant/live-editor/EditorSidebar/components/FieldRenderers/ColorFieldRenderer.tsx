"use client";
import React, { useState } from "react";
import { useEditorT } from "@/context/editorI18nStore";

// تخزين اللون دائماً مع # في البيانات؛ العرض في الواجهة بدون #
function toStored(raw: string): string {
  const s = (raw || "").trim();
  if (!s || s.toLowerCase() === "transparent") return "transparent";
  const hex = s.startsWith("#") ? s.slice(1) : s;
  if (!/^[0-9A-Fa-f]{3,8}$/.test(hex)) return s;
  return "#" + hex;
}

function toDisplay(stored: string): string {
  if (!stored) return "";
  if (stored.toLowerCase() === "transparent") return "transparent";
  return stored.startsWith("#") ? stored.slice(1) : stored;
}

// مكون عرض حقل اللون
export const ColorFieldRenderer: React.FC<{
  label: string;
  path: string;
  value: string;
  updateValue: (path: string, value: any) => void;
}> = ({ label, path, value, updateValue }) => {
  const t = useEditorT();

  // Ensure value is a string (handle cases where it might be an object)
  const stringValue =
    typeof value === "string"
      ? value
      : typeof value === "object" && value !== null
        ? (value as { value?: string; color?: string }).value ||
          (value as { value?: string; color?: string }).color ||
          ""
        : String(value || "");
  const normalizedProp = toStored(stringValue);
  const hasHex =
    typeof normalizedProp === "string" && normalizedProp.startsWith("#");

  // Local state: always stored form (#hex or "transparent")
  const [localValue, setLocalValue] = useState(normalizedProp);

  // Update local value when prop value changes
  React.useEffect(() => {
    setLocalValue(normalizedProp);
  }, [normalizedProp]);

  // Handle color updates — نُخزّن دائماً بالشكل المعياري (مع #)
  const handleColorChange = (newValue: string) => {
    const stored = toStored(newValue);
    setLocalValue(stored);
    updateValue(path, stored);
  };

  return (
    <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* العنوان */}
        <span className="text-sm font-semibold text-slate-700">{label}</span>

        {/* الدائرة الملونة مع input يغطيها للفتح المباشر */}
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-slate-200 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110"
            style={{
              backgroundColor:
                localValue && localValue.startsWith("#")
                  ? localValue
                  : "transparent",
            }}
            title={t("editor_sidebar.pick_color")}
          >
            {!(localValue && localValue.startsWith("#")) && (
              <span className="absolute inset-0 grid place-items-center text-xs text-slate-400">
                {t("editor_sidebar.transparent")}
              </span>
            )}
          </div>
          <input
            aria-label={`Color picker for ${label}`}
            type="color"
            value={
              localValue && localValue.startsWith("#") ? localValue : "#000000"
            }
            onChange={(e) => handleColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            style={{ WebkitAppearance: "none", appearance: "none" as any }}
          />
        </div>

        {/* حقل النص للكود السادس عشر — يُعرض بدون # ويُخزَّن مع # في البيانات */}
        <input
          type="text"
          value={toDisplay(localValue)}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-28 text-center px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 font-mono text-sm"
          placeholder="FFFFFF"
        />

        {/* زر Transparent */}
        <button
          type="button"
          onClick={() => handleColorChange("transparent")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border-2 transition-all duration-200 ${
            localValue === "transparent" ||
            !(localValue && localValue.startsWith("#"))
              ? "bg-slate-100 border-slate-400 text-slate-700 shadow-inner"
              : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 shadow-sm"
          }`}
          title={t("editor_sidebar.make_color_transparent")}
        >
          {t("editor_sidebar.transparent")}
        </button>

        {/* زر النسخ */}
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(localValue || "")}
          className="group/btn p-2 rounded-lg bg-slate-100 hover:bg-blue-100 border-2 border-transparent hover:border-blue-300 transition-all duration-200"
          title={t("editor_sidebar.copy_color")}
        >
          <svg
            className="w-4 h-4 text-slate-600 group-hover/btn:text-blue-600 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
