/**
 * ============================================================================
 * Theme Restore Service
 * ============================================================================
 *
 * هذا الملف يحتوي على خدمات استعادة الثيم من النسخ الاحتياطي.
 * This file contains services for restoring theme from backup.
 *
 * المسؤوليات:
 * - استعادة الثيم من النسخ الاحتياطي
 * - استخراج رقم الثيم من مفتاح النسخ الاحتياطي
 * - استعادة جميع الصفحات والمكونات من النسخ الاحتياطي
 *
 * Responsibilities:
 * - Restore theme from backup
 * - Extract theme number from backup key
 * - Restore all pages and components from backup
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context-liveeditor/editorStore";
import {
  extractThemeNumberFromBackupKey,
  loadThemeData,
} from "./themeDataLoader";
import { restoreStaticPagesFromBackup } from "./staticPagesService";
import { restoreGlobalComponents } from "./globalComponentsService";
import { restorePageComponentsFromBackup } from "./pageComponentsService";
import { syncTenantStoreFromBackup } from "./tenantStoreSyncService";
import { normalizeComponentId } from "./utils";
import { applyStaticPagesFromTheme } from "./staticPagesService";
import type { ThemeNumber } from "./types";

/**
 * تسجيل بيانات الصفحات الثابتة قبل وبعد الاستعادة
 * Log static pages data before and after restore
 *
 * تقوم هذه الدالة بتسجيل بيانات الصفحات الثابتة قبل وبعد الاستعادة
 * مع مقارنة للتغييرات.
 *
 * This function logs static pages data before and after restore
 * with comparison of changes.
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @param backup - بيانات النسخ الاحتياطي
 *               Backup data
 *
 * @param backupKey - مفتاح النسخ الاحتياطي
 *                   Backup key
 *
 * @example
 * ```typescript
 * logStaticPagesRestore(store, backup, "Theme1Backup");
 * ```
 */
function logStaticPagesRestore(
  store: ReturnType<typeof useEditorStore.getState>,
  backup: Record<string, any>,
  backupKey: string,
): void {
  // ⭐ LOGGING: عرض بيانات الصفحات الثابتة قبل الاستعادة
  // ⭐ LOGGING: Show static pages data BEFORE restore
  console.group(`🔄 [Theme Restore] Static Pages - BEFORE (${backupKey})`);
  const staticPagesBackupData = backup._staticPagesData || {};
  const staticPagesBeforeRestore: Record<string, any> = {};
  Object.keys(staticPagesBackupData).forEach((slug) => {
    const pageData = staticPagesBackupData[slug];
    staticPagesBeforeRestore[slug] = pageData
      ? {
          slug: pageData.slug || slug,
          componentCount: pageData.components?.length || 0,
          components:
            pageData.components?.map((c: any) => ({
              id: c.id,
              componentName: c.componentName,
              type: c.type,
            })) || [],
        }
      : null;
  });
  console.log("Static Pages Data Before Restore:", staticPagesBeforeRestore);
  console.log(
    "Has Static Pages in Backup:",
    Object.keys(staticPagesBackupData).length > 0,
  );
  console.groupEnd();

  // استعادة الصفحات الثابتة من النسخ الاحتياطي
  // Restore static pages from backup
  restoreStaticPagesFromBackup(backup);

  // ⭐ CRITICAL: إذا لم تكن هناك صفحات ثابتة في النسخ الاحتياطي، تحميل من بيانات الثيم
  // This handles the case where backup was created before static pages were added
  // ⭐ CRITICAL: If no static pages in backup, load from theme data
  if (
    !staticPagesBackupData ||
    Object.keys(staticPagesBackupData).length === 0
  ) {
    const restoredThemeNumber = extractThemeNumberFromBackupKey(backupKey);
    console.log(
      `[restoreThemeFromBackup] No static pages in backup, loading from theme data for Theme ${restoredThemeNumber}`,
    );
    if (restoredThemeNumber) {
      const themeData = loadThemeData(restoredThemeNumber as ThemeNumber);
      if (themeData.staticPages) {
        console.log(
          `[restoreThemeFromBackup] Applying static pages from theme data:`,
          Object.keys(themeData.staticPages),
        );
        applyStaticPagesFromTheme(themeData);
      }
    }
  }

  // ⭐ LOGGING: عرض بيانات الصفحات الثابتة بعد الاستعادة
  // ⭐ LOGGING: Show static pages data AFTER restore
  console.group(`🔄 [Theme Restore] Static Pages - AFTER (${backupKey})`);
  const staticPagesAfterRestore: Record<string, any> = {};
  // الحصول على جميع الصفحات الثابتة من store
  // (قد تتضمن صفحات من بيانات الثيم إذا كان النسخ الاحتياطي فارغاً)
  // Get all static pages from store
  // (may include pages from theme data if backup was empty)
  const allStaticPagesInStore = store.staticPagesData;
  Object.keys(allStaticPagesInStore).forEach((slug) => {
    const afterData = store.getStaticPageData(slug);
    staticPagesAfterRestore[slug] = afterData
      ? {
          slug: afterData.slug,
          componentCount: afterData.components?.length || 0,
          components:
            afterData.components?.map((c: any) => ({
              id: c.id,
              componentName: c.componentName,
              type: c.type,
              forceUpdate: c.forceUpdate,
            })) || [],
        }
      : null;
  });
  console.log("Static Pages Data After Restore:", staticPagesAfterRestore);

  // عرض المقارنة (فقط إذا كانت هناك بيانات قبل)
  // Show comparison (only if we had data before)
  if (Object.keys(staticPagesBackupData).length > 0) {
    console.log("📊 Comparison:");
    Object.keys(staticPagesBackupData).forEach((slug) => {
      const before = staticPagesBeforeRestore[slug];
      const after = staticPagesAfterRestore[slug];
      if (before && after) {
        const beforeComponentName = before.components?.[0]?.componentName;
        const afterComponentName = after.components?.[0]?.componentName;
        const changed = beforeComponentName !== afterComponentName;
        console.log(`  ${slug}:`, {
          before: beforeComponentName,
          after: afterComponentName,
          changed: changed ? "✅ YES" : "❌ NO",
        });
      }
    });
  } else {
    console.log(
      "📊 No backup data to compare - static pages loaded from theme data",
    );
  }
  console.groupEnd();
}

