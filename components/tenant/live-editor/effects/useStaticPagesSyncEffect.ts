import { useEffect, useRef } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib/types";
import { isStaticPage } from "./utils/staticPageHelpers";
import { formatStaticPageComponents } from "./utils/staticPageHelpers";

interface UseStaticPagesSyncEffectProps {
  initialized: boolean;
  slug: string;
  tenantData: any;
  staticPagesData: any;
  setPageComponents: (
    components:
      | ComponentInstance[]
      | ((prev: ComponentInstance[]) => ComponentInstance[]),
  ) => void;
  lastSyncedRef: React.MutableRefObject<string>;
}

export const useStaticPagesSyncEffect = ({
  initialized,
  slug,
  tenantData,
  staticPagesData,
  setPageComponents,
  lastSyncedRef,
}: UseStaticPagesSyncEffectProps) => {
  // ⭐ NEW: Force update pageComponents when staticPagesData changes for current page
  // This ensures immediate update when theme changes and staticPagesData is updated
  useEffect(() => {
    if (!initialized) return;

    const editorStore = useEditorStore.getState();
    const pageIsStatic = isStaticPage(slug, tenantData, editorStore);

    if (pageIsStatic) {
      const staticPageData = editorStore.getStaticPageData(slug);
      const staticPageComponents = staticPageData?.components || [];

      if (staticPageComponents.length > 0) {
        // Create signature function for comparison
        const createSignature = (components: any[]) => {
          if (!components || components.length === 0) return "empty";
          return components
            .map((c) => {
              const dataHash = JSON.stringify(c.data || {});
              return `${c.id}-${c.type}-${c.componentName}-${dataHash.substring(0, 50)}`;
            })
            .sort()
            .join(",");
        };

        const staticComponents = formatStaticPageComponents(
          staticPageComponents,
          slug,
        );

        const staticSignature = createSignature(staticComponents);

        // Only update if signature changed to avoid infinite loops
        if (lastSyncedRef.current !== staticSignature) {
          console.log(
            "[LiveEditorEffects] Force update pageComponents from staticPagesData:",
            {
              slug,
              componentCount: staticComponents.length,
              componentNames: staticComponents.map((c: any) => c.componentName),
              componentIds: staticComponents.map((c: any) => c.id),
              signature: staticSignature.substring(0, 50),
            },
          );

          // Force update immediately
          setPageComponents(staticComponents);
          lastSyncedRef.current = staticSignature;
        }
      }
    }
  }, [
    slug,
    staticPagesData,
    initialized,
    tenantData,
    setPageComponents,
    lastSyncedRef,
  ]);
};
