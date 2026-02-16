// Update functions for hero component
export const createHeroUpdateFunctions = (set) => ({
  updateHero: (heroData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              hero: {
                ...state.tenantData.componentSettings?.hero,
                data: heroData,
              },
            },
          }
        : state.tenantData,
    })),
  updateHeroVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              hero: {
                ...state.tenantData.componentSettings?.hero,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  saveHeroChanges: (heroData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              hero: {
                ...state.tenantData.componentSettings?.hero,
                data: heroData,
              },
            },
          }
        : state.tenantData,
    })),
});
