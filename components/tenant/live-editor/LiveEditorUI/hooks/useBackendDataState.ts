// ============================================================================
// Hook for managing backend data state
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/context/editorStore";
import { logEditorStore } from "@/lib/debugLogger";

interface UseBackendDataStateProps {
  pageComponents: any[];
  slug: string;
  globalHeaderData: any;
  globalFooterData: any;
  globalFooterVariant: string;
  themeChangeTimestamp: number;
  selectedComponentId: string | null;
  staticPagesData: Record<string, any>;
  /** When these change (e.g. sidebar edit), recompute mergedData so canvas shows latest store data */
  heroBannerStates?: Record<string, any>;
  commitmentSectionStates?: Record<string, any>;
  creativityTriadSectionStates?: Record<string, any>;
  essenceSectionStates?: Record<string, any>;
  featuresSectionStates?: Record<string, any>;
  journeySectionStates?: Record<string, any>;
  landInvestmentFormSectionStates?: Record<string, any>;
  philosophyCtaSectionStates?: Record<string, any>;
  quoteSectionStates?: Record<string, any>;
  projectsHeaderStates?: Record<string, any>;
  projectsShowcaseStates?: Record<string, any>;
  contactFormStates?: Record<string, any>;
  valuesSectionStates?: Record<string, any>;
  headerStates?: Record<string, any>;
  footerStates?: Record<string, any>;
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
  heroBannerStates,
  commitmentSectionStates,
  creativityTriadSectionStates,
  essenceSectionStates,
  featuresSectionStates,
  journeySectionStates,
  landInvestmentFormSectionStates,
  philosophyCtaSectionStates,
  quoteSectionStates,
  projectsHeaderStates,
  projectsShowcaseStates,
  contactFormStates,
  valuesSectionStates,
  headerStates,
  footerStates,
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
  const prevHeroBannerStatesRef = useRef<string>("");
  const prevCommitmentSectionStatesRef = useRef<string>("");
  const prevCreativityTriadSectionStatesRef = useRef<string>("");
  const prevEssenceSectionStatesRef = useRef<string>("");
  const prevFeaturesSectionStatesRef = useRef<string>("");
  const prevJourneySectionStatesRef = useRef<string>("");
  const prevLandInvestmentFormSectionStatesRef = useRef<string>("");
  const prevPhilosophyCtaSectionStatesRef = useRef<string>("");
  const prevQuoteSectionStatesRef = useRef<string>("");
  const prevProjectsHeaderStatesRef = useRef<string>("");
  const prevProjectsShowcaseStatesRef = useRef<string>("");
  const prevContactFormStatesRef = useRef<string>("");
  const prevValuesSectionStatesRef = useRef<string>("");
  const prevHeaderStatesRef = useRef<string>("");
  const prevFooterStatesRef = useRef<string>("");

