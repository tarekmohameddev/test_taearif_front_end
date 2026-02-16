// Update functions for propertyFilter and applicationForm components
export const createPropertyFilterUpdateFunctions = (set) => ({
  updatePropertyFilter: (propertyFilterData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              propertyFilter: {
                ...state.tenantData.componentSettings?.propertyFilter,
                data: propertyFilterData,
              },
            },
          }
        : state.tenantData,
    })),
  updateApplicationForm: (applicationFormData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              applicationForm: {
                ...state.tenantData.componentSettings?.applicationForm,
                data: applicationFormData,
              },
            },
          }
        : state.tenantData,
    })),
  updatePropertyFilterVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              propertyFilter: {
                ...state.tenantData.componentSettings?.propertyFilter,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updateApplicationFormVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              applicationForm: {
                ...state.tenantData.componentSettings?.applicationForm,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
