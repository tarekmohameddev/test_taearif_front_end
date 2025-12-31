/**
 * ============================================================================
 * Static Pages Service
 * ============================================================================
 *
 * هذا الملف يحتوي على خدمات إدارة الصفحات الثابتة (static pages).
 * This file contains services for managing static pages.
 *
 * المسؤوليات:
 * - تطبيق الصفحات الثابتة من بيانات الثيم
 * - استعادة الصفحات الثابتة من النسخ الاحتياطي
 * - تحديث meta tags للصفحات الثابتة
 * - تحضير مكونات الصفحات الثابتة
 *
 * Responsibilities:
 * - Apply static pages from theme data
 * - Restore static pages from backup
 * - Update meta tags for static pages
 * - Prepare static page components
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context-liveeditor/editorStore";
import type { ThemeData } from "./types";
import {
  normalizeComponentId,
  createPageMetaData,
  createDefaultComponentData,
} from "./utils";

/**
 * تحضير مكونات الصفحة الثابتة
 * Prepare static page components
 *
 * تقوم هذه الدالة بتحضير مكونات الصفحة الثابتة مع التأكد من أن
 * id يطابق componentName (مهم جداً للصفحات الثابتة).
 *
 * This function prepares static page components ensuring that
 * id matches componentName (critical for static pages).
 *
 * @param components - مكونات الصفحة من بيانات الثيم
 *                    Page components from theme data
 *
 * @returns مكونات الصفحة المحضرة مع id و forceUpdate
 *          Prepared page components with id and forceUpdate
 *
 * @example
 * ```typescript
 * const preparedComponents = prepareStaticPageComponents(pageData.components);
 * ```
 */
function prepareStaticPageComponents(components: any[]): any[] {
  return components.map((comp: any) => {
    // ⭐ CRITICAL: استخدام componentName كـ id للصفحات الثابتة
    // ⭐ CRITICAL: Use componentName as id for static pages
    const finalId = normalizeComponentId(comp);

    return {
      ...comp,
      id: finalId, // ✅ التأكد من أن id يطابق componentName
      componentName: comp.componentName,
      data: comp.data || {},
      position: comp.position || 0,
      layout: comp.layout || { row: 0, col: 0, span: 2 },
      forceUpdate: Date.now(), // ✅ إضافة forceUpdate لإجبار إعادة التصيير
    };
  });
}

/**
 * تحديث حالات المكونات للصفحة الثابتة
 * Update component states for static page
 *
 * تقوم هذه الدالة بتحديث حالات المكونات في Editor Store
 * للصفحة الثابتة.
 *
 * This function updates component states in Editor Store
 * for the static page.
 *
 * @param components - مكونات الصفحة
 *                    Page components
 *
 * @param slug - معرف الصفحة (slug)
 *             Page identifier (slug)
 *
 * @example
 * ```typescript
 * updateStaticPageComponentStates(components, "project");
 * ```
 */
function updateStaticPageComponentStates(
  components: any[],
  slug: string,
): void {
  const store = useEditorStore.getState();

  components.forEach((comp: any) => {
    if (comp.id && comp.type && comp.data) {
      // ⭐ CRITICAL: استخدام componentName كـ variantId للصفحات الثابتة
      // ⭐ CRITICAL: Use componentName as variantId for static pages
      // هذا يضمن أن projectDetails1 يستخدم "projectDetails1" كـ variantId وليس UUID
      // This ensures projectDetails1 uses "projectDetails1" as variantId, not a UUID
      const variantId = comp.componentName || comp.id;

      console.log(
        `[updateStaticPageComponentStates] Setting component state:`,
        {
          slug,
          type: comp.type,
          id: comp.id,
          componentName: comp.componentName,
          variantId: variantId,
        },
      );

      // ✅ التأكد من وجود variant وتعيين البيانات
      // ✅ Ensure variant exists and set data
      store.ensureComponentVariant(comp.type, variantId, comp.data);
      store.setComponentData(comp.type, variantId, comp.data);
    }
  });
}

/**
 * تحديث meta tags للصفحة الثابتة
 * Update meta tags for static page
 *
 * تقوم هذه الدالة بتحديث meta tags في WebsiteLayout
 * للصفحة الثابتة.
 *
 * This function updates meta tags in WebsiteLayout
 * for the static page.
 *
 * @param slug - معرف الصفحة (slug)
 *             Page identifier (slug)
 *
 * @param pageData - بيانات الصفحة
 *                 Page data
 *
 * @example
 * ```typescript
 * updateStaticPageMetaTags("project", pageData);
 * ```
 */
