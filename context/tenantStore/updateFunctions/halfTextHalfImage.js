// Update functions for halfTextHalfImage components
export const createHalfTextHalfImageUpdateFunctions = (set) => ({
  updatehalfTextHalfImage: (halfTextHalfImageData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage: {
                ...state.tenantData.componentSettings?.halfTextHalfImage,
                data: halfTextHalfImageData,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImageVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage: {
                ...state.tenantData.componentSettings?.halfTextHalfImage,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage2: (halfTextHalfImage2Data) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage2: {
                ...state.tenantData.componentSettings?.halfTextHalfImage2,
                data: halfTextHalfImage2Data,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage2Variant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage2: {
                ...state.tenantData.componentSettings?.halfTextHalfImage2,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage3: (halfTextHalfImage3Data) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage3: {
                ...state.tenantData.componentSettings?.halfTextHalfImage3,
                data: halfTextHalfImage3Data,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage3Variant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage3: {
                ...state.tenantData.componentSettings?.halfTextHalfImage3,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
