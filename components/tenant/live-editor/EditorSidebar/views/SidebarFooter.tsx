import React from "react";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { createDefaultData } from "../utils";
import { getDefaultHeaderData } from "@/context-liveeditor/editorStoreFunctions/headerFunctions";

interface SidebarFooterProps {
  view: "main" | "add-section" | "edit-component" | "branding-settings";
  selectedComponent: ComponentInstance | null;
  handleSave: () => void;
  onClose: () => void;
  setView: (
    view: "main" | "add-section" | "edit-component" | "branding-settings",
  ) => void;
  setTempData: (data: any) => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  view,
  selectedComponent,
  handleSave,
  onClose,
  setView,
  setTempData,
}) => {
  const t = useEditorT();

  const handleCancel = () => {
    // Handle global components cancel - restore original data
    if (selectedComponent?.id === "global-header") {
      const store = useEditorStore.getState();
      const defaultData = getDefaultHeaderData();
      const originalData =
        store.globalHeaderData && Object.keys(store.globalHeaderData).length > 0
          ? store.globalHeaderData
          : defaultData;
      setTempData(originalData);
    } else if (selectedComponent?.id === "global-footer") {
      const store = useEditorStore.getState();
      // Use globalFooterVariant to get correct default data
      const currentVariant = store.globalFooterVariant || "StaticFooter1";
      const defaultData = createDefaultData("footer", currentVariant);

      const originalData =
        store.globalFooterData && Object.keys(store.globalFooterData).length > 0
          ? store.globalFooterData
          : defaultData;
      setTempData(originalData);
    } else {
      // Clear tempData when canceling regular components
      setTempData({});
    }
    onClose();
  };

  return (
    <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
      {view === "edit-component" && (
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{t("editor.save_changes")}</span>
            </div>
          </button>
          <button
            onClick={handleCancel}
            className="w-full px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
          >
            {t("common.cancel")}
          </button>
        </div>
      )}
      {view === "add-section" && (
        <button
          onClick={() => setView("main")}
          className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>{t("editor_sidebar.back_to_settings")}</span>
          </div>
        </button>
      )}
      {view === "branding-settings" && (
        <>
          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t("editor.save_changes")}</span>
              </div>
            </button>
            <button
              onClick={() => {
                setTempData({});
                onClose();
              }}
              className="w-full px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
            >
              {t("common.cancel")}
            </button>
          </div>
          <button
            onClick={() => setView("main")}
            className="group w-full relative overflow-hidden px-6 py-4 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 mt-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>{t("editor_sidebar.back_to_settings")}</span>
            </div>
          </button>
        </>
      )}
    </div>
  );
};
