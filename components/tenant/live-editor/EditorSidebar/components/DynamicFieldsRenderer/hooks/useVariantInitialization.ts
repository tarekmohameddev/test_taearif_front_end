import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";

interface UseVariantInitializationProps {
  variantId: string | null;
  componentType: string | null;
  tempData: any;
}

export const useVariantInitialization = ({
  variantId,
  componentType,
  tempData,
}: UseVariantInitializationProps) => {
  // Initialize variant data if needed
  useEffect(() => {
    if (!variantId || !componentType || !COMPONENTS[componentType]) {
      return;
    }

    // ⭐ CRITICAL: Get fresh store state inside effect to avoid stale closures
    // Don't subscribe to store functions - they're stable but can cause loops in deps
    const store = useEditorStore.getState();

    // Initialize variant (ensureComponentVariant checks if exists before creating)
    // This is safe to call multiple times - it only creates if doesn't exist
    store.ensureComponentVariant(componentType, variantId);

    // For non-global components, ensure tempData is initialized with current component data
    if (variantId !== "global-header" && variantId !== "global-footer") {
      const componentData = store.getComponentData(componentType, variantId);

      // Only update if tempData is empty and we have component data
      if (componentData && (!tempData || Object.keys(tempData).length === 0)) {
        // Initialize tempData with current component data for live editing
        store.setComponentData(componentType, variantId, componentData);
      }
    }
    // ⭐ CRITICAL: Only depend on variantId and componentType
    // Don't include store functions or tempData in deps to prevent infinite loops
    // tempData changes will be handled by the component that uses this hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentType, variantId]);
};
