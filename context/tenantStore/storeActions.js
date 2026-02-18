// Basic store actions
import { eventTracker } from "@/lib/debug/live-editor/trackers/eventTracker";
import { eventFormatter } from "@/lib/debug/live-editor/formatters/eventFormatter";
import { extractContext } from "@/lib/debug/live-editor/utils/contextUtils";
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";

export const createStoreActions = (set, get) => ({
  setTenant: (tenant) => {
    const state = get();
    
    // Track tenant store update
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType: "tenant",
          componentId: "tenant",
          variantId: "tenant",
        },
        {
          action: "setTenant",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
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
        })
      );
    }
    
    set({ tenant });
  },
  setTenantId: (tenantId) => {
    const currentState = get();
    if (tenantId !== currentState.tenantId) {
      // Track tenantId change
      if (isDebugEnabled()) {
        const context = extractContext(
          {
            componentType: "tenant",
            componentId: "tenant",
            variantId: "tenant",
          },
          {
            action: "setTenantId",
            page: typeof window !== "undefined" ? window.location.pathname : "unknown",
          }
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
              storeState: { ...currentState, tenantId, tenantData: null, lastFetchedWebsite: null, loadingTenantData: false },
              mergedData: { tenantId },
            },
          })
        );
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
