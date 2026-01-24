import type { PropertyFormStore, ValidationErrors } from "./types";
import { initialState } from "./initialState";

export const createValidationSlice = (
  set: (partial: Partial<PropertyFormStore>) => void,
  get: () => PropertyFormStore
): Pick<
  PropertyFormStore,
  | "errors"
  | "missingFields"
  | "missingFieldsAr"
  | "validationErrors"
  | "setErrors"
  | "setError"
  | "clearError"
  | "clearAllErrors"
  | "setMissingFields"
  | "setMissingFieldsAr"
  | "setValidationErrors"
  | "clearValidation"
> => ({
  errors: initialState.errors,
  missingFields: initialState.missingFields,
  missingFieldsAr: initialState.missingFieldsAr,
  validationErrors: initialState.validationErrors,

  setErrors: (errors) => {
    set({ errors });
  },

  setError: (field, error) => {
    const current = get();
    set({
      errors: {
        ...current.errors,
        [field]: error,
      },
    });
  },

  clearError: (field) => {
    const current = get();
    const newErrors = { ...current.errors };
    delete newErrors[field];
    set({ errors: newErrors });
  },

  clearAllErrors: () => {
    set({ errors: {} });
  },

  setMissingFields: (fields) => {
    set({ missingFields: fields });
  },

  setMissingFieldsAr: (fields) => {
    set({ missingFieldsAr: fields });
  },

  setValidationErrors: (errors) => {
    set({ validationErrors: errors });
  },

  clearValidation: () => {
    set({
      errors: {},
      missingFields: [],
      missingFieldsAr: [],
      validationErrors: [],
    });
  },
});
