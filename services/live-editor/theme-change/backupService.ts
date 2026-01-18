/**
 * ============================================================================
 * Backup Service
 * ============================================================================
 *
 * هذا الملف يحتوي على خدمات النسخ الاحتياطي للثيمات.
 * This file contains backup services for themes.
 *
 * المسؤوليات:
 * - نسخ إعدادات المكونات الحالية قبل تغيير الثيم
 * - نسخ الصفحات الثابتة
 * - حفظ النسخ الاحتياطي في Store
 *
 * Responsibilities:
 * - Backup current component settings before theme change
 * - Backup static pages
 * - Save backup in Store
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { createBackupKey } from "./themeDataLoader";
import type { BackupResult } from "./types";

/**
 * نسخ إعدادات المكونات الحالية
 * Backup current component settings
 *
 * تقوم هذه الدالة بإنشاء نسخة احتياطية كاملة من إعدادات المكونات الحالية
 * قبل تغيير الثيم. تحافظ على التنسيق الأصلي (Array أو Object).
 *
 * This function creates a complete backup of current component settings
 * before changing the theme. Preserves original format (Array or Object).
 *
 * @returns كائن يحتوي على بيانات النسخ الاحتياطي ومفتاحه
 *          Object containing backup data and its key
 *
 * @example
 * ```typescript
 * const { backup, backupKey } = backupCurrentComponentSettings();
 * if (backupKey) {
 *   store.setThemeBackup(backupKey, backup);
 * }
 * ```
 */
export function backupCurrentComponentSettings(): BackupResult {
  // الحصول على حالة Editor Store
  // Get Editor Store state
  const store = useEditorStore.getState();
  const currentTheme = store.WebsiteLayout?.currentTheme;

  // إذا لم يكن هناك ثيم حالي، أرجع نسخة احتياطية فارغة
  // If no current theme, return empty backup
  if (!currentTheme) {
    return { backup: {}, backupKey: null };
  }

  // إنشاء مفتاح النسخ الاحتياطي
  // Create backup key
  const backupKey = createBackupKey(currentTheme);
  if (!backupKey) {
    return { backup: {}, backupKey: null };
  }

  // إنشاء كائن النسخ الاحتياطي
  // Create backup object
  const backup: Record<string, any> = {};

  // الحصول على التنسيق الأصلي من tenantData للحفاظ على تنسيق Array/Object
  // Get original format from tenantData to preserve Array/Object format
  const tenantStore = useTenantStore.getState();
  const originalComponentSettings =
    tenantStore.tenantData?.componentSettings || {};

  // نسخ جميع الصفحات من pageComponentsByPage
  // Backup all pages from pageComponentsByPage
  Object.entries(store.pageComponentsByPage).forEach(([page, components]) => {
    if (components && components.length > 0) {
      // التحقق من التنسيق الأصلي (Array أو Object)
      // Check original format (Array or Object)
      const originalFormat = originalComponentSettings[page];
      const isOriginalArray = Array.isArray(originalFormat);

      if (isOriginalArray) {
        // الحفاظ على تنسيق Array
        // Preserve Array format
        backup[page] = components.map((comp: any) => ({
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
          backup[page] = pageSettings;
        }
      }
    }
  });

  // نسخ بيانات المكونات العامة (globalComponentsData)
  // ⭐ CRITICAL: التأكد من أن variant موجود داخل بيانات header و footer
  // Backup global components data
  // ⭐ CRITICAL: Ensure variant is inside header and footer data
  const headerVariant = store.globalHeaderVariant || "header1";
  const footerVariant = store.globalFooterVariant || "footer1";

  if (
    store.globalComponentsData ||
    store.globalHeaderData ||
    store.globalFooterData
  ) {
    backup._globalComponentsData = {
      header: {
        ...(store.globalHeaderData || {}),
        variant: headerVariant, // ⭐ CRITICAL: Ensure variant is inside header data
      },
      footer: {
        ...(store.globalFooterData || {}),
        variant: footerVariant, // ⭐ CRITICAL: Ensure variant is inside footer data
      },
      globalHeaderVariant: headerVariant,
      globalFooterVariant: footerVariant,
    };
  }

  // نسخ بيانات الصفحات الثابتة
  // Backup static pages data
  if (store.staticPagesData && Object.keys(store.staticPagesData).length > 0) {
    backup._staticPagesData = { ...store.staticPagesData };
  }

  return { backup, backupKey };
}

/**
 * نسخ الصفحات الثابتة فقط
 * Backup static pages only
 *
 * تقوم هذه الدالة بإنشاء نسخة احتياطية من الصفحات الثابتة فقط.
 *
 * This function creates a backup of static pages only.
 *
 * @returns بيانات الصفحات الثابتة أو كائن فارغ
 *          Static pages data or empty object
 *
 * @example
 * ```typescript
 * const staticPagesBackup = backupStaticPages();
 * ```
 */
export function backupStaticPages(): Record<string, any> {
  const store = useEditorStore.getState();

  // التحقق من وجود بيانات الصفحات الثابتة
  // Check if static pages data exists
  if (store.staticPagesData && Object.keys(store.staticPagesData).length > 0) {
    // إرجاع نسخة من البيانات
    // Return copy of data
    return { ...store.staticPagesData };
  }

  // إرجاع كائن فارغ إذا لم تكن هناك بيانات
  // Return empty object if no data
  return {};
}

/**
 * حفظ النسخ الاحتياطي في Store
 * Save backup in Store
 *
 * تقوم هذه الدالة بحفظ النسخ الاحتياطي في Editor Store
 * وفي WebsiteLayout للاستمرارية.
 *
 * This function saves the backup in Editor Store
 * and in WebsiteLayout for persistence.
 *
 * @param backupKey - مفتاح النسخ الاحتياطي
 *                   Backup key
 *
 * @param backup - بيانات النسخ الاحتياطي
 *                Backup data
 *
 * @example
 * ```typescript
 * const { backup, backupKey } = backupCurrentComponentSettings();
 * if (backupKey) {
 *   saveBackupInStore(backupKey, backup);
 * }
 * ```
 */
export function saveBackupInStore(
  backupKey: string,
  backup: Record<string, any>,
): void {
  const store = useEditorStore.getState();

  // حفظ في themeBackup (temporary reference)
  // Save in themeBackup (temporary reference)
  store.setThemeBackup(backupKey, backup);

  // حفظ في ThemesBackup field (NEW: separate field for persistence)
  // Save in ThemesBackup field (NEW: separate field for persistence)
  const updatedBackups = {
    ...store.ThemesBackup,
    [backupKey]: backup,
  };
  store.setThemesBackup(updatedBackups);
}
