/**
 * Blog Validators
 * 
 * @description دوال التحقق من صحة البيانات للمقالات
 * 
 * @usedIn
 * - hooks/use-blog-form.ts
 * - components/form/* (مكونات النموذج)
 * 
 * @related
 * - blog.types.ts (BlogFormData)
 */

import type { BlogFormData } from "../types/blog.types";

/**
 * Validation errors type
 */
export interface ValidationErrors {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: string;
  thumbnail_id?: string;
  category_ids?: string;
  media_ids?: string;
}

/**
 * Validate blog form data
 * @param data - Form data to validate
 * @returns Validation errors object (empty if valid)
 */
export function validateBlogForm(data: BlogFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate title
  if (!data.title || data.title.trim().length === 0) {
    errors.title = "العنوان مطلوب";
  } else if (data.title.length > 255) {
    errors.title = "العنوان يجب أن يكون أقل من 255 حرف";
  }

  // Validate slug (optional, but if provided must be valid)
  if (data.slug && data.slug.length > 255) {
    errors.slug = "الرابط يجب أن يكون أقل من 255 حرف";
  }

  // Validate content
  if (!data.content || data.content.trim().length === 0) {
    errors.content = "المحتوى مطلوب";
  } else if (data.content.length > 100000) {
    errors.content = "المحتوى يجب أن يكون أقل من 100000 حرف";
  }

  // Validate excerpt (optional, but if provided must be valid)
  if (data.excerpt && data.excerpt.length > 500) {
    errors.excerpt = "الملخص يجب أن يكون أقل من 500 حرف";
  }

  // Validate status
  if (data.status !== "draft" && data.status !== "published") {
    errors.status = "الحالة غير صحيحة";
  }

  return errors;
}

/**
 * Validate title
 * @param title - Title to validate
 * @returns Error message or null if valid
 */
export function validateTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return "العنوان مطلوب";
  }
  if (title.length > 255) {
    return "العنوان يجب أن يكون أقل من 255 حرف";
  }
  return null;
}

/**
 * Validate content
 * @param content - Content to validate
 * @returns Error message or null if valid
 */
export function validateContent(content: string): string | null {
  if (!content || content.trim().length === 0) {
    return "المحتوى مطلوب";
  }
  if (content.length > 100000) {
    return "المحتوى يجب أن يكون أقل من 100000 حرف";
  }
  return null;
}

/**
 * Validate slug
 * @param slug - Slug to validate
 * @returns Error message or null if valid
 */
export function validateSlug(slug: string): string | null {
  if (slug && slug.length > 255) {
    return "الرابط يجب أن يكون أقل من 255 حرف";
  }
  // Check for valid slug format (alphanumeric, hyphens, underscores)
  if (slug && !/^[a-z0-9_-]+$/.test(slug)) {
    return "الرابط يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط";
  }
  return null;
}

/**
 * Check if form is valid
 * @param errors - Validation errors object
 * @returns True if no errors
 */
export function isFormValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
