export interface ValidationErrors {
  [key: string]: string;
}

export interface FormData {
  title?: string;
  address?: string;
  purpose?: string;
  category?: string;
  description?: string;
  [key: string]: any;
}

export interface Images {
  thumbnail?: File | null;
  [key: string]: any;
}

export interface Previews {
  thumbnail?: string | null;
  [key: string]: any;
}

export const validateUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const validateForm = (
  formData: FormData,
  images: Images,
  previews: Previews,
  mode: "add" | "edit",
): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  if (!formData.title) newErrors.title = "اسم الوحدة مطلوب";
  if (!formData.address) newErrors.address = "عنوان الوحدة مطلوب";
  if (!formData.purpose) newErrors.purpose = "نوع القائمة مطلوب";
  if (!formData.category) newErrors.category = "فئة الوحدة مطلوبة";
  if (mode === "add" && !images.thumbnail)
    newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
  if (mode === "edit" && !previews.thumbnail && !images.thumbnail)
    newErrors.thumbnail = "صورة رئيسية واحدة على الأقل مطلوبة";
  if (!formData.description)
    newErrors.description = "من فضلك اكتب وصف للوحدة";

  return newErrors;
};
