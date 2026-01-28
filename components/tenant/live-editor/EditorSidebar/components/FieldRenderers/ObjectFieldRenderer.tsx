"use client";
import React, { useState } from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { CardThemeSelector } from "../../../CardThemeSelector";

interface ObjectFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getValueByPath: (path: string) => any;
  renderField: (def: FieldDefinition, basePath?: string) => React.ReactNode;
}

export function ObjectFieldRenderer({
  def,
  normalizedPath,
  value,
  updateValue,
  getValueByPath,
  renderField,
}: ObjectFieldRendererProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const objDef = def as any;
  const key = normalizedPath;
  const isOpen = expanded[key] ?? false;
  const toggle = () => setExpanded((s) => ({ ...s, [key]: !isOpen }));

  return (
    <div className="group bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
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
          <span className="font-bold text-slate-800">{def.label}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {objDef.fields?.length || 0} fields
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
          {/* Card Theme Selector - Show only for card objects */}
          {def.key === "card" && (
            <div className="mb-6">
              <CardThemeSelector
                currentTheme={
                  getValueByPath(`${normalizedPath}.theme`) || "card-default"
                }
                onThemeChange={(theme) =>
                  updateValue(`${normalizedPath}.theme`, theme)
                }
              />
            </div>
          )}

          {/* Enhanced Menu Items Support - Special handling for menu objects */}
          {def.key === "menu" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
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
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Menu Items</h3>
                    <p className="text-sm text-slate-600">
                      Manage your navigation menu items
                    </p>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  Menu items are managed through the main array field below.
                  Each item can have submenus with their own items.
                </div>
              </div>
            </div>
          )}

          {/* Render remaining child fields */}
          {objDef.fields
            .filter((f: any) => {
              if (def.key === "card") return true; // handled separately but still render card subfields
              return true;
            })
            .map((f: any) => (
              <div key={f.key} className="space-y-2">
                {/* Enhanced array field rendering for nested arrays */}
                {f.type === "array" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-700 text-lg">
                        {f.label}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {Array.isArray(
                            getValueByPath(`${normalizedPath}.${f.key}`),
                          )
                            ? getValueByPath(`${normalizedPath}.${f.key}`)
                                .length
                            : 0}{" "}
                          items
                        </span>
                      </div>
                    </div>
                    {renderField(f, `${normalizedPath}.${f.key}`)}
                  </div>
                ) : (
                  renderField(f, `${normalizedPath}.${f.key}`)
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
