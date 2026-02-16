// Basic store actions
export const createStoreActions = (set, get) => ({
  setTenant: (tenant) => set({ tenant }),
  setTenantId: (tenantId) => {
    const currentState = get();
    if (tenantId !== currentState.tenantId) {
      set({
        tenantId,
        tenantData: null,
        lastFetchedWebsite: null,
        loadingTenantData: false,
      });
    }
  },
});
