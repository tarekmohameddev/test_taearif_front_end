import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { AutoScroller, defaultPreset, DragDropManager } from "@dnd-kit/dom";
import { DragDropEvents } from "@dnd-kit/abstract";
import type { Draggable, Droppable } from "@dnd-kit/dom";
import { useDebouncedCallback } from "use-debounce";
import { createZoneStore, ZoneStoreType, Preview } from "./zoneStore";
import {
  DropZoneContext,
  ZoneStoreProvider,
  DropZoneProvider,
} from "./zoneContext";
import { useLiveEditorSensors } from "./useSensors";
import {
  positionTracker,
  trackComponentMove,
  PositionDebugInfo,
} from "./enhanced-position-tracker";

const DEBUG = false;

// Drag listener context
const dragListenerContext = createContext<{
  dragListeners: { [id: string]: (event: DragDropEvents["dragstart"]) => void };
  setDragListeners: React.Dispatch<
    React.SetStateAction<{
      [id: string]: (event: DragDropEvents["dragstart"]) => void;
    }>
  >;
}>({
  dragListeners: {},
  setDragListeners: () => {},
});

export const useDragListener = () => useContext(dragListenerContext);

// Main component props
interface EnhancedLiveEditorDragDropContextProps {
  children: React.ReactNode;
  components: any[];
  onComponentMove?: (
    sourceIndex: number,
    sourceZone: string,
    finalIndex: number,
    destinationZone: string,
    updatedComponents?: any[],
    debugInfo?: PositionDebugInfo,
  ) => void;
  onComponentAdd?: (data: {
    type: string;
    index: number;
    zone: string;
    variant?: string;
    sourceData?: any;
  }) => void;
  onPositionDebug?: (debugInfo: PositionDebugInfo) => void;
  id?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
}

