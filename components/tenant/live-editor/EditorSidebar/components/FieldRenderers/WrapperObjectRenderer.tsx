"use client";
import React, { useState } from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorLocale, useEditorT } from "@/context/editorI18nStore";

interface WrapperObjectRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export function WrapperObjectRenderer({
  def,
  normalizedPath,
  value,
  updateValue,
  getValueByPath,
  renderField,
}: WrapperObjectRendererProps) {
  const { locale } = useEditorLocale();
  const t = useEditorT();
  const isRTL = locale === "ar";
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const key = normalizedPath;
  const isOpen = expanded[key] ?? false;
  const toggle = () => setExpanded((s) => ({ ...s, [key]: !isOpen }));

  // الحقول الملفوفة (field واحد أو fieldين)
  const wrappedFields = (def as any).wrappedFields || [];

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
            {wrappedFields.length} {t("editor_sidebar.fields")}
          </span>
          <div
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
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
          {wrappedFields.map((field: FieldDefinition) => {
            // بناء المسار الصحيح للحقل
            // إذا كان normalizedPath يحتوي على المسار الكامل، نستخدمه كـ basePath
            // وإلا نستخدم field.key مباشرة للبيانات flat
            const basePath = normalizedPath.includes('.') 
              ? normalizedPath.split('.').slice(0, -1).join('.') + '.' + field.key
              : field.key;
            
            return (
              <div key={field.key} className="space-y-2">
                {renderField(field, basePath)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
