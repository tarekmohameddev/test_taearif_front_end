"use client";
import React from "react";
import { FieldDefinition } from "@/componentsStructure/types";

interface BackgroundFieldRendererProps {
  backgroundField: FieldDefinition;
  getValueByPath: (path: string) => any;
  updateValue: (path: string, value: any) => void;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export function BackgroundFieldRenderer({
  backgroundField,
  getValueByPath,
  updateValue,
  renderField,
}: BackgroundFieldRendererProps) {
  return (
    <div className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <label className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <span className="font-bold text-slate-800">
            {backgroundField.label}
          </span>
        </label>

        {(backgroundField as any).fields?.map((field: FieldDefinition) => (
          <div key={field.key} className="mt-4">
            {renderField(field, "background")}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SimpleBackgroundFieldRendererProps {
  fields: FieldDefinition[];
  getValueByPath: (path: string) => any;
  updateValue: (path: string, value: any) => void;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export function SimpleBackgroundFieldRenderer({
  fields,
  getValueByPath,
  updateValue,
  renderField,
}: SimpleBackgroundFieldRendererProps) {
  const hasBgType = fields.some((f) => f.key === "background.type");
  const hasBgFrom = fields.some((f) => f.key === "background.colors.from");
  const hasBgTo = fields.some((f) => f.key === "background.colors.to");

  if (!hasBgType && !hasBgFrom && !hasBgTo) return null;

  return (
    <div className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <label className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <span className="font-bold text-slate-800">Background</span>
        </label>

        {fields
          .filter((f) => f.key?.startsWith("background."))
          .map((field) => (
            <div key={field.key} className="mb-4">
              {renderField(field, undefined)}
            </div>
          ))}
      </div>
    </div>
  );
}
