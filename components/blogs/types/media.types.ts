/**
 * Media Types
 * 
 * @description أنواع البيانات للملفات الإعلامية
 * 
 * @usedIn
 * - hooks/use-media-upload.ts
 * - services/media-api.ts
 * - components/form/blog-thumbnail-upload.tsx
 * - components/form/blog-media-upload.tsx
 * 
 * @related
 * - blog.types.ts (BlogPost uses Media)
 */

/**
 * Media Object (from API)
 */
export interface Media {
  id: number;
  url: string;
  type: "image" | "video";
  created_at: string;
}

/**
 * API Response for Upload Media
 */
export interface MediaUploadResponse {
  data: Media;
}
