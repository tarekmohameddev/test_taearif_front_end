/**
 * ============================================================================
 * Theme Application Service
 * ============================================================================
 *
 * هذا الملف يحتوي على الدالة الرئيسية لتطبيق الثيم على جميع الصفحات.
 * This file contains the main function to apply theme to all pages.
 *
 * المسؤوليات:
 * - تطبيق الثيم على جميع الصفحات والمكونات
 * - معالجة النسخ الاحتياطي قبل التطبيق
 * - تطبيق الثيم الافتراضي أو استعادة من النسخ الاحتياطي
 * - إجبار تحديث الصفحة الحالية
 *
 * Responsibilities:
 * - Apply theme to all pages and components
 * - Handle backup before application
 * - Apply default theme or restore from backup
 * - Force update current page
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context/editorStore";
import { loadThemeData } from "./themeDataLoader";
import {
  backupCurrentComponentSettings,
  saveBackupInStore,
} from "./backupService";
import { applyStaticPagesFromTheme } from "./staticPagesService";
import {
  applyGlobalComponentsFromTheme,
  mergeGlobalComponentsWithBackup,
} from "./globalComponentsService";
import { applyPageComponentsFromTheme } from "./pageComponentsService";
import { syncTenantStoreWithEditorStore } from "./tenantStoreSyncService";
import { normalizeComponentId } from "./utils";
import { restoreThemeFromBackup } from "./themeRestoreService";
import type { ThemeNumber, ThemeData } from "./types";

/**
 * إجبار تحديث الصفحة الحالية
 * Force update current page
 *
 * تقوم هذه الدالة بإجبار تحديث الصفحة الحالية بعد تطبيق الثيم.
 * تتعامل مع الصفحات الثابتة والصفحات العادية.
 *
 * This function forces update of current page after applying theme.
 * Handles static pages and regular pages.
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @example
 * ```typescript
 * forceUpdateCurrentPage(store);
 * ```
 */
