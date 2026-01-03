import React from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT } from "@/context/editorI18nStore";

interface TextareaFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
}

export const TextareaFieldRenderer: React.FC<TextareaFieldRendererProps> = ({
  def,
  normalizedPath,
  value,
  updateValue,
}) => {
  const t = useEditorT();

  return (
    <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <label className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
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
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-700">
            {def.label}
          </span>
          {def.description && (
            <p className="text-xs text-slate-500 mt-1">{def.description}</p>
          )}
        </div>
      </label>
      <div className="relative">
        <textarea
          value={value || ""}
          onChange={(e) => updateValue(normalizedPath, e.target.value)}
          className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-slate-700 resize-none ${
            value && value.length > 0
              ? "border-green-300 bg-green-50"
              : "border-slate-200"
          }`}
          rows={4}
          placeholder={def.placeholder || t("editor_sidebar.enter_your_text")}
        />
        {value && value.length > 0 && (
          <div className="absolute right-3 top-3">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {def.min && value && value.length < def.min && (
        <p className="text-xs text-red-500 mt-2">
          Minimum {def.min} characters required ({value?.length || 0}/{def.min})
        </p>
      )}
      {def.max && value && value.length > def.max && (
        <p className="text-xs text-red-500 mt-2">
          Maximum {def.max} characters allowed ({value?.length || 0}/{def.max})
        </p>
      )}
      {def.max && value && value.length <= def.max && (
        <p className="text-xs text-slate-500 mt-2">
          {value?.length || 0}/{def.max} characters
        </p>
      )}
    </div>
  );
};
