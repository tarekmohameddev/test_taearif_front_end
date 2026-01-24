/**
 * Blog Helpers
 * 
 * @description دوال مساعدة للمقالات
 * 
 * @usedIn
 * - components/blogs/* (جميع مكونات المدونة)
 * - hooks/use-blog-form.ts
 * 
 * @related
 * - blog.types.ts (BlogPost, BlogListItem)
 */

/**
 * Get status color for badge/display
 * @param status - Post status
 * @returns Tailwind CSS color class
 */
export function getBlogStatusColor(
  status: "draft" | "published"
): string {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Get status label in Arabic
 * @param status - Post status
 * @returns Arabic label
 */
export function getBlogStatusLabel(
  status: "draft" | "published"
): string {
  switch (status) {
    case "published":
      return "منشور";
    case "draft":
      return "مسودة";
    default:
      return "غير محدد";
  }
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Get thumbnail URL or placeholder
 * @param thumbnail - Media object or null
 * @returns Image URL
 */
export function getThumbnailUrl(
  thumbnail: { url: string } | null | undefined
): string {
  if (thumbnail?.url) {
    return thumbnail.url;
  }
  return "/placeholder.svg";
}

/**
 * Check if post is published
 * @param status - Post status
 * @returns True if published
 */
export function isPublished(status: "draft" | "published"): boolean {
  return status === "published";
}

/**
 * Format file size
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
