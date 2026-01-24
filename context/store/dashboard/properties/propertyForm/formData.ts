import type { PropertyFormStore, FormData } from "./types";
import { initialFormData } from "./initialState";

export const createFormDataSlice = (
  set: (partial: Partial<PropertyFormStore>) => void,
  get: () => PropertyFormStore
): Pick<
  PropertyFormStore,
  "formData" | "setFormData" | "updateFormField" | "resetFormData"
> => ({
  formData: initialFormData,

  setFormData: (data) => {
    const current = get();
    if (typeof data === "function") {
      set({ formData: data(current.formData) });
    } else {
      set({ formData: data });
    }
  },

  updateFormField: (field, value) => {
    const current = get();
    set({
      formData: {
        ...current.formData,
        [field]: value,
      },
    });
  },

  resetFormData: () => {
    set({
      formData: { ...initialFormData },
    });
  },
});
