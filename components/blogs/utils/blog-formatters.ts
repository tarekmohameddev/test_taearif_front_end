/**
 * Blog Formatters
 * 
 * @description دوال تنسيق البيانات للمقالات
 * 
 * @usedIn
 * - components/blogs/* (جميع مكونات المدونة)
 * - hooks/use-blog-form.ts
 * 
 * @related
 * - blog.types.ts (BlogPost, BlogListItem)
 */

/**
 * Format date with Arabic text and English numbers
 * @param dateString - ISO date string
 * @returns Formatted date string (Arabic text, English numbers, Gregorian calendar)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "غير محدد";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn", // أرقام إنجليزية
    calendar: "gregory",     // تاريخ ميلادي
  }).format(date);
}

/**
 * Format date with time (Arabic text and English numbers)
 * @param dateString - ISO date string
 * @returns Formatted date and time string (Arabic text, English numbers, Gregorian calendar)
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "غير محدد";
  
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    numberingSystem: "latn", // أرقام إنجليزية
    calendar: "gregory",     // تاريخ ميلادي
  }).format(date);
}

/**
 * Generate slug from title
 * @param title - Post title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single
}

/**
 * Format excerpt from content
 * @param content - HTML content
 * @param maxLength - Maximum length (default: 200)
 * @returns Formatted excerpt
 */
export function formatExcerpt(
  content: string | null | undefined,
  maxLength: number = 200
): string {
  if (!content) return "";
  
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "").trim();
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Format number with English locale
 * @param num - Number to format
 * @returns Formatted number string (English format)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
