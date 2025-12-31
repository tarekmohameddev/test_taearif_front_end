import React from "react";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { AVAILABLE_SECTIONS, getSectionIcon } from "../constants";

interface AddSectionViewProps {
  onSectionAdd: (type: string) => void;
}

export const AddSectionView: React.FC<AddSectionViewProps> = ({
  onSectionAdd,
}) => {
  const t = useEditorT();

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-sm">🏗️</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {t("editor_sidebar.add_section")}
          </h3>
          <p className="text-sm text-slate-500">
            {t("editor_sidebar.choose_section")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {AVAILABLE_SECTIONS.map((section) => (
          <button
            key={section.type}
            onClick={() => onSectionAdd(section.type)}
            className="group relative overflow-hidden p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">
                  {getSectionIcon(section.type)}
                </span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                  {section.name}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  {section.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Coming Soon Overlay - Disabled add-section functionality */}
      {process.env.NODE_ENV !== "development" && (
        <div
          className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 -top-[30px] flex items-start justify-center pointer-events-auto"
          style={{ paddingTop: "250px" }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              {t("live_editor.coming_soon")}
            </h2>
            <p className="text-red-500 font-medium">
              {t("live_editor.components_disabled")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
