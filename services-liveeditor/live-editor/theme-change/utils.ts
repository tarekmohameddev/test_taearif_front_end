/**
 * ============================================================================
 * Theme Change Utilities
 * ============================================================================
 *
 * هذا الملف يحتوي على الدوال المساعدة المستخدمة في نظام تغيير الثيمات.
 * This file contains utility functions used in the theme change system.
 *
 * المسؤوليات:
 * - إنشاء بيانات meta للصفحات
 * - تطبيع معرفات المكونات
 * - تسجيل تغييرات الثيم
 * - دوال مساعدة أخرى
 *
 * Responsibilities:
 * - Create page meta data
 * - Normalize component IDs
 * - Log theme changes
 * - Other utility functions
 *
 * ============================================================================
 */

/**
 * إنشاء بيانات meta للصفحة الثابتة
 * Create meta data for static page
 *
 * تقوم هذه الدالة بإنشاء بيانات meta tags للصفحات الثابتة
 * (project أو property) باللغتين العربية والإنجليزية.
 *
 * This function creates meta tags data for static pages
 * (project or property) in both Arabic and English.
 *
 * @param slug - معرف الصفحة (slug)
 *             Page identifier (slug)
 *
 * @returns بيانات meta tags للصفحة
 *          Meta tags data for the page
 *
 * @example
 * ```typescript
 * const projectMeta = createPageMetaData("project");
 * // Returns: { slug: "project", path: "/project", TitleAr: "المشروع", ... }
 * ```
 */
export function createPageMetaData(slug: string): {
  slug: string;
  path: string;
  TitleAr: string;
  TitleEn: string;
  DescriptionAr: string;
  DescriptionEn: string;
} {
  // تحديد نوع الصفحة (project أو property)
  // Determine page type (project or property)
  const isProject = slug === "project";

  // إرجاع بيانات meta tags
  // Return meta tags data
  return {
    slug: slug,
    path: `/${slug}`,
    TitleAr: isProject ? "المشروع" : "العقار",
    TitleEn: isProject ? "Project" : "Property",
    DescriptionAr: isProject ? "تفاصيل المشروع" : "تفاصيل العقار",
    DescriptionEn: isProject ? "Project Details" : "Property Details",
  };
}

/**
 * تطبيع معرف المكون
 * Normalize component ID
 *
 * تقوم هذه الدالة بتطبيع معرف المكون لضمان أن id يطابق componentName
 * للصفحات الثابتة. هذا مهم جداً لضمان عمل النظام بشكل صحيح.
 *
 * This function normalizes component ID to ensure that id matches componentName
 * for static pages. This is critical for the system to work correctly.
 *
 * @param component - بيانات المكون
 *                   Component data
 *
 * @returns معرف المكون المطبيع
 *          Normalized component ID
 *
 * @example
 * ```typescript
 * const normalizedId = normalizeComponentId({
 *   id: "some-uuid",
 *   componentName: "projectDetails1"
 * }); // Returns: "projectDetails1"
 * ```
 */
export function normalizeComponentId(component: {
  id?: string;
  componentName?: string;
}): string {
  // للصفحات الثابتة، يجب أن يطابق id الـ componentName
  // For static pages, id should match componentName
  // استخدام componentName كـ id إذا كان موجوداً
  // Use componentName as id if it exists
  return component.componentName || component.id || "unknown";
}

/**
 * تسجيل تغيير الثيم في console
 * Log theme change in console
 *
 * تقوم هذه الدالة بتسجيل معلومات تغيير الثيم في console
 * مع تنسيق جميل باستخدام console.group.
 *
 * This function logs theme change information in console
 * with nice formatting using console.group.
 *
 * @param title - عنوان المجموعة
 *              Group title
 *
 * @param data - البيانات المراد تسجيلها
 *             Data to log
 *
 * @param isGroup - هل استخدام console.group (افتراضي: true)
 *                Whether to use console.group (default: true)
 *
 * @example
 * ```typescript
 * logThemeChange("Theme Change", { theme: 1, pages: 5 });
 * ```
 */
export function logThemeChange(
  title: string,
  data: any,
  isGroup: boolean = true,
): void {
  if (isGroup) {
    console.group(title);
  }
  console.log(data);
  if (isGroup) {
    console.groupEnd();
  }
}

/**
 * التحقق من صحة بيانات المكون
 * Validate component data
 *
 * تقوم هذه الدالة بالتحقق من أن بيانات المكون صحيحة
 * قبل استخدامها في النظام.
 *
 * This function validates that component data is correct
 * before using it in the system.
 *
 * @param component - بيانات المكون للتحقق منها
 *                   Component data to validate
 *
 * @returns true إذا كانت البيانات صحيحة، false خلاف ذلك
 *          true if data is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = validateComponentData({
 *   id: "comp1",
 *   type: "hero",
 *   componentName: "hero1"
 * }); // Returns: true
 * ```
 */
export function validateComponentData(component: {
  id?: string;
  type?: string;
  componentName?: string;
  data?: any;
}): boolean {
  // التحقق من وجود الحقول المطلوبة
  // Check for required fields
  if (!component.id && !component.componentName) {
    return false;
  }

  if (!component.type) {
    return false;
  }

  // التحقق من أن data موجودة (حتى لو كانت كائن فارغ)
  // Check that data exists (even if it's an empty object)
  if (component.data === undefined || component.data === null) {
    return false;
  }

  return true;
}

/**
 * إنشاء بيانات مكون افتراضية
 * Create default component data
 *
 * تقوم هذه الدالة بإنشاء بيانات مكون افتراضية
 * مع القيم الافتراضية المطلوبة.
 *
 * This function creates default component data
 * with required default values.
 *
 * @param component - بيانات المكون الأساسية
 *                   Base component data
 *
 * @param index - الفهرس الافتراضي (للموضع والتخطيط)
 *              Default index (for position and layout)
 *
 * @returns بيانات المكون الكاملة مع القيم الافتراضية
 *          Complete component data with default values
 *
 * @example
 * ```typescript
 * const defaultComponent = createDefaultComponentData({
 *   id: "comp1",
 *   type: "hero",
 *   componentName: "hero1"
 * }, 0);
 * ```
 */
export function createDefaultComponentData(
  component: {
    id?: string;
    type: string;
    componentName?: string;
    data?: any;
    position?: number;
    layout?: { row: number; col: number; span: number };
  },
  index: number = 0,
): {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: any;
  position: number;
  layout: { row: number; col: number; span: number };
} {
  return {
    id: component.id || `comp-${index}`,
    type: component.type,
    name: component.type.charAt(0).toUpperCase() + component.type.slice(1),
    componentName: component.componentName || `${component.type}1`,
    data: component.data || {},
    position: component.position ?? index,
    layout: component.layout || { row: index, col: 0, span: 2 },
  };
}
