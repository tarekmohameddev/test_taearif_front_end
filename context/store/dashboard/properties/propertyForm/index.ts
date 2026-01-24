import { create } from "zustand";
import type { PropertyFormStore } from "./types";
import { initialState } from "./initialState";
import { createFormDataSlice } from "./formData";
import { createUIStateSlice } from "./uiState";
import { createValidationSlice } from "./validation";
import { createMediaSlice } from "./media";
import { createFAQsSlice } from "./faqs";
import { createMapStateSlice } from "./mapState";

// Create the store with all slices
export const usePropertyFormStore = create<PropertyFormStore>((set, get) => {
  // Combine all slices
  const formDataSlice = createFormDataSlice(set, get);
  const uiStateSlice = createUIStateSlice(set, get);
  const validationSlice = createValidationSlice(set, get);
  const mediaSlice = createMediaSlice(set, get);
  const faqsSlice = createFAQsSlice(set, get);
  const mapStateSlice = createMapStateSlice(set, get);

  return {
    // Form Data
    ...formDataSlice,
    
    // UI State
    ...uiStateSlice,
    
    // Validation
    ...validationSlice,
    
    // Media
    ...mediaSlice,
    
    // FAQs
    ...faqsSlice,
    
    // Map State
    ...mapStateSlice,
    
    // Additional state
    currentFeature: initialState.currentFeature,
    selectedFacilities: initialState.selectedFacilities,
    categories: initialState.categories,
    projects: initialState.projects,
    facades: initialState.facades,
    buildings: initialState.buildings,
    
    // Additional actions
    setCurrentFeature: (feature) => {
      set({ currentFeature: feature });
    },
    
    setSelectedFacilities: (facilities) => {
      set({ selectedFacilities: facilities });
    },
    
    setCategories: (categories) => {
      set({ categories });
    },
    
    setProjects: (projects) => {
      set({ projects });
    },
    
    setFacades: (facades) => {
      set({ facades });
    },
    
    setBuildings: (buildings) => {
      set({ buildings });
    },
    
    // Store Management
    resetStore: () => {
      set({
        ...initialState,
        formData: { ...initialState.formData },
        images: { ...initialState.images },
        previews: { ...initialState.previews },
      });
    },
    
    clearStore: () => {
      set({
        ...initialState,
        formData: { ...initialState.formData },
        images: { ...initialState.images },
        previews: { ...initialState.previews },
      });
    },
  };
});

// Export types
export type { PropertyFormStore, FormData, Images, Previews, ValidationErrors, FAQ } from "./types";
