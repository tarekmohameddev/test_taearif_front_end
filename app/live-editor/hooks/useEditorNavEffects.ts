import { useEffect } from "react";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { normalizeComponentSettings } from "@/services/live-editor/componentSettingsHelper";
import { DEFAULT_PAGES } from "../constants/defaultPages";

export function useEditorNavEffects(
  tenantId: string,
  isDropdownOpen: boolean,
  isPagesDropdownOpen: boolean,
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsPagesDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { fetchTenantData, tenantData, loadingTenantData } = useTenantStore();

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setIsDropdownOpen(false);
        }
      }
      if (isPagesDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".pages-dropdown-container")) {
          setIsPagesDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isPagesDropdownOpen, setIsDropdownOpen, setIsPagesDropdownOpen]);

  // تحميل tenantData
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // تحميل جميع البيانات من componentSettings أو البيانات الافتراضية
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
        "[EditorNavBar] Skipping componentSettings load - theme recently changed:",
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

  // إضافة بيانات افتراضية للصفحات المحددة إذا لم تكن موجودة في WebsiteLayout
  useEffect(() => {
    if (!tenantData) return;

    const { addPageToWebsiteLayout } = useEditorStore.getState();

    // التحقق من كل صفحة بشكل منفصل
    const existingPages = tenantData.WebsiteLayout?.metaTags?.pages || [];
    const existingPaths = existingPages.map((page: any) => page.path);

    // إضافة الصفحات المفقودة
    DEFAULT_PAGES.forEach((defaultPage) => {
      if (!existingPaths.includes(defaultPage.path)) {
        addPageToWebsiteLayout(defaultPage);
      }
    });
  }, [tenantData]);
}
