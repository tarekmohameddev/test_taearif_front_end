// Update functions for ctaValuation component
export const createCtaValuationUpdateFunctions = (set) => ({
  updateCtaValuation: (ctaValuationData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              ctaValuation: {
                ...state.tenantData.componentSettings?.ctaValuation,
                data: ctaValuationData,
              },
            },
          }
        : state.tenantData,
    })),
  updateCtaValuationVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              ctaValuation: {
                ...state.tenantData.componentSettings?.ctaValuation,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
