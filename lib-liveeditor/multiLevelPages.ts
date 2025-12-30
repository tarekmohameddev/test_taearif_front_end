/**
 * قائمة الصفحات التي تعتمد على ما بعد السلاش
 * أي صفحة في هذه القائمة ستُعالج كصفحة متعددة المستويات
 * 
 * أمثلة:
 * - "project" → /project/[slug]
 * - "property" → /property/[slug]
 * - "blog" → /blog/[slug]
 */
export const MULTI_LEVEL_PAGES = [
  "project",    // /project/[slug]
  "property",   // /property/[slug]
  "blog",       // /blog/[slug]
  // يمكن إضافة المزيد لاحقاً
] as const;

export type MultiLevelPageSlug = typeof MULTI_LEVEL_PAGES[number];

/**
 * التحقق من كون الصفحة متعددة المستويات
 * @param slug - الـ slug للصفحة
 * @returns true إذا كانت الصفحة في قائمة MULTI_LEVEL_PAGES
 */
export function isMultiLevelPage(slug: string): boolean {
  return MULTI_LEVEL_PAGES.includes(slug as MultiLevelPageSlug);
}

/**
 * الحصول على اسم الـ slug property في component.data
 * مثال: "project" → "projectSlug", "property" → "propertySlug"
 * @param slug - الـ slug للصفحة
 * @returns اسم الـ property (مثل "projectSlug")
 */
export function getSlugPropertyName(slug: string): string {
  return `${slug}Slug`;
}












