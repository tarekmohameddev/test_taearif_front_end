import type { FormData, ValidationErrors } from "../types/propertyForm.types";

export const usePropertyHandlers = (
  formData: FormData,
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void,
  errors: ValidationErrors,
  setErrors: (errors: ValidationErrors | ((prev: ValidationErrors) => ValidationErrors)) => void,
  validateUrl: (value: string, name: string) => void,
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCounterChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value.toString() }));
  };

  const handleCitySelect = (cityId: number) => {
    setFormData((prev) => ({ ...prev, city_id: cityId, district_id: null }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate URL format if not empty
    if (value.trim()) {
      validateUrl(value, name);
    }
  };

  return {
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleCounterChange,
    handleCitySelect,
    handleUrlChange,
  };
};
