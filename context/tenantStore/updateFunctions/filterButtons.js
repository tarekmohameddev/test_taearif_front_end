// Update functions for filterButtons component
export const createFilterButtonsUpdateFunctions = (set) => ({
  updateFilterButtons: (filterButtonsData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              filterButtons: {
                ...state.tenantData.componentSettings?.filterButtons,
                data: filterButtonsData,
              },
            },
          }
        : state.tenantData,
    })),
  updateFilterButtonsVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              filterButtons: {
                ...state.tenantData.componentSettings?.filterButtons,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
