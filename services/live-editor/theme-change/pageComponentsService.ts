/**
 * ============================================================================
 * Page Components Service
 * ============================================================================
 *
 * هذا الملف يحتوي على خدمات إدارة مكونات الصفحات.
 * This file contains services for managing page components.
 *
 * المسؤوليات:
 * - تطبيق مكونات الصفحات من بيانات الثيم
 * - استعادة مكونات الصفحات من النسخ الاحتياطي
 * - تحويل البيانات إلى تنسيق pageComponents
 * - تحديث حالات المكونات
 *
 * Responsibilities:
 * - Apply page components from theme data
 * - Restore page components from backup
 * - Convert data to pageComponents format
 * - Update component states
 *
 * ============================================================================
 */

import { useEditorStore } from "@/context/editorStore";
import { createDefaultComponentData } from "./utils";

/**
 * تحويل بيانات المكونات إلى تنسيق pageComponents
 * Convert component data to pageComponents format
 *
 * تقوم هذه الدالة بتحويل بيانات المكونات من تنسيقات مختلفة
 * (Array أو Object) إلى تنسيق pageComponents موحد.
 *
 * This function converts component data from different formats
 * (Array or Object) to unified pageComponents format.
 *
 * @param pageComponents - بيانات المكونات (Array أو Object)
 *                        Component data (Array or Object)
 *
 * @returns مصفوفة من المكونات بتنسيق pageComponents
 *          Array of components in pageComponents format
 *
 * @example
 * ```typescript
 * const components = convertToPageComponentsFormat(pageData.components);
 * ```
 */
export function convertToPageComponentsFormat(
  pageComponents: any[] | Record<string, any>,
): any[] {
  // التحقق من نوع البيانات
  // Check data type
  if (Array.isArray(pageComponents)) {
    // تنسيق Array: [component1, component2, ...]
    // Array format: [component1, component2, ...]
    return pageComponents.map((comp, index) =>
      createDefaultComponentData(
        {
          id: comp.id || `comp-${index}`,
          type: comp.type,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position ?? index,
          layout: comp.layout,
        },
        index,
      ),
    );
  } else if (pageComponents && typeof pageComponents === "object") {
    // تنسيق Object: { id1: component1, id2: component2, ... }
    // Object format: { id1: component1, id2: component2, ... }
    return Object.entries(pageComponents).map(
      ([id, comp]: [string, any], index) =>
        createDefaultComponentData(
          {
            id: id || comp.id || `comp-${index}`,
            type: comp.type,
            componentName: comp.componentName,
            data: comp.data || {},
            position: comp.position ?? index,
            layout: comp.layout,
          },
          index,
        ),
    );
  }

  // إرجاع مصفوفة فارغة إذا كانت البيانات غير صحيحة
  // Return empty array if data is invalid
  return [];
}

/**
 * تحديث حالات المكونات في Editor Store
 * Update component states in Editor Store
 *
 * تقوم هذه الدالة بتحديث حالات المكونات في Editor Store
 * لكل مكون في الصفحة.
 *
 * This function updates component states in Editor Store
 * for each component in the page.
 *
 * @param components - مكونات الصفحة
 *                    Page components
 *
 * @example
 * ```typescript
 * updateComponentStates(components);
 * ```
 */
export function updateComponentStates(components: any[]): void {
  const store = useEditorStore.getState();

  components.forEach((comp) => {
    if (comp.id && comp.type) {
      // التأكد من وجود variant وتعيين البيانات
      // Ensure variant exists and set data
      store.ensureComponentVariant(comp.type, comp.id, comp.data);
      store.setComponentData(comp.type, comp.id, comp.data);
    }
  });
}

/**
 * تطبيق مكونات الصفحات من بيانات الثيم
 * Apply page components from theme data
 *
 * تقوم هذه الدالة بتطبيق مكونات الصفحات من بيانات الثيم
 * على Editor Store.
 *
 * This function applies page components from theme data
 * to Editor Store.
 *
 * @param themeData - بيانات الثيم
 *                  Theme data
 *
 * @returns كائن يحتوي على pageComponentsByPage
 *          Object containing pageComponentsByPage
 *
 * @example
 * ```typescript
 * const pageComponents = applyPageComponentsFromTheme(themeData);
 * ```
 */
