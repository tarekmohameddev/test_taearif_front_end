import { DragDropProvider } from "@dnd-kit/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
// import { createNestedDroppablePlugin } from "./NestedDroppablePlugin"; // مؤقتاً
// import { collisionStore } from "./collision/dynamic/store"; // مؤقتاً

const DEBUG = false;

type Events = DragDropEvents<Draggable, Droppable, DragDropManager>;
type DragCbs = Partial<{ [eventName in keyof Events]: Events[eventName][] }>;

const dragListenerContext = createContext<{
  dragListeners: DragCbs;
  setDragListeners?: Dispatch<SetStateAction<DragCbs>>;
}>({
  dragListeners: {},
});

type EventKeys = keyof Events;

export function useDragListener(
  type: EventKeys,
  fn: Events[EventKeys],
  deps: any[] = [],
) {
  const { setDragListeners } = useContext(dragListenerContext);

  useEffect(() => {
    if (setDragListeners) {
      setDragListeners((old) => ({
        ...old,
        [type]: [...(old[type] || []), fn],
      }));
    }
  }, deps);
}

type DeepestParams = {
  zone: string | null;
  area: string | null;
};

const AREA_CHANGE_DEBOUNCE_MS = 100;

type LiveEditorDragDropContextProps = {
  children: ReactNode;
  disableAutoScroll?: boolean;
  onComponentAdd?: (componentData: any) => void;
  onComponentMove?: (
    sourceIndex: number,
    sourceZone: string,
    destinationIndex: number,
    destinationZone: string,
  ) => void;
};

