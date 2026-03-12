import { getUserToken } from "../utils/authHelper";
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";

// Save hero changes function
export const createSaveHeroChanges = (set) => ({
  saveHeroChanges: async (tenantId, heroData, variant) => {
    // Track saveHeroChanges call (lazy-load debug modules)
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
              componentId: variant || "hero1",
              variantId: variant || "hero1",
            },
            {
              action: "saveHeroChanges",
              page:
                typeof window !== "undefined"
                  ? window.location.pathname
                  : "unknown",
            },
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
            }),
          );
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[tenantStore] Failed to load debug modules for saveHeroChanges",
              e,
            );
          }
        }
      })();
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

      // Track successful save (lazy-load debug modules)
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
                componentId: variant || "hero1",
                variantId: variant || "hero1",
              },
              {
                action: "saveHeroChanges_success",
                page:
                  typeof window !== "undefined"
                    ? window.location.pathname
                    : "unknown",
              },
            );

            const mergedData =
              updatedTenant?.componentSettings?.hero?.data || heroData || {};

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
                  componentData: mergedData,
                  storeState: { tenantData: updatedTenant },
                  mergedData,
                },
              }),
            );
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "[tenantStore] Failed to load debug modules for saveHeroChanges_success",
                e,
              );
            }
          }
        })();
      }

      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      // Track save error (lazy-load debug modules)
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
                componentId: variant || "hero1",
                variantId: variant || "hero1",
              },
              {
                action: "saveHeroChanges_error",
                page:
                  typeof window !== "undefined"
                    ? window.location.pathname
                    : "unknown",
              },
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
              }),
            );
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "[tenantStore] Failed to load debug modules for saveHeroChanges_error",
                e,
              );
            }
          }
        })();
      }

      return false;
    }
  },
});
