// ============================================================================
// Component Loaders for Header and Footer
// ============================================================================

import { lazy } from "react";
import dynamic from "next/dynamic";
import { getComponentSubPath } from "@/lib/ComponentsList";

// Import static components
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import Header1 from "@/components/tenant/header/header1";
import Header2 from "@/components/tenant/header/header2";
import Footer1 from "@/components/tenant/footer/footer1";
import Footer2 from "@/components/tenant/footer/footer2";

// ⭐ Cache للـ header components
export const headerComponentsCache = new Map<string, any>();

// ⭐ Cache للـ footer components
export const footerComponentsCache = new Map<string, any>();

// Load header component dynamically (same logic as TenantPageWrapper)
export const loadHeaderComponent = (componentName: string) => {
  if (!componentName) return null;

  // ⭐ Check cache first
  if (headerComponentsCache.has(componentName)) {
    return headerComponentsCache.get(componentName);
  }

  // Handle StaticHeader1 specially (no number suffix)
  if (componentName === "StaticHeader1") {
    const component = lazy(() =>
      import(`@/components/tenant/header/StaticHeader1`).catch(() => ({
        default: StaticHeader1,
      })),
    );
    headerComponentsCache.set(componentName, component);
    return component;
  }

  // ⭐ Direct import for known header components (more reliable than dynamic import)
  const headerComponentMap: Record<string, any> = {
    header1: Header1,
    header2: Header2,
  };

  if (headerComponentMap[componentName]) {
    // Wrap in lazy for Suspense compatibility
    const component = lazy(() =>
      Promise.resolve({ default: headerComponentMap[componentName] }),
    );
    headerComponentsCache.set(componentName, component);
    return component;
  }

  // Fallback to dynamic import for other header variants
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.warn(
      `[Header Component] No subPath found for baseName: ${baseName}`,
    );
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  // Debug log (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    console.log("[LiveEditorUI Header Import Debug]", {
      baseName,
      subPath,
      fullPath,
      "Import path": `@/components/tenant/${fullPath}`,
    });
  }

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch((error) => {
        console.error(
          `[Header Import Error] Failed to load ${fullPath}:`,
          error,
        );
        return { default: StaticHeader1 };
      }),
    { ssr: false },
  );

  // ⭐ Cache the component
  headerComponentsCache.set(componentName, component);
  return component;
};

// Load footer component dynamically (same logic as header)
export const loadFooterComponent = (componentName: string) => {
  if (!componentName) return null;

  // ⭐ Check cache first
  if (footerComponentsCache.has(componentName)) {
    return footerComponentsCache.get(componentName);
  }

  // Handle StaticFooter1 specially (no number suffix)
  if (componentName === "StaticFooter1") {
    const component = lazy(() =>
      import(`@/components/tenant/footer/StaticFooter1`).catch(() => ({
        default: StaticFooter1,
      })),
    );
    footerComponentsCache.set(componentName, component);
    return component;
  }

  // ⭐ Direct import for known footer components
  const footerComponentMap: Record<string, any> = {
    footer1: Footer1,
    footer2: Footer2,
  };

  if (footerComponentMap[componentName]) {
    const component = lazy(() =>
      Promise.resolve({ default: footerComponentMap[componentName] }),
    );
    footerComponentsCache.set(componentName, component);
    return component;
  }

  // Fallback to dynamic import for other footer variants
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.warn(
      `[Footer Component] No subPath found for baseName: ${baseName}`,
    );
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch((error) => {
        console.error(
          `[Footer Import Error] Failed to load ${fullPath}:`,
          error,
        );
        return { default: StaticFooter1 };
      }),
    { ssr: false },
  );

  footerComponentsCache.set(componentName, component);
  return component;
};
