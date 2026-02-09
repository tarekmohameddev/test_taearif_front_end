import { Page } from "../types/types";
import { getDefaultSeoData } from "../constants/defaultSeoData";

/**
 * دالة لحساب عنوان الصفحة حسب اللغة
 * ⭐ PRIORITY: Use page.name first if it exists (especially for static pages)
 * This ensures correctly set names like "صفحة العقار" appear instead of SEO data
 */
export function getPageTitle(page: Page, locale: string): string {
  // ⭐ PRIORITY: Use page.name first if it exists (especially for static pages)
  // This ensures correctly set names like "صفحة العقار" appear instead of SEO data
  if (page.name) {
    return page.name;
  }
  // Fallback to SEO data if page.name is not set
  // إذا كانت الصفحة باللغة العربية
  if (locale === "ar" && page.seo?.TitleAr) {
    return page.seo.TitleAr;
  }
  // إذا كانت الصفحة باللغة الإنجليزية
  if (locale === "en" && page.seo?.TitleEn) {
    return page.seo.TitleEn;
  }
  // إذا لم يكن هناك page.name أو بيانات SEO، استخدم page.slug
  return page.slug || "Homepage";
}

export { getDefaultSeoData };
