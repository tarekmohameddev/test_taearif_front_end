import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { normalizeComponentSettings } from "@/services/live-editor/componentSettingsHelper";

/**
 * Hook لتحميل componentSettings من tenantData إلى editorStore
 * Loads componentSettings from tenantData into editorStore
 */
export function useComponentSettingsLoader() {
  const { tenantData } = useTenantStore();

  useEffect(() => {
    if (!tenantData) return;

    const editorStore = useEditorStore.getState();
    const { setPageComponentsForPage } = editorStore;

    // ⭐ CRITICAL: Check if theme was recently changed
    // If themeChangeTimestamp > 0, don't overwrite store data with tenantData
    // This prevents loading old theme data after a theme change
    const themeChangeTimestamp = editorStore.themeChangeTimestamp;
    const hasRecentThemeChange = themeChangeTimestamp > 0;

    if (hasRecentThemeChange) {
      // Theme was recently changed - tenantStore was already updated by themeChangeService
      // Don't overwrite the new theme data in editorStore with potentially old tenantData
      console.log(
        "[useComponentSettingsLoader] Skipping componentSettings load - theme recently changed:",
        {
          themeChangeTimestamp,
          storePages: Object.keys(editorStore.pageComponentsByPage).length,
        },
      );
      return;
    }

    // التحقق من وجود componentSettings وأنها ليست فارغة
    const hasComponentSettings =
      tenantData.componentSettings &&
      typeof tenantData.componentSettings === "object" &&
      !Array.isArray(tenantData.componentSettings) &&
      Object.keys(tenantData.componentSettings).length > 0;

    if (hasComponentSettings) {
      // تحميل جميع الصفحات من componentSettings
      Object.entries(tenantData.componentSettings).forEach(
        ([pageSlug, pageData]: [string, any]) => {
          // ⭐ IMPROVED: Check if store already has data for this page
          // If store has data, don't overwrite it with tenantData
          // This prevents loading old data after save
          const storePageComponents =
            editorStore.pageComponentsByPage[pageSlug];
          if (storePageComponents && storePageComponents.length > 0) {
            // Always prioritize store data if it exists (it has recent changes)
            return; // Skip this page - store data takes priority
          }

          const normalizedSettings = normalizeComponentSettings(pageData);
          const components = Object.entries(normalizedSettings).map(
            ([id, component]: [string, any]) => ({
              id,
              type: component.type,
              name: component.name,
              componentName: component.componentName,
              data: component.data || {},
              position: component.position || 0,
              layout: component.layout || { row: 0, col: 0, span: 2 },
            }),
          );

          // تحديث كل صفحة في الـ store
          setPageComponentsForPage(pageSlug, components);
        },
      );
    } else {
      // تحميل البيانات الافتراضية من PAGE_DEFINITIONS
      // ⭐ Only load defaults if store doesn't already have data (from theme change)
      const {
        PAGE_DEFINITIONS,
      } = require("@/lib/defaultComponents");

      Object.entries(PAGE_DEFINITIONS).forEach(
        ([pageSlug, pageData]: [string, any]) => {
          // Check if store already has data for this page
          const storePageComponents =
            editorStore.pageComponentsByPage[pageSlug];
          if (storePageComponents && storePageComponents.length > 0) {
            // Store already has data - skip loading defaults
            return;
          }

          const components = Object.entries(pageData).map(
            ([id, component]: [string, any]) => ({
              id,
              type: component.type,
              name: component.name,
              componentName: component.componentName,
              data: component.data || {},
              position: component.position || 0,
              layout: component.layout || { row: 0, col: 0, span: 2 },
            }),
          );

          // تحديث كل صفحة في الـ store
          setPageComponentsForPage(pageSlug, components);
        },
      );
    }
  }, [tenantData]);
}