function forceUpdateCurrentPage(
  store: ReturnType<typeof useEditorStore.getState>,
): void {
  // ⭐ CRITICAL: إضافة تأخير صغير لضمان انتشار تحديثات store
  // ثم إجبار تحديث إضافي لضمان المزامنة (نفس منطق restoreThemeFromBackup)
  // ⭐ CRITICAL: Add a small delay to ensure store updates are propagated
  // Then force one more update to guarantee sync (same as restoreThemeFromBackup)
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
          "[forceUpdateCurrentPage] Final force update for current page:",
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
 * إجبار تحديث جميع الصفحات الثابتة
 * Force update all static pages
 *
 * تقوم هذه الدالة بإجبار تحديث جميع الصفحات الثابتة في pageComponentsByPage.
 *
 * This function forces update of all static pages in pageComponentsByPage.
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @example
 * ```typescript
 * forceUpdateAllStaticPages(store, themeData);
 * ```
 */
function forceUpdateAllStaticPages(
  store: ReturnType<typeof useEditorStore.getState>,
  themeData: ThemeData,
): void {
  // إجبار تحديث جميع الصفحات الثابتة (ليس فقط الصفحة الحالية)
  // This ensures all static pages are updated in pageComponentsByPage
  // Force update ALL static pages (not just current page)
  Object.keys(themeData.staticPages || {}).forEach((pageSlug) => {
    const staticPageData = store.getStaticPageData(pageSlug);
    if (
      staticPageData &&
      staticPageData.components &&
      staticPageData.components.length > 0
    ) {
      // تحويل مكونات الصفحة الثابتة إلى تنسيق pageComponents
      // ⭐ CRITICAL: التأكد من أن id يطابق componentName للصفحات الثابتة
      // Convert static page components to pageComponents format
      // ⭐ CRITICAL: Ensure id matches componentName for static pages
      const staticPageComponents = staticPageData.components.map(
        (comp: any) => {
          // استخدام componentName كـ id إذا كان موجوداً (للصفحات الثابتة، يجب أن يطابق id الـ componentName)
          // Use componentName as id if it exists (for static pages, id should match componentName)
          const finalId = normalizeComponentId(comp);

          // ⭐ CRITICAL: تحديث component state بشكل صحيح
          // Update component state correctly
          const variantId = comp.componentName || finalId;
          store.ensureComponentVariant(comp.type, variantId, comp.data || {});
          store.setComponentData(comp.type, variantId, comp.data || {});

          return {
            id: finalId, // ⭐ FIX: استخدام componentName كـ id لمطابقة variantId في states
            type: comp.type,
            name: comp.name || comp.type,
            componentName: comp.componentName,
            data: comp.data || {},
            position: comp.position || 0,
            layout: comp.layout || { row: 0, col: 0, span: 2 },
          };
        },
      );

      console.log(
        "[forceUpdateAllStaticPages] Force update static page after theme change:",
        {
          page: pageSlug,
          componentCount: staticPageComponents.length,
          components: staticPageComponents.map((c: any) => ({
            id: c.id,
            componentName: c.componentName,
            type: c.type,
          })),
        },
      );

      // إجبار تحديث pageComponentsByPage لهذه الصفحة الثابتة
      // Force update pageComponentsByPage for this static page
      store.forceUpdatePageComponents(pageSlug, staticPageComponents);
      store.setPageComponentsForPage(pageSlug, staticPageComponents);
    }
  });

  // ⭐ CRITICAL: إضافة forceUpdate إضافي بعد تحديث جميع الصفحات
  // This ensures all updates are propagated before sync
  // Add additional forceUpdate after updating all pages
  setTimeout(() => {
    const finalStore = useEditorStore.getState();
    Object.keys(themeData.staticPages || {}).forEach((pageSlug) => {
      const finalStaticPageData = finalStore.getStaticPageData(pageSlug);
      if (
        finalStaticPageData &&
        finalStaticPageData.components &&
        finalStaticPageData.components.length > 0
      ) {
        const finalStaticPageComponents = finalStaticPageData.components.map(
          (comp: any) => {
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
          },
        );

        // Force update again to ensure sync
        finalStore.forceUpdatePageComponents(pageSlug, finalStaticPageComponents);
        finalStore.setPageComponentsForPage(pageSlug, finalStaticPageComponents);

        console.log(
          `[forceUpdateAllStaticPages] Additional force update for static page: ${pageSlug}`,
          {
            componentNames: finalStaticPageComponents.map(
              (c: any) => c.componentName,
            ),
          },
        );
      }
    });
  }, 50);
}

/**
 * تسجيل بيانات الصفحات الثابتة قبل وبعد تغيير الثيم
 * Log static pages data before and after theme change
 *
 * تقوم هذه الدالة بتسجيل بيانات الصفحات الثابتة قبل وبعد تغيير الثيم
 * مع مقارنة للتغييرات.
 *
 * This function logs static pages data before and after theme change
 * with comparison of changes.
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @param themeNumber - رقم الثيم
 *                    Theme number
 *
 * @example
 * ```typescript
 * logStaticPagesChange(store, themeData, 1);
 * ```
 */
function logStaticPagesChange(
  store: ReturnType<typeof useEditorStore.getState>,
  themeData: ThemeData,
  themeNumber: ThemeNumber,
): void {
  // ⭐ LOGGING: عرض بيانات الصفحات الثابتة قبل تغيير الثيم
  // ⭐ LOGGING: Show static pages data BEFORE theme change
  console.group(
    `🎨 [Theme Change] Static Pages - BEFORE (Theme ${themeNumber})`,
  );
  const staticPagesBefore: Record<string, any> = {};
  Object.keys(themeData.staticPages || {}).forEach((slug) => {
    const beforeData = store.getStaticPageData(slug);
    staticPagesBefore[slug] = beforeData
      ? {
          slug: beforeData.slug,
          componentCount: beforeData.components?.length || 0,
          components:
            beforeData.components?.map((c: any) => ({
              id: c.id,
              componentName: c.componentName,
              type: c.type,
            })) || [],
        }
      : null;
  });
  console.log("Static Pages Data Before:", staticPagesBefore);
  console.groupEnd();

  // تطبيق الصفحات الثابتة من الثيم
  // Apply static pages from theme
  applyStaticPagesFromTheme(themeData);

  // ⭐ LOGGING: عرض بيانات الصفحات الثابتة بعد تغيير الثيم
  // ⭐ LOGGING: Show static pages data AFTER theme change
  console.group(
    `🎨 [Theme Change] Static Pages - AFTER (Theme ${themeNumber})`,
  );
  const staticPagesAfter: Record<string, any> = {};
  Object.keys(themeData.staticPages || {}).forEach((slug) => {
    const afterData = store.getStaticPageData(slug);
    staticPagesAfter[slug] = afterData
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
  console.log("Static Pages Data After:", staticPagesAfter);

  // عرض المقارنة
  // Show comparison
  console.log("📊 Comparison:");
  Object.keys(themeData.staticPages || {}).forEach((slug) => {
    const before = staticPagesBefore[slug];
    const after = staticPagesAfter[slug];
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
  console.groupEnd();
}

/**
 * تطبيق الثيم الافتراضي
 * Apply default theme
 *
 * تقوم هذه الدالة بتطبيق الثيم الافتراضي من بيانات الثيم
 * (عند عدم وجود نسخ احتياطي).
 *
 * This function applies default theme from theme data
 * (when no backup exists).
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @param themeNumber - رقم الثيم
 *                    Theme number
 *
 * @example
 * ```typescript
 * applyDefaultTheme(store, themeData, 1);
 * ```
 */
function applyDefaultTheme(
  store: ReturnType<typeof useEditorStore.getState>,
  themeData: ThemeData,
  themeNumber: ThemeNumber,
): void {
  // تطبيق componentSettings أو pages إلى pageComponentsByPage
  // Apply componentSettings or pages to pageComponentsByPage
  applyPageComponentsFromTheme(themeData);

  // إجبار تحديث الصفحة الحالية
  // Force update current page
  forceUpdateCurrentPage(store);

  // تطبيق globalComponentsData
  // Apply globalComponentsData
  applyGlobalComponentsFromTheme(themeData);

  // تحديث currentTheme (يحدث themeChangeTimestamp)
  // Update currentTheme (triggers themeChangeTimestamp)
  store.setCurrentTheme(themeNumber);

  // تطبيق الصفحات الثابتة من الثيم (بعد setCurrentTheme)
  // Apply static pages from theme (after setCurrentTheme)
  logStaticPagesChange(store, themeData, themeNumber);

  // إجبار تحديث جميع الصفحات الثابتة
  // Force update all static pages
  forceUpdateAllStaticPages(store, themeData);

  // ⭐ CRITICAL: إضافة تأخير صغير قبل syncTenantStoreWithEditorStore
  // This ensures all store updates (staticPagesData, pageComponentsByPage, componentStates)
  // are fully propagated before syncing to tenantStore
  // ⭐ CRITICAL: Add small delay before syncTenantStoreWithEditorStore
  setTimeout(() => {
    const finalStore = useEditorStore.getState();

    // ⭐ CRITICAL: تحديث tenantStore لمزامنة مع editorStore
    // This ensures tenantData.componentSettings matches pageComponentsByPage
    // and tenantData.globalComponentsData matches globalComponentsData
    // and tenantData.StaticPages matches staticPagesData
    // ⭐ CRITICAL: Update tenantStore to sync with editorStore
    syncTenantStoreWithEditorStore(themeData);

    console.log(
      `[applyDefaultTheme] Theme ${themeNumber} applied and synced to tenantStore`,
      {
        staticPagesCount: Object.keys(finalStore.staticPagesData || {}).length,
        staticPagesSlugs: Object.keys(finalStore.staticPagesData || {}),
      },
    );
  }, 100);
}

/**
 * معالجة استعادة النسخ الاحتياطي
 * Handle backup restore
 *
 * تقوم هذه الدالة بمعالجة استعادة الثيم من النسخ الاحتياطي
 * مع تطبيق variants من بيانات الثيم.
 *
 * This function handles restoring theme from backup
 * with applying variants from theme data.
 *
 * @param store - حالة Editor Store
 *              Editor Store state
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @param targetBackupKey - مفتاح النسخ الاحتياطي المستهدف
 *                        Target backup key
 *
 * @example
 * ```typescript
 * await handleThemeBackupRestore(store, themeData, "Theme1Backup");
 * ```
 */
async function handleThemeBackupRestore(
  store: ReturnType<typeof useEditorStore.getState>,
  themeData: ThemeData,
  targetBackupKey: string,
): Promise<void> {
  // استعادة الثيم من النسخ الاحتياطي
  // Restore theme from backup
  await restoreThemeFromBackup(targetBackupKey);

  // ⭐ CRITICAL: تطبيق variants من globalComponentsData من themeData (تجاوز variants من النسخ الاحتياطي)
  // This ensures that when switching themes, the correct variants (header2/footer2) are applied
  // even if the backup contains old variants (StaticHeader1/StaticFooter1)
  // ⭐ CRITICAL: Apply globalComponentsData variants from themeData (override backup variants)
  if (themeData.globalComponentsData) {
    mergeGlobalComponentsWithBackup(themeData);
  }
}

/**
 * تطبيق الثيم على جميع الصفحات والمكونات العامة
 * Apply theme to all pages and global components
 *
 * هذه هي الدالة الرئيسية لتطبيق الثيم على النظام بالكامل.
 * تقوم بـ:
 * 1. نسخ إعدادات المكونات الحالية قبل التغيير
 * 2. مسح جميع الحالات قبل تطبيق الثيم الجديد
 * 3. التحقق من وجود نسخ احتياطي للثيم المستهدف
 * 4. استعادة من النسخ الاحتياطي أو تطبيق الثيم الافتراضي
 * 5. مزامنة Tenant Store مع Editor Store
 *
 * This is the main function to apply theme to the entire system.
 * It:
 * 1. Backs up current component settings before change
 * 2. Clears all states before applying new theme
 * 3. Checks if backup exists for target theme
 * 4. Restores from backup or applies default theme
 * 5. Syncs Tenant Store with Editor Store
 *
 * @param themeNumber - رقم الثيم المطلوب تطبيقه (1 أو 2)
 *                    Theme number to apply (1 or 2)
 *
 * @example
 * ```typescript
 * await applyThemeToAllPages(1);
 * ```
 */
export async function applyThemeToAllPages(
  themeNumber: ThemeNumber,
): Promise<void> {
  const store = useEditorStore.getState();

  // 1. الحصول على الثيم الحالي وإنشاء نسخ احتياطي إذا كان موجوداً
  // 1. Get current theme and create backup if exists
  const currentTheme = store.WebsiteLayout?.currentTheme;
  if (currentTheme) {
    const { backup, backupKey } = backupCurrentComponentSettings();
    if (backupKey && Object.keys(backup).length > 0) {
      saveBackupInStore(backupKey, backup);
    }
  }

  // 2. مسح جميع الحالات قبل تطبيق الثيم الجديد
  // This ensures complete removal of all components and data from iframe
  // 2. Clear ALL states before applying new theme
  store.clearAllStates();

  // 3. التحقق من وجود نسخ احتياطي للثيم المستهدف
  // If backup exists, restore from backup instead of applying default theme
  // 3. Check if backup exists for the target theme
  const targetBackupKey = `Theme${themeNumber}Backup`;
  const targetBackup = store.ThemesBackup?.[targetBackupKey];

  // تحميل بيانات الثيم من lib/themes/theme{themeNumber}Data.json
  // (مطلوب للـ variants حتى لو كان هناك نسخ احتياطي)
  // Load theme data from lib/themes/theme{themeNumber}Data.json
  // (needed for variants even if backup exists)
  const themeData = loadThemeData(themeNumber);

  // إذا كان هناك نسخ احتياطي وغير فارغ، استعادة من النسخ الاحتياطي بدلاً من تطبيق الثيم الافتراضي
  // If backup exists and is not empty, restore from backup instead of applying default theme
  if (
    targetBackup &&
    typeof targetBackup === "object" &&
    Object.keys(targetBackup).length > 0
  ) {
    // معالجة استعادة النسخ الاحتياطي
    // Handle backup restore
    await handleThemeBackupRestore(store, themeData, targetBackupKey);

    // restoreThemeFromBackup already updates currentTheme, so we're done
    return;
  }

  // 4. إذا لم يكن هناك نسخ احتياطي، المتابعة مع تطبيق الثيم الافتراضي من مجلد lib
  // 4. If no backup exists, continue with default theme application from lib folder
  applyDefaultTheme(store, themeData, themeNumber);
}

/**
 * تطبيق البيانات الافتراضية للثيم الحالي
 * Apply default data for current theme
 *
 * تقوم هذه الدالة بتطبيق البيانات الافتراضية للثيم الحالي
 * من مجلد lib/themes دون التحقق من النسخ الاحتياطي.
 * يتم استخدامها عند الضغط على زر Reset لإعادة تعيين الثيم
 * إلى حالته الافتراضية الأصلية.
 *
 * This function applies default data for current theme
 * from lib/themes folder without checking for backup.
 * It is used when clicking the Reset button to reset the theme
 * to its original default state.
 *
 * @param themeNumber - رقم الثيم المطلوب إعادة تعيينه (1 أو 2)
 *                     Theme number to reset (1 or 2)
 *
 * @example
 * ```typescript
 * await applyDefaultThemeData(1);
 * ```
 */
export async function applyDefaultThemeData(
  themeNumber: ThemeNumber,
): Promise<void> {
  const store = useEditorStore.getState();

  // 1. حذف النسخة الاحتياطية الموجودة للثيم الحالي من ThemesBackup (إن وجدت)
  // 1. Delete existing backup for current theme from ThemesBackup if it exists
  const backupKey = `Theme${themeNumber}Backup`;
  if (store.ThemesBackup?.[backupKey]) {
    store.deleteThemeBackup(backupKey);
  }

  // 2. مسح جميع الحالات قبل تطبيق الثيم الجديد
  // This ensures complete removal of all components and data from iframe
  // 2. Clear ALL states before applying new theme
  store.clearAllStates();

  // 3. تحميل بيانات الثيم الافتراضية من lib/themes/theme{themeNumber}Data.json
  // 3. Load default theme data from lib/themes/theme{themeNumber}Data.json
  const themeData = loadThemeData(themeNumber);

  // 4. تطبيق الثيم الافتراضي مباشرة (دون التحقق من backup)
  // 4. Apply default theme directly (without checking for backup)
  applyDefaultTheme(store, themeData, themeNumber);
}