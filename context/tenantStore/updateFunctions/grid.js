// Update functions for grid component
export const createGridUpdateFunctions = (set) => ({
  updateGrid: (gridData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              grid: {
                ...state.tenantData.componentSettings?.grid,
                data: gridData,
              },
            },
          }
        : state.tenantData,
    })),
  updateGridVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              grid: {
                ...state.tenantData.componentSettings?.grid,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
});
