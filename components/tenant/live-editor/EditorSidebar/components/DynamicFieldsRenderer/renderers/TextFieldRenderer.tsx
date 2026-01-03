import React from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { ImageFieldRenderer } from "../../FieldRenderers";
import { useEditorT } from "@/context/editorI18nStore";

interface TextFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
}

export const TextFieldRenderer: React.FC<TextFieldRendererProps> = ({
  def,
  normalizedPath,
  value,
  updateValue,
}) => {
  const t = useEditorT();

  // Handle image fields separately
  if (def.type === "image") {
    return (
      <ImageFieldRenderer
        label={def.label}
        path={normalizedPath}
        value={value || ""}
        updateValue={updateValue}
      />
    );
  }

  return (
    <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <label className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">T</span>
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
        <input
          type="text"
          value={value || ""}
          onChange={(e) => updateValue(normalizedPath, e.target.value)}
          placeholder={def.placeholder || t("editor_sidebar.enter_text")}
          className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 ${
            value && value.length > 0
              ? "border-green-300 bg-green-50"
              : "border-slate-200"
          }`}
        />
        {value && value.length > 0 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