function updateStaticPageMetaTags(slug: string, pageData: any): void {
  const store = useEditorStore.getState();

  // الحصول على meta tags الحالية
  // Get current meta tags
  const currentMetaTags = store.WebsiteLayout?.metaTags || {};
  const staticPagesMetaTags = (currentMetaTags as any).staticPages || [];

  // التحقق من وجود الصفحة في metaTags
  // Check if page exists in metaTags
  const existingPageIndex = staticPagesMetaTags.findIndex(
    (page: any) => page.slug === slug || page.path === `/${slug}`,
  );

  // إنشاء بيانات meta للصفحة
  // Create page meta data
  const pageMetaData = createPageMetaData(slug);

  if (existingPageIndex >= 0) {
    // تحديث الصفحة الموجودة
    // Update existing page
    staticPagesMetaTags[existingPageIndex] = pageMetaData;
  } else {
    // إضافة صفحة جديدة
    // Add new page
    staticPagesMetaTags.push(pageMetaData);
  }

  // تحديث WebsiteLayout
  // Update WebsiteLayout
  store.setWebsiteLayout({
    ...store.WebsiteLayout,
    metaTags: {
      ...currentMetaTags,
      staticPages: staticPagesMetaTags,
    },
  });
}

/**
 * تطبيق الصفحات الثابتة من بيانات الثيم
 * Apply static pages from theme data
 *
 * تقوم هذه الدالة بتطبيق جميع الصفحات الثابتة من بيانات الثيم
 * على Editor Store.
 *
 * This function applies all static pages from theme data
 * to Editor Store.
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @example
 * ```typescript
 * applyStaticPagesFromTheme(themeData);
 * ```
 */
export function applyStaticPagesFromTheme(themeData: ThemeData): void {
  const store = useEditorStore.getState();

  // التحقق من وجود صفحات ثابتة في بيانات الثيم
  // Check if static pages exist in theme data
  if (!themeData.staticPages || !("staticPages" in themeData)) {
    console.log("[applyStaticPagesFromTheme] No static pages in theme data");
    return;
  }

  console.log(
    "[applyStaticPagesFromTheme] Applying static pages from theme:",
    Object.keys(themeData.staticPages),
  );

  // تطبيق كل صفحة ثابتة من الثيم
  // Apply each static page from theme
  Object.entries(themeData.staticPages).forEach(([slug, pageData]) => {
    if (pageData && pageData.components && Array.isArray(pageData.components)) {
      // ⭐ CRITICAL: تحضير المكونات مع التأكد من أن id يطابق componentName
      // ⭐ CRITICAL: Prepare components ensuring id matches componentName
      const updatedComponents = prepareStaticPageComponents(
        pageData.components,
      );

      // تعيين بيانات الصفحة الثابتة
      // Set static page data
      store.setStaticPageData(slug, {
        slug: pageData.slug || slug,
        components: updatedComponents, // ✅ استخدام المكونات المحضرة
        apiEndpoints: pageData.apiEndpoints || {},
      });

      // تحديث حالات المكونات
      // Update component states
      updateStaticPageComponentStates(updatedComponents, slug);

      // تحديث meta tags
      // Update meta tags
      updateStaticPageMetaTags(slug, pageData);

      console.log(`[applyStaticPagesFromTheme] Applied static page: ${slug}`, {
        componentCount: pageData.components.length,
      });
    }
  });
}

/**
 * استعادة الصفحات الثابتة من النسخ الاحتياطي
 * Restore static pages from backup
 *
 * تقوم هذه الدالة باستعادة جميع الصفحات الثابتة من النسخ الاحتياطي
 * على Editor Store.
 *
 * This function restores all static pages from backup
 * to Editor Store.
 *
 * @param backup - بيانات النسخ الاحتياطي
 *               Backup data
 *
 * @example
 * ```typescript
 * restoreStaticPagesFromBackup(backup);
 * ```
 */
export function restoreStaticPagesFromBackup(
  backup: Record<string, any>,
): void {
  const store = useEditorStore.getState();

  // الحصول على بيانات الصفحات الثابتة من النسخ الاحتياطي
  // Get static pages data from backup
  const staticPagesBackup = backup._staticPagesData;
  if (!staticPagesBackup || Object.keys(staticPagesBackup).length === 0) {
    console.log("[restoreStaticPagesFromBackup] No static pages in backup");
    return;
  }

  console.log(
    "[restoreStaticPagesFromBackup] Restoring static pages from backup:",
    Object.keys(staticPagesBackup),
  );

  // استعادة كل صفحة ثابتة من النسخ الاحتياطي
  // Restore each static page from backup
  Object.entries(staticPagesBackup).forEach(
    ([slug, pageData]: [string, any]) => {
      if (
        pageData &&
        pageData.components &&
        Array.isArray(pageData.components)
      ) {
        // ⭐ CRITICAL: تحضير المكونات مع التأكد من أن id يطابق componentName
        // ⭐ CRITICAL: Prepare components ensuring id matches componentName
        const updatedComponents = prepareStaticPageComponents(
          pageData.components,
        );

        // تعيين بيانات الصفحة الثابتة
        // Set static page data
        store.setStaticPageData(slug, {
          slug: pageData.slug || slug,
          components: updatedComponents,
          apiEndpoints: pageData.apiEndpoints || {},
        });

        // تحديث حالات المكونات
        // Update component states
        updateStaticPageComponentStates(updatedComponents, slug);

        // تحديث meta tags
        // Update meta tags
        updateStaticPageMetaTags(slug, pageData);

        console.log(
          `[restoreStaticPagesFromBackup] Restored static page: ${slug}`,
          {
            componentCount: pageData.components.length,
          },
        );
      }
    },
  );
}
