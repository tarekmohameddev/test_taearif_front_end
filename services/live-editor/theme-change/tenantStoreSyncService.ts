/**
 * ============================================================================
 * Tenant Store Sync Service
 * ============================================================================
 *
 * هذا الملف يحتوي على خدمات مزامنة Tenant Store مع Editor Store.
 * This file contains services for syncing Tenant Store with Editor Store.
 *
 * المسؤوليات:
 * - مزامنة Tenant Store مع Editor Store بعد تغيير الثيم
 * - تحويل pageComponents إلى componentSettings
 * - تحديث بيانات المكونات العامة في Tenant Store
 *
 * Responsibilities:
 * - Sync Tenant Store with Editor Store after theme change
 * - Convert pageComponents to componentSettings
 * - Update global components data in Tenant Store
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import type { ThemeData } from "./types";

/**
 * تحويل pageComponents إلى componentSettings
 * Convert pageComponents to componentSettings
 *
 * تقوم هذه الدالة بتحويل pageComponents من Editor Store
 * إلى تنسيق componentSettings لـ Tenant Store.
 * تحافظ على التنسيق الأصلي (Array أو Object).
 *
 * This function converts pageComponents from Editor Store
 * to componentSettings format for Tenant Store.
 * Preserves original format (Array or Object).
 *
 * @param pageComponentsByPage - مكونات الصفحات من Editor Store
 *                              Page components from Editor Store
 *
 * @param originalComponentSettings - إعدادات المكونات الأصلية من Tenant Store
 *                                  Original component settings from Tenant Store
 *
 * @param themePagesData - بيانات صفحات الثيم (للتنسيق)
 *                       Theme pages data (for format)
 *
 * @returns componentSettings محولة
 *          Converted componentSettings
 *
 * @example
 * ```typescript
 * const componentSettings = convertPageComponentsToComponentSettings(
 *   store.pageComponentsByPage,
 *   tenantData.componentSettings,
 *   themeData.pages
 * );
 * ```
 */
export function convertPageComponentsToComponentSettings(
  pageComponentsByPage: Record<string, any[]>,
  originalComponentSettings: Record<string, any>,
  themePagesData: Record<string, any>,
): Record<string, any> {
  const updatedComponentSettings: Record<string, any> = {};

  Object.entries(pageComponentsByPage).forEach(([page, components]) => {
    if (components && components.length > 0) {
      // التحقق من تنسيق الثيم أو التنسيق الأصلي (Array)
      // Check if theme format or original format was Array
      const themeFormat = themePagesData[page];
      const originalFormat = originalComponentSettings[page];
      const isArrayFormat =
        Array.isArray(themeFormat) || Array.isArray(originalFormat);

      if (isArrayFormat) {
        // الحفاظ على تنسيق Array
        // Preserve Array format
        updatedComponentSettings[page] = components.map((comp: any) => ({
          id: comp.id,
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position ?? 0,
          layout: comp.layout || { row: 0, col: 0, span: 2 },
        }));
      } else {
        // استخدام تنسيق Object (key-value pairs)
        // Use Object format (key-value pairs)
        const pageSettings: Record<string, any> = {};
        components.forEach((comp) => {
          if (comp.id) {
            pageSettings[comp.id] = {
              type: comp.type,
              name: comp.name,
              componentName: comp.componentName,
              data: comp.data || {},
              position: comp.position ?? 0,
              layout: comp.layout || { row: 0, col: 0, span: 2 },
            };
          }
        });
        if (Object.keys(pageSettings).length > 0) {
          updatedComponentSettings[page] = pageSettings;
        }
      }
    }
  });

  return updatedComponentSettings;
}

/**
 * تحديث بيانات المكونات العامة في Tenant Store
 * Update global components data in Tenant Store
 *
 * تقوم هذه الدالة بتحديث بيانات المكونات العامة (Header و Footer)
 * في Tenant Store من Editor Store.
 *
 * This function updates global components data (Header and Footer)
 * in Tenant Store from Editor Store.
 *
 * @returns بيانات المكونات العامة المحدثة
 *          Updated global components data
 *
 * @example
 * ```typescript
 * const globalComponentsData = updateTenantGlobalComponentsData();
 * ```
 */
export function updateTenantGlobalComponentsData(): any {
  const store = useEditorStore.getState();

  return {
    ...store.globalComponentsData,
    header: {
      ...(store.globalHeaderData || {}),
      variant: store.globalHeaderVariant || "StaticHeader1",
    },
    footer: {
      ...(store.globalFooterData || {}),
      variant: store.globalFooterVariant || "StaticFooter1",
    },
    globalHeaderVariant: store.globalHeaderVariant || "StaticHeader1",
    globalFooterVariant: store.globalFooterVariant || "StaticFooter1",
  };
}

/**
 * مزامنة Tenant Store مع Editor Store
 * Sync Tenant Store with Editor Store
 *
 * تقوم هذه الدالة بمزامنة Tenant Store مع Editor Store
 * بعد تغيير الثيم. تضمن أن tenantData.componentSettings
 * يطابق pageComponentsByPage وأن tenantData.globalComponentsData
 * يطابق globalComponentsData.
 *
 * This function syncs Tenant Store with Editor Store
 * after theme change. Ensures that tenantData.componentSettings
 * matches pageComponentsByPage and tenantData.globalComponentsData
 * matches globalComponentsData.
 *
 * @param themeData - بيانات الثيم (للتنسيق)
 *                  Theme data (for format)
 *
 * @example
 * ```typescript
 * syncTenantStoreWithEditorStore(themeData);
 * ```
 */
export function syncTenantStoreWithEditorStore(themeData?: ThemeData): void {
  const store = useEditorStore.getState();
  const tenantStore = useTenantStore.getState();
  const currentTenantData = tenantStore.tenantData;

  if (!currentTenantData) {
    return;
  }

  // تحويل pageComponentsByPage إلى تنسيق componentSettings
  // Preserve original format (Array or Object) from themeData or tenantData
  // Convert pageComponentsByPage to componentSettings format
  const originalComponentSettings = currentTenantData.componentSettings || {};
  const themePagesData = themeData?.componentSettings || themeData?.pages || {};

  const updatedComponentSettings = convertPageComponentsToComponentSettings(
    store.pageComponentsByPage,
    originalComponentSettings,
    themePagesData,
  );

  // تحديث بيانات المكونات العامة في Tenant Store
  // Update global components data in Tenant Store
  const updatedGlobalComponentsData = updateTenantGlobalComponentsData();

  // تحديث staticPagesData في Tenant Store
  // Update staticPagesData in Tenant Store
  const updatedStaticPagesData = store.staticPagesData || {};

  // ⭐ CRITICAL: تحديث StaticPages في Tenant Store من staticPagesData
  // Convert staticPagesData format to StaticPages format [slug, components, apiEndpoints]
  // Update StaticPages in Tenant Store from staticPagesData
  const updatedStaticPages: Record<string, any> = {};
  Object.entries(updatedStaticPagesData).forEach(([slug, pageData]: [string, any]) => {
    if (pageData && typeof pageData === "object") {
      // Convert to Array format: [slug, components, apiEndpoints]
      updatedStaticPages[slug] = [
        pageData.slug || slug,
        Array.isArray(pageData.components) ? pageData.components : [],
        pageData.apiEndpoints || {},
      ];
    }
  });

  // تحديث Tenant Store بالبيانات الجديدة
  // Update Tenant Store with new data
  useTenantStore.setState({
    tenantData: {
      ...currentTenantData,
      componentSettings: updatedComponentSettings,
      globalComponentsData: updatedGlobalComponentsData,
      staticPagesData: updatedStaticPagesData,
      StaticPages: updatedStaticPages, // ⭐ CRITICAL: Update StaticPages format
      WebsiteLayout: store.WebsiteLayout,
    },
  });

  console.log("[syncTenantStoreWithEditorStore] Updated tenantStore:", {
    componentSettingsPages: Object.keys(updatedComponentSettings).length,
    hasGlobalComponentsData: !!updatedGlobalComponentsData,
    hasStaticPagesData: Object.keys(updatedStaticPagesData).length > 0,
    hasStaticPages: Object.keys(updatedStaticPages).length > 0,
    staticPagesSlugs: Object.keys(updatedStaticPages),
  });
}

/**
 * مزامنة Tenant Store من النسخ الاحتياطي
 * Sync Tenant Store from backup
 *
 * تقوم هذه الدالة بمزامنة Tenant Store من النسخ الاحتياطي
 * بعد استعادة الثيم.
 *
 * This function syncs Tenant Store from backup
 * after restoring theme.
 *
 * @param backup - بيانات النسخ الاحتياطي
 *               Backup data
 *
 * @example
 * ```typescript
 * syncTenantStoreFromBackup(backup);
 * ```
 */
export function syncTenantStoreFromBackup(backup: Record<string, any>): void {
  const store = useEditorStore.getState();
  const tenantStore = useTenantStore.getState();
  const currentTenantData = tenantStore.tenantData;

  if (!currentTenantData) {
    return;
  }

  // تحويل pageComponentsByPage إلى تنسيق componentSettings
  // Preserve original format (Array or Object) from backup
  // Convert pageComponentsByPage to componentSettings format
  const updatedComponentSettings: Record<string, any> = {};

  Object.entries(store.pageComponentsByPage).forEach(([page, components]) => {
    if (components && components.length > 0) {
      // التحقق من تنسيق النسخ الاحتياطي (Array أو Object)
      // Check if backup format was Array or Object
      const backupFormat = backup[page];
      const isBackupArray = Array.isArray(backupFormat);

      if (isBackupArray) {
        // الحفاظ على تنسيق Array من النسخ الاحتياطي
        // Preserve Array format from backup
        updatedComponentSettings[page] = components.map((comp: any) => ({
          id: comp.id,
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position ?? 0,
          layout: comp.layout || { row: 0, col: 0, span: 2 },
        }));
      } else {
        // استخدام تنسيق Object (key-value pairs)
        // Use Object format (key-value pairs)
        const pageSettings: Record<string, any> = {};
        components.forEach((comp: any) => {
          if (comp.id) {
            pageSettings[comp.id] = {
              type: comp.type,
              name: comp.name,
              componentName: comp.componentName,
              data: comp.data || {},
              position: comp.position ?? 0,
              layout: comp.layout || { row: 0, col: 0, span: 2 },
            };
          }
        });
        if (Object.keys(pageSettings).length > 0) {
          updatedComponentSettings[page] = pageSettings;
        }
      }
    }
  });

  // تحديث بيانات المكونات العامة في Tenant Store من النسخ الاحتياطي المستعاد
  // Update global components data in Tenant Store from restored backup
  const updatedGlobalComponentsData = updateTenantGlobalComponentsData();

  // تحديث staticPagesData في Tenant Store من النسخ الاحتياطي المستعاد
  // Update staticPagesData in Tenant Store from restored backup
  const updatedStaticPagesData = store.staticPagesData || {};

  // ⭐ CRITICAL: تحديث StaticPages في Tenant Store من staticPagesData
  // Convert staticPagesData format to StaticPages format [slug, components, apiEndpoints]
  // Update StaticPages in Tenant Store from staticPagesData
  const updatedStaticPages: Record<string, any> = {};
  Object.entries(updatedStaticPagesData).forEach(([slug, pageData]: [string, any]) => {
    if (pageData && typeof pageData === "object") {
      // Convert to Array format: [slug, components, apiEndpoints]
      updatedStaticPages[slug] = [
        pageData.slug || slug,
        Array.isArray(pageData.components) ? pageData.components : [],
        pageData.apiEndpoints || {},
      ];
    }
  });

  // تحديث Tenant Store بالبيانات المستعادة
  // Update Tenant Store with restored data
  useTenantStore.setState({
    tenantData: {
      ...currentTenantData,
      componentSettings: updatedComponentSettings,
      globalComponentsData: updatedGlobalComponentsData,
      staticPagesData: updatedStaticPagesData,
      StaticPages: updatedStaticPages, // ⭐ CRITICAL: Update StaticPages format
      WebsiteLayout: store.WebsiteLayout,
    },
  });

  console.log("[syncTenantStoreFromBackup] Updated tenantStore:", {
    componentSettingsPages: Object.keys(updatedComponentSettings).length,
    hasGlobalComponentsData: !!updatedGlobalComponentsData,
    hasStaticPagesData: Object.keys(updatedStaticPagesData).length > 0,
    hasStaticPages: Object.keys(updatedStaticPages).length > 0,
    staticPagesSlugs: Object.keys(updatedStaticPages),
  });
}
