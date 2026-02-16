// Update functions for footer component
export const createFooterUpdateFunctions = (set) => ({
  updateFooter: (footerData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              footer: {
                ...state.tenantData.componentSettings?.footer,
                data: footerData,
              },
            },
          }
        : state.tenantData,
    })),
  updateFooterVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              footer: {
                ...state.tenantData.componentSettings?.footer,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
