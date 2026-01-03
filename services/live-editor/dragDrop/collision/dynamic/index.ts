import {
  Collision,
  CollisionDetector,
  CollisionPriority,
  CollisionType,
  UniqueIdentifier,
} from "@dnd-kit/abstract";
// import { directionalCollision } from "../directional";
// import { getDirection } from "./get-direction";
// import { getMidpointImpact } from "./get-midpoint-impact";
// import { trackMovementInterval } from "./track-movement-interval";
// import { collisionDebug } from "../collision-debug";
import { closestCorners } from "@dnd-kit/collision";
// import { DragAxis, Direction } from "../../types";
// import { collisionStore } from "./store";

type DragAxis = "x" | "y" | "both";
type Direction = "up" | "down" | "left" | "right";

let flushNext: UniqueIdentifier = "";

/**
 * نظام Collision Detection ديناميكي مستوحى من Puck
 *
 * يجمع بين midpoint detection و directional collision للحصول على
 * تجربة سحب وإفلات سلسة وخالية من التشويش في التخطيطات المعقدة
 */
export const createDynamicCollisionDetector = (
  dragAxis: DragAxis,
  midpointOffset: number = 0.05,
) =>
  ((input) => {
    const { dragOperation, droppable } = input;

    const { position } = dragOperation;
    const dragShape = dragOperation.shape?.current;
    const { shape: dropShape } = droppable;

    if (!dragShape || !dropShape) {
      return null;
    }

    const { center: dragCenter } = dragShape;

    const fallbackEnabled = true; // collisionStore.getState().fallbackEnabled;

    // تبسيط مؤقت - سيتم تحسينه لاحقاً
    let direction: Direction = "down";

    const data = {
      direction: direction as Direction,
    };

    const { center: dropCenter } = dropShape;

    const overMidpoint = true; // getMidpointImpact(dragShape, dropShape, direction, midpointOffset);

    if (dragOperation.source?.id === droppable.id) {
      // إذا كان العنصر المسحوب والهدف نفس العنصر، نتحقق من الاتجاه
      // لمنع الحركة غير المتوقعة في التخطيطات المعقدة

      // مبسط مؤقتاً
      const intersectionArea = dragShape.intersectionArea(dropShape);
      if (intersectionArea > 0) {
        return {
          id: droppable.id,
          value: intersectionArea / dropShape.area,
          priority: CollisionPriority.Highest,
          type: CollisionType.Collision,
          data,
        };
      }
    }

    const intersectionArea = dragShape.intersectionArea(dropShape);
    const intersectionRatio = intersectionArea / dropShape.area;

    if (intersectionArea && overMidpoint) {
      // collisionDebug(
      //   dragCenter,
      //   dropCenter,
      //   droppable.id.toString(),
      //   "green",
      //   interval.direction
      // );

      const collision: Collision = {
        id: droppable.id,
        value: intersectionRatio,
        priority: CollisionPriority.High,
        type: CollisionType.Collision,
      };

      // نظام flushing لإجبار dnd-kit على تحديث dragmove
      const shouldFlushId = flushNext === droppable.id;

      flushNext = "";

      return { ...collision, id: shouldFlushId ? "flush" : collision.id, data };
    }

    if (fallbackEnabled && dragOperation.source?.id !== droppable.id) {
      // حساب fallback collisions فقط عندما يكون العنصر في محور الهدف
      const xAxisIntersection =
        dropShape.boundingRectangle.right > dragShape.boundingRectangle.left &&
        dropShape.boundingRectangle.left < dragShape.boundingRectangle.right;

      const yAxisIntersection =
        dropShape.boundingRectangle.bottom > dragShape.boundingRectangle.top &&
        dropShape.boundingRectangle.top < dragShape.boundingRectangle.bottom;

      if ((dragAxis === "y" && xAxisIntersection) || yAxisIntersection) {
        const fallbackCollision = closestCorners(input);

        if (fallbackCollision) {
          // مبسط مؤقتاً
          const deltaX = dragShape.center.x - (droppable.shape?.center.x || 0);
          const deltaY = dragShape.center.y - (droppable.shape?.center.y || 0);

          const calculatedDirection: Direction =
            Math.abs(deltaX) > Math.abs(deltaY)
              ? deltaX > 0
                ? "right"
                : "left"
              : deltaY > 0
                ? "down"
                : "up";

          data.direction = calculatedDirection;

          if (intersectionArea) {
            // collisionDebug(
            //   dragCenter,
            //   dropCenter,
            //   droppable.id.toString(),
            //   "red",
            //   direction || ""
            // );

            flushNext = droppable.id;

            return {
              ...fallbackCollision,
              priority: CollisionPriority.Low,
              data,
            };
          }

          // collisionDebug(
          //   dragCenter,
          //   dropCenter,
          //   droppable.id.toString(),
          //   "orange",
          //   direction || ""
          // );

          return {
            ...fallbackCollision,
            priority: CollisionPriority.Lowest,
            data,
          };
        }
      }
    }

    // collisionDebug(dragCenter, dropCenter, droppable.id.toString(), "hotpink");

    return null;
  }) as CollisionDetector;
