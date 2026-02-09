import { PageFormData } from "../types/types";
import useTenantStore from "@/context/tenantStore";
import { useEditorT } from "@/context/editorI18nStore";

export function usePageValidation() {
  const { tenantData } = useTenantStore();
  const t = useEditorT();

  const validateForm = (formData: PageFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = t("validation.slug_required");
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = t("validation.slug_format");
    }

    // التحقق من عدم تكرار الـ slug
    const existingSlugs = tenantData?.componentSettings
      ? Object.keys(tenantData.componentSettings)
      : [];
    if (existingSlugs.includes(formData.slug)) {
      newErrors.slug = t("validation.slug_exists");
    }

    if (!formData.TitleAr.trim()) {
      newErrors.TitleAr = "عنوان الصفحة بالعربي مطلوب";
    }

    if (!formData.TitleEn.trim()) {
      newErrors.TitleEn = "عنوان الصفحة بالإنجليزي مطلوب";
    }

    return newErrors;
  };

  return { validateForm };
}
