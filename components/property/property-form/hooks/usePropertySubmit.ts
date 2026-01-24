import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useStore from "@/context/Store";
import type { FormData, Images, Previews, FAQ } from "../types/propertyForm.types";
import { formatPropertyData } from "../utils/formatters";
import { createProperty, updateProperty, completeDraft, handleApiError } from "../services/propertyApi";
import { validateForm as validateFormUtil } from "../utils/validation";

export const usePropertySubmit = (
  mode: "add" | "edit",
  id: string | undefined,
  isDraft: boolean,
  formData: FormData,
  images: Images,
  previews: Previews,
  video: File | null,
  videoPreview: string | null,
  faqs: FAQ[],
  authLoading: boolean,
  userToken: string | undefined,
  setErrors: (errors: any) => void,
  setValidationErrors: (errors: string[]) => void,
) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isCompletingDraft, setIsCompletingDraft] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors = validateFormUtil(formData, images, previews, mode);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (authLoading || !userToken) {
      console.log("No token available or auth loading, skipping handleSubmit");
      alert("Authentication required. Please login.");
      return;
    }

    setSubmitError(null);
    if (!validateForm()) {
      toast.error("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      setSubmitError("يرجى التحقق من الحقول المطلوبة وإصلاح الأخطاء.");
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      const propertyData = await formatPropertyData(
        formData,
        images,
        previews,
        video,
        videoPreview,
        faqs,
        mode,
      );

      propertyData.status = publish ? 1 : 0;

      if (mode === "add") {
        await createProperty(propertyData);
      } else {
        await updateProperty(id!, propertyData, publish);
      }

      router.push(isDraft ? "/dashboard/properties/incomplete" : "/dashboard/properties");
    } catch (error: any) {
      toast.error("حدث خطأ أثناء حفظ الوحدة. يرجى المحاولة مرة أخرى.");
      setSubmitError("حدث خطأ أثناء حفظ الوحدة. يرجى المحاولة مرة أخرى.");
    } finally {
      setUploading(false);
      setIsLoading(false);
    }
  };

  const handleCompleteDraft = async () => {
    if (authLoading || !userToken || !id) {
      toast.error("Authentication required. Please login.");
      return;
    }

    if (!validateForm()) {
      toast.error("يرجى إكمال جميع الحقول المطلوبة");
      return;
    }

    setIsCompletingDraft(true);
    setSubmitError(null);

    try {
      const normalizedPurpose = formData.purpose === "sold" ? "sale" : formData.purpose;

      const completionData = {
        title: formData.title,
        address: formData.address,
        description: formData.description,
        city_id: formData.city_id,
        purpose: normalizedPurpose,
        type: formData.PropertyType || "",
        area: parseInt(formData.size) || 0,
        state_id: formData.district_id || null,
        category_id: parseInt(formData.category) || null,
        price: Number(formData.price) || null,
        beds: parseInt(formData.bedrooms) || null,
        bath: parseInt(formData.bathrooms) || null,
        featured_image: previews.thumbnail || null,
        gallery_images: previews.gallery || [],
      };

      await completeDraft(id, completionData);
      router.push("/dashboard/properties");
    } catch (error: any) {
      const { errorMessage, validationErrors: apiErrors, validationErrorsArray } = handleApiError(error);
      
      setSubmitError(errorMessage);
      toast.error(errorMessage);

      if (apiErrors) {
        setErrors(apiErrors);
      }

      if (validationErrorsArray) {
        setValidationErrors(validationErrorsArray);
      }
    } finally {
      setIsCompletingDraft(false);
    }
  };

  return {
    isLoading,
    uploading,
    isCompletingDraft,
    submitError,
    setSubmitError,
    handleSubmit,
    handleCompleteDraft,
  };
};
