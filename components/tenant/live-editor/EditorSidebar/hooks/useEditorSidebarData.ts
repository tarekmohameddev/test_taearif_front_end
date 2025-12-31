import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { createDefaultData } from "../utils";
import { getDefaultHeaderData } from "@/context-liveeditor/editorStoreFunctions/headerFunctions";

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
