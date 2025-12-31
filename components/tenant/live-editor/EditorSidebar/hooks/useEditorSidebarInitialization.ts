import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { createDefaultData } from "../utils";
import { getDefaultHeaderData } from "@/context-liveeditor/editorStoreFunctions/headerFunctions";
import { logSidebar } from "@/lib-liveeditor/debugLogger";

interface UseEditorSidebarInitializationProps {
  view: "main" | "add-section" | "edit-component" | "branding-settings";
  selectedComponent: ComponentInstance | null;
  globalHeaderData: any;
  globalFooterData: any;
  globalFooterVariant: string | null;
  globalComponentsData: any;
  setTempData: (data: any) => void;
  setCurrentPage: (page: string) => void;
}

export const useEditorSidebarInitialization = ({
  view,
  selectedComponent,
  globalHeaderData,
  globalFooterData,
  globalFooterVariant,
  globalComponentsData,
  setTempData,
  setCurrentPage,
}: UseEditorSidebarInitializationProps) => {
  useEffect(() => {
    if (view === "edit-component" && selectedComponent) {
      // Check if this is a global component
      if (selectedComponent.id === "global-header") {
        const defaultData = getDefaultHeaderData();
        const dataToUse =
          globalComponentsData?.header &&
          Object.keys(globalComponentsData.header).length > 0
            ? globalComponentsData.header
            : globalHeaderData && Object.keys(globalHeaderData).length > 0
              ? globalHeaderData
              : defaultData;

        // Set current page to indicate we're editing global header
        setCurrentPage("global-header");
        setTempData(dataToUse);
        return;
      }

      if (selectedComponent.id === "global-footer") {
        // Use globalFooterVariant to get correct default data
        const currentVariant = globalFooterVariant || "StaticFooter1";
        const defaultData = createDefaultData("footer", currentVariant);

        const dataToUse =
          globalComponentsData?.footer &&
          Object.keys(globalComponentsData.footer).length > 0
            ? globalComponentsData.footer
            : globalFooterData && Object.keys(globalFooterData).length > 0
              ? globalFooterData
              : defaultData;

        // Set current page to indicate we're editing global footer
        setCurrentPage("global-footer");
        setTempData(dataToUse);
        return;
      }

      // Initialize store data for component types that use stores
      const store = useEditorStore.getState();
      const defaultData = createDefaultData(
        selectedComponent.type,
        selectedComponent.componentName,
      );

      // Use component.id as unique identifier, but also pass componentName for default data selection
      const uniqueVariantId = selectedComponent.id;
      const componentName = selectedComponent.componentName;

      // Log sidebar initialization
      logSidebar("INITIALIZE_COMPONENT", uniqueVariantId, componentName, {
        type: selectedComponent.type,
        uniqueVariantId,
        componentName,
        hasSelectedData: !!(
          selectedComponent.data &&
          Object.keys(selectedComponent.data).length > 0
        ),
        selectedDataKeys: selectedComponent.data
          ? Object.keys(selectedComponent.data)
          : [],
        defaultDataKeys: defaultData ? Object.keys(defaultData) : [],
        selectedData: selectedComponent.data,
        defaultData: defaultData,
        storeState: {
          allVariants: Object.keys(store.halfTextHalfImageStates || {}),
          currentVariantData: store.halfTextHalfImageStates?.[uniqueVariantId],
        },
      });

      // Use dynamic component initialization for all components
      // Use existing component data if available, otherwise use default data
      // For contactCards, check if cards exist in the data
      // For contactFormSection, check if socialLinks exist in the data
      let dataToUse;
      if (selectedComponent.type === "contactCards") {
        // Check if cards exist in the data
        const hasCards =
          selectedComponent.data?.cards &&
          Array.isArray(selectedComponent.data.cards) &&
          selectedComponent.data.cards.length > 0;

        if (hasCards) {
          dataToUse = selectedComponent.data;
        } else {
          // Use default data if no cards found
          dataToUse = defaultData;
        }
      } else if (selectedComponent.type === "contactFormSection") {
        // Check if socialLinks exist in the data
        const hasSocialLinks =
          selectedComponent.data?.content?.socialLinks &&
          Array.isArray(selectedComponent.data.content.socialLinks) &&
          selectedComponent.data.content.socialLinks.length > 0;

        if (hasSocialLinks) {
          dataToUse = selectedComponent.data;
        } else {
          // Use default data if no socialLinks found
          dataToUse = defaultData;
        }
      } else {
        // For other components, use existing logic
        dataToUse =
          selectedComponent.data &&
          Object.keys(selectedComponent.data).length > 0
            ? selectedComponent.data
            : defaultData;
      }

      // Log data selection
      logSidebar("DATA_SELECTION", uniqueVariantId, componentName, {
        componentName,
        dataToUseKeys: dataToUse ? Object.keys(dataToUse) : [],
        dataToUse: dataToUse,
        selectedDataKeys: selectedComponent.data
          ? Object.keys(selectedComponent.data)
          : [],
        hasCards:
          selectedComponent.data?.cards &&
          Array.isArray(selectedComponent.data.cards) &&
          selectedComponent.data.cards.length > 0,
        cardsCount: selectedComponent.data?.cards?.length || 0,
        reason:
          selectedComponent.type === "contactCards"
            ? selectedComponent.data?.cards &&
              Array.isArray(selectedComponent.data.cards) &&
              selectedComponent.data.cards.length > 0
              ? "Using existing component data with cards"
              : "Using default data - no cards found in API data"
            : selectedComponent.data &&
                Object.keys(selectedComponent.data).length > 0
              ? "Using existing component data"
              : "Using default data for new component",
      });

      // Log before calling ensureComponentVariant
      logSidebar("CALLING_ENSURE_VARIANT", uniqueVariantId, componentName, {
        type: selectedComponent.type,
        uniqueVariantId,
        dataToUse: dataToUse,
      });

      store.ensureComponentVariant(
        selectedComponent.type,
        uniqueVariantId,
        dataToUse,
      );

      // Initialize tempData with current component data from store (not selectedComponent.data)
      const currentComponentData = store.getComponentData(
        selectedComponent.type,
        uniqueVariantId,
      );

      setTempData(currentComponentData || {});
    } else if (selectedComponent) {
      const store = useEditorStore.getState();
      const defaultData = createDefaultData(
        selectedComponent.type,
        selectedComponent.componentName,
      );

      // Use component.id as unique identifier instead of componentName
      const uniqueVariantId = selectedComponent.id;

      // Use existing component data if available, otherwise use default data
      const dataToUse =
        selectedComponent.data && Object.keys(selectedComponent.data).length > 0
          ? selectedComponent.data
          : defaultData;

      // Use dynamic component initialization for all components
      store.ensureComponentVariant(
        selectedComponent.type,
        uniqueVariantId,
        dataToUse,
      );

      // Initialize tempData with current component data from store
      const currentComponentData = store.getComponentData(
        selectedComponent.type,
        uniqueVariantId,
      );
      setTempData(currentComponentData || {});
    }
  }, [
    view,
    selectedComponent,
    globalHeaderData,
    globalFooterData,
    globalFooterVariant,
    globalComponentsData,
    setTempData,
    setCurrentPage,
  ]);
};
