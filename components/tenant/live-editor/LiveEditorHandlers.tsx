"use client";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { ComponentData } from "@/lib/types";
import {
  getDefaultThemeForType,
  applyAutoExpandLogic,
} from "@/services/live-editor";
import { createDefaultData } from "./EditorSidebar/utils";
import {
  logComponentAdd,
  logComponentChange,
  logUserAction,
} from "@/lib/debugLogger";
import {
  logBefore,
  logAfter,
  logBeforeAfter,
} from "@/lib/fileLogger";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// دالة بسيطة لإضافة رقم 1 لكل مكون
const getComponentNameWithOne = (componentType: string): string => {
  // إذا كان المكون يحتوي بالفعل على رقم، لا نضيف رقم آخر
  if (componentType.match(/\d+$/)) {
    return componentType;
  }
  return `${componentType}1`;
};

// ============================================================================
// معالجات الأحداث للـ LiveEditor
// ============================================================================

export function useLiveEditorHandlers(state: any) {
  const {
    setSidebarView,
    setSelectedComponentId,
    setSidebarOpen,
    setComponentToDelete,
    setDeleteDialogOpen,
    setDeletePageDialogOpen,
    setDeletePageConfirmation,
    setPageComponents,
    slug,
    tenantId,
  } = state;

  const router = useRouter();

  // Sidebar Handlers
  const openMainSidebar = () => {
    setSidebarView("main");
    setSelectedComponentId(null);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Component Edit Handlers
  const handleEditClick = (componentId: string) => {
    setSelectedComponentId(componentId);
    setSidebarView("edit-component");
    setSidebarOpen(true);
  };

  // Component Delete Handlers
  const handleDeleteClick = (componentId: string) => {
    setComponentToDelete(componentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (state.componentToDelete) {
      const componentToDeleteId = state.componentToDelete;
      const store = useEditorStore.getState();
      const currentPage = store.currentPage || slug;
      
      // Find component to delete for logging
      const componentToDelete = state.pageComponents.find(
        (c: any) => c.id === componentToDeleteId,
      );

      // ========== LOG BEFORE ==========
      logBefore(
        "COMPONENT_DELETE",
        "DELETE_COMPONENT_START",
        {
          componentToDelete: componentToDelete
            ? {
                id: componentToDelete.id,
                type: componentToDelete.type,
                componentName: componentToDelete.componentName,
              }
            : { id: componentToDeleteId },
          currentPageComponentsCount: state.pageComponents.length,
          currentPage,
          storePageComponentsCount:
            store.pageComponentsByPage[currentPage]?.length || 0,
        },
        {
          componentId: componentToDeleteId,
          componentName: componentToDelete?.componentName,
          componentType: componentToDelete?.type,
        },
      );

      setPageComponents((currentComponents: any[]) => {
        // حذف المكون وتطبيق منطق التوسع التلقائي
        const filteredComponents = currentComponents.filter(
          (c) => c.id !== componentToDeleteId,
        );
        const newComponents = applyAutoExpandLogic(filteredComponents);

        // ⭐ CRITICAL: Update pageComponentsByPage in the store AFTER render
        // Using setTimeout to avoid "Cannot update component while rendering" error
        // This still executes quickly but after the render phase completes
        setTimeout(() => {
          const storeAfter = useEditorStore.getState();
          const currentPageAfter = storeAfter.currentPage || slug;
          storeAfter.forceUpdatePageComponents(currentPageAfter, newComponents);

          // ========== LOG AFTER ==========
          // Log after store update completes
          const finalStore = useEditorStore.getState();
          logAfter(
            "COMPONENT_DELETE",
            "DELETE_COMPONENT_COMPLETE",
            {
              deletedComponentId: componentToDeleteId,
              newComponentsCount: newComponents.length,
              currentPage: currentPageAfter,
              storePageComponentsCount:
                finalStore.pageComponentsByPage[currentPageAfter]?.length || 0,
            },
            {
              componentId: componentToDeleteId,
              componentName: componentToDelete?.componentName,
              componentType: componentToDelete?.type,
            },
          );

          // ========== LOG BEFORE/AFTER ==========
          logBeforeAfter(
            "DELETE_COMPONENT",
            {
              pageComponentsBefore: currentComponents.map((c: any) => ({
                id: c.id,
                type: c.type,
                componentName: c.componentName,
              })),
              pageComponentsByPageBefore:
                store.pageComponentsByPage[currentPage]?.map((c: any) => ({
                  id: c.id,
                  type: c.type,
                  componentName: c.componentName,
                })) || [],
            },
            {
              pageComponentsAfter: newComponents.map((c: any) => ({
                id: c.id,
                type: c.type,
                componentName: c.componentName,
              })),
              pageComponentsByPageAfter:
                finalStore.pageComponentsByPage[currentPageAfter]?.map(
                  (c: any) => ({
                    id: c.id,
                    type: c.type,
                    componentName: c.componentName,
                  }),
                ) || [],
            },
            {
              componentId: componentToDeleteId,
              componentName: componentToDelete?.componentName,
              componentType: componentToDelete?.type,
            },
          );
        }, 0);

        return newComponents;
      });
    }
    setDeleteDialogOpen(false);
    setComponentToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setComponentToDelete(null);
  };

  // Page Delete Handlers
  const handleDeletePage = () => {
    setDeletePageDialogOpen(true);
  };

  const confirmDeletePage = () => {
    if (
      state.deletePageConfirmation === "I am sure I want to delete this page" ||
      state.deletePageConfirmation ===
        "أنا متأكد من أنني أريد حذف هذه الصفحة" ||
      state.deletePageConfirmation === "أنا متأكد"
    ) {
      // Remove page from editorStore
      const store = useEditorStore.getState();
      store.deletePage(slug);

      // Remove page from tenantStore componentSettings
      const { tenantData } = useTenantStore.getState();
      if (tenantData?.componentSettings) {
        const updatedComponentSettings = { ...tenantData.componentSettings };
        delete updatedComponentSettings[slug];

        useTenantStore.setState({
          tenantData: {
            ...tenantData,
            componentSettings: updatedComponentSettings,
          },
        });
      }

      // Clear page components
      setPageComponents([]);

      // Close dialog and reset confirmation
      setDeletePageDialogOpen(false);
      setDeletePageConfirmation("");

      // Navigate to homepage in live editor
      router.push(`/live-editor/homepage`);
    }
  };

  const cancelDeletePage = () => {
    setDeletePageDialogOpen(false);
    setDeletePageConfirmation("");
  };

  // Component Update Handlers
  const handleComponentUpdate = (id: string, newData: ComponentData) => {
    // Handle global components - save them separately, not in pageComponentsByPage
    if (id === "global-header" || id === "global-footer") {
      // Get current store state
      const store = useEditorStore.getState();

      console.log(
        "🔍 [LiveEditorHandlers] Saving global component separately:",
        {
          id,
          newData,
          globalHeaderData: store.globalHeaderData,
          globalFooterData: store.globalFooterData,
        },
      );

      // Global components are already saved in their respective stores (globalHeaderData, globalFooterData)
      // No need to save them to pageComponentsByPage
      // They will be sent to API separately via save-changes endpoint

      return; // Don't proceed with regular component update
    }

    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => (c.id === id ? { ...c, data: newData } : c)),
    );
  };

  const handleComponentThemeChange = (id: string, newTheme: string) => {
    // Log user action
    logUserAction("CHANGE_COMPONENT_THEME", id, newTheme, {
      id,
      newTheme,
      reason: "User changed component theme",
    });

    // Handle global-header specially
    if (id === "global-header") {
      const store = useEditorStore.getState();

      // ⭐ CRITICAL: Preserve logo.image/logo.text from current globalHeaderData before changing theme
      // This ensures data is preserved when switching from header2 to header1 (like footer behavior)
      const currentGlobalHeaderData = store.globalHeaderData || {};
      const preservedLogoImage = currentGlobalHeaderData?.logo?.image;
      const preservedLogoText = currentGlobalHeaderData?.logo?.text;

      // Get default data for the new theme
      const newDefaultData = createDefaultData("header", newTheme);

      // ⭐ Add variant to newDefaultData to ensure it's included
      // ⭐ Also Include CustomBranding if available
      const customBranding = store.WebsiteLayout?.CustomBranding?.header;
      const newDefaultDataWithVariant: any = {
        ...newDefaultData,
        variant: newTheme,
      };

      // Ensure logo structure exists
      if (!newDefaultDataWithVariant.logo) {
        newDefaultDataWithVariant.logo = {};
      }

      // Priority: CustomBranding > Preserved from current data > Default
      // Inject CustomBranding (highest priority)
      if (customBranding) {
        // Header usually has logo object at root or inside logo property
        // Check standard header structure (usually logo.image and logo.text/alt)
        if (customBranding.logo) {
          if (typeof newDefaultDataWithVariant.logo === "object") {
            newDefaultDataWithVariant.logo.image = customBranding.logo;
          } else {
             // Fallback if structure is different
             newDefaultDataWithVariant.logo = customBranding.logo;
          }
        }
        if (customBranding.name) {
          if (typeof newDefaultDataWithVariant.logo === "object") {
             // Usually text or alt
             newDefaultDataWithVariant.logo.text = customBranding.name;
             newDefaultDataWithVariant.logo.alt = customBranding.name;
          }
        }
      } else {
        // ⭐ CRITICAL: If no CustomBranding, preserve logo.image/text from current globalHeaderData
        // This matches footer behavior - preserves data when changing theme
        if (preservedLogoImage) {
          if (typeof newDefaultDataWithVariant.logo === "object") {
            newDefaultDataWithVariant.logo.image = preservedLogoImage;
          }
          console.log("[LiveEditorHandlers] Preserved logo.image from current globalHeaderData:", preservedLogoImage);
        }
        if (preservedLogoText) {
          if (typeof newDefaultDataWithVariant.logo === "object") {
            newDefaultDataWithVariant.logo.text = preservedLogoText;
            newDefaultDataWithVariant.logo.alt = preservedLogoText;
          }
          console.log("[LiveEditorHandlers] Preserved logo.text from current globalHeaderData:", preservedLogoText);
        }
        if (!preservedLogoImage && !preservedLogoText) {
          console.warn("[LiveEditorHandlers] No CustomBranding or preserved data found for header");
        }
      }

      // IMPORTANT: Update variant FIRST, then data
      // This ensures the variant is saved before any other operations
      store.setGlobalHeaderVariant(newTheme);

      // Update data with variant included
      store.setGlobalHeaderData(newDefaultDataWithVariant);

      // ⭐ CRITICAL: Update tempData to show change immediately in Editor Sidebar
      store.setTempData(newDefaultDataWithVariant);

      // Update globalComponentsData with BOTH variant and data
      store.setGlobalComponentsData({
        ...store.globalComponentsData,
        header: newDefaultDataWithVariant,
        globalHeaderVariant: newTheme, // ← Also save variant in globalComponentsData
      } as any);

      // Mark as changed
      store.setHasChangesMade(true);

      return; // Don't proceed with regular component update
    }

    // Handle global-footer specially
    if (id === "global-footer") {
      const store = useEditorStore.getState();

      // ⭐ CRITICAL: Preserve logo/name from current globalFooterData before changing theme
      // This ensures data is preserved when switching from footer2 to footer1 (like footer2 behavior)
      const currentGlobalFooterData = store.globalFooterData || {};
      const preservedLogo = currentGlobalFooterData?.content?.companyInfo?.logo;
      const preservedName = currentGlobalFooterData?.content?.companyInfo?.name;

      // Get default data for the new theme
      const newDefaultData = createDefaultData("footer", newTheme);

      // ⭐ Add variant to newDefaultData to ensure it's included
      // ⭐ Also Include CustomBranding if available
      const customBranding = store.WebsiteLayout?.CustomBranding?.footer;
      
      console.log("[LiveEditorHandlers] Debug CustomBranding:", { 
          customBranding, 
          websiteLayout: store.WebsiteLayout 
      });

      const newDefaultDataWithVariant: any = {
        ...newDefaultData,
        variant: newTheme,
      };

      // Ensure content.companyInfo structure exists
      if (!newDefaultDataWithVariant.content) {
        newDefaultDataWithVariant.content = {};
      }
      if (!newDefaultDataWithVariant.content.companyInfo) {
        newDefaultDataWithVariant.content.companyInfo = {};
      }

      // Priority: CustomBranding > Preserved from current data > Default
      // Inject CustomBranding (highest priority)
      if (customBranding) {
        if (customBranding.logo) {
          newDefaultDataWithVariant.content.companyInfo.logo =
            customBranding.logo;
        }
        if (customBranding.name) {
          newDefaultDataWithVariant.content.companyInfo.name =
            customBranding.name;
        }
        console.log("[LiveEditorHandlers] Injected Branding:", newDefaultDataWithVariant.content.companyInfo);
      } else {
        // ⭐ CRITICAL: If no CustomBranding, preserve logo/name from current globalFooterData
        // This matches footer2 behavior - preserves data when changing theme
        if (preservedLogo) {
          newDefaultDataWithVariant.content.companyInfo.logo = preservedLogo;
          console.log("[LiveEditorHandlers] Preserved logo from current globalFooterData:", preservedLogo);
        }
        if (preservedName) {
          newDefaultDataWithVariant.content.companyInfo.name = preservedName;
          console.log("[LiveEditorHandlers] Preserved name from current globalFooterData:", preservedName);
        }
        if (!preservedLogo && !preservedName) {
          console.warn("[LiveEditorHandlers] No CustomBranding or preserved data found for footer");
        }
      }

      // IMPORTANT: Update variant FIRST, then data
      store.setGlobalFooterVariant(newTheme);

      // Update data with variant included
      store.setGlobalFooterData(newDefaultDataWithVariant);

      // ⭐ CRITICAL: Update tempData to show change immediately in Editor Sidebar
      // Using setTimeout to ensure this runs after any effects that might try to reset it
      setTimeout(() => {
         console.log("[LiveEditorHandlers] Forcing tempData update via setTimeout");
         store.setTempData(newDefaultDataWithVariant);
      }, 50);

      // Update globalComponentsData with BOTH variant and data
      store.setGlobalComponentsData({
        ...store.globalComponentsData,
        footer: newDefaultDataWithVariant,
        globalFooterVariant: newTheme,
      } as any);

      // Mark as changed
      store.setHasChangesMade(true);

      return; // Don't proceed with regular component update
    }

    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => {
        if (c.id === id) {
          const oldTheme = c.componentName;

          // Log component change
          logComponentChange(id, oldTheme, newTheme, {
            oldComponent: c,
            newTheme,
            reason: "Component theme changed",
          });

          // Get new default data for the new theme
          const newDefaultData = createDefaultData(c.type, newTheme);

          // Check if this is a static page (before setTimeout to use in return)
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          const staticPageData = store.getStaticPageData(currentPage);
          const isStaticPage = !!staticPageData;

          // Defer store update to avoid render cycle issues
          setTimeout(() => {
            const store = useEditorStore.getState();
            const currentPage = store.currentPage;

            // Check if this is a static page
            const staticPageData = store.getStaticPageData(currentPage);
            const isStaticPage = !!staticPageData;

            if (isStaticPage && staticPageData) {
              // ⭐ STATIC PAGE: Update staticPagesData with incremented forceUpdate
              // For static pages, id should match componentName
              const updatedComponents = staticPageData.components.map(
                (comp: any) => {
                  if (comp.id === id) {
                    // ⭐ Update id to match newTheme for static pages
                    const newId = newTheme;
                    return {
                      ...comp,
                      id: newId, // ✅ Update id to match componentName
                      componentName: newTheme,
                      data: newDefaultData,
                      forceUpdate: (comp.forceUpdate || 0) + 1, // ✅ Increment forceUpdate
                    };
                  }
                  return comp;
                },
              );

              // ⭐ Also update componentData in store with new id
              // Move data from old id to new id
              store.setComponentData(c.type, newTheme, newDefaultData);

              store.setStaticPageData(currentPage, {
                ...staticPageData,
                components: updatedComponents,
                // API endpoints remain unchanged (IMMUTABLE)
              });
            } else {
              // REGULAR PAGE: Update pageComponentsByPage in the store with new data
              const updatedPageComponents =
                store.pageComponentsByPage[currentPage] || [];
              const updatedStoreComponents = updatedPageComponents.map(
                (comp: any) => {
                  if (comp.id === id) {
                    return {
                      ...comp,
                      componentName: newTheme,
                      data: newDefaultData,
                    };
                  }
                  return comp;
                },
              );

              // Update the store
              store.forceUpdatePageComponents(
                currentPage,
                updatedStoreComponents,
              );
            }

            // Also update the component data in the store
            // For static pages, use newTheme as id; for regular pages, use original id
            if (isStaticPage && staticPageData) {
              store.setComponentData(c.type, newTheme, newDefaultData);
            } else {
              store.setComponentData(c.type, id, newDefaultData);
            }
          }, 0);

          // ✅ Update id for static pages to match componentName
          return {
            ...c,
            id: isStaticPage ? newTheme : c.id, // ✅ Update id for static pages
            componentName: newTheme,
            data: newDefaultData,
            forceUpdate: (c.forceUpdate || 0) + 1, // ✅ Increment forceUpdate in local state
          };
        }
        return c;
      }),
    );
  };

  const handleComponentReset = (id: string) => {
    setPageComponents((currentComponents: any[]) =>
      currentComponents.map((c) => {
        if (c.id === id) {
          // Get default data for this component type and current theme
          const defaultData = createDefaultData(c.type, c.componentName);

          // Also reset data in the editor store using component.id as unique identifier
          const store = useEditorStore.getState();
          store.setComponentData(c.type, id, defaultData);

          // Defer store update to avoid render cycle issues
          setTimeout(() => {
            const currentPage = store.currentPage;

            // Update pageComponentsByPage in the store
            const updatedPageComponents =
              store.pageComponentsByPage[currentPage] || [];
            const updatedStoreComponents = updatedPageComponents.map(
              (comp: any) => {
                if (comp.id === id) {
                  return {
                    ...comp,
                    data: defaultData,
                    componentName: c.componentName, // Keep current theme
                  };
                }
                return comp;
              },
            );

            // Update the store
            store.forceUpdatePageComponents(
              currentPage,
              updatedStoreComponents,
            );
          }, 0);

          return {
            ...c,
            data: defaultData,
            // Keep current theme, just reset data
            componentName: c.componentName,
          };
        }
        return c;
      }),
    );
  };

  // Page Theme Change Handler
  const handlePageThemeChange = (
    themeId: string,
    components: Record<string, string>,
  ) => {
    // ⭐ CRITICAL: Update store FIRST, then update pageComponents from store
    // This prevents infinite loops by ensuring single source of truth
    const store = useEditorStore.getState();
    const currentPage = store.currentPage;

    // Get current page components from store (or use current state as fallback)
    const currentStoreComponents =
      store.pageComponentsByPage[currentPage] || state.pageComponents || [];

    // Prepare updated components for store
    const updatedStoreComponents = currentStoreComponents.map((comp: any) => {
      const newTheme = components[comp.type];
      if (newTheme) {
        // Get new default data for the new theme
        const newDefaultData = createDefaultData(comp.type, newTheme);

        // Update component data in store immediately
        store.setComponentData(comp.type, comp.id, newDefaultData);

        return {
          ...comp,
          componentName: newTheme,
          data: newDefaultData,
        };
      }
      return comp;
    });

    // Update store FIRST (single update)
    store.forceUpdatePageComponents(currentPage, updatedStoreComponents);

    // Then update pageComponents from updatedStoreComponents (synchronously)
    // This ensures both store and local state are in sync without causing loops
    setPageComponents(updatedStoreComponents);
  };

  // Add Section Handler
  const handleAddSection = (type: string) => {
    // إضافة رقم 1 لكل مكون
    const componentName = getComponentNameWithOne(type);
    const componentId = uuidv4();

    // Log user action
    logUserAction("ADD_COMPONENT", componentId, componentName, {
      type,
      componentName,
      componentId,
      reason: "User clicked add component",
    });

    const defaultData = createDefaultData(type, componentName);

    const newSection = {
      id: componentId,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      componentName,
      data: defaultData,
      layout: {
        row: state.pageComponents.length,
        col: 0,
        span: 2,
      },
    };

    // Log component addition
    logComponentAdd(componentId, componentName, type, {
      newSection,
      defaultData,
      currentComponents: state.pageComponents,
      reason: "Component added to page",
    });

    setPageComponents((current: any[]) => [...current, newSection]);

    // Defer store update to avoid render cycle issues
    setTimeout(() => {
      const store = useEditorStore.getState();
      const currentPage = store.currentPage;
      const updatedPageComponents = [
        ...(store.pageComponentsByPage[currentPage] || []),
        newSection,
      ];
      store.forceUpdatePageComponents(currentPage, updatedPageComponents);
    }, 0);

    setSidebarView("main");
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: any) => {
    state.setActiveId(event.active.id);
  };

  const handleDragEndLocal = (event: any) => {
    const {
      handleDragEnd,
      manageDragState,
    } = require("@/services/live-editor");

    // Create a custom setPageComponents that also updates the store
    const setPageComponentsWithStore = (
      updater: (components: any[]) => any[],
    ) => {
      setPageComponents((currentComponents: any[]) => {
        const newComponents = updater(currentComponents);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(currentPage, newComponents);
        }, 0);

        return newComponents;
      });
    };

    handleDragEnd(
      event,
      state.pageComponents,
      state.dropIndicator,
      setPageComponentsWithStore,
    );
    manageDragState.end(state.setActiveId, state.setDropIndicator);
  };

  return {
    // Sidebar
    openMainSidebar,
    closeSidebar,

    // Component
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleComponentUpdate,
    handleComponentThemeChange,
    handleComponentReset,

    // Page
    handleDeletePage,
    confirmDeletePage,
    cancelDeletePage,
    handlePageThemeChange,

    // Add Section
    handleAddSection,

    // Drag and Drop
    handleDragStart,
    handleDragEndLocal,
  };
}
