// Update functions for hero component
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";

export const createHeroUpdateFunctions = (set, get) => ({
  updateHero: (heroData) => {
    const currentState = get ? get() : {};

    // Track updateHero call (lazy-load debug modules)
    if (isDebugEnabled()) {
      (async () => {
        try {
          const [
            { eventTracker },
            { eventFormatter },
            { extractContext },
          ] = await Promise.all([
            import("@/lib/debug/live-editor/trackers/eventTracker"),
            import("@/lib/debug/live-editor/formatters/eventFormatter"),
            import("@/lib/debug/live-editor/utils/contextUtils"),
          ]);

          const context = extractContext(
            {
              componentType: "hero",
              componentId: "hero",
              variantId: "hero",
            },
            {
              action: "updateHero",
              page:
                typeof window !== "undefined"
                  ? window.location.pathname
                  : "unknown",
            },
          );

          const existingHeroData =
            currentState.tenantData?.componentSettings?.hero?.data || {};

          eventTracker.trackEvent(
            eventFormatter.formatEvent({
              eventType: "STORE_UPDATED",
              context,
              details: {
                action: "updateHero",
                source: "tenantStore",
                storeType: "tenant",
              },
              before: {
                componentData: existingHeroData,
                storeState: currentState,
                mergedData: existingHeroData,
              },
              after: {
                componentData: heroData || {},
                storeState: {},
                mergedData: heroData || {},
              },
            }),
          );
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[tenantStore] Failed to load debug modules for updateHero",
              e,
            );
          }
        }
      })();
    }

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
    }));
  },
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
