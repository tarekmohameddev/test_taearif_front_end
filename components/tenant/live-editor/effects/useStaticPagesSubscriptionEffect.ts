import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib-liveeditor/types";
import { isStaticPage } from "./utils/staticPageHelpers";

interface UseStaticPagesSubscriptionEffectProps {
  slug: string;
  pageComponents: ComponentInstance[];
  setPageComponents: (
    components:
      | ComponentInstance[]
      | ((prev: ComponentInstance[]) => ComponentInstance[]),
  ) => void;
}

export const useStaticPagesSubscriptionEffect = ({
  slug,
  pageComponents,
  setPageComponents,
}: UseStaticPagesSubscriptionEffectProps) => {
  // ⭐ Sync pageComponents with staticPagesData when componentName changes
  // This ensures pageComponents is updated when componentName is changed in ComponentEditor
  // Use Zustand subscription to listen to staticPagesData changes
  useEffect(() => {
    const editorStore = useEditorStore.getState();
    const staticPageData = editorStore.getStaticPageData(slug);
    const isStatic = !!staticPageData;

    if (!isStatic || !staticPageData) return;

    // Subscribe to staticPagesData changes
    const unsubscribe = useEditorStore.subscribe(
      (state) => state.staticPagesData?.[slug],
      (staticPageData) => {
        if (!staticPageData) return;

        // Use functional update to access latest pageComponents (avoids stale closure)
        setPageComponents((currentPageComponents) => {
          // Check if staticPagesData has different componentName than pageComponents
          const needsUpdate = staticPageData.components.some(
            (storeComp: any) => {
              const localComp = currentPageComponents.find(
                (lc: any) => lc.id === storeComp.id,
              );
              return (
                localComp && localComp.componentName !== storeComp.componentName
              );
            },
          );

          if (needsUpdate) {
            // Update pageComponents to match staticPagesData (especially componentName and id)
            return currentPageComponents.map((localComp: any) => {
              const storeComp = staticPageData.components.find(
                (sc: any) =>
                  sc.id === localComp.id ||
                  sc.componentName === localComp.componentName,
              );
              if (
                storeComp &&
                (storeComp.componentName !== localComp.componentName ||
                  storeComp.id !== localComp.id)
              ) {
                // Use componentName and id from staticPagesData (more up-to-date)
                // For static pages, id should match componentName
                return {
                  ...localComp,
                  id: storeComp.id, // ✅ Sync id (should match componentName for static pages)
                  componentName: storeComp.componentName,
                  forceUpdate:
                    storeComp.forceUpdate || localComp.forceUpdate || 0, // ✅ Sync forceUpdate
                };
              }
              return localComp;
            });
          }
          return currentPageComponents;
        });
      },
    );

    return unsubscribe;
  }, [slug, setPageComponents]); // ✅ Removed pageComponents from dependencies to avoid stale closure
};
