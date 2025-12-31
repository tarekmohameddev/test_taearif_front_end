// ============================================================================
// Hook for managing global header and footer components
// ============================================================================

import { useMemo } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { loadHeaderComponent, loadFooterComponent } from "../componentLoaders";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";

export function useGlobalComponents() {
  const globalHeaderData = useEditorStore((s) => s.globalHeaderData);
  const globalFooterData = useEditorStore((s) => s.globalFooterData);
  const globalHeaderVariantFromStore = useEditorStore(
    (s) => s.globalHeaderVariant,
  );
  const globalFooterVariantFromStore = useEditorStore(
    (s) => s.globalFooterVariant,
  );
  const themeChangeTimestamp = useEditorStore((s) => s.themeChangeTimestamp);
  const setGlobalHeaderData = useEditorStore((s) => s.setGlobalHeaderData);
  const setGlobalFooterData = useEditorStore((s) => s.setGlobalFooterData);
  const tenantData = useTenantStore((s) => s.tenantData);

  // Get global header variant with smart priority logic
  const globalHeaderVariant = useMemo(() => {
    // ⭐ CRITICAL: If theme was recently changed, prioritize store variant
    const hasRecentThemeChange = themeChangeTimestamp > 0;

    // If globalHeaderVariantFromStore is the default value, prioritize tenantData/globalHeaderData
    // This handles the case when Live Editor first opens
    const isDefaultVariant = globalHeaderVariantFromStore === "StaticHeader1";

    // Priority logic:
    // 1. If theme was recently changed, use store variant (highest priority)
    // 2. If store variant is NOT default, use it (for immediate updates)
    // 3. Otherwise, use tenantData/globalHeaderData (for initial load)
    const variant = hasRecentThemeChange
      ? globalHeaderVariantFromStore || "StaticHeader1" // ⭐ Force use store variant after theme change
      : (!isDefaultVariant && globalHeaderVariantFromStore) ||
        globalHeaderData?.variant ||
        tenantData?.globalComponentsData?.globalHeaderVariant ||
        globalHeaderVariantFromStore || // Fallback to store
        "StaticHeader1";

    return variant;
  }, [
    globalHeaderVariantFromStore,
    globalHeaderData?.variant,
    tenantData?.globalComponentsData?.globalHeaderVariant,
    tenantData,
    themeChangeTimestamp, // ⭐ NEW: Force re-compute when theme changes
  ]);

  // Get global footer variant with smart priority logic
  const globalFooterVariant = useMemo(() => {
    // ⭐ CRITICAL: If theme was recently changed, prioritize store variant
    const hasRecentThemeChange = themeChangeTimestamp > 0;

    const isDefaultVariant = globalFooterVariantFromStore === "StaticFooter1";

    // Priority logic:
    // 1. If theme was recently changed, use store variant (highest priority)
    // 2. If store variant is NOT default, use it (for immediate updates)
    // 3. Otherwise, use tenantData/globalFooterData (for initial load)
    const variant = hasRecentThemeChange
      ? globalFooterVariantFromStore || "StaticFooter1" // ⭐ Force use store variant after theme change
      : (!isDefaultVariant && globalFooterVariantFromStore) ||
        globalFooterData?.variant ||
        tenantData?.globalComponentsData?.globalFooterVariant ||
        globalFooterVariantFromStore ||
        "StaticFooter1";

    return variant;
  }, [
    globalFooterVariantFromStore,
    globalFooterData?.variant,
    tenantData?.globalComponentsData?.globalFooterVariant,
    tenantData,
    themeChangeTimestamp, // ⭐ NEW: Force re-compute when theme changes
  ]);

  // Initialize data immediately if not exists
  if (!globalHeaderData || Object.keys(globalHeaderData).length === 0) {
    const {
      getDefaultHeaderData,
    } = require("@/context-liveeditor/editorStoreFunctions/headerFunctions");
    const defaultHeaderData = getDefaultHeaderData();
    setGlobalHeaderData(defaultHeaderData);
  }

  if (!globalFooterData || Object.keys(globalFooterData).length === 0) {
    const {
      getDefaultFooterData,
    } = require("@/context-liveeditor/editorStoreFunctions/footerFunctions");
    const defaultFooterData = getDefaultFooterData();
    setGlobalFooterData(defaultFooterData);
  }

  // Load header component dynamically based on globalHeaderVariant
  const HeaderComponent = useMemo(() => {
    // Map variant names to component names
    const componentMap: Record<string, string> = {
      StaticHeader1: "StaticHeader1",
      header1: "header1",
      header2: "header2",
      header3: "header3",
      header4: "header4",
      header5: "header5",
      header6: "header6",
    };

    const componentName = componentMap[globalHeaderVariant] || "StaticHeader1";

    const HeaderComponent = loadHeaderComponent(componentName);

    if (!HeaderComponent) {
      console.warn(
        "[LiveEditorUI] HeaderComponent is null, falling back to StaticHeader1",
      );
      return StaticHeader1;
    }

    return HeaderComponent;
  }, [
    globalHeaderVariant,
    themeChangeTimestamp, // ⭐ NEW: Force re-load when theme changes
    globalHeaderData, // ⭐ NEW: Force re-load when header data changes
  ]);

  // Load footer component dynamically based on globalFooterVariant
  const FooterComponent = useMemo(() => {
    const componentMap: Record<string, string> = {
      StaticFooter1: "StaticFooter1",
      footer1: "footer1",
      footer2: "footer2",
    };

    const componentName = componentMap[globalFooterVariant] || "StaticFooter1";

    const FooterComponent = loadFooterComponent(componentName);

    if (!FooterComponent) {
      console.warn(
        "[LiveEditorUI] FooterComponent is null, falling back to StaticFooter1",
      );
      return StaticFooter1;
    }

    return FooterComponent;
  }, [
    globalFooterVariant,
    themeChangeTimestamp, // ⭐ NEW: Force re-load when theme changes
    globalFooterData, // ⭐ NEW: Force re-load when footer data changes
  ]);

  return {
    globalHeaderVariant,
    globalFooterVariant,
    HeaderComponent,
    FooterComponent,
    globalHeaderData,
    globalFooterData,
  };
}
