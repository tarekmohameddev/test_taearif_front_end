"use client";
import React, { useState, useEffect } from "react";
import { AdvancedSimpleSwitcherProps } from "../types";
import { DynamicFieldsRenderer } from "./DynamicFieldsRenderer";
import { COMPONENTS } from "@/lib/ComponentsList";
import { useEditorStore } from "@/context/editorStore";
import { useEditorT } from "@/context/editorI18nStore";
import { translateComponentStructure } from "@/componentsStructure";

export function AdvancedSimpleSwitcher({
  type,
  componentName,
  componentId,
  onUpdateByPath,
  currentData,
}: AdvancedSimpleSwitcherProps) {
  const t = useEditorT();
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [structure, setStructure] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    tempData,
    updateByPath,
    globalHeaderData,
    globalFooterData,
    updateGlobalHeaderByPath,
    updateGlobalFooterByPath,
    updateGlobalComponentByPath,
    selectedComponent,
  } = useEditorStore();

  // دالة للتعامل مع تحديث البيانات حسب نوع المكون
  const handleUpdateByPath = (path: string, value: any) => {
    // Debug: Log all footer updates
    if (type === "footer") {
      console.log("🔍 [AdvancedSimpleSwitcher] Footer Update:", {
        type,
        componentName,
        path,
        value,
        selectedComponentId: selectedComponent?.id,
      });
    }

    // Note: CustomBranding updates are now handled during save (in handleGlobalComponentSave)
    // Changes are saved to tempData only, and transferred to CustomBranding on save button click

    if (onUpdateByPath) {
      // Use the unified update function (which updates tempData)
      onUpdateByPath(path, value);
    } else {
      // For all components (including global), use updateByPath to update tempData
      // This ensures changes are saved to tempData first, then transferred on save
      updateByPath(path, value);
    }
  };

  // دالة محسنة لتحميل structure
  const loadStructure = async (componentType: string) => {
    try {
      setLoading(true);
      setError(null);

      // التحقق من وجود المكون في ComponentsList
      const component = COMPONENTS[componentType];
      if (!component) {
        throw new Error(
          `Component type "${componentType}" not found in ComponentsList`,
        );
      }

      let loadedStructure = null;

      // تحميل structure ديناميكياً مع معالجة أفضل للأخطاء
      try {
        const structureModule = await import(
          `@/componentsStructure/${componentType}`
        );
        const structureName = `${componentType}Structure`;
        loadedStructure = structureModule[structureName];

        if (!loadedStructure) {
          throw new Error(
            `Structure "${structureName}" not found in ${componentType} module`,
          );
        }
      } catch (importErr) {
        console.warn(
          `Failed to load structure for ${componentType}, trying fallback:`,
          importErr,
        );

        // محاولة تحميل fallback structure
        try {
          const fallbackModule = await import(`@/componentsStructure/header`);
          loadedStructure = fallbackModule.headerStructure;
          console.log(`Using fallback header structure for ${componentType}`);
        } catch (fallbackErr) {
          throw new Error(
            `Failed to load both primary and fallback structures: ${fallbackErr}`,
          );
        }
      }

      // التحقق من صحة الـ structure
      if (
        !loadedStructure ||
        !loadedStructure.variants ||
        !Array.isArray(loadedStructure.variants)
      ) {
        throw new Error(`Invalid structure format for ${componentType}`);
      }

      // ترجمة الـ structure
      const translatedStructure = translateComponentStructure(
        loadedStructure,
        t,
      );

      // البحث عن الـ variant المناسب
      const targetVariant =
        translatedStructure.variants.find((v: any) => v.id === componentName) ||
        translatedStructure.variants[0];

      if (!targetVariant) {
        throw new Error(
          `No suitable variant found for ${componentName} in ${componentType}`,
        );
      }

      setStructure({
        ...translatedStructure,
        currentVariant: targetVariant,
      });
    } catch (err) {
      console.error(`Error loading structure for ${componentType}:`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setStructure(null);
    } finally {
      setLoading(false);
    }
  };

  // تحميل structure عند تغيير type
  useEffect(() => {
    if (type) {
      loadStructure(type);
    }
  }, [type]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white text-sm">⏳</span>
          </div>
          <div>
            <h4 className="font-bold text-blue-800">
              {t("editor_sidebar.loading_structure")}
            </h4>
            <p className="text-sm text-blue-600">
              {t("editor_sidebar.loading_component_structure")} {type}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with enhanced error handling
  if (error || !structure) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">❌</span>
          </div>
          <div>
            <h4 className="font-bold text-red-800">
              {t("editor_sidebar.structure_loading_error")}
            </h4>
            <p className="text-sm text-red-600">
              {error || t("editor_sidebar.failed_to_load_structure")}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-red-700">
            Component type:{" "}
            <span className="font-mono bg-red-100 px-2 py-1 rounded">
              {type}
            </span>
          </p>
          <p className="text-sm text-red-700">
            Component name:{" "}
            <span className="font-mono bg-red-100 px-2 py-1 rounded">
              {componentName}
            </span>
          </p>
          <p className="text-sm text-red-700">
            Component ID:{" "}
            <span className="font-mono bg-red-100 px-2 py-1 rounded">
              {componentId}
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => loadStructure(type)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t("editor_sidebar.retry_loading_structure")}
          </button>

          <button
            onClick={() => {
              // Try to load a fallback structure
              setError(null);
              setLoading(true);
              setTimeout(() => {
                try {
                  const fallbackModule = require(
                    `@/componentsStructure/header`,
                  );
                  setStructure(fallbackModule.headerStructure);
                  setLoading(false);
                } catch (fallbackErr) {
                  setError("Failed to load fallback structure");
                  setLoading(false);
                }
              }, 100);
            }}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t("editor_sidebar.use_fallback_structure")}
          </button>
        </div>
      </div>
    );
  }

  // البحث عن variant - تحسين منطق البحث
  const variant = structure.variants?.find((v: any) => {
    // البحث المباشر أولاً (الأهم)
    if (v.id === componentName) {
      return true;
    }

    // البحث case-insensitive
    if (v.id?.toLowerCase() === componentName?.toLowerCase()) {
      return true;
    }

    return false;
  });

  // استخدام أول variant متاح كـ fallback إذا لم يتم العثور على variant مطابق
  const activeVariant = variant || structure.variants?.[0];

  if (!activeVariant) {
    // إذا لم يوجد أي variant متاح
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">⚠️</span>
          </div>
          <div>
            <h4 className="font-bold text-red-800">
              {t("editor_sidebar.no_variants_available")}
            </h4>
            <p className="text-sm text-red-600">
              {t("editor_sidebar.no_variants_found")}
            </p>
          </div>
        </div>
        <p className="text-sm text-red-700">
          Component type:{" "}
          <span className="font-mono bg-red-100 px-2 py-1 rounded">{type}</span>
        </p>
      </div>
    );
  }

  // تحذير إذا تم استخدام fallback
  if (!variant && structure.variants?.[0]) {
    console.warn(
      `⚠️ Variant "${componentName}" not found for ${type}, using fallback: ${activeVariant.id}`,
    );
  }

  const variantAny = activeVariant as any;
  const fields =
    mode === "simple" && variantAny.simpleFields?.length
      ? variantAny.simpleFields
      : activeVariant.fields;

  return (
    <div className="space-y-6">
      {/* Warning Banner - Show only when using fallback */}
      {!variant && structure.variants?.[0] && (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-yellow-800">
              {t("editor_sidebar.using_fallback_variant")}{" "}
              <span className="font-mono bg-yellow-100 px-1 rounded">
                {activeVariant.id}
              </span>{" "}
              {t("editor_sidebar.for")} {componentName}
            </span>
          </div>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="flex bg-slate-100 rounded-2xl p-2 shadow-inner">
          <button
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === "simple"
                ? "bg-white text-blue-600 shadow-lg transform scale-105 border-2 border-blue-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setMode("simple")}
            type="button"
          >
            {t("editor_sidebar.simple")}
          </button>
          <button
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              mode === "advanced"
                ? "bg-white text-purple-600 shadow-lg transform scale-105 border-2 border-purple-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setMode("advanced")}
            type="button"
          >
            {t("editor_sidebar.advanced")}
          </button>
        </div>
      </div>

      {/* Component Info */}
      {/* مخفية فقط , ممكن استخدامها في المستقبل */}
      {/* <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-semibold text-green-800">{t("editor_sidebar.component")}:</span>
          <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">
            {type}
          </span>
          <span className="font-semibold text-green-800">{t("editor_sidebar.variant")}:</span>
          <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">
            {activeVariant.id}
          </span>
          <span className="font-semibold text-green-800">{t("editor_sidebar.id")}:</span>
          <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">
            {componentName}
          </span>
        </div>
      </div> */}

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
          <p>
            <strong>{t("editor_sidebar.debug_info")}:</strong>
          </p>
          <p>
            {t("editor_sidebar.type")}: {type}
          </p>
          <p>
            {t("editor_sidebar.component")} Name: {componentName}
          </p>
          <p>
            Active {t("editor_sidebar.variant")}: {activeVariant?.id}
          </p>
          <p>
            {t("editor_sidebar.fields_count")}: {fields?.length || 0}
          </p>
          <p>
            {t("editor_sidebar.mode")}: {mode}
          </p>
        </div>
      )}
      <DynamicFieldsRenderer
        fields={fields}
        componentType={type}
        variantId={(() => {
          // Handle global components
          if (type === "header" && componentName === "header1") {
            return "global-header";
          }
          if (type === "footer" && componentName === "footer1") {
            return "global-footer";
          }
          // Use componentId as the unique identifier for all components
          // This ensures each component instance is uniquely identified
          return componentId || componentName;
        })()}
        onUpdateByPath={handleUpdateByPath}
        currentData={currentData}
      />
    </div>
  );
}
