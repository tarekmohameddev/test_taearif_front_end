import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance, ComponentData } from "@/lib/types";
import { logChange } from "@/lib/debugLogger";
import { deepMerge } from "../utils/deepMerge";
import { useEventDebug } from "@/lib/debug/live-editor/hooks/useEventDebug";
import { useDataFlowDebug } from "@/lib/debug/live-editor/hooks/useDataFlowDebug";
import { storeTracker } from "@/lib/debug/live-editor/trackers/storeTracker";

interface UseSaveHandlerProps {
  view: "main" | "add-section" | "edit-component" | "branding-settings";
  selectedComponent: ComponentInstance | null;
  tempData: any;
  setTempData: (data: any) => void;
  setGlobalHeaderData: (data: any) => void;
  setGlobalFooterData: (data: any) => void;
  setGlobalComponentsData: (data: any) => void;
  globalComponentsData: any;
  setWebsiteLayout: (layout: any) => void;
  setHasChangesMade: (hasChanges: boolean) => void;
  onComponentUpdate: (id: string, newData: ComponentData) => void;
  onClose: () => void;
}

export const useSaveHandler = ({
  view,
  selectedComponent,
  tempData,
  setTempData,
  setGlobalHeaderData,
  setGlobalFooterData,
  setGlobalComponentsData,
  globalComponentsData,
  setWebsiteLayout,
  setHasChangesMade,
  onComponentUpdate,
  onClose,
}: UseSaveHandlerProps) => {
  // Debug tracking
  const { emitEvent } = useEventDebug();
  const { trackDataFlow } = useDataFlowDebug({
    componentId: selectedComponent?.id || "",
    componentType: selectedComponent?.type || "unknown",
    defaultData: {},
    tenantData: {},
    storeData: {},
    mergedData: {},
  });
  const handleBrandingSave = () => {
    const store = useEditorStore.getState();
    // Get branding data directly from WebsiteLayout (which is updated in real-time)
    // الحصول على بيانات الـ branding مباشرة من WebsiteLayout (التي يتم تحديثها في الوقت الفعلي)
    const brandingData = store.WebsiteLayout?.branding || {};

    console.log("🔍 Current WebsiteLayout.branding:", brandingData);
    console.log("🔍 Current brandingData structure:", {
      hasColors: !!brandingData.colors,
      primary: brandingData.colors?.primary,
      secondary: brandingData.colors?.secondary,
      accent: brandingData.colors?.accent,
      mainBgColor: brandingData.mainBgColor,
    });

    // Ensure brandingData has the correct structure
    const finalBrandingData = {
      colors: {
        primary: brandingData.colors?.primary || "",
        secondary: brandingData.colors?.secondary || "",
        accent: brandingData.colors?.accent || "",
      },
      mainBgColor: brandingData.mainBgColor || "",
    };

    // Update WebsiteLayout with branding data (ensure it's saved)
    // تحديث WebsiteLayout ببيانات الـ branding (للتأكد من الحفظ)
    const updatedWebsiteLayout = {
      ...(store.WebsiteLayout || {}),
      metaTags: store.WebsiteLayout?.metaTags || { pages: [] },
      branding: finalBrandingData,
    };

    console.log("💾 Saving branding data:", finalBrandingData);
    setWebsiteLayout(updatedWebsiteLayout);
    setHasChangesMade(true);
    onClose();
  };

  const handleGlobalComponentSave = (
    componentId: string,
    latestTempData: any,
  ) => {
    const store = useEditorStore.getState();
    const currentPage = store.currentPage || "homepage";

    if (componentId === "global-header") {
      logChange(
        componentId,
        "header1",
        "header",
        latestTempData,
        "GLOBAL_HEADER",
      );

      setGlobalHeaderData(latestTempData);
      setGlobalComponentsData({
        ...globalComponentsData,
        header: latestTempData,
      });

      // Transfer logo/name from tempData to CustomBranding.header
      // Priority: latestTempData values > current CustomBranding values
      const headerLogo = latestTempData?.logo?.image || latestTempData?.logo;
      
      // ⭐ CRITICAL: For header2, logo.alt is used (company name field)
      // For header1, logo.text is used
      // Priority: logo.alt first (header2) > logo.text (header1)
      // This ensures header2's company name field (logo.alt) takes priority
      const headerName = latestTempData?.logo?.alt || latestTempData?.logo?.text;

      console.log("🔍 [handleGlobalComponentSave] Header Save Debug:", {
        latestTempData,
        logo: latestTempData?.logo,
        logoImage: latestTempData?.logo?.image,
        logoText: latestTempData?.logo?.text,
        logoAlt: latestTempData?.logo?.alt,
        headerLogo,
        headerName,
      });

      // Get current CustomBranding to preserve existing values if new ones are not provided
      const currentCustomBranding = store.WebsiteLayout?.CustomBranding;
      const currentHeaderBranding: any = currentCustomBranding?.header || {};
      
      // ⭐ CRITICAL: If latestTempData has logo object, use its values (even if empty strings)
      // This ensures that explicitly set empty values are saved
      const hasLogoInTempData = latestTempData?.logo !== undefined;
      
      // If logo object exists in tempData, use its values; otherwise preserve current CustomBranding
      const logoToSave = hasLogoInTempData 
        ? (headerLogo !== undefined ? headerLogo : currentHeaderBranding?.logo || "")
        : (currentHeaderBranding?.logo || "");
      
      const nameToSave = hasLogoInTempData
        ? (headerName !== undefined ? headerName : currentHeaderBranding?.name || "")
        : (currentHeaderBranding?.name || "");

      console.log("💾 [handleGlobalComponentSave] Updating CustomBranding.header:", {
        hasLogoInTempData,
        logoToSave,
        nameToSave,
        headerLogo,
        headerName,
        currentHeaderBranding,
        latestTempDataLogo: latestTempData?.logo,
      });

      // Always update CustomBranding when saving header (even if values are empty)
      store.updateCustomBranding("header", {
        logo: logoToSave,
        name: nameToSave,
      });
      
      // ⭐ CRITICAL: Get updated state immediately after updateCustomBranding
      const storeAfterUpdate = useEditorStore.getState();
      console.log("✅ [handleGlobalComponentSave] CustomBranding.header updated:", {
        logo: logoToSave,
        name: nameToSave,
        storeAfterUpdateCustomBranding: storeAfterUpdate.WebsiteLayout?.CustomBranding,
        storeAfterUpdateHeader: storeAfterUpdate.WebsiteLayout?.CustomBranding?.header,
        storeAfterUpdateHeaderName: storeAfterUpdate.WebsiteLayout?.CustomBranding?.header?.name,
      });

      onComponentUpdate(componentId, latestTempData);

      const storeAfter = useEditorStore.getState();
      const pageComponentsAfter =
        storeAfter.pageComponentsByPage[currentPage] || [];
      
      console.log("🔍 [handleGlobalComponentSave] Final store state check:", {
        finalCustomBranding: storeAfter.WebsiteLayout?.CustomBranding,
        finalHeader: storeAfter.WebsiteLayout?.CustomBranding?.header,
        finalHeaderName: storeAfter.WebsiteLayout?.CustomBranding?.header?.name,
      });

      onClose();
      return;
    }

    if (componentId === "global-footer") {
      logChange(
        componentId,
        "footer1",
        "footer",
        latestTempData,
        "GLOBAL_FOOTER",
      );

      setGlobalFooterData(latestTempData);
      setGlobalComponentsData({
        ...globalComponentsData,
        footer: latestTempData,
      });

      // Transfer logo/name from tempData to CustomBranding.footer
      const footerLogo = latestTempData?.content?.companyInfo?.logo;
      const footerName = latestTempData?.content?.companyInfo?.name;

      if (footerLogo || footerName) {
        const currentCustomBranding = store.WebsiteLayout?.CustomBranding;
        store.updateCustomBranding("footer", {
          logo: footerLogo || currentCustomBranding?.footer?.logo || "",
          name: footerName || currentCustomBranding?.footer?.name || "",
        });
      }

      onComponentUpdate(componentId, latestTempData);

      const storeAfter = useEditorStore.getState();
      const pageComponentsAfter =
        storeAfter.pageComponentsByPage[currentPage] || [];

      onClose();
      return;
    }
  };

  const handleRegularComponentSave = (
    component: ComponentInstance,
    latestTempData: any,
  ) => {
    const store = useEditorStore.getState();
    const currentPage = store.currentPage || "homepage";
    const pageComponentsBefore = store.pageComponentsByPage[currentPage] || [];

    // Emit SAVE_INITIATED event
    emitEvent("SAVE_INITIATED", {
      context: {
        component: {
          id: component.id,
          type: component.type,
          variant: component.componentName,
          name: component.name || component.componentName,
        },
        location: {
          file: "useSaveHandler.ts",
          function: "handleRegularComponentSave",
          line: 0,
        },
        user: {
          action: "save",
          page: currentPage,
        },
      },
      details: {
        action: "save_initiated",
        source: "useSaveHandler",
        tempData: latestTempData,
        storeData: store.getComponentData(component.type, component.id),
        existingData: pageComponentsBefore.find((c: any) => c.id === component.id)?.data,
      },
    });

    console.group("🔍 Initial Save Debug");
    console.log("Selected Component:", component);
    console.log("Current Page:", currentPage);
    console.log("Page Components Before:", pageComponentsBefore.length);
    console.log("TempData:", tempData);
    console.log(
      "StoreData:",
      store.getComponentData(component.type, component.id),
    );
    console.groupEnd();

    const uniqueVariantId = component.id;

    // Get the latest data from the store (which includes all changes made via updateComponentByPath)
    const storeData = store.getComponentData(component.type, uniqueVariantId);
    const currentPageComponents = pageComponentsBefore;
    const existingComponent = currentPageComponents.find(
      (comp: any) => comp.id === component.id,
    );

    // IMPORTANT: Always use store.tempData directly (not tempData prop) to get the latest changes
    // This ensures that all changes made via updateByPath are included
    const actualTempData =
      store.tempData && Object.keys(store.tempData).length > 0
        ? store.tempData
        : latestTempData;

    console.group("🔍 Save Debug - tempData sources");
    console.log("Store TempData:", store.tempData);
    console.log("TempData Prop:", tempData);
    console.log("Latest TempData:", latestTempData);
    console.log("Actual TempData:", actualTempData);
    console.log("Store Data:", storeData);
    console.log("Existing Component Data:", existingComponent?.data);
    console.groupEnd();

    // Emit MERGE_STARTED event
    emitEvent("MERGE_STARTED", {
      context: {
        component: {
          id: component.id,
          type: component.type,
          variant: component.componentName,
          name: component.name || component.componentName,
        },
        location: {
          file: "useSaveHandler.ts",
          function: "handleRegularComponentSave",
          line: 0,
        },
        user: {
          action: "merge",
          page: currentPage,
        },
      },
      details: {
        action: "merge_started",
        source: "useSaveHandler",
      },
      dataFlow: {
        sources: [
          { name: "existingData", value: existingComponent?.data, priority: 3, used: true, reason: "Existing component data" },
          { name: "storeData", value: storeData, priority: 2, used: true, reason: "Store data" },
          { name: "tempData", value: actualTempData, priority: 1, used: true, reason: "Temporary changes" },
        ],
        merge: {
          method: "deepMerge",
          order: ["existingData", "storeData", "tempData"],
          result: {},
        },
      },
    });

    // Merge tempData with store data to preserve all changes
    // Priority: actualTempData (latest changes) > storeData (previous changes) > existingComponent.data (old changes)
    const mergedData = existingComponent?.data
      ? deepMerge(deepMerge(existingComponent.data, storeData), actualTempData)
      : deepMerge(storeData, actualTempData);

    // Emit MERGE_COMPLETED event
    emitEvent("MERGE_COMPLETED", {
      context: {
        component: {
          id: component.id,
          type: component.type,
          variant: component.componentName,
          name: component.name || component.componentName,
        },
        location: {
          file: "useSaveHandler.ts",
          function: "handleRegularComponentSave",
          line: 0,
        },
        user: {
          action: "merge",
          page: currentPage,
        },
      },
      details: {
        action: "merge_completed",
        source: "useSaveHandler",
      },
      dataFlow: {
        sources: [
          { name: "existingData", value: existingComponent?.data, priority: 3, used: true, reason: "Existing component data" },
          { name: "storeData", value: storeData, priority: 2, used: true, reason: "Store data" },
          { name: "tempData", value: actualTempData, priority: 1, used: true, reason: "Temporary changes" },
        ],
        merge: {
          method: "deepMerge",
          order: ["existingData", "storeData", "tempData"],
          result: mergedData,
        },
      },
    });

    console.group("🔧 Merge Process Debug");
    console.log("Existing Component Data:", existingComponent?.data);
    console.log("Store Data:", storeData);
    console.log("Latest TempData:", latestTempData);
    console.log("Actual TempData:", actualTempData);
    console.log("Merged Data:", mergedData);
    console.group("Styling Data");
    console.log("Styling in TempData:", actualTempData?.styling);
    console.log("Styling in StoreData:", storeData?.styling);
    console.log("Styling in MergedData:", mergedData?.styling);
    console.group("Search Button Data");
    console.log(
      "SearchButton in TempData:",
      actualTempData?.styling?.searchButton,
    );
    console.log("SearchButton in StoreData:", storeData?.styling?.searchButton);
    console.log(
      "SearchButton in MergedData:",
      mergedData?.styling?.searchButton,
    );
    console.groupEnd();
    console.groupEnd();
    console.groupEnd();

    // Track store update before saving
    storeTracker.trackUpdate({
      componentType: component.type,
      componentId: uniqueVariantId,
      before: storeData,
      after: mergedData,
      operation: "save",
      storeType: "editor",
    });

    // Emit STORE_UPDATED event
    emitEvent("STORE_UPDATED", {
      context: {
        component: {
          id: component.id,
          type: component.type,
          variant: component.componentName,
          name: component.name || component.componentName,
        },
        location: {
          file: "useSaveHandler.ts",
          function: "handleRegularComponentSave",
          line: 0,
        },
        user: {
          action: "store_update",
          page: currentPage,
        },
      },
      details: {
        action: "store_updated",
        source: "useSaveHandler",
      },
      before: {
        componentData: {},
        storeState: storeData,
        mergedData: {},
      },
      after: {
        componentData: {},
        storeState: mergedData,
        mergedData: mergedData,
      },
    });

    // Update the component data in the store using the merged data
    store.setComponentData(component.type, uniqueVariantId, mergedData);

    // Update pageComponentsByPage with the merged data
    const updatedPageComponents = currentPageComponents.map((comp: any) => {
      if (comp.id === component.id) {
        return {
          ...comp,
          data: mergedData,
        };
      }
      return comp;
    });

    // Update pageComponentsByPage
    store.forceUpdatePageComponents(currentPage, updatedPageComponents);

    onComponentUpdate(component.id, mergedData);

    // Update tempData with the merged data to keep sidebar in sync
    setTempData(mergedData);

    // Also update store.tempData to ensure consistency
    store.setTempData(mergedData);

    // Log after save for regular components
    const storeAfter = useEditorStore.getState();
    const pageComponentsAfter =
      storeAfter.pageComponentsByPage[currentPage] || [];

    console.group("✅ EditorSidebar Save Complete");
    console.log("Merged Data:", mergedData);
    console.log("Latest TempData:", latestTempData);
    console.log("Store Data:", storeData);
    console.log("Updated Page Components:", updatedPageComponents.length);
    console.log("Page Components After:", pageComponentsAfter.length);
    console.group("Store After");
    console.log("Contact Cards States:", storeAfter.contactCardsStates);
    console.log(
      "Page Components By Page:",
      storeAfter.pageComponentsByPage[currentPage],
    );
    console.groupEnd();
    console.groupEnd();

    // Emit SAVE_COMPLETED event
    emitEvent("SAVE_COMPLETED", {
      context: {
        component: {
          id: component.id,
          type: component.type,
          variant: component.componentName,
          name: component.name || component.componentName,
        },
        location: {
          file: "useSaveHandler.ts",
          function: "handleRegularComponentSave",
          line: 0,
        },
        user: {
          action: "save",
          page: currentPage,
        },
      },
      details: {
        action: "save_completed",
        source: "useSaveHandler",
        success: true,
        finalData: mergedData,
      },
    });

    onClose();
  };

  const handleSave = () => {
    // Handle branding-settings view
    if (view === "branding-settings") {
      handleBrandingSave();
      return;
    }

    if (selectedComponent) {
      // Set hasChangesMade to true when save is triggered
      console.group("🚀 EditorSidebar Save Process");
      console.log("Setting hasChangesMade to true");
      setHasChangesMade(true);

      // Get the latest tempData from store for global components
      const store = useEditorStore.getState();
      const latestTempData =
        selectedComponent.id === "global-header" ||
        selectedComponent.id === "global-footer"
          ? store.tempData && Object.keys(store.tempData).length > 0
            ? store.tempData
            : tempData
          : tempData;

      // Handle global components
      if (
        selectedComponent.id === "global-header" ||
        selectedComponent.id === "global-footer"
      ) {
        handleGlobalComponentSave(selectedComponent.id, latestTempData);
        console.groupEnd(); // Close main "🚀 EditorSidebar Save Process" group
        return;
      }

      // Handle regular components
      handleRegularComponentSave(selectedComponent, latestTempData);
      console.groupEnd(); // Close main "🚀 EditorSidebar Save Process" group
    }
  };

  return {
    handleSave,
  };
};
