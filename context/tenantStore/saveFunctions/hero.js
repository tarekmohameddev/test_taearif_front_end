import { getUserToken } from "../utils/authHelper";
import { eventTracker } from "@/lib/debug/live-editor/trackers/eventTracker";
import { eventFormatter } from "@/lib/debug/live-editor/formatters/eventFormatter";
import { extractContext } from "@/lib/debug/live-editor/utils/contextUtils";
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";

// Save hero changes function
export const createSaveHeroChanges = (set) => ({
  saveHeroChanges: async (tenantId, heroData, variant) => {
    // Track saveHeroChanges call
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType: "hero",
          componentId: variant || "hero1",
          variantId: variant || "hero1",
        },
        {
          action: "saveHeroChanges",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
      );

      eventTracker.trackEvent(
        eventFormatter.formatEvent({
          eventType: "SAVE_INITIATED",
          context,
          details: {
            action: "saveHeroChanges",
            source: "tenantStore",
            storeType: "tenant",
            tenantId,
            variant,
          },
          before: {
            componentData: heroData || {},
            storeState: {},
            mergedData: heroData || {},
          },
        })
      );
    }
    
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = await getUserToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          heroData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero changes");
      }

      const updatedTenant = await response.json();
      
      // Track successful save
      if (isDebugEnabled()) {
        const context = extractContext(
          {
            componentType: "hero",
            componentId: variant || "hero1",
            variantId: variant || "hero1",
          },
          {
            action: "saveHeroChanges_success",
            page: typeof window !== "undefined" ? window.location.pathname : "unknown",
          }
        );

        eventTracker.trackEvent(
          eventFormatter.formatEvent({
            eventType: "SAVE_COMPLETED",
            context,
            details: {
              action: "saveHeroChanges_success",
              source: "tenantStore",
              storeType: "tenant",
              tenantId,
              variant,
              success: true,
            },
            after: {
              componentData: updatedTenant?.componentSettings?.hero?.data || heroData || {},
              storeState: { tenantData: updatedTenant },
              mergedData: updatedTenant?.componentSettings?.hero?.data || heroData || {},
            },
          })
        );
      }
      
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      // Track save error
      if (isDebugEnabled()) {
        const context = extractContext(
          {
            componentType: "hero",
            componentId: variant || "hero1",
            variantId: variant || "hero1",
          },
          {
            action: "saveHeroChanges_error",
            page: typeof window !== "undefined" ? window.location.pathname : "unknown",
          }
        );

        eventTracker.trackEvent(
          eventFormatter.formatEvent({
            eventType: "SAVE_COMPLETED",
            context,
            details: {
              action: "saveHeroChanges_error",
              source: "tenantStore",
              storeType: "tenant",
              tenantId,
              variant,
              success: false,
              error: error.message,
            },
          })
        );
      }
      
      return false;
    }
  },
});