export function applyPageComponentsFromTheme(themeData: {
  componentSettings?: Record<string, any[]>;
  pages?: Record<string, any[]>;
}): Record<string, any[]> {
  const store = useEditorStore.getState();
  const newPageComponentsByPage: Record<string, any[]> = {};

  // التعامل مع تنسيق theme1 (componentSettings) أو theme2 (pages)
  // Handle theme1 format (componentSettings) or theme2 format (pages)
  const pagesData = themeData.componentSettings || themeData.pages;

  if (pagesData) {
    Object.entries(pagesData).forEach(([page, pageComponents]) => {
      // تحويل البيانات إلى تنسيق pageComponents
      // Convert data to pageComponents format
      const components = convertToPageComponentsFormat(pageComponents);

      if (components.length > 0) {
        newPageComponentsByPage[page] = components;

        // تحديث حالات المكونات
        // Update component states
        updateComponentStates(components);
      }
    });

    // تحديث pageComponentsByPage
    // Update pageComponentsByPage
    Object.entries(newPageComponentsByPage).forEach(([page, components]) => {
      store.setPageComponentsForPage(page, components);
    });

    // إجبار تحديث مكونات الصفحة الحالية لإجبار إعادة التصيير
    // Force update current page components to trigger re-render
    const currentPage = store.currentPage;
    if (currentPage && newPageComponentsByPage[currentPage]) {
      store.forceUpdatePageComponents(
        currentPage,
        newPageComponentsByPage[currentPage],
      );
    }
  }

  return newPageComponentsByPage;
}

/**
 * استعادة مكونات الصفحات من النسخ الاحتياطي
 * Restore page components from backup
 *
 * تقوم هذه الدالة باستعادة مكونات الصفحات من النسخ الاحتياطي
 * على Editor Store.
 *
 * This function restores page components from backup
 * to Editor Store.
 *
 * @param backup - بيانات النسخ الاحتياطي
 *               Backup data
 *
 * @example
 * ```typescript
 * restorePageComponentsFromBackup(backup);
 * ```
 */
export function restorePageComponentsFromBackup(
  backup: Record<string, any>,
): void {
  const store = useEditorStore.getState();

  // استعادة جميع الصفحات من النسخ الاحتياطي مع force update
  // Restore all pages from backup with force update
  Object.entries(backup).forEach(([page, pageSettings]) => {
    // تخطي globalComponentsData و staticPagesData - تم التعامل معها مسبقاً
    // Skip globalComponentsData and staticPagesData - already handled
    if (page === "_globalComponentsData" || page === "_staticPagesData") {
      return;
    }

    // تحويل البيانات إلى تنسيق pageComponents
    // Convert data to pageComponents format
    const components = convertToPageComponentsFormat(pageSettings);

    if (components.length > 0) {
      // تعيين مكونات الصفحة
      // Set page components
      store.setPageComponentsForPage(page, components);

      // إجبار التحديث لهذه الصفحة لضمان إعادة التصيير الفورية
      // Force update for this page to ensure immediate re-render
      store.forceUpdatePageComponents(page, components);

      // تحديث حالات المكونات
      // Update component states
      updateComponentStates(components);
    }
  });

  // إجبار تحديث مكونات الصفحة الحالية لإجبار إعادة التصيير
  // Force update current page components to trigger re-render
  const currentPage = store.currentPage;
  let currentPageComponents: any[] = [];

  if (currentPage && backup[currentPage]) {
    const pageSettings = backup[currentPage];
    currentPageComponents = convertToPageComponentsFormat(pageSettings);

    if (currentPageComponents.length > 0) {
      // إجبار تحديث الصفحة الحالية لضمان إعادة التصيير الفورية في iframe
      // Force update current page to ensure immediate re-render in iframe
      store.forceUpdatePageComponents(currentPage, currentPageComponents);
    }
  } else if (currentPage && store.pageComponentsByPage[currentPage]) {
    // إذا كانت الصفحة الحالية موجودة في store ولكن ليس في النسخ الاحتياطي، استخدم بيانات store
    // If current page exists in store but not in backup, use store data
    currentPageComponents = store.pageComponentsByPage[currentPage];
  }
}