export function EnhancedLiveEditorDragDropContext({
  children,
  components,
  onComponentMove,
  onComponentAdd,
  onPositionDebug,
  id = "enhanced-drag-drop-context",
  iframeRef,
}: EnhancedLiveEditorDragDropContextProps) {
  const [dragListeners, setDragListeners] = useState<{
    [id: string]: (event: DragDropEvents["dragstart"]) => void;
  }>({});

  const sensors = useLiveEditorSensors();

  const zoneStore = useMemo(() => createZoneStore(), []);

  const plugins = useMemo(() => {
    const basePlugins = [];

    // إضافة plugins الأساسية من defaultPreset
    try {
      if (defaultPreset?.plugins) {
        const filteredPlugins = defaultPreset.plugins.filter(
          (plugin) => plugin,
        );
        basePlugins.push(...filteredPlugins);
      }
    } catch (error) {
      console.warn("Error loading default plugins:", error);
    }

    return basePlugins;
  }, []);

  const handleEnhancedMove = useCallback(
    (
      sourceIndex: number,
      sourceZone: string,
      destinationIndex: number,
      destinationZone: string,
    ) => {
      const result = trackComponentMove(
        components,
        sourceIndex,
        sourceZone,
        destinationIndex,
        destinationZone,
      );

      if (result.success && onComponentMove) {
        onComponentMove(
          sourceIndex,
          sourceZone,
          destinationIndex,
          destinationZone,
          result.updatedComponents,
          result.debugInfo,
        );
      } else {
        if (DEBUG) {
          // Debug logging disabled
        }

        onPositionDebug?.(result.debugInfo);
      }
    },
    [components, onComponentMove, onPositionDebug],
  );

  const nextContextValue = useMemo<DropZoneContext>(
    () => ({
      mode: "edit",
      areaId: "root",
      depth: 0,
    }),
    [],
  );

  return (
    <div id={id}>
      <dragListenerContext.Provider
        value={{
          dragListeners,
          setDragListeners,
        }}
      >
        <DragDropProvider
          plugins={plugins}
          sensors={sensors}
          onDragEnd={(event, manager) => {
            const { source, target } = event.operation;

            const iframeDoc = iframeRef?.current?.contentDocument;
            if (!iframeDoc) {
              return;
            }

            const isNewComponent =
              source?.id?.toString().startsWith("new-component") ||
              source?.id?.toString().startsWith("drawer-item-");

            if (!source || event.canceled) {
              return;
            }

            const sourceData = source.data;
            const sourceComponentId = source.id.toString();

            if (target) {
              const targetComponentId = target.id.toString();
              let targetZone = "";
              let targetIndex = 0;
              let realTargetIndex = 0;

              if (target.type === "droppable" || target.type === "dropzone") {
                console.log(
                  "🔍 [DRAG DEBUG] Target is droppable, targetComponentId:",
                  targetComponentId,
                );

                // للـ dropzone، نحتاج لحساب الموضع بناءً على موقع الماوس
                if (
                  target.type === "dropzone" &&
                  targetComponentId === "root"
                ) {
                  console.log(
                    "🔍 [DRAG DEBUG] Handling root dropzone - calculating position based on mouse position",
                  );

                  const dragY = (event.operation.shape as any)?.current?.y || 0;
                  console.log("🔍 [DRAG DEBUG] Drag Y position:", dragY);

                  const allElements = Array.from(
                    iframeDoc.querySelectorAll("[data-component-id]"),
                  )
                    .map((el) => {
                      const elementRect = el.getBoundingClientRect();
                      return {
                        id: el.getAttribute("data-component-id"),
                        index: parseInt(el.getAttribute("data-index") || "0"),
                        top: elementRect.top,
                        bottom: elementRect.bottom,
                        element: el,
                      };
                    })
                    .sort((a, b) => a.top - b.top);

                  const sortedElements = allElements.filter((item) => item.id);
                  console.log(
                    "🔍 [DRAG DEBUG] Sorted elements for root dropzone:",
                    sortedElements.map((el) => ({
                      id: el.id,
                      index: el.index,
                      top: el.top,
                    })),
                  );

                  // البحث عن الموضع الصحيح بناءً على موقع الماوس
                  let calculatedIndex = 0;
                  for (const item of sortedElements) {
                    if (dragY < item.top) {
                      calculatedIndex = item.index;
                      console.log(
                        "🔍 [DRAG DEBUG] Found insertion point at index:",
                        calculatedIndex,
                        "for element:",
                        item.id,
                      );
                      break;
                    }
                    calculatedIndex = item.index + 1;
                  }

                  targetIndex = calculatedIndex;
                  realTargetIndex = calculatedIndex;
                  targetZone = "main";

                  console.log(
                    "🔍 [DRAG DEBUG] Root dropzone - calculated targetIndex:",
                    targetIndex,
                  );
                } else {
                  // للعناصر العادية
                  const targetElement =
                    iframeDoc.getElementById(targetComponentId);
                  if (targetElement) {
                    console.log(
                      "🔍 [DRAG DEBUG] Target element found, calculating positions...",
                    );
                    const rect = targetElement.getBoundingClientRect();
                    const dragY =
                      (event.operation.shape as any)?.current?.y || 0;
                    const midpoint = rect.top + rect.height / 2;
                    console.log(
                      "🔍 [DRAG DEBUG] Rect:",
                      rect,
                      "DragY:",
                      dragY,
                      "Midpoint:",
                      midpoint,
                    );

                    const allElements = Array.from(
                      iframeDoc.querySelectorAll("[data-component-id]"),
                    )
                      .map((el) => {
                        const elementRect = el.getBoundingClientRect();
                        return {
                          id: el.getAttribute("data-component-id"),
                          index: parseInt(el.getAttribute("data-index") || "0"),
                          top: elementRect.top,
                          bottom: elementRect.bottom,
                          element: el,
                        };
                      })
                      .sort((a, b) => a.top - b.top);

                    const sortedElements = allElements.filter(
                      (item) => item.id,
                    );
                    let realTargetIndex = targetIndex;
                    let foundTarget = false;

                    console.log(
                      "🔍 [DRAG DEBUG] Sorted elements:",
                      sortedElements.map((el) => ({
                        id: el.id,
                        index: el.index,
                        top: el.top,
                      })),
                    );
                    console.log(
                      "🔍 [DRAG DEBUG] Drag Y:",
                      dragY,
                      "Midpoint:",
                      midpoint,
                    );

                    for (const item of sortedElements) {
                      if (dragY < item.top) {
                        realTargetIndex = item.index;
                        console.log(
                          "🔍 [DRAG DEBUG] Found target at index:",
                          realTargetIndex,
                          "for element:",
                          item.id,
                        );
                        foundTarget = true;
                        break;
                      }
                    }

                    if (!foundTarget && sortedElements.length > 0) {
                      const lastElement =
                        sortedElements[sortedElements.length - 1];
                      realTargetIndex = lastElement.index + 1;
                      console.log(
                        "🔍 [DRAG DEBUG] No target found, using last element + 1:",
                        realTargetIndex,
                      );
                    }

                    if (targetComponentId !== "root") {
                      // Find the actual index of the target component in the sorted elements
                      const targetElementIndex = sortedElements.findIndex(
                        (item) => item.id === targetComponentId,
                      );
                      const parsedTargetIndex =
                        targetElementIndex >= 0 ? targetElementIndex : 0;

                      console.log(
                        "🔍 [DRAG DEBUG] Target element index in sorted elements:",
                        targetElementIndex,
                      );
                      console.log(
                        "🔍 [DRAG DEBUG] Parsed target index:",
                        parsedTargetIndex,
                      );

                      if (dragY > midpoint) {
                        targetIndex = parsedTargetIndex + 1;
                        console.log(
                          "🔍 [DRAG DEBUG] Target component calculation - dragY > midpoint, targetIndex:",
                          targetIndex,
                        );
                      } else {
                        targetIndex = parsedTargetIndex;
                        console.log(
                          "🔍 [DRAG DEBUG] Target component calculation - dragY <= midpoint, targetIndex:",
                          targetIndex,
                        );
                      }
                      // Don't override realTargetIndex - use the calculated value
                      console.log(
                        "🔍 [DRAG DEBUG] Target component calculation - parsedTargetIndex:",
                        parsedTargetIndex,
                        "targetIndex:",
                        targetIndex,
                      );
                    } else {
                      targetIndex = realTargetIndex;
                      console.log(
                        "🔍 [DRAG DEBUG] Root target - using realTargetIndex:",
                        realTargetIndex,
                      );
                    }
                  } else {
                    console.log(
                      "🔍 [DRAG DEBUG] Target element not found, using default targetIndex:",
                      targetIndex,
                    );
                    console.log(
                      "🔍 [DRAG DEBUG] TargetComponentId:",
                      targetComponentId,
                    );
                  }
                }
              } else if (target.type === "component") {
                console.log(
                  "🔍 [DRAG DEBUG] Target is component, targetComponentId:",
                  targetComponentId,
                );

                // Try multiple ways to find the target element
                let targetElement = iframeDoc.getElementById(targetComponentId);

                if (!targetElement) {
                  // Try finding by data-component-id
                  targetElement = iframeDoc.querySelector(
                    `[data-component-id="${targetComponentId}"]`,
                  );
                }

                if (!targetElement) {
                  // Try finding by data-live-editor-dnd
                  targetElement = iframeDoc.querySelector(
                    `[data-live-editor-dnd="${targetComponentId}"]`,
                  );
                }

                if (!targetElement) {
                  // Try finding by data-testid
                  targetElement = iframeDoc.querySelector(
                    `[data-testid*="component"]`,
                  );
                }

                if (!targetElement) {
                  // Try finding by any element with id
                  targetElement = iframeDoc.querySelector(`*[id]`);
                }

                console.log("🔍 [DRAG DEBUG] Target element search result:", {
                  targetComponentId,
                  foundById: !!iframeDoc.getElementById(targetComponentId),
                  foundByDataComponentId: !!iframeDoc.querySelector(
                    `[data-component-id="${targetComponentId}"]`,
                  ),
                  foundByDataLiveEditorDnd: !!iframeDoc.querySelector(
                    `[data-live-editor-dnd="${targetComponentId}"]`,
                  ),
                  targetElement: !!targetElement,
                });

                if (targetElement) {
                  console.log(
                    "🔍 [DRAG DEBUG] Target element found, calculating positions...",
                  );
                  const rect = targetElement.getBoundingClientRect();
                  const dragY = (event.operation.shape as any)?.current?.y || 0;
                  const midpoint = rect.top + rect.height / 2;
                  console.log(
                    "🔍 [DRAG DEBUG] Rect:",
                    rect,
                    "DragY:",
                    dragY,
                    "Midpoint:",
                    midpoint,
                  );

                  const allElements = Array.from(
                    iframeDoc.querySelectorAll("[data-component-id]"),
                  )
                    .map((el) => {
                      const elementRect = el.getBoundingClientRect();
                      return {
                        id: el.getAttribute("data-component-id"),
                        index: parseInt(el.getAttribute("data-index") || "0"),
                        top: elementRect.top,
                        bottom: elementRect.bottom,
                        element: el,
                      };
                    })
                    .sort((a, b) => a.top - b.top);

                  const sortedElements = allElements.filter((item) => item.id);
                  console.log(
                    "🔍 [DRAG DEBUG] Sorted elements:",
                    sortedElements.map((el) => ({
                      id: el.id,
                      index: el.index,
                      top: el.top,
                    })),
                  );
                  console.log(
                    "🔍 [DRAG DEBUG] Drag Y:",
                    dragY,
                    "Midpoint:",
                    midpoint,
                  );

                  // Find the target element in sorted elements
                  const targetElementIndex = sortedElements.findIndex(
                    (item) => item.id === targetComponentId,
                  );
                  if (targetElementIndex >= 0) {
                    console.log(
                      "🔍 [DRAG DEBUG] Found target at index:",
                      targetElementIndex,
                      "for element:",
                      targetComponentId,
                    );

                    if (dragY > midpoint) {
                      targetIndex = targetElementIndex + 1;
                      console.log(
                        "🔍 [DRAG DEBUG] Target component calculation - dragY > midpoint, targetIndex:",
                        targetIndex,
                      );
                    } else {
                      targetIndex = targetElementIndex;
                      console.log(
                        "🔍 [DRAG DEBUG] Target component calculation - dragY <= midpoint, targetIndex:",
                        targetIndex,
                      );
                    }
                    realTargetIndex = targetIndex;
                    console.log(
                      "🔍 [DRAG DEBUG] Target component calculation - targetIndex:",
                      targetIndex,
                      "realTargetIndex:",
                      realTargetIndex,
                    );
                  } else {
                    console.log(
                      "🔍 [DRAG DEBUG] Target element not found in sorted elements, using default targetIndex:",
                      targetIndex,
                    );
                  }
                } else {
                  console.log(
                    "🔍 [DRAG DEBUG] Target element not found, using default targetIndex:",
                    targetIndex,
                  );
                  console.log(
                    "🔍 [DRAG DEBUG] TargetComponentId:",
                    targetComponentId,
                  );

                  // Check all available elements
                  const allAvailableElements = [
                    ...Array.from(
                      iframeDoc.querySelectorAll("[data-component-id]"),
                    ),
                    ...Array.from(
                      iframeDoc.querySelectorAll("[data-live-editor-dnd]"),
                    ),
                    ...Array.from(
                      iframeDoc.querySelectorAll('[data-testid*="component"]'),
                    ),
                    ...Array.from(iframeDoc.querySelectorAll("*[id]")),
                  ];

                  console.log(
                    "🔍 [DRAG DEBUG] Available elements:",
                    allAvailableElements.map((el) => ({
                      id: el.id,
                      dataComponentId: el.getAttribute("data-component-id"),
                      dataLiveEditorDnd: el.getAttribute(
                        "data-live-editor-dnd",
                      ),
                      dataTestId: el.getAttribute("data-testid"),
                      tagName: el.tagName,
                      className: el.className,
                    })),
                  );
                }
              } else {
                console.log(
                  "🔍 [DRAG DEBUG] Target is not droppable or component, type:",
                  target.type,
                );
              }

              targetZone = target.id.toString();

              if (isNewComponent) {
                console.log("🔍 [DRAG DEBUG] Adding new component:", {
                  sourceData,
                  componentType: sourceData.componentType || sourceData.type,
                  targetIndex,
                  targetZone,
                });

                onComponentAdd?.({
                  type:
                    sourceData.componentType || sourceData.type || "unknown",
                  index: targetIndex,
                  zone: targetZone,
                  variant: sourceData.data?.variant,
                  sourceData: sourceData.data,
                });
              } else {
                const actualSourceIndex = components.findIndex(
                  (c) => c.id === sourceComponentId,
                );

                if (actualSourceIndex !== -1) {
                  console.log("--- ENHANCED MOVE ---");
                  console.log("Source Index:", actualSourceIndex);
                  console.log("Target Index:", targetIndex);
                  console.log("Target Component ID:", targetComponentId);
                  console.log("Real Target Index:", realTargetIndex);
                  console.log("Using targetIndex for move:", targetIndex);
                  handleEnhancedMove(
                    actualSourceIndex,
                    "main",
                    targetIndex,
                    "main",
                  );
                }
              }
            } else {
              console.log("🔍 [DRAG DEBUG] No target found");
            }

            manager.dragOperation.reset();
          }}
          onDragStart={(event, manager) => {
            const { source } = event.operation;

            const listener = dragListeners[source?.id?.toString() || ""];
            if (listener) {
              listener(event);
            }

            const isNewComponent =
              source?.id?.toString().startsWith("new-component") ||
              source?.id?.toString().startsWith("drawer-item-");
          }}
        >
          <ZoneStoreProvider store={zoneStore}>
            <DropZoneProvider value={nextContextValue}>
              {children}
            </DropZoneProvider>
          </ZoneStoreProvider>
        </DragDropProvider>
      </dragListenerContext.Provider>
    </div>
  );
}
