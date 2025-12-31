import React from "react";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { ThemeSelector } from "../../ThemeSelector";
import { ResetConfirmDialog } from "../../ResetConfirmDialog";
import { AdvancedSimpleSwitcher } from "../components/AdvancedSimpleSwitcher";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";
import { createDefaultData } from "../utils";
import { useEditorStore } from "@/context-liveeditor/editorStore";

interface EditComponentViewProps {
  selectedComponent: ComponentInstance;
  tempData: any;
  globalHeaderVariant: string | null;
  globalFooterVariant: string | null;
  setGlobalHeaderVariant: (variant: string) => void;
  setGlobalFooterVariant: (variant: string) => void;
  setGlobalHeaderData: (data: any) => void;
  setGlobalFooterData: (data: any) => void;
  setGlobalComponentsData: (data: any) => void;
  globalComponentsData: any;
  setHasChangesMade: (hasChanges: boolean) => void;
  onComponentThemeChange?: (id: string, newTheme: string) => void;
  onComponentReset?: (id: string) => void;
  updateByPath: (path: string, value: any) => void;
  updateComponentByPath: (
    componentType: string,
    componentId: string,
    path: string,
    value: any,
  ) => void;
  handleInputChange: (
    field: "texts" | "colors" | "settings",
    key: string,
    value: string | boolean | number,
  ) => void;
}