// Utility to generate unique IDs
const generateId = () =>
  `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const LiveEditorDragDropContextClient = ({
  children,
  disableAutoScroll,
  onComponentAdd,
  onComponentMove,
}: LiveEditorDragDropContextProps) => {
  const id = generateId();

  const debouncedParamsRef = useRef<DeepestParams | null>(null);

  const [zoneStore] = useState(() => createZoneStore());

  const getChanged = useCallback(
    (params: DeepestParams, id: string) => {
      const { zoneDepthIndex = {}, areaDepthIndex = {} } =
        zoneStore.getState() || {};

      const stateHasZone = Object.keys(zoneDepthIndex).length > 0;
      const stateHasArea = Object.keys(areaDepthIndex).length > 0;

      let zoneChanged = false;
      let areaChanged = false;

      if (params.zone && !zoneDepthIndex[params.zone]) {
        zoneChanged = true;
      } else if (!params.zone && stateHasZone) {
        zoneChanged = true;
      }

      if (params.area && !areaDepthIndex[params.area]) {
        areaChanged = true;
      } else if (!params.area && stateHasArea) {
        areaChanged = true;
      }

      return { zoneChanged, areaChanged };
    },
    [zoneStore],
  );

  const setDeepestAndCollide = useCallback(
    (params: DeepestParams, manager: DragDropManager) => {
      const { zoneChanged, areaChanged } = getChanged(params, id);

      if (!zoneChanged && !areaChanged) return;

      zoneStore.setState({
        zoneDepthIndex: params.zone ? { [params.zone]: true } : {},
        areaDepthIndex: params.area ? { [params.area]: true } : {},
      });

      setTimeout(() => {
        // Force update after debounce
        manager.collisionObserver.forceUpdate(true);
      }, 50);

      debouncedParamsRef.current = null;
    },
    [zoneStore],
  );

  const setDeepestDb = useDebouncedCallback(
    setDeepestAndCollide,
    AREA_CHANGE_DEBOUNCE_MS,
  );

  const cancelDb = () => {
    setDeepestDb.cancel();
    debouncedParamsRef.current = null;
  };

  const [plugins] = useState(() => {
    const basePlugins = [];

    // إضافة plugins الأساسية من defaultPreset بحذر
    try {
      if (defaultPreset?.plugins) {
        const filteredPlugins = disableAutoScroll
          ? defaultPreset.plugins.filter(
              (plugin) => plugin && plugin !== AutoScroller,
            )
          : defaultPreset.plugins.filter((plugin) => plugin); // تصفية plugins null/undefined

        basePlugins.push(...filteredPlugins);
      }
    } catch (error) {
      console.warn("Error loading default plugins:", error);
    }

    // إضافة plugin مخصص مبسط (مؤقتاً)
    // سنضيف createNestedDroppablePlugin لاحقاً عندما نتأكد من أنه يعمل

    return basePlugins;
  });

  const sensors = useLiveEditorSensors();

  const [dragListeners, setDragListeners] = useState<DragCbs>({});

  const dragMode = useRef<"new" | "existing" | null>(null);

  const initialSelector = useRef<{ zone: string; index: number }>(undefined);

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
            console.log("🔍 [LIVE-EDITOR-DND] onDragEnd called");
            const { source, target } = event.operation;
            console.log(
              "🔍 [LIVE-EDITOR-DND] Source:",
              source?.id,
              "Target:",
              target?.id,
            );

            // تنظيف الحالة دائماً
            zoneStore.setState({
              draggedItem: null,
              previewIndex: {},
            });

            if (!source || event.canceled) {
              console.log("🔍 [LIVE-EDITOR-DND] No source or event canceled");
              return;
            }

            // تحديد نوع العنصر المسحوب
            const isNewComponent =
              source.type === "drawer" ||
              source.id.toString().includes("drawer-item");
            const sourceData = source.data as any;

            if (target) {
              console.log("🔍 [LIVE-EDITOR-DND] Target exists, processing...");
              let targetZone = "root";
              let targetIndex = 0;

              if (target.type === "component") {
                console.log("🔍 [LIVE-EDITOR-DND] Target is component");
                const targetData = target.data as any;
                targetZone = targetData.zone || "root";
                targetIndex = targetData.index || 0;

                // تحديد موقع الإفلات (قبل أو بعد العنصر)
                // بشكل مبسط - سنضع العنصر بعد الهدف
                targetIndex = targetIndex + 1;
                console.log(
                  "🔍 [LIVE-EDITOR-DND] Component target - zone:",
                  targetZone,
                  "index:",
                  targetIndex,
                );
              } else if (target.type === "dropzone") {
                console.log("🔍 [LIVE-EDITOR-DND] Target is dropzone");
                targetZone = target.id.toString();
                targetIndex = 0; // في بداية المنطقة
                console.log(
                  "🔍 [LIVE-EDITOR-DND] Dropzone target - zone:",
                  targetZone,
                  "index:",
                  targetIndex,
                );
              }

              if (isNewComponent) {
                console.log("🔍 [LIVE-EDITOR-DND] Adding new component:", {
                  componentType: sourceData.componentType,
                  zone: targetZone,
                  index: targetIndex,
                });
                // إضافة مكون جديد
                onComponentAdd?.({
                  componentType: sourceData.componentType,
                  zone: targetZone,
                  index: targetIndex,
                  data: sourceData.data || {},
                });
              } else {
                console.log("🔍 [LIVE-EDITOR-DND] Moving existing component:", {
                  sourceIndex: sourceData.index || 0,
                  sourceZone: sourceData.zone || "root",
                  targetIndex,
                  targetZone,
                });
                // نقل مكون موجود
                const sourceIndex = sourceData.index || 0;
                const sourceZone = sourceData.zone || "root";

                onComponentMove?.(
                  sourceIndex,
                  sourceZone,
                  targetIndex,
                  targetZone,
                );
              }
            } else {
            }

            // تنظيف المراجع
            initialSelector.current = undefined;

            dragListeners.dragend?.forEach((fn) => {
              fn(event, manager);
            });
          }}
          onDragOver={(event, manager) => {
            // مبسط جداً لتجنب المشاكل
            const { source, target } = event.operation;

            if (!source || !target) return;

            // فقط لإظهار visual feedback - بدون منطق معقد
            const sourceData = source.data as any;
            const isNewComponent =
              source.type === "drawer" ||
              source.id.toString().includes("drawer-item");

            if (isNewComponent) {
              dragMode.current = "new";
            } else {
              dragMode.current = "existing";
              if (!initialSelector.current) {
                initialSelector.current = {
                  zone: sourceData.zone || "root",
                  index: sourceData.index || 0,
                };
              }
            }

            dragListeners.dragover?.forEach((fn) => {
              fn(event, manager);
            });
          }}
          onDragStart={(event, manager) => {
            const { source } = event.operation;

            if (source) {
              const sourceData = source.data as any;
              const isNewComponent =
                source.type === "drawer" ||
                source.id.toString().includes("drawer-item");
            }

            dragListeners.dragstart?.forEach((fn) => {
              fn(event, manager);
            });
          }}
          onBeforeDragStart={(event) => {
            const source = event.operation.source;
            const isNewComponent =
              source?.type === "drawer" ||
              source?.id.toString().includes("drawer-item");

            dragMode.current = isNewComponent ? "new" : "existing";
            initialSelector.current = undefined;

            zoneStore.setState({
              draggedItem: source,
              previewIndex: {}, // تنظيف أي preview قديم
            });
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
};

export const LiveEditorDragDropContext = ({
  children,
  disableAutoScroll,
  onComponentAdd,
  onComponentMove,
}: LiveEditorDragDropContextProps) => {
  return (
    <LiveEditorDragDropContextClient
      disableAutoScroll={disableAutoScroll}
      onComponentAdd={onComponentAdd}
      onComponentMove={onComponentMove}
    >
      {children}
    </LiveEditorDragDropContextClient>
  );
};
