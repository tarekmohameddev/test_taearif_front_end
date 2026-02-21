"use client";
import React, { useState, useRef } from "react";
import { FieldRendererProps } from "../types";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import axiosInstance from "@/lib/axiosInstance";
import { FieldDefinition } from "@/componentsStructure/types";

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
        ? value.value || value.color || ""
        : String(value || "");
  const hasHex = typeof stringValue === "string" && stringValue.startsWith("#");
  const colorValue = hasHex ? stringValue : "#000000";

  // Local state to track the current color value for immediate UI updates
  const [localValue, setLocalValue] = useState(stringValue);

  // Update local value when prop value changes
  React.useEffect(() => {
    setLocalValue(stringValue);
  }, [stringValue]);

  // Handle color updates
  const handleColorChange = (newValue: string) => {
    setLocalValue(newValue);
    updateValue(path, newValue);
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

        {/* حقل النص للكود السادس عشر */}
        <input
          type="text"
          value={localValue || ""}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-28 text-center px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 font-mono text-sm"
          placeholder="#FFFFFF"
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

// مكون عرض حقل الصورة
export const ImageFieldRenderer: React.FC<{
  label: string;
  path: string;
  value: string;
  updateValue: (path: string, value: any) => void;
}> = ({ label, path, value, updateValue }) => {
  const t = useEditorT();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("context", "template");

      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success" && response.data.data?.url) {
        updateValue(path, response.data.data.url);
      }
    } catch (error) {
      console.error("خطأ في رفع الصورة:", error);
      // يمكن إضافة إشعار خطأ هنا
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="group p-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <label className="flex items-center space-x-3 mb-3">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => updateValue(path, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700"
            placeholder="https://example.com/image.jpg"
          />

          {/* زر رفع الصورة */}
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>جاري الرفع...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>رفع صورة</span>
              </>
            )}
          </button>

          {/* input مخفي لرفع الملفات */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {value && (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>{t("editor_sidebar.open_image")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

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

// مكون عرض حقل الرقم (يدعم min, max, step, unit مثل px)
function clampNum(val: number, min?: number, max?: number): number {
  let n = val;
  if (min != null && n < min) n = min;
  if (max != null && n > max) n = max;
  return n;
}

// استخراج رقم من value (قد يكون number أو string مثل "36" أو "36px")
function parseNumValue(value: unknown, min?: number, max?: number): number {
  if (typeof value === "number" && !Number.isNaN(value)) return clampNum(value, min, max);
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
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">#</span>
        </div>
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
          {unit && <span className="text-slate-500 text-sm font-medium shrink-0">{unit}</span>}
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