/**
 * إجبار تحديث الصفحة الحالية بعد الاستعادة
 * Force update current page after restore
 *
 * تقوم هذه الدالة بإجبار تحديث الصفحة الحالية بعد استعادة الثيم.
 * تتعامل مع الصفحات الثابتة والصفحات العادية.
 *
 * This function forces update of current page after restoring theme.
 * Handles static pages and regular pages.
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @param backup - بيانات النسخ الاحتياطي
 *               Backup data
 *
 * @example
 * ```typescript
 * forceUpdateCurrentPageAfterRestore(store, backup);
 * ```
 */
function forceUpdateCurrentPageAfterRestore(
  store: ReturnType<typeof useEditorStore.getState>,
  backup: Record<string, any>,
): void {
  // ⭐ CRITICAL: إضافة تأخير صغير لضمان انتشار تحديثات store
  // ثم إجبار تحديث إضافي لضمان المزامنة
  // ⭐ CRITICAL: Add a small delay to ensure store updates are propagated
  // Then force one more update to guarantee sync
  setTimeout(() => {
    const finalStore = useEditorStore.getState();
    const finalCurrentPage = finalStore.currentPage;

    if (finalCurrentPage) {
      // ⭐ CRITICAL: للصفحات الثابتة، قراءة من staticPagesData أولاً
      // ⭐ CRITICAL: For static pages, read from staticPagesData first
      const staticPageData = finalStore.getStaticPageData(finalCurrentPage);
      let finalComponents: any[] = [];

      if (
        staticPageData &&
        staticPageData.components &&
        staticPageData.components.length > 0
      ) {
        // تحويل مكونات الصفحة الثابتة إلى تنسيق pageComponents
        // Convert static page components to pageComponents format
        finalComponents = staticPageData.components.map((comp: any) => {
          const finalId = normalizeComponentId(comp);
          return {
            id: finalId,
            type: comp.type,
            name: comp.name || comp.type,
            componentName: comp.componentName,
            data: comp.data || {},
            position: comp.position || 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          };
        });
      } else if (finalStore.pageComponentsByPage[finalCurrentPage]) {
        // للصفحات العادية، استخدام pageComponentsByPage
        // For regular pages, use pageComponentsByPage
        finalComponents = finalStore.pageComponentsByPage[finalCurrentPage];
      }

      if (finalComponents.length > 0) {
        console.log(
          "[restoreThemeFromBackup] Final force update for current page:",
          {
            page: finalCurrentPage,
            componentCount: finalComponents.length,
            isStaticPage: !!staticPageData,
            componentNames: finalComponents.map((c: any) => c.componentName),
          },
        );
        finalStore.forceUpdatePageComponents(finalCurrentPage, finalComponents);
      }
    }
  }, 100);
}