  // تحديث البيانات المدمجة عند تغيير أي مصدر بيانات
  useEffect(() => {
    // ⭐ CRITICAL: Check if data actually changed using JSON.stringify
    const currentPageComponentsStr = JSON.stringify(pageComponents);
    const currentGlobalHeaderDataStr = JSON.stringify(globalHeaderData);
    const currentGlobalFooterDataStr = JSON.stringify(globalFooterData);
    const currentStaticPagesDataStr = JSON.stringify(staticPagesData);
    const currentHeroBannerStatesStr = JSON.stringify(heroBannerStates ?? {});
    const currentCommitmentSectionStatesStr = JSON.stringify(commitmentSectionStates ?? {});
    const currentCreativityTriadSectionStatesStr = JSON.stringify(creativityTriadSectionStates ?? {});
    const currentEssenceSectionStatesStr = JSON.stringify(essenceSectionStates ?? {});
    const currentFeaturesSectionStatesStr = JSON.stringify(featuresSectionStates ?? {});
    const currentJourneySectionStatesStr = JSON.stringify(journeySectionStates ?? {});
    const currentLandInvestmentFormSectionStatesStr = JSON.stringify(landInvestmentFormSectionStates ?? {});
    const currentPhilosophyCtaSectionStatesStr = JSON.stringify(philosophyCtaSectionStates ?? {});
    const currentQuoteSectionStatesStr = JSON.stringify(quoteSectionStates ?? {});
    const currentProjectsHeaderStatesStr = JSON.stringify(projectsHeaderStates ?? {});
    const currentProjectsShowcaseStatesStr = JSON.stringify(projectsShowcaseStates ?? {});
    const currentContactFormStatesStr = JSON.stringify(contactFormStates ?? {});
    const currentValuesSectionStatesStr = JSON.stringify(valuesSectionStates ?? {});
    const currentHeaderStatesStr = JSON.stringify(headerStates ?? {});
    const currentFooterStatesStr = JSON.stringify(footerStates ?? {});

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
    const globalFooterVariantChanged =
      prevGlobalFooterVariantRef.current !== globalFooterVariant;
    const heroBannerStatesChanged =
      prevHeroBannerStatesRef.current !== currentHeroBannerStatesStr;
    const theme3StatesChanged =
      prevCommitmentSectionStatesRef.current !== currentCommitmentSectionStatesStr ||
      prevCreativityTriadSectionStatesRef.current !== currentCreativityTriadSectionStatesStr ||
      prevEssenceSectionStatesRef.current !== currentEssenceSectionStatesStr ||
      prevFeaturesSectionStatesRef.current !== currentFeaturesSectionStatesStr ||
      prevJourneySectionStatesRef.current !== currentJourneySectionStatesStr ||
      prevLandInvestmentFormSectionStatesRef.current !== currentLandInvestmentFormSectionStatesStr ||
      prevPhilosophyCtaSectionStatesRef.current !== currentPhilosophyCtaSectionStatesStr ||
      prevQuoteSectionStatesRef.current !== currentQuoteSectionStatesStr ||
      prevProjectsHeaderStatesRef.current !== currentProjectsHeaderStatesStr ||
      prevProjectsShowcaseStatesRef.current !== currentProjectsShowcaseStatesStr ||
      prevContactFormStatesRef.current !== currentContactFormStatesStr ||
      prevValuesSectionStatesRef.current !== currentValuesSectionStatesStr ||
      prevHeaderStatesRef.current !== currentHeaderStatesStr ||
      prevFooterStatesRef.current !== currentFooterStatesStr;

    if (
      !pageComponentsChanged &&
      !globalHeaderChanged &&
      !globalFooterChanged &&
      !slugChanged &&
      !themeChanged &&
      !staticPagesChanged &&
      !globalFooterVariantChanged &&
      !heroBannerStatesChanged &&
      !theme3StatesChanged
    ) {
      return;
    }

    prevPageComponentsRef.current = currentPageComponentsStr;
    prevGlobalHeaderDataRef.current = currentGlobalHeaderDataStr;
    prevGlobalFooterDataRef.current = currentGlobalFooterDataStr;
    prevSlugRef.current = slug;
    prevThemeChangeTimestampRef.current = themeChangeTimestamp;
    prevStaticPagesDataRef.current = currentStaticPagesDataStr;
    prevGlobalFooterVariantRef.current = globalFooterVariant;
    prevHeroBannerStatesRef.current = currentHeroBannerStatesStr;
    prevCommitmentSectionStatesRef.current = currentCommitmentSectionStatesStr;
    prevCreativityTriadSectionStatesRef.current = currentCreativityTriadSectionStatesStr;
    prevEssenceSectionStatesRef.current = currentEssenceSectionStatesStr;
    prevFeaturesSectionStatesRef.current = currentFeaturesSectionStatesStr;
    prevJourneySectionStatesRef.current = currentJourneySectionStatesStr;
    prevLandInvestmentFormSectionStatesRef.current = currentLandInvestmentFormSectionStatesStr;
    prevPhilosophyCtaSectionStatesRef.current = currentPhilosophyCtaSectionStatesStr;
    prevQuoteSectionStatesRef.current = currentQuoteSectionStatesStr;
    prevProjectsHeaderStatesRef.current = currentProjectsHeaderStatesStr;
    prevProjectsShowcaseStatesRef.current = currentProjectsShowcaseStatesStr;
    prevContactFormStatesRef.current = currentContactFormStatesStr;
    prevValuesSectionStatesRef.current = currentValuesSectionStatesStr;
    prevHeaderStatesRef.current = currentHeaderStatesStr;
    prevFooterStatesRef.current = currentFooterStatesStr;
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
        // ✅ Use component.id from database (the key used in loadFromDatabase)
        // This ensures we find the data that was loaded using comp.id in loadFromDatabase
        const storeData = useEditorStore
          .getState()
          .getComponentData(component.type, component.id);

        // ⭐ Page-specific data: pageComponentsByPage[slug] and component.data (current page list)
        const pageComponentsByPage = useEditorStore.getState().pageComponentsByPage[slug];
        const pageComponentFromStore = pageComponentsByPage?.find(
          (pc: any) => pc.id === component.id
        );
        const databaseData = pageComponentFromStore?.data;

        // ⭐ FIX: Prefer page-specific data over global store so components don't revert to default on navigation.
        // The store is keyed by component id only; when the same id exists on multiple pages, store gets overwritten.
        // Priority: databaseData (this page's aggregate) → component.data (this page's list) → storeData (fallback)
        const mergedData =
          databaseData && Object.keys(databaseData).length > 0
            ? databaseData
            : component.data && Object.keys(component.data || {}).length > 0
              ? component.data
              : storeData || {};

        return {
          ...component,
          id: finalId, // ✅ Use updated id (should match componentName for static pages)
          componentName: finalComponentName, // ✅ Use updated componentName from staticPagesData
          mergedData,
        };
      });

    // Log backend data state for debugging live editor flow
    logEditorStore(
      "BACKEND_DATA_STATE_UPDATE",
      slug || "unknown-slug",
      "backend-data",
      {
        slug,
        themeChangeTimestamp,
        componentCount: componentsWithMergedData.length,
        components: componentsWithMergedData.map((c: any) => ({
          id: c.id,
          type: c.type,
          componentName: c.componentName,
          hasMergedData:
            !!c.mergedData &&
            Object.keys((c.mergedData as any) || {}).length > 0,
        })),
      },
    );

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
    heroBannerStates,
    commitmentSectionStates,
    creativityTriadSectionStates,
    essenceSectionStates,
    featuresSectionStates,
    journeySectionStates,
    landInvestmentFormSectionStates,
    philosophyCtaSectionStates,
    quoteSectionStates,
    projectsHeaderStates,
    projectsShowcaseStates,
    contactFormStates,
    valuesSectionStates,
    headerStates,
    footerStates,
  ]);

  return { backendDataState, setBackendDataState };
}
