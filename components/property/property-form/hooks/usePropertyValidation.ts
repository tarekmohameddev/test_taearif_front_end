import { useMemo } from "react";
import type { FormData, Images, Previews, ValidationErrors } from "../types/propertyForm.types";
import { validateForm as validateFormUtil, validateUrl as validateUrlUtil } from "../utils/validation";
import { getFieldDisplayName } from "../utils/constants";

export const usePropertyValidation = (
  formData: FormData,
  images: Images,
  previews: Previews,
  mode: "add" | "edit",
  isDraft: boolean,
  missingFields: string[],
  setErrors: (errors: ValidationErrors | ((prev: ValidationErrors) => ValidationErrors)) => void,
) => {
  const validateForm = (): boolean => {
    const newErrors = validateFormUtil(formData, images, previews, mode);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUrl = (value: string, name: string) => {
    if (validateUrlUtil(value)) {
      setErrors((prev: ValidationErrors) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } else {
      setErrors((prev: ValidationErrors) => ({
        ...prev,
        [name]: "الرجاء إدخال رابط صحيح",
      }));
    }
  };

  const isFieldMissing = (fieldName: string): boolean => {
    if (!isDraft || !missingFields.length) return false;
    return missingFields.some(
      (field) => field.toLowerCase() === fieldName.toLowerCase(),
    );
  };

  const cardHasMissingFields = (cardFields: string[]): boolean => {
    if (!isDraft || !missingFields.length) return false;
    return cardFields.some((field) => isFieldMissing(field));
  };

  const getFieldDisplayNameMemo = useMemo(
    () => (fieldName: string) => getFieldDisplayName(fieldName),
    [],
  );

  return {
    validateForm,
    validateUrl,
    isFieldMissing,
    cardHasMissingFields,
    getFieldDisplayName: getFieldDisplayNameMemo,
  };
};
