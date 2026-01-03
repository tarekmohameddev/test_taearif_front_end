import React from "react";
import { useEditorT } from "@/context/editorI18nStore";
import { PageThemeSelector } from "../../PageThemeSelector";

interface MainViewProps {
  onPageThemeChange?: (
    themeId: string,
    components: Record<string, string>,
  ) => void;
  setView: (
    view: "main" | "add-section" | "edit-component" | "branding-settings",
  ) => void;
}

export const MainView: React.FC<MainViewProps> = ({
  onPageThemeChange,
  setView,
}) => {
  const t = useEditorT();

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🎨</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {t("editor_sidebar.theme_settings")}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Page Theme Selector */}
          <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {t("editor_sidebar.page_theme")}
                  </h4>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full shadow-sm">
                  {t("editor_sidebar.global")}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {t("editor_sidebar.transform_all_components")}
              </p>
              <PageThemeSelector
                onThemeChange={(themeId, components) => {
                  if (onPageThemeChange) {
                    onPageThemeChange(themeId, components);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <label className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {t("editor_sidebar.primary_color")}
                </span>
              </label>
              <input
                type="color"
                className="w-full h-12 rounded-xl border-2 border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200 cursor-pointer"
              />
            </div>

            <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <label className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Aa</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {t("editor_sidebar.default_font")}
                </span>
              </label>
              <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 font-medium">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Cairo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <button
          onClick={() => setView("add-section")}
          className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-3">
            <svg
              className="w-5 h-5"
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
            <span>{t("editor_sidebar.add_new_section")}</span>
          </div>
        </button>
      </div>
    </>
  );
};
