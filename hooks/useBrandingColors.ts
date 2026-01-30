"use client";
import { useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { useIsLiveEditor } from "./useIsLiveEditor";

/**
 * Hook to get branding colors from the correct source
 * - In live editor: uses editorStore.WebsiteLayout.branding.colors
 * - In normal view: uses tenantStore.tenantData.WebsiteLayout.branding.colors
 * 
 * @returns {Object} { primary, secondary, accent } with fallback values
 */
export function useBrandingColors() {
  const isLiveEditor = useIsLiveEditor();
  const editorWebsiteLayout = useEditorStore((s) => s.WebsiteLayout);
  const tenantData = useTenantStore((s) => s.tenantData);

  const colors = useMemo(() => {
    // Default fallback colors
    const defaultPrimary = "#8b5f46";
    const defaultSecondary = "#8b5f46";
    const defaultAccent = "#8b5f46";

    if (isLiveEditor) {
      // In live editor: use editorStore
      const editorBranding = editorWebsiteLayout?.branding?.colors;
      return {
        primary:
          editorBranding?.primary?.trim() || defaultPrimary,
        secondary:
          editorBranding?.secondary?.trim() || defaultSecondary,
        accent:
          editorBranding?.accent?.trim() || defaultAccent,
      };
    } else {
      // In normal view: use tenantStore
      const tenantBranding = tenantData?.WebsiteLayout?.branding?.colors;
      return {
        primary:
          tenantBranding?.primary?.trim() || defaultPrimary,
        secondary:
          tenantBranding?.secondary?.trim() || defaultSecondary,
        accent:
          tenantBranding?.accent?.trim() || defaultAccent,
      };
    }
  }, [isLiveEditor, editorWebsiteLayout, tenantData]);

  return colors;
}
