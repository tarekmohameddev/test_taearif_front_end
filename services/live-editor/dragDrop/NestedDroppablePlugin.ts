import { Plugin } from "@dnd-kit/dom";
import { DragDropManager, Droppable } from "@dnd-kit/dom";

interface NestedDroppableParams {
  zone: string | null;
  area: string | null;
}

interface NestedDroppableOptions {
  onChange: (params: NestedDroppableParams, manager: DragDropManager) => void;
}

/**
 * Plugin لدعم nested droppables مستوحى من Puck
 * يتيح التعامل مع المناطق المتداخلة بشكل ذكي
 */
export const createNestedDroppablePlugin = (
  options: NestedDroppableOptions,
  contextId: string,
): Plugin => {
  let lastParams: NestedDroppableParams | null = null;

  const getZoneFromId = (id: string): string | null => {
    if (id === "root") return "root";

    // إذا كان ID يحتوي على ":" فهو zone مركب
    if (id.includes(":")) {
      const [areaId, zoneId] = id.split(":");
      return zoneId;
    }

    return id;
  };

  const getAreaFromId = (id: string): string | null => {
    if (id === "root") return "root";

    // إذا كان ID يحتوي على ":" فهو zone مركب
    if (id.includes(":")) {
      const [areaId] = id.split(":");
      return areaId;
    }

    return null;
  };

  const findDeepestDroppable = (
    droppables: Map<string, Droppable>,
    targetPosition: { x: number; y: number },
  ): Droppable | null => {
    let deepestDroppable: Droppable | null = null;
    let maxDepth = -1;

    for (const droppable of droppables.values()) {
      if (droppable.disabled || !droppable.shape) continue;

      const rect = droppable.shape.boundingRectangle;

      // التحقق من التداخل مع النقطة
      if (
        targetPosition.x >= rect.left &&
        targetPosition.x <= rect.right &&
        targetPosition.y >= rect.top &&
        targetPosition.y <= rect.bottom
      ) {
        // حساب العمق بناءً على data
        const depth = (droppable.data as any)?.depth || 0;

        if (depth > maxDepth) {
          maxDepth = depth;
          deepestDroppable = droppable;
        }
      }
    }

    return deepestDroppable;
  };

  return {
    name: "NestedDroppable",

    onDragMove: (manager: DragDropManager) => {
      const dragOperation = manager.dragOperation;
      if (!dragOperation.source) return;

      const pointerPosition = dragOperation.position.current;
      const deepestDroppable = findDeepestDroppable(
        manager.registry.droppables,
        pointerPosition,
      );

      let zone: string | null = null;
      let area: string | null = null;

      if (deepestDroppable) {
        zone = getZoneFromId(deepestDroppable.id.toString());
        area = getAreaFromId(deepestDroppable.id.toString());
      }

      const currentParams: NestedDroppableParams = { zone, area };

      // التحقق من التغيير
      const hasChanged =
        !lastParams ||
        lastParams.zone !== currentParams.zone ||
        lastParams.area !== currentParams.area;

      if (hasChanged) {
        lastParams = currentParams;
        options.onChange(currentParams, manager);
      }
    },

    onDragEnd: () => {
      lastParams = null;
    },

    onDragCancel: () => {
      lastParams = null;
    },
  };
};
