import { isMultiLevelPage } from "@/lib-liveeditor/multiLevelPages";

/**
 * Returns the default component configuration for a static page
 * @param slug - The slug of the static page
 * @returns Default component configuration or null if not found
 */
export function getDefaultComponentForStaticPage(slug: string) {
  const defaults: Record<string, any> = {
    project: {
      id: "projectDetails1",
      type: "projectDetails",
      name: "Project Details",
      componentName: "projectDetails1",
      data: { projectSlug: "", visible: true },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    property: {
      id: "propertyDetail1",
      type: "propertyDetail",
      name: "Property Detail",
      componentName: "propertyDetail1",
      data: { propertySlug: "", visible: true },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    // يمكن إضافة صفحات ثابتة أخرى لاحقاً
    // products: { ... },
    // checkout: { ... },
  };

  return defaults[slug] || null;
}

/**
 * Checks if a page is a static page based on tenantData or editorStore
 * @param slug - The slug of the page to check
 * @param tenantData - Tenant data from getTenant
 * @param editorStore - Editor store instance
 * @returns true if the page is a static page, false otherwise
 */
export function isStaticPage(
  slug: string,
  tenantData: any,
  editorStore: any,
): boolean {
  if (!slug) return false;

  // ⭐ NEW: Check if page is a multi-level page (like "property", "project")
  // These pages should always be treated as static pages, even if no data exists
  if (isMultiLevelPage(slug)) {
    return true;
  }

  // Check if page exists in tenantData.StaticPages
  // Handle both formats: [slug, components] or { slug, components }
  const staticPageFromTenant = tenantData?.StaticPages?.[slug];
  if (staticPageFromTenant) {
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

  // Check if page exists in editorStore.staticPagesData
  const staticPageData = editorStore.getStaticPageData(slug);
  if (staticPageData) {
    return true;
  }

  return false;
}

/**
 * Converts static page components to the format expected by setPageComponents
 * @param components - Array of components from static page
 * @param slug - The slug of the static page
 * @returns Formatted components array
 */
export function formatStaticPageComponents(
  components: any[],
  slug: string,
): any[] {
  const defaultComponent = getDefaultComponentForStaticPage(slug);

  return components.map((comp: any) => {
    // Use componentName as id if it exists (for static pages, id should match componentName)
    const finalId =
      comp.componentName || comp.id || defaultComponent?.id || `${slug}1`;

    return {
      id: finalId, // ⭐ FIX: Use componentName as id to match variantId in states
      type: comp.type || defaultComponent?.type || slug,
      name: comp.name || defaultComponent?.name || slug,
      componentName:
        comp.componentName || defaultComponent?.componentName || `${slug}1`,
      data: comp.data || defaultComponent?.data || {},
      position: comp.position || 0,
      layout: comp.layout || { row: 0, col: 0, span: 2 },
      forceUpdate: comp.forceUpdate || 0,
    };
  });
}
