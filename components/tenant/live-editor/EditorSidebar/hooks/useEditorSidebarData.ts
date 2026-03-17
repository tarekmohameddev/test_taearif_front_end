import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib/types";
import { createDefaultData } from "../utils";
import { getDefaultHeaderData } from "@/context/editorStoreFunctions/headerFunctions";

/** Theme3 component types that use getComponentData + seed when raw store is empty (HeroBanner-style). */
const THEME3_COMPONENT_TYPES = new Set([
  "heroBanner",
  "commitmentSection",
  "creativityTriadSection",
  "essenceSection",
  "featuresSection",
  "journeySection",
  "landInvestmentFormSection",
  "philosophyCtaSection",
  "quoteSection",
  "projectsHeader",
  "projectsShowcase",
  "valuesSection",
  "contactForm",
  "header",
  "footer",
]);

/** Map component type to store state key for raw-empty check and seed. */
const THEME3_TYPE_TO_STATE_KEY: Record<string, string> = {
  heroBanner: "heroBannerStates",
  commitmentSection: "commitmentSectionStates",
  creativityTriadSection: "creativityTriadSectionStates",
  essenceSection: "essenceSectionStates",
  featuresSection: "featuresSectionStates",
  journeySection: "journeySectionStates",
  landInvestmentFormSection: "landInvestmentFormSectionStates",
  philosophyCtaSection: "philosophyCtaSectionStates",
  quoteSection: "quoteSectionStates",
  projectsHeader: "projectsHeaderStates",
  projectsShowcase: "projectsShowcaseStates",
  valuesSection: "valuesSectionStates",
  contactForm: "contactFormStates",
  header: "headerStates",
  footer: "footerStates",
};

interface UseEditorSidebarDataProps {
  view: "main" | "add-section" | "edit-component" | "branding-settings";
  selectedComponent: ComponentInstance | null;
  globalHeaderData: any;
  globalFooterData: any;
  globalFooterVariant: string | null;
  halfTextHalfImageStates: any;
  setTempData: (data: any) => void;
}

export const useEditorSidebarData = ({
  view,
  selectedComponent,
  globalHeaderData,
  globalFooterData,
  globalFooterVariant,
  halfTextHalfImageStates,
  setTempData,
}: UseEditorSidebarDataProps) => {
  // Update tempData when selectedComponent changes or when component data changes
  // Don't clear tempData if we're in branding-settings view
  useEffect(() => {
    // Skip if we're in branding-settings view (BrandingSettings manages its own tempData)
    if (view === "branding-settings") {
      return;
    }

    if (selectedComponent) {
      // Use component.id as unique identifier instead of componentName
      const store = useEditorStore.getState();
      const uniqueVariantId = selectedComponent.id;

      // Handle global components
      if (selectedComponent.id === "global-header") {
        const defaultData = getDefaultHeaderData();
        const dataToUse =
          store.globalHeaderData &&
          Object.keys(store.globalHeaderData).length > 0
            ? store.globalHeaderData
            : defaultData;

        setTempData(dataToUse);
      } else if (selectedComponent.id === "global-footer") {
        // Use globalFooterVariant to get correct default data
        const currentVariant = store.globalFooterVariant || "StaticFooter1";
        const defaultData = createDefaultData("footer", currentVariant);

        const dataToUse =
          store.globalFooterData &&
          Object.keys(store.globalFooterData).length > 0
            ? store.globalFooterData
            : defaultData;

        setTempData(dataToUse);
      } else {
        // ⭐ IMPORTANT: For halfTextHalfImage, always get data from store to ensure we have the latest data after theme change
        // Don't rely on selectedComponent.data as it may be stale after theme change
        if (selectedComponent.type === "halfTextHalfImage") {
          // First, try to get data from store (this will have the correct default data after theme change)
          const storeData = store.getComponentData(
            selectedComponent.type,
            uniqueVariantId,
          );

          // Also check halfTextHalfImageStates directly for the latest data
          const stateData = halfTextHalfImageStates?.[uniqueVariantId];

          // Priority: stateData > storeData > selectedComponent.data
          const dataToUse =
            stateData && Object.keys(stateData).length > 0
              ? stateData
              : storeData && Object.keys(storeData).length > 0
                ? storeData
                : selectedComponent.data &&
                    Object.keys(selectedComponent.data).length > 0
                  ? selectedComponent.data
                  : {};

          setTempData(dataToUse);
        } else if (THEME3_COMPONENT_TYPES.has(selectedComponent.type)) {
          // Theme3 (incl. heroBanner): use getComponentData so sidebar sees merged defaults + stored
          const dataToUse = store.getComponentData(
            selectedComponent.type,
            uniqueVariantId,
          );
          setTempData(dataToUse && Object.keys(dataToUse).length > 0 ? dataToUse : selectedComponent.data || {});

          // Seed store with full defaults when raw store is empty so first save persists them
          const stateKey = THEME3_TYPE_TO_STATE_KEY[selectedComponent.type];
          const rawStored = stateKey ? (store as any)[stateKey]?.[uniqueVariantId] : undefined;
          if (!rawStored || Object.keys(rawStored).length === 0) {
            const seedData =
              dataToUse && Object.keys(dataToUse).length > 0
                ? dataToUse
                : store.getComponentData(selectedComponent.type, uniqueVariantId);
            if (seedData && Object.keys(seedData).length > 0) {
              store.setComponentData(selectedComponent.type, uniqueVariantId, seedData);
            }
          }
        } else {
          // For other components, use existing component data if available, otherwise get from store
          const existingData =
            selectedComponent.data &&
            Object.keys(selectedComponent.data).length > 0
              ? selectedComponent.data
              : store.getComponentData(selectedComponent.type, uniqueVariantId);

          setTempData(existingData || {});
        }
      }
    } else {
      setTempData({});
    }
  }, [
    selectedComponent,
    globalHeaderData,
    globalFooterData,
    globalFooterVariant,
    view,
    halfTextHalfImageStates,
    setTempData,
  ]);

  // Clear tempData when view changes (but not for branding-settings)
  useEffect(() => {
    if (view !== "edit-component" && view !== "branding-settings") {
      setTempData({});
    }
  }, [view, setTempData]);
};
