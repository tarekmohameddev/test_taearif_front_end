"use client";
import React from "react";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { FieldDefinition } from "@/componentsStructure/types";

// مكون عرض حقل الرقم (يدعم min, max, step, unit مثل px)
function clampNum(val: number, min?: number, max?: number): number {
  let n = val;
  if (min != null && n < min) n = min;
  if (max != null && n > max) n = max;
  return n;
}

// استخراج رقم من value (قد يكون number أو string مثل "36" أو "36px")
function parseNumValue(value: unknown, min?: number, max?: number): number {
  if (typeof value === "number" && !Number.isNaN(value))
    return clampNum(value, min, max);
  if (typeof value === "string") {
    const n = parseInt(value.replace(/\D/g, ""), 10);
    if (!Number.isNaN(n)) return clampNum(n, min, max);
  }
  return clampNum(0, min, max);
}

export const NumberFieldRenderer: React.FC<{
  label: string;
  path: string;
  value: number;
  updateValue: (path: string, value: any) => void;
  def?: FieldDefinition;
}> = ({ label, path, value, updateValue, def }) => {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const isRTL = locale === "ar";
  const min = def?.min;
  const max = def?.max ?? (def?.unit === "px" ? 200 : undefined);
  const step = def?.step ?? 1;
  const unit = def?.unit;
  const numValue = parseNumValue(value, min, max);

  const setValue = (n: number) => {
    const clamped = clampNum(n, min, max);
    updateValue(path, clamped);
  };

  return (
    <div
      className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <label className="flex items-center space-x-3 mb-3">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue(numValue - step)}
          disabled={min != null && numValue <= min}
          className="group/btn w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-red-100 border-2 border-transparent hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg
            className="w-5 h-5 text-slate-600 group-hover/btn:text-red-600 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden">
        {unit && <span className="text-slate-500 text-sm font-medium shrink-0 mx-5">{unit}</span>}

          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={numValue}
            onChange={(e) => {
              const v = e.target.value === "" ? min ?? 0 : parseInt(e.target.value, 10);
              if (!Number.isNaN(v)) setValue(v);
            }}
            className="w-full min-w-0 px-2 py-3 bg-transparent focus:outline-none focus:ring-0 text-slate-700 text-center font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setValue(numValue + step)}
          disabled={max != null && numValue >= max}
          className="group/btn w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-green-100 border-2 border-transparent hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg
            className="w-5 h-5 text-slate-600 group-hover/btn:text-green-600 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        {t("editor_sidebar.current_value")}: {numValue}
        {unit ? ` ${unit}` : ""}
      </p>
    </div>
  );
};
