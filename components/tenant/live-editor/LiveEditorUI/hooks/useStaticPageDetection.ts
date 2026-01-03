// ============================================================================
// Hook for detecting static pages
// ============================================================================

import { useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultComponentForStaticPage } from "@/components/tenant/live-editor/effects/utils/staticPageHelpers";
import { isMultiLevelPage } from "@/lib-liveeditor/multiLevelPages";

export function useStaticPageDetection(slug: string | undefined): boolean {
  const getStaticPageData = useEditorStore((s) => s.getStaticPageData);
  const editorStore = useEditorStore();
  const tenantData = useTenantStore((s) => s.tenantData);

  const isStaticPage = useMemo(() => {
    const currentSlug = slug || "";
    if (!currentSlug) return false;

    // ⭐ Use the same logic as isStaticPage function for consistency
    // This ensures all static pages (including create-request) are detected correctly

    // ⭐ Priority 0: Check if it's a multi-level page (project, property, etc.)
    if (isMultiLevelPage(currentSlug)) {
      return true;
    }

    // ⭐ Priority 1: Check static pages in editorStore
    const staticPageData = getStaticPageData(currentSlug);
    if (staticPageData) {
      return true;
    }

    // ⭐ Priority 2: Check tenantData.StaticPages
    if (tenantData?.StaticPages?.[currentSlug]) {
      const staticPageFromTenant = tenantData.StaticPages[currentSlug];
      // Format 1: Array [slug, components]
      if (
        Array.isArray(staticPageFromTenant) &&
        staticPageFromTenant.length === 2
      ) {
        return true;
      }
      // Format 2: Object { slug, components }
      if (
        typeof staticPageFromTenant === "object" &&
        !Array.isArray(staticPageFromTenant)
      ) {
        return true;
      }
    }

    // ⭐ Priority 3: Check if default component exists for this slug (fallback)
    // This ensures newly added static pages are recognized even if not in tenantData or store
    const defaultComponent = getDefaultComponentForStaticPage(currentSlug);
    if (defaultComponent) {
      return true;
    }

    return false;
  }, [slug, getStaticPageData, tenantData, editorStore]);

  return isStaticPage;
}
