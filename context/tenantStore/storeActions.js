// Basic store actions
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";

export const createStoreActions = (set, get) => ({
  setTenant: (tenant) => {
    const state = get();

    // Track tenant store update (lazy-load debug modules)
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
              componentType: "tenant",
              componentId: "tenant",
              variantId: "tenant",
            },
            {
              action: "setTenant",
              page:
                typeof window !== "undefined"
                  ? window.location.pathname
                  : "unknown",
            },
          );

          eventTracker.trackEvent(
            eventFormatter.formatEvent({
              eventType: "STORE_UPDATED",
              context,
              details: {
                action: "setTenant",
                source: "tenantStore",
                storeType: "tenant",
              },
              before: {
                componentData: state.tenant || {},
                storeState: state,
                mergedData: state.tenant || {},
              },
              after: {
                componentData: tenant || {},
                storeState: { ...state, tenant },
                mergedData: tenant || {},
              },
            }),
          );
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[tenantStore] Failed to load debug modules for setTenant",
              e,
            );
          }
        }
      })();
    }

    set({ tenant });
  },
  setTenantId: (tenantId) => {
    const currentState = get();
    if (tenantId !== currentState.tenantId) {
      // Track tenantId change (lazy-load debug modules)
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
                componentType: "tenant",
                componentId: "tenant",
                variantId: "tenant",
              },
              {
                action: "setTenantId",
                page:
                  typeof window !== "undefined"
                    ? window.location.pathname
                    : "unknown",
              },
            );

            eventTracker.trackEvent(
              eventFormatter.formatEvent({
                eventType: "STORE_UPDATED",
                context,
                details: {
                  action: "setTenantId",
                  source: "tenantStore",
                  storeType: "tenant",
                  oldTenantId: currentState.tenantId,
                  newTenantId: tenantId,
                },
                before: {
                  componentData: { tenantId: currentState.tenantId },
                  storeState: currentState,
                  mergedData: { tenantId: currentState.tenantId },
                },
                after: {
                  componentData: { tenantId },
                  storeState: {
                    ...currentState,
                    tenantId,
                    tenantData: null,
                    lastFetchedWebsite: null,
                    loadingTenantData: false,
                  },
                  mergedData: { tenantId },
                },
              }),
            );
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "[tenantStore] Failed to load debug modules for setTenantId",
                e,
              );
            }
          }
        })();
      }

      set({
        tenantId,
        tenantData: null,
        lastFetchedWebsite: null,
        loadingTenantData: false,
      });
    }
  },
});
