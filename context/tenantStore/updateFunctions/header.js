// Update functions for header component
export const createHeaderUpdateFunctions = (set) => ({
  updateHeader: (headerData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              header: {
                ...state.tenantData.componentSettings?.header,
                data: headerData,
              },
            },
          }
        : state.tenantData,
    })),
  updateHeaderVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              header: {
                ...state.tenantData.componentSettings?.header,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