/**
 * استعادة الثيم من النسخ الاحتياطي
 * Restore theme from backup
 *
 * هذه هي الدالة الرئيسية لاستعادة الثيم من النسخ الاحتياطي.
 * تقوم بـ:
 * 1. مسح جميع الحالات قبل الاستعادة
 * 2. استعادة الصفحات الثابتة من النسخ الاحتياطي
 * 3. استعادة المكونات العامة (Header و Footer)
 * 4. استعادة جميع الصفحات من النسخ الاحتياطي
 * 5. تحديث currentTheme
 * 6. إجبار تحديث الصفحة الحالية
 * 7. مزامنة Tenant Store مع Editor Store
 *
 * This is the main function to restore theme from backup.
 * It:
 * 1. Clears all states before restore
 * 2. Restores static pages from backup
 * 3. Restores global components (Header and Footer)
 * 4. Restores all pages from backup
 * 5. Updates currentTheme
 * 6. Forces update of current page
 * 7. Syncs Tenant Store with Editor Store
 *
 * @param backupKey - مفتاح النسخ الاحتياطي (مثل "Theme1Backup")
 *                   Backup key (e.g., "Theme1Backup")
 *
 * @throws Error إذا لم يتم العثور على النسخ الاحتياطي
 *         Error if backup not found
 *
 * @example
 * ```typescript
 * await restoreThemeFromBackup("Theme1Backup");
 * ```
 */
export async function restoreThemeFromBackup(backupKey: string): Promise<void> {
  const store = useEditorStore.getState();

  // قراءة النسخ الاحتياطي من WebsiteLayout بدلاً من themeBackup
  // Read backup from WebsiteLayout instead of themeBackup
  const backup = store.WebsiteLayout?.[backupKey];

  // التحقق من وجود النسخ الاحتياطي
  // Check if backup exists
  if (!backup || Object.keys(backup).length === 0) {
    throw new Error("No backup found to restore");
  }

  // استخراج رقم الثيم من مفتاح النسخ الاحتياطي
  // Extract theme number from backup key
  // (Theme1Backup -> 1, Theme10Backup -> 10, etc.)
  // Regex pattern supports any number of digits (1, 2, 10, 11, 100, etc.)
  const restoredThemeNumber = extractThemeNumberFromBackupKey(backupKey);

  // 1. مسح جميع الحالات قبل الاستعادة من النسخ الاحتياطي
  // This ensures complete removal of all components and data from iframe
  // 1. Clear ALL states before restoring from backup
  store.clearAllStates();

  // 2. استعادة الصفحات الثابتة من النسخ الاحتياطي (قبل المكونات العامة)
  // 2. Restore static pages from backup (before global components)
  logStaticPagesRestore(store, backup, backupKey);

  // 3. استعادة globalComponentsData من النسخ الاحتياطي (استبدال كامل)
  // 3. Restore globalComponentsData from backup (complete replacement)
  if (backup._globalComponentsData) {
    restoreGlobalComponents(backup._globalComponentsData);
  }

  // 4. استعادة جميع الصفحات من النسخ الاحتياطي مع force update
  // 4. Restore all pages from backup with force update
  restorePageComponentsFromBackup(backup);

  // 5. استعادة currentTheme إذا تم استخراجه من مفتاح النسخ الاحتياطي
  // This will also set themeChangeTimestamp to force sync
  // 5. Restore currentTheme if we extracted it from backup key
  if (restoredThemeNumber) {
    store.setCurrentTheme(restoredThemeNumber);
  }

  // 6. إجبار تحديث الصفحة الحالية
  // 6. Force update current page
  forceUpdateCurrentPageAfterRestore(store, backup);

  // 7. مسح themeBackup بعد الاستعادة
  // 7. Clear themeBackup after restoring
  store.setThemeBackup(null, null);

  // 8. ⭐ CRITICAL: تحديث tenantStore لمزامنة مع editorStore
  // This ensures tenantData.componentSettings matches pageComponentsByPage
  // and tenantData.globalComponentsData matches globalComponentsData
  // 8. ⭐ CRITICAL: Update tenantStore to sync with editorStore
  syncTenantStoreFromBackup(backup);
}
