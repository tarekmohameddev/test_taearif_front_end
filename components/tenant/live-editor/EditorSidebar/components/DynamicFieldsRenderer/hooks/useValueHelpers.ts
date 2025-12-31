import { useCallback } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { normalizePath } from "../../../utils";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";

interface UseValueHelpersProps {
  currentData: any;
  componentType: string | null;
  variantId: string | null;
  onUpdateByPath?: (path: string, value: any) => void;
}

export const useValueHelpers = ({
  currentData,
  componentType,
  variantId,
  onUpdateByPath,
}: UseValueHelpersProps) => {
  const {
    tempData,
    updateByPath,
    getComponentData,
    updateComponentByPath,
    globalHeaderData,
    globalFooterData,
    globalComponentsData,
  } = useEditorStore();

  const getValueByPath = useCallback(
    (path: string) => {
      // Validate path
      if (!path || typeof path !== "string") {
        console.warn("⚠️ [DynamicFieldsRenderer] Invalid path provided:", path);
        return undefined;
      }

      const segments = normalizePath(path).split(".").filter(Boolean);
      if (segments.length === 0) {
        console.warn("⚠️ [DynamicFieldsRenderer] Empty path segments:", path);
        return undefined;
      }

      // Use currentData first, then fall back to other sources
      let cursor: any = {};

      // Use currentData if provided (unified system)
      if (currentData && Object.keys(currentData).length > 0) {
        cursor = currentData;
      } else if (variantId === "global-header") {
        // Use globalComponentsData for global header
        cursor = globalComponentsData?.header || tempData || {};

        // Validate global component data structure
        if (cursor && typeof cursor === "object") {
          const requiredFields = ["visible", "menu", "logo", "colors"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required header fields:",
              missingFields,
            );
          }
        }
      } else if (variantId === "global-footer") {
        // Use globalComponentsData for global footer
        cursor = globalComponentsData?.footer || tempData || {};

        // Validate global component data structure
        if (cursor && typeof cursor === "object") {
          const requiredFields = ["visible", "content", "styling"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required footer fields:",
              missingFields,
            );
          }
        }
      } else if (
        variantId === "global-header" ||
        variantId === "global-footer"
      ) {
        // For global components, always use tempData for editing (not global data)
        cursor = tempData || {};

        // Validate global component data structure
        if (
          variantId === "global-header" &&
          cursor &&
          typeof cursor === "object"
        ) {
          const requiredFields = ["visible", "menu", "logo", "colors"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required header fields:",
              missingFields,
            );
          }
        } else if (
          variantId === "global-footer" &&
          cursor &&
          typeof cursor === "object"
        ) {
          const requiredFields = ["visible", "content", "styling"];
          const missingFields = requiredFields.filter(
            (field) => !(field in cursor),
          );
          if (missingFields.length > 0) {
            console.warn(
              "⚠️ [DynamicFieldsRenderer] Missing required footer fields:",
              missingFields,
            );
          }
        }
      } else if (componentType && variantId && COMPONENTS[componentType]) {
        // For regular components, prioritize tempData for live editing
        const componentData = getComponentData(componentType, variantId);

        // Always use tempData if it has data (for live editing)
        if (tempData && Object.keys(tempData).length > 0) {
          cursor = tempData;
        }
        // If tempData is empty but currentData is provided, use currentData (initial load)
        else if (currentData && Object.keys(currentData).length > 0) {
          cursor = currentData;
        }
        // Fall back to componentData from store
        else if (componentData && Object.keys(componentData).length > 0) {
          cursor = componentData;
        } else {
          cursor = {};
        }
      } else {
        // Fall back to tempData
        cursor = tempData || {};
      }

      // Special handling for halfTextHalfImage3 imagePosition
      if (path === "content.imagePosition" && cursor && cursor.imagePosition) {
        return cursor.imagePosition;
      }

      // Special handling for halfTextHalfImage3 layout.direction
      if (
        path === "layout.direction" &&
        cursor &&
        cursor.layout &&
        cursor.layout.direction
      ) {
        return cursor.layout.direction;
      }

      for (const seg of segments) {
        if (cursor == null) return undefined;
        cursor = cursor[seg as any];
      }

      return cursor;
    },
    [
      currentData,
      tempData,
      componentType,
      variantId,
      getComponentData,
      globalHeaderData,
      globalFooterData,
      globalComponentsData,
    ],
  );

  const updateValue = useCallback(
    (path: string, value: any) => {
      // Special handling for halfTextHalfImage3 imagePosition
      if (
        path === "content.imagePosition" &&
        componentType === "halfTextHalfImage"
      ) {
        // Update both content.imagePosition and top-level imagePosition for consistency
        if (onUpdateByPath) {
          onUpdateByPath("content.imagePosition", value);
          onUpdateByPath("imagePosition", value);
        } else if (componentType && variantId) {
          updateComponentByPath(
            componentType,
            variantId,
            "content.imagePosition",
            value,
          );
          updateComponentByPath(
            componentType,
            variantId,
            "imagePosition",
            value,
          );
        }
        return;
      }

      // Special handling for halfTextHalfImage3 layout.direction
      if (
        path === "layout.direction" &&
        componentType === "halfTextHalfImage"
      ) {
        // Update layout.direction
        if (onUpdateByPath) {
          onUpdateByPath("layout.direction", value);
        } else if (componentType && variantId) {
          updateComponentByPath(
            componentType,
            variantId,
            "layout.direction",
            value,
          );
        }
        return;
      }

      if (onUpdateByPath) {
        // For regular components, prioritize tempData updates for immediate UI feedback
        if (
          componentType &&
          variantId &&
          variantId !== "global-header" &&
          variantId !== "global-footer"
        ) {
          // Use updateByPath to update tempData for immediate UI feedback
          updateByPath(path, value);
        } else {
          // Use the unified update function for global components
          onUpdateByPath(path, value);
        }
      } else {
        // Check if this is a global component
        if (variantId === "global-header") {
          // Use tempData for global header components
          updateByPath(path, value);
        } else if (variantId === "global-footer") {
          // Use tempData for global footer components
          updateByPath(path, value);
        } else if (componentType && variantId) {
          // For regular components, always use tempData for live editing
          // This ensures that changes are immediately visible in the UI
          updateByPath(path, value);
        } else {
          updateByPath(path, value);
        }
      }
    },
    [
      onUpdateByPath,
      updateByPath,
      updateComponentByPath,
      componentType,
      variantId,
      globalHeaderData,
      globalFooterData,
    ],
  );

  return { getValueByPath, updateValue };
};
