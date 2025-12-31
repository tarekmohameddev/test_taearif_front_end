// ============================================================================
// Hook for managing backend data state
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";

interface UseBackendDataStateProps {
  pageComponents: any[];
  slug: string | undefined;
  globalHeaderData: any;
  globalFooterData: any;
  globalFooterVariant: string;
  themeChangeTimestamp: number;
  selectedComponentId: string | null;
  staticPagesData: Record<string, any>;
}

export function useBackendDataState({
  pageComponents,
  slug,
  globalHeaderData,
  globalFooterData,
  globalFooterVariant,
  themeChangeTimestamp,
  selectedComponentId,
  staticPagesData,
}: UseBackendDataStateProps) {
  const [backendDataState, setBackendDataState] = useState<{
    componentsWithMergedData: Array<{
      [key: string]: any;
      mergedData: any;
    }>;
    globalHeaderData: any;
    globalFooterData: any;
  }>({
    componentsWithMergedData: [],
    globalHeaderData: null,
    globalFooterData: null,
  });

  // ⭐ CRITICAL: Use refs to track previous values and prevent unnecessary updates
  const prevPageComponentsRef = useRef<string>("");
  const prevGlobalHeaderDataRef = useRef<string>("");
  const prevGlobalFooterDataRef = useRef<string>("");
  const prevSlugRef = useRef<string | undefined>(slug);
  const prevThemeChangeTimestampRef = useRef<number>(themeChangeTimestamp);
  const prevStaticPagesDataRef = useRef<string>("");
  const prevGlobalFooterVariantRef = useRef<string>(globalFooterVariant);

  // تحديث البيانات المدمجة عند تغيير أي مصدر بيانات
  useEffect(() => {
    // ⭐ CRITICAL: Check if data actually changed using JSON.stringify
    // This prevents infinite loops from reference changes
    const currentPageComponentsStr = JSON.stringify(pageComponents);
    const currentGlobalHeaderDataStr = JSON.stringify(globalHeaderData);
    const currentGlobalFooterDataStr = JSON.stringify(globalFooterData);
    const currentStaticPagesDataStr = JSON.stringify(staticPagesData);

    // Check if anything actually changed
    const pageComponentsChanged =
      prevPageComponentsRef.current !== currentPageComponentsStr;
    const globalHeaderChanged =
      prevGlobalHeaderDataRef.current !== currentGlobalHeaderDataStr;
    const globalFooterChanged =
      prevGlobalFooterDataRef.current !== currentGlobalFooterDataStr;
    const slugChanged = prevSlugRef.current !== slug;
    const themeChanged =
      prevThemeChangeTimestampRef.current !== themeChangeTimestamp;
    const staticPagesChanged =
      prevStaticPagesDataRef.current !== currentStaticPagesDataStr;

    // Check if globalFooterVariant changed
    const globalFooterVariantChanged =
      prevGlobalFooterVariantRef.current !== globalFooterVariant;

    // If nothing changed, skip update
    if (
      !pageComponentsChanged &&
      !globalHeaderChanged &&
      !globalFooterChanged &&
      !slugChanged &&
      !themeChanged &&
      !staticPagesChanged &&
      !globalFooterVariantChanged
    ) {
      return; // No actual changes, skip update
    }

    // Update refs
    prevPageComponentsRef.current = currentPageComponentsStr;
    prevGlobalHeaderDataRef.current = currentGlobalHeaderDataStr;
    prevGlobalFooterDataRef.current = currentGlobalFooterDataStr;
    prevSlugRef.current = slug;
    prevThemeChangeTimestampRef.current = themeChangeTimestamp;
    prevStaticPagesDataRef.current = currentStaticPagesDataStr;
    prevGlobalFooterVariantRef.current = globalFooterVariant;
    // Check if this is a static page
    const editorStore = useEditorStore.getState();
    const staticPageData = editorStore.getStaticPageData(slug);
    const isStaticPage = !!staticPageData;

    // ⭐ CRITICAL: Force re-compute for static pages when theme changes
    // This ensures we get the latest data from staticPagesData after theme change
    if (isStaticPage && themeChangeTimestamp > 0) {
      // Force re-read staticPageData to ensure we have the latest data
      const freshStaticPageData = editorStore.getStaticPageData(slug);
      if (freshStaticPageData) {
        // Log removed for production
      }
    }

    // 1. معالجة pageComponents مع mergedData
    const componentsWithMergedData = pageComponents
      .filter(
        (component: any) =>
          !component.componentName?.startsWith("header") &&
          !component.componentName?.startsWith("footer"),
      )
      .map((component: any) => {
        // For static pages, get componentName and id from staticPagesData (more up-to-date)
        let finalComponentName = component.componentName;
        let finalId = component.id;
        if (isStaticPage && staticPageData) {
          // First try to find by id, then by componentName (in case id changed)
          let storeComp = staticPageData.components.find(
            (sc: any) => sc.id === component.id,
          );
          // If not found by id, try to find by componentName (for cases where id was updated)
          if (!storeComp) {
            storeComp = staticPageData.components.find(
              (sc: any) => sc.componentName === component.componentName,
            );
          }
          if (storeComp) {
            finalComponentName = storeComp.componentName;
            finalId = storeComp.id; // ✅ Sync id (should match componentName for static pages)
          }
        }

        // قراءة البيانات من editorStore
        // For static pages, use finalId (which may have been updated to match componentName)
        const storeData = useEditorStore
          .getState()
          .getComponentData(component.type, finalId);

        // دمج البيانات: أولوية للبيانات من editorStore
        const mergedData =
          storeData && Object.keys(storeData).length > 0
            ? storeData
            : component.data;

        return {
          ...component,
          id: finalId, // ✅ Use updated id (should match componentName for static pages)
          componentName: finalComponentName, // ✅ Use updated componentName from staticPagesData
          mergedData,
        };
      });

    // 2. تحديث state
    setBackendDataState({
      componentsWithMergedData,
      globalHeaderData: globalHeaderData || null,
      globalFooterData: globalFooterData || null,
    });
    // ⭐ CRITICAL: Include all dependencies, but the ref checks prevent unnecessary updates
  }, [
    pageComponents,
    slug,
    globalHeaderData,
    globalFooterData,
    globalFooterVariant,
    themeChangeTimestamp,
    selectedComponentId,
    staticPagesData,
    // Note: backendDataState.globalFooterData?.variant is checked inside effect
  ]);

  return { backendDataState, setBackendDataState };
}
