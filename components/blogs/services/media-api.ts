/**
 * Media API Service
 * 
 * @description جميع API calls المتعلقة برفع الملفات الإعلامية
 * 
 * @dependencies
 * - Uses: lib/axiosInstance.js (للطلبات)
 * - Used by: hooks/use-media-upload.ts
 * 
 * @endpoints
 * - POST /media - رفع ملف إعلامي
 * 
 * @related
 * - types/media.types.ts (Media type)
 * - docs/ExcessFiles/blogs.txt (وثائق API)
 */

import axiosInstance from "@/lib/axiosInstance";
import type { MediaUploadResponse } from "../types/media.types";

/**
 * Upload media file
 * @param file - File to upload
 * @param mediableType - Optional: Type of related model (e.g., "App\\Models\\Api\\Post")
 * @param mediableId - Optional: ID of related model
 * @returns Promise with uploaded media data
 */
export async function uploadMedia(
  file: File,
  mediableType?: string,
  mediableId?: number
): Promise<MediaUploadResponse> {
  // POST /media (multipart/form-data)
  const formData = new FormData();
  formData.append("file", file);
  
  if (mediableType && mediableId) {
    formData.append("mediable_type", mediableType);
    formData.append("mediable_id", mediableId.toString());
  }

  const response = await axiosInstance.post("/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}

// Export all functions as default object
export const mediaApi = {
  uploadMedia,
};
