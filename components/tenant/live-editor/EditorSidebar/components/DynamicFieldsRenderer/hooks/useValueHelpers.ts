import { useCallback } from "react";
import { useEditorStore } from "@/context/editorStore";
import { deepMerge } from "@/context/editorStore/utils/deepMerge";
import { normalizePath } from "../../../utils";
import { COMPONENTS } from "@/lib/ComponentsList";
import { useEventDebug } from "@/lib/debug/live-editor/hooks/useEventDebug";
import { useDataFlowDebug } from "@/lib/debug/live-editor/hooks/useDataFlowDebug";
import { contextUtils } from "@/lib/debug/live-editor/utils/contextUtils";
import { getSessionId } from "@/lib/debug/live-editor/core/config";
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";

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

  // Debug tracking
  const { emitEvent } = useEventDebug();
  const { trackDataFlow } = useDataFlowDebug({
    componentId: variantId || "",
    componentType: componentType || "unknown",
    defaultData: {},
    tenantData: {},
    storeData: getComponentData(componentType || "", variantId || "") || {},
    mergedData: currentData || {},
  });

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

      // Use currentData first, then fall back to other sources.
      // When both currentData and tempData exist, merge tempData over currentData so condition checks
      // (e.g. useCustomFooterLogo) see the latest toggle/edits immediately.
      let cursor: any = {};

      // Use currentData if provided (unified system)
      if (currentData && Object.keys(currentData).length > 0) {
        cursor =
          tempData && Object.keys(tempData).length > 0
            ? deepMerge(currentData, tempData)
            : currentData;
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
      // Get old value for debug tracking (before update)
      let oldValue: any;
      try {
        const segments = normalizePath(path).split(".").filter(Boolean);
        let cursor: any = currentData && Object.keys(currentData).length > 0 ? currentData : (tempData || {});
        for (const seg of segments) {
          if (cursor == null) break;
          cursor = cursor[seg as any];
        }
        oldValue = cursor;
      } catch {
        oldValue = undefined;
      }

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

        // Emit FIELD_UPDATED event
        if (isDebugEnabled() && componentType && variantId) {
          const context = contextUtils.buildContext(
            variantId,
            componentType,
            variantId,
            variantId,
            {
              action: "field_update",
              page: typeof window !== "undefined" ? window.location.pathname : "unknown",
            }
          );

          emitEvent("FIELD_UPDATED", {
            context,
            details: {
              action: "field_update",
              field: {
                path: "content.imagePosition",
                oldValue,
                newValue: value,
                type: "string",
              },
              source: "DynamicFieldsRenderer",
            },
            before: {
              componentData: currentData || {},
              storeState: getComponentData(componentType, variantId) || {},
              mergedData: currentData || {},
            },
            after: {
              componentData: { ...(currentData || {}), content: { ...(currentData?.content || {}), imagePosition: value } },
              storeState: getComponentData(componentType, variantId) || {},
              mergedData: { ...(currentData || {}), content: { ...(currentData?.content || {}), imagePosition: value } },
            },
          });
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

        // Emit FIELD_UPDATED event
        if (isDebugEnabled() && componentType && variantId) {
          const context = contextUtils.buildContext(
            variantId,
            componentType,
            variantId,
            variantId,
            {
              action: "field_update",
              page: typeof window !== "undefined" ? window.location.pathname : "unknown",
            }
          );

          emitEvent("FIELD_UPDATED", {
            context,
            details: {
              action: "field_update",
              field: {
                path: "layout.direction",
                oldValue,
                newValue: value,
                type: "string",
              },
              source: "DynamicFieldsRenderer",
            },
            before: {
              componentData: currentData || {},
              storeState: getComponentData(componentType, variantId) || {},
              mergedData: currentData || {},
            },
            after: {
              componentData: { ...(currentData || {}), layout: { ...(currentData?.layout || {}), direction: value } },
              storeState: getComponentData(componentType, variantId) || {},
              mergedData: { ...(currentData || {}), layout: { ...(currentData?.layout || {}), direction: value } },
            },
          });
        }

        return;
      }

      // Track data flow before update
      if (isDebugEnabled() && componentType && variantId) {
        trackDataFlow({
          operation: "field_update",
          path,
          oldValue,
          newValue: value,
        });
      }

      if (onUpdateByPath) {
        // For regular components, update tempData + component store AND notify parent so currentData stays in sync
        if (
          componentType &&
          variantId &&
          variantId !== "global-header" &&
          variantId !== "global-footer"
        ) {
          updateByPath(path, value);
          updateComponentByPath(componentType, variantId, path, value);
          onUpdateByPath(path, value);
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
          // For regular components, update both tempData and component store
          // This ensures that changes are immediately visible in the UI AND persist when saving
          updateByPath(path, value);
          updateComponentByPath(componentType, variantId, path, value);
        } else {
          updateByPath(path, value);
        }
      }

      // Emit FIELD_UPDATED event after update
      if (isDebugEnabled() && componentType && variantId) {
        const context = contextUtils.buildContext(
          variantId,
          componentType,
          variantId,
          variantId,
          {
            action: "field_update",
            page: typeof window !== "undefined" ? window.location.pathname : "unknown",
          }
        );

        const storeData = getComponentData(componentType, variantId) || {};
        const updatedData = { ...(currentData || {}), [path]: value };

        emitEvent("FIELD_UPDATED", {
          context,
          details: {
            action: "field_update",
            field: {
              path,
              oldValue,
              newValue: value,
              type: typeof value,
            },
            source: "DynamicFieldsRenderer",
          },
          before: {
            componentData: currentData || {},
            storeState: storeData,
            mergedData: currentData || {},
          },
          after: {
            componentData: updatedData,
            storeState: storeData,
            mergedData: updatedData,
          },
        });
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
      getValueByPath,
      getComponentData,
      currentData,
      emitEvent,
      trackDataFlow,
    ],
  );

  return { getValueByPath, updateValue };
};