export const EditComponentView: React.FC<EditComponentViewProps> = ({
  selectedComponent,
  tempData,
  globalHeaderVariant,
  globalFooterVariant,
  setGlobalHeaderVariant,
  setGlobalFooterVariant,
  setGlobalHeaderData,
  setGlobalFooterData,
  setGlobalComponentsData,
  globalComponentsData,
  setHasChangesMade,
  onComponentThemeChange,
  onComponentReset,
  updateByPath,
  updateComponentByPath,
  handleInputChange,
}) => {
  const t = useEditorT();

  const getComponentName = () => {
    // Handle global components
    if (selectedComponent.id === "global-header") {
      return globalHeaderVariant || "StaticHeader1";
    }
    if (selectedComponent.id === "global-footer") {
      return globalFooterVariant || "StaticFooter1";
    }

    // أولاً: تحقق من componentName مباشرة
    if (
      selectedComponent.componentName &&
      selectedComponent.componentName !== "undefined" &&
      selectedComponent.componentName !== "null"
    ) {
      return selectedComponent.componentName;
    }

    // ثانياً: إذا كان componentName غير صحيح، استخدم fallback بناءً على نوع المكون
    if (selectedComponent.type === "halfTextHalfImage") {
      // استخدام الـ id إذا كان يحتوي على رقم المكون
      if (
        selectedComponent.id &&
        selectedComponent.id.includes("halfTextHalfImage3")
      ) {
        return "halfTextHalfImage3";
      } else if (
        selectedComponent.id &&
        selectedComponent.id.includes("halfTextHalfImage2")
      ) {
        return "halfTextHalfImage2";
      } else if (
        selectedComponent.id &&
        selectedComponent.id.includes("halfTextHalfImage1")
      ) {
        return "halfTextHalfImage1";
      }
      return "halfTextHalfImage1"; // افتراضي لـ halfTextHalfImage1
    }

    // ثالثاً: fallback عام
    return selectedComponent.id || selectedComponent.componentName;
  };

  const handleUpdateByPath = (path: string, value: any) => {
    // Validate input
    if (!path || path.trim() === "") {
      console.error("❌ [EditorSidebar] Invalid path provided:", path);
      return;
    }

    // Handle global components with enhanced validation
    if (selectedComponent.id === "global-header") {
      // Validate header-specific paths
      const validHeaderPaths = [
        "visible",
        "position",
        "height",
        "background",
        "colors",
        "logo",
        "menu",
        "actions",
        "responsive",
        "animations",
      ];

      const pathRoot = path.split(".")[0];
      if (!validHeaderPaths.includes(pathRoot)) {
        console.warn(
          "⚠️ [EditorSidebar] Potentially invalid header path:",
          path,
        );
      }

      // Update tempData with validation
      updateByPath(path, value);
    } else if (selectedComponent.id === "global-footer") {
      // Validate footer-specific paths
      const validFooterPaths = [
        "visible",
        "background",
        "layout",
        "content",
        "footerBottom",
        "styling",
      ];

      const pathRoot = path.split(".")[0];
      if (!validFooterPaths.includes(pathRoot)) {
        console.warn(
          "⚠️ [EditorSidebar] Potentially invalid footer path:",
          path,
        );
      }

      updateByPath(path, value);
    } else {
      // Handle regular components with enhanced logic
      if (
        path === "content.imagePosition" &&
        selectedComponent.type === "halfTextHalfImage"
      ) {
        // Update both content.imagePosition and top-level imagePosition for consistency
        updateComponentByPath(
          selectedComponent.type,
          selectedComponent.id,
          "content.imagePosition",
          value,
        );
        updateComponentByPath(
          selectedComponent.type,
          selectedComponent.id,
          "imagePosition",
          value,
        );
      } else if (
        path === "layout.direction" &&
        selectedComponent.type === "halfTextHalfImage"
      ) {
        // Update layout.direction
        updateComponentByPath(
          selectedComponent.type,
          selectedComponent.id,
          "layout.direction",
          value,
        );
      } else {
        updateComponentByPath(
          selectedComponent.type,
          selectedComponent.id,
          path,
          value,
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Theme Selector */}
      <div className="group relative p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
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
                {t("editor_sidebar.component_theme")}
              </h4>
            </div>
            <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full shadow-sm">
              {selectedComponent.componentName}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {t("editor_sidebar.switch_visual_styles")}
          </p>
          <div className="space-y-4">
            {/* Special handling for global-header and global-footer */}
            {selectedComponent.id === "global-header" ? (
              <ThemeSelector
                componentType="header"
                currentTheme={globalHeaderVariant || "StaticHeader1"}
                onThemeChange={(newTheme) => {
                  try {
                    // Get default data for the new theme
                    const newDefaultData = createDefaultData(
                      "header",
                      newTheme,
                    );

                    // ⭐ Add variant to newDefaultData to ensure it's included
                    const newDefaultDataWithVariant = {
                      ...newDefaultData,
                      variant: newTheme,
                    };

                    // IMPORTANT: Update variant FIRST, then data
                    // This ensures the variant is saved before any other operations
                    setGlobalHeaderVariant(newTheme);

                    // Update data with variant included
                    setGlobalHeaderData(newDefaultDataWithVariant);

                    // Update globalComponentsData with BOTH variant and data
                    setGlobalComponentsData({
                      ...globalComponentsData,
                      header: newDefaultDataWithVariant,
                      globalHeaderVariant: newTheme, // ← Also save variant in globalComponentsData
                    } as any);

                    // Mark as changed
                    setHasChangesMade(true);
                  } catch (error) {
                    // Silently handle error
                  }
                }}
                className="w-full"
              />
            ) : selectedComponent.id === "global-footer" ? (
              <ThemeSelector
                componentType="footer"
                currentTheme={globalFooterVariant || "StaticFooter1"}
                onThemeChange={(newTheme) => {
                  try {
                    // Get default data for the new theme
                    const newDefaultData = createDefaultData(
                      "footer",
                      newTheme,
                    );

                    // ⭐ Add variant to newDefaultData to ensure it's included
                    const newDefaultDataWithVariant = {
                      ...newDefaultData,
                      variant: newTheme,
                    };

                    // IMPORTANT: Update variant FIRST, then data
                    setGlobalFooterVariant(newTheme);

                    // Update data with variant included
                    setGlobalFooterData(newDefaultDataWithVariant);

                    // Update globalComponentsData with BOTH variant and data
                    setGlobalComponentsData({
                      ...globalComponentsData,
                      footer: newDefaultDataWithVariant,
                      globalFooterVariant: newTheme,
                    } as any);

                    // Mark as changed
                    setHasChangesMade(true);
                  } catch (error) {
                    // Silently handle error
                  }
                }}
                className="w-full"
              />
            ) : (
              <ThemeSelector
                componentType={selectedComponent.type}
                currentTheme={selectedComponent.componentName}
                onThemeChange={(newTheme) => {
                  if (onComponentThemeChange && selectedComponent) {
                    onComponentThemeChange(selectedComponent.id, newTheme);
                  }
                }}
                className="w-full"
              />
            )}

            <div className="pt-2 border-t border-purple-200/50">
              <ResetConfirmDialog
                componentType={selectedComponent.type}
                componentName={selectedComponent.componentName}
                onConfirmReset={() => {
                  if (onComponentReset && selectedComponent) {
                    onComponentReset(selectedComponent.id);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">✏️</span>
          </div>
          <h4 className="text-lg font-bold text-slate-800">
            {t("editor_sidebar.content_settings")}
          </h4>
        </div>

        {/* تخصيص حسب نوع المكون: استخدام AdvancedSimpleSwitcher لجميع المكونات المدعومة */}
        {COMPONENTS[selectedComponent.type] ? (
          <AdvancedSimpleSwitcher
            type={selectedComponent.type}
            componentName={getComponentName()}
            componentId={selectedComponent.id}
            onUpdateByPath={handleUpdateByPath}
            currentData={tempData}
          />
        ) : (
          // المكوّنات الأخرى تستخدم البنية العامة الحالية
          <div className="space-y-6">
            {tempData.texts &&
              Object.keys(tempData.texts).map((key) => (
                <div
                  key={key}
                  className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <label className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                  {key.toLowerCase().includes("subtitle") ||
                  key.toLowerCase().includes("description") ? (
                    <textarea
                      value={tempData.texts?.[key] || ""}
                      onChange={(e) =>
                        handleInputChange("texts", key, e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 resize-none"
                      rows={3}
                      placeholder={t("editor_sidebar.enter_your_text")}
                    />
                  ) : (
                    <input
                      type="text"
                      value={tempData.texts?.[key] || ""}
                      onChange={(e) =>
                        handleInputChange("texts", key, e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700"
                      placeholder={t("editor_sidebar.enter_your_text")}
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
