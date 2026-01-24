import { useState } from "react";
import toast from "react-hot-toast";
import type { Images, Previews, ValidationErrors } from "../types/propertyForm.types";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_VIDEO_DURATION = 300; // 5 minutes in seconds

export const useFileUpload = (
  images: Images,
  setImages: (images: Images | ((prev: Images) => Images)) => void,
  previews: Previews,
  setPreviews: (previews: Previews | ((prev: Previews) => Previews)) => void,
  setVideo: (video: File | null) => void,
  setVideoPreview: (preview: string | null) => void,
  errors: ValidationErrors,
  setErrors: (errors: ValidationErrors | ((prev: ValidationErrors) => ValidationErrors)) => void,
) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "thumbnail") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى تحميل ملفات صور فقط (JPG, PNG, GIF)");
        e.target.value = "";
        return;
      }
      if (file.size >= MAX_IMAGE_SIZE) {
        toast.error(
          "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
        );
        e.target.value = "";
        return;
      }
      setImages((prev) => ({ ...prev, thumbnail: file }));
      setPreviews((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
      }));
      if (errors.thumbnail) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.thumbnail;
          return newErrors;
        });
      }
    } else if (type === "deedImage") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى تحميل ملفات صور فقط (JPG, PNG, GIF)");
        e.target.value = "";
        return;
      }
      if (file.size >= MAX_IMAGE_SIZE) {
        toast.error(
          "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
        );
        e.target.value = "";
        return;
      }
      setImages((prev) => ({ ...prev, deedImage: file }));
      setPreviews((prev) => ({
        ...prev,
        deedImage: URL.createObjectURL(file),
      }));
    } else if (type === "video") {
      const file = files[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        toast.error("يجب أن يكون الفيديو بصيغة MP4 أو MOV أو AVI فقط");
        e.target.value = "";
        return;
      }

      if (file.size >= MAX_VIDEO_SIZE) {
        toast.error(
          "حجم الفيديو كبير جداً. الحد الأقصى المسموح به هو 50 ميجابايت",
        );
        e.target.value = "";
        return;
      }

      // التحقق من طول الفيديو
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;

        if (duration > MAX_VIDEO_DURATION) {
          toast.error("يجب أن يكون طول الفيديو أقل من 5 دقائق");
          e.target.value = "";
          return;
        }

        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));
      };

      video.onerror = () => {
        toast.error("حدث خطأ أثناء تحميل الفيديو");
        e.target.value = "";
      };

      video.src = URL.createObjectURL(file);
    } else {
      // Gallery or floorPlans
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("يجب أن تكون الصور بصيغة JPG أو PNG أو GIF فقط");
          return false;
        }
        if (file.size >= MAX_IMAGE_SIZE) {
          toast.error(
            "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
          );
          return false;
        }
        return true;
      });

      if (validFiles.length !== files.length) {
        e.target.value = "";
      }
      setImages((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), ...validFiles],
      }));
      setPreviews((prev) => ({
        ...prev,
        [type]: [
          ...(prev[type] || []),
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ],
      }));
    }

    e.target.value = "";
  };

  const removeImage = (type: string, index?: number) => {
    if (type === "thumbnail") {
      setImages((prev) => ({ ...prev, thumbnail: null }));
      setPreviews((prev) => ({ ...prev, thumbnail: null }));
    } else if (type === "deedImage") {
      setImages((prev) => ({ ...prev, deedImage: null }));
      setPreviews((prev) => ({ ...prev, deedImage: null }));
    } else {
      setImages((prev) => ({
        ...prev,
        [type]: (prev[type] || []).filter((_: any, i: number) => i !== index),
      }));
      setPreviews((prev) => ({
        ...prev,
        [type]: (prev[type] || []).filter((_: any, i: number) => i !== index),
      }));
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  return {
    uploading,
    setUploading,
    handleFileChange,
    removeImage,
    removeVideo,
  };
};
