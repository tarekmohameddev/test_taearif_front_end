import { useEffect, useRef } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib/types";
import {
  isStaticPage,
  getDefaultComponentForStaticPage,
} from "./utils/staticPageHelpers";
import { formatStaticPageComponents } from "./utils/staticPageHelpers";

interface UseStoreSyncEffectProps {
  initialized: boolean;
  slug: string;
  tenantData: any;
  pageComponents: ComponentInstance[];
  setPageComponents: (
    components:
      | ComponentInstance[]
      | ((prev: ComponentInstance[]) => ComponentInstance[]),
  ) => void;
  lastSyncedRef: React.MutableRefObject<string>;
}

export const useStoreSyncEffect = ({
  initialized,
  slug,
  tenantData,
  pageComponents,
  setPageComponents,
  lastSyncedRef,
}: UseStoreSyncEffectProps) => {
  // Subscribe to pageComponentsByPage changes for current page
  const storePageComponents = useEditorStore(
    (state) => state.pageComponentsByPage[slug],
  );

  // Subscribe to currentTheme changes to detect theme restore
  const currentTheme = useEditorStore(
    (state) => state.WebsiteLayout?.currentTheme,
  );
  const themeChangeTimestamp = useEditorStore(
    (state) => state.themeChangeTimestamp,
  );
  const staticPagesData = useEditorStore((state) => state.staticPagesData);

  // Create a more comprehensive signature that includes data hash
  const createSignature = (components: any[]) => {
    if (!components || components.length === 0) return "empty";
    return components
      .map((c) => {
        // Include data hash in signature to detect data changes
        const dataHash = JSON.stringify(c.data || {});
        return `${c.id}-${c.type}-${c.componentName}-${dataHash.substring(0, 50)}`;
      })
      .sort()
      .join(",");
  };

  // ⭐ CRITICAL: Use ref to track if we're currently updating to prevent loops
  const isUpdatingRef = useRef(false);

  // ⭐ CRITICAL: Track previous themeChangeTimestamp to detect changes
  const prevThemeChangeTimestampRef = useRef(0);

  useEffect(() => {
    // Only sync if already initialized to avoid conflicts with initial load
    if (!initialized) return;

    // ⭐ CRITICAL: Prevent recursive updates
    if (isUpdatingRef.current) {
      return;
    }

    // ⭐ NEW: For static pages, always check staticPagesData first
    // ⭐ CRITICAL: Also check if theme was recently changed to force update
    const editorStore = useEditorStore.getState();
    const pageIsStatic = isStaticPage(slug, tenantData, editorStore);
    const currentThemeChangeTimestamp = editorStore.themeChangeTimestamp;
    const hasRecentThemeChange = currentThemeChangeTimestamp > 0;

    // ⭐ CRITICAL: Detect if themeChangeTimestamp changed
    const themeChangeTimestampChanged =
      themeChangeTimestamp !== prevThemeChangeTimestampRef.current &&
      themeChangeTimestamp > 0;

    if (pageIsStatic) {
      const staticPageData = editorStore.getStaticPageData(slug);
      const staticPageComponents = staticPageData?.components || [];

      if (staticPageComponents.length > 0) {
        const staticComponents = formatStaticPageComponents(
          staticPageComponents,
          slug,
        );

        const staticSignature = createSignature(staticComponents);

        // ⭐ CRITICAL: Force update if:
        // 1. Theme was recently changed (hasRecentThemeChange)
        // 2. ThemeChangeTimestamp changed (themeChangeTimestampChanged)
        // 3. Signature doesn't match
        // This ensures static pages are updated immediately after theme change/reset
        const shouldUpdate =
          hasRecentThemeChange ||
          themeChangeTimestampChanged ||
          lastSyncedRef.current !== staticSignature;

        if (shouldUpdate) {
          console.log(
            `[useStoreSyncEffect] Force updating static page after theme change:`,
            {
              slug,
              hasRecentThemeChange,
              themeChangeTimestampChanged,
              signatureChanged: lastSyncedRef.current !== staticSignature,
              componentNames: staticComponents.map((c: any) => c.componentName),
            },
          );

          isUpdatingRef.current = true;
          setPageComponents(staticComponents);
          lastSyncedRef.current = staticSignature;
          prevThemeChangeTimestampRef.current = themeChangeTimestamp;
          // Reset flag after a short delay to allow state update to complete
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
          return; // Skip normal sync logic for static pages
        } else {
          // Already synced, skip to avoid infinite loop
          return;
        }
      }
    }

    // ⭐ CRITICAL: Force sync if themeChangeTimestamp changed (after theme restore)
    // This ensures immediate update after clearAllStates() and restore
    // We need to check the store directly to get the latest data, not rely on subscription
    if (themeChangeTimestamp > 0) {
      // Get fresh data from store (bypass subscription timing issues)
      const store = useEditorStore.getState();
      const freshStorePageComponents = store.pageComponentsByPage[slug];

      // ⭐ NEW: For static pages, check staticPagesData first (even if freshStorePageComponents exists)
      // This ensures static pages are updated from staticPagesData after theme change
      const pageIsStatic = isStaticPage(slug, tenantData, store);

      if (pageIsStatic) {
        const staticPageData = store.getStaticPageData(slug);
        const staticPageComponents = staticPageData?.components || [];

        if (staticPageComponents.length > 0) {
          const staticComponents = formatStaticPageComponents(
            staticPageComponents,
            slug,
          );

          const staticSignature = createSignature(staticComponents);

          // ⭐ CRITICAL: Force update if themeChangeTimestamp changed, even if signature matches
          // This ensures componentName changes (e.g., propertyDetail1 -> propertyDetail2) are detected
          const shouldUpdate =
            themeChangeTimestampChanged ||
            lastSyncedRef.current !== staticSignature;

          if (shouldUpdate) {
            console.log(
              `[useStoreSyncEffect] Force updating static page from staticPagesData:`,
              {
                slug,
                themeChangeTimestampChanged,
                signatureChanged: lastSyncedRef.current !== staticSignature,
                componentNames: staticComponents.map((c: any) => c.componentName),
              },
            );

            isUpdatingRef.current = true;
            setPageComponents(staticComponents);
            lastSyncedRef.current = staticSignature;
            prevThemeChangeTimestampRef.current = themeChangeTimestamp;
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 0);
          }
          return;
        }
      }

      if (freshStorePageComponents !== undefined) {
        const storeSignature = createSignature(freshStorePageComponents);

        // ⭐ CRITICAL: Force update if themeChangeTimestamp changed, even if signature matches
        // This ensures componentName changes are detected
        const shouldUpdate =
          themeChangeTimestampChanged ||
          lastSyncedRef.current !== storeSignature;

        if (shouldUpdate) {
          console.log(
            `[useStoreSyncEffect] Force updating pageComponents from pageComponentsByPage:`,
            {
              slug,
              themeChangeTimestampChanged,
              signatureChanged: lastSyncedRef.current !== storeSignature,
              componentCount: freshStorePageComponents.length,
            },
          );

          isUpdatingRef.current = true;
          setPageComponents(freshStorePageComponents || []);
          lastSyncedRef.current = storeSignature;
          prevThemeChangeTimestampRef.current = themeChangeTimestamp;
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        }
        return;
      } else {
        // If storePageComponents is undefined, set to empty array to clear iframe
        // BUT: Skip for static pages if they have components in staticPagesData
        const pageIsStatic = isStaticPage(slug, tenantData, store);

        if (pageIsStatic) {
          const staticPageData = store.getStaticPageData(slug);
          if (staticPageData?.components?.length > 0) {
            // Don't clear, static page has components
            return;
          }
        }
        if (lastSyncedRef.current !== "empty") {
          isUpdatingRef.current = true;
          setPageComponents([]);
          lastSyncedRef.current = "empty";
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        }
        return;
      }
    }

    // Normal sync: Force sync if storePageComponents exists (even if empty array)
    if (storePageComponents !== undefined) {
      const storeSignature = createSignature(storePageComponents);
      const currentSignature = createSignature(pageComponents);

      // Force update if:
      // 1. Signatures are different
      // 2. We haven't synced this exact state
      // 3. Store has components but current doesn't (or vice versa)
      // 4. Store changed from undefined to defined (or vice versa)
      const shouldUpdate =
        storeSignature !== currentSignature &&
        (lastSyncedRef.current !== storeSignature ||
          (storePageComponents.length > 0 && pageComponents.length === 0) ||
          (storePageComponents.length === 0 && pageComponents.length > 0));

      if (shouldUpdate) {
        isUpdatingRef.current = true;
        lastSyncedRef.current = storeSignature;
        setPageComponents(storePageComponents || []);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);
      }
    } else {
      // ⭐ NEW: For static pages, check staticPagesData before clearing
      const editorStore = useEditorStore.getState();
      const pageIsStatic = isStaticPage(slug, tenantData, editorStore);

      if (pageIsStatic) {
        const staticPageData = editorStore.getStaticPageData(slug);
        const staticPageComponents = staticPageData?.components || [];

        if (staticPageComponents.length > 0) {
          // Convert static page components to the format expected by setPageComponents
          const staticComponents = formatStaticPageComponents(
            staticPageComponents,
            slug,
          );

          const staticSignature = createSignature(staticComponents);
          if (lastSyncedRef.current !== staticSignature) {
            isUpdatingRef.current = true;
            setPageComponents(staticComponents);
            lastSyncedRef.current = staticSignature;
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 0);
            return;
          }
        }
      }

      // ⭐ NEW: If storePageComponents is undefined but we have pageComponents, clear them
      // This handles the case where clearAllStates() was called but pageComponents wasn't updated
      // BUT: Skip this for static pages if they have components in staticPagesData
      if (pageComponents.length > 0 && lastSyncedRef.current !== "empty") {
        isUpdatingRef.current = true;
        setPageComponents([]);
        lastSyncedRef.current = "empty";
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);
      }
    }
  }, [
    initialized,
    slug,
    storePageComponents,
    setPageComponents,
    currentTheme,
    themeChangeTimestamp,
    staticPagesData,
    tenantData,
    pageComponents,
    lastSyncedRef,
  ]);
};
