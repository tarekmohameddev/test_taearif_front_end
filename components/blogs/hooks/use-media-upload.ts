/**
 * useMediaUpload Hook
 * 
 * @description Hook لرفع الملفات الإعلامية (thumbnail + media)
 * 
 * @dependencies
 * - Uses: services/media-api.ts (uploadMedia)
 * - Used by: 
 *   - components/form/blog-thumbnail-upload.tsx
 *   - components/form/blog-media-upload.tsx
 *   - hooks/use-blog-form.ts
 * 
 * @returns {Object} { uploadFile, uploading, error }
 * 
 * @related
 * - types/media.types.ts (Media type)
 * - services/media-api.ts (API calls)
 */

import { useState } from "react";
import { mediaApi } from "../services/media-api";
import type { Media } from "../types/media.types";

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a single media file
   * @param file - File to upload
   * @param mediableType - Optional: Type of related model
   * @param mediableId - Optional: ID of related model
   * @returns Promise with uploaded media data
   */
  const uploadFile = async (
    file: File,
    mediableType?: string,
    mediableId?: number
  ): Promise<Media | null> => {
    try {
      setUploading(true);
      setError(null);
      
      // POST /media - رفع ملف إعلامي
      const response = await mediaApi.uploadMedia(file, mediableType, mediableId);
      return response.data;
    } catch (err: any) {
      console.error("Error uploading media:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "فشل في رفع الملف";
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param mediableType - Optional: Type of related model
   * @param mediableId - Optional: ID of related model
   * @returns Promise with array of uploaded media data
   */
  const uploadFiles = async (
    files: File[],
    mediableType?: string,
    mediableId?: number
  ): Promise<Media[]> => {
    const uploadPromises = files.map((file) =>
      uploadFile(file, mediableType, mediableId)
    );
    const results = await Promise.all(uploadPromises);
    return results.filter((media): media is Media => media !== null);
  };

  return {
    uploadFile,
    uploadFiles,
    uploading,
    error,
  };
}
