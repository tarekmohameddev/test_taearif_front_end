import { useEffect, useRef } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { isStaticPage } from "./utils/staticPageHelpers";

interface UseSaveFunctionEffectProps {
  slug: string;
  pageComponents: ComponentInstance[];
}

export const useSaveFunctionEffect = ({
  slug,
  pageComponents,
}: UseSaveFunctionEffectProps) => {
  // Use ref to store latest pageComponents to avoid recreating function on every change
  const pageComponentsRef = useRef<ComponentInstance[]>(pageComponents);

  // Update ref whenever pageComponents changes
  useEffect(() => {
    pageComponentsRef.current = pageComponents;
  }, [pageComponents]);

  // Setup Save Function Effect
  useEffect(() => {
    const saveFn = () => {
      const store = useEditorStore.getState();
      // Get fresh pageComponents from ref (always has latest value)
      const currentPageComponents = pageComponentsRef.current;

      // Get fresh staticPagesData from store (has latest componentName updates)
      const staticPageData = store.getStaticPageData(slug);
      const isStatic = !!staticPageData;

      if (isStatic && staticPageData) {
        // STATIC PAGE - Use staticPagesData from store (which has latest componentName updates)
        // The staticPagesData is already updated when componentName changes in ComponentEditor
        // We need to merge pageComponents (local changes) with staticPagesData (latest componentName)
        // ✅ Get fresh staticPagesData to ensure we have the latest componentName
        const currentStaticPageData = store.getStaticPageData(slug);
        if (currentStaticPageData) {
          // Merge: use componentName and id from staticPagesData (up-to-date), but keep other data from pageComponents
          const mergedComponents = currentPageComponents.map(
            (localComp: any) => {
              // Find matching component in staticPagesData to get latest componentName and id
              // First try to find by id, then by componentName (in case id changed)
              let storeComp = currentStaticPageData.components.find(
                (sc: any) => sc.id === localComp.id,
              );
              // If not found by id, try to find by componentName (for cases where id was updated)
              if (!storeComp) {
                storeComp = currentStaticPageData.components.find(
                  (sc: any) => sc.componentName === localComp.componentName,
                );
              }
              // ✅ Use componentName and id from staticPagesData (more up-to-date than pageComponents)
              // For static pages, id should match componentName
              return {
                ...localComp,
                id: storeComp?.id || localComp.id, // ✅ Sync id (should match componentName for static pages)
                componentName:
                  storeComp?.componentName || localComp.componentName,
                forceUpdate: (localComp.forceUpdate || 0) + 1, // Ensure forceUpdate is incremented
              };
            },
          );

          // ✅ Update staticPagesData with merged components (includes latest componentName)
          store.setStaticPageData(slug, {
            ...currentStaticPageData,
            components: mergedComponents,
            // API endpoints remain unchanged (IMMUTABLE)
          });
        }
      } else {
        // REGULAR PAGE - Update pageComponentsByPage
        store.forceUpdatePageComponents(slug, currentPageComponents);
      }
    };

    // Set the save function in the store
    useEditorStore.getState().setOpenSaveDialog(saveFn);

    // Cleanup: reset to empty function when component unmounts or slug changes
    return () => {
      useEditorStore.getState().setOpenSaveDialog(() => {});
    };
  }, [slug]); // Only depend on slug, not pageComponents
};
