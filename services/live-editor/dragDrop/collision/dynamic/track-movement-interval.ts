import { Vector } from "@dnd-kit/abstract";
import { DragAxis, Direction } from "../../types";
import { getDirection } from "./get-direction";

interface MovementInterval {
  direction: Direction;
  previous?: Direction;
  velocity: number;
  timestamp: number;
}

// تخزين آخر موضع وحركة لكل عملية سحب
const movementHistory = new Map<
  string,
  {
    lastPosition: Vector;
    lastDirection?: Direction;
    lastTimestamp: number;
  }
>();

/**
 * تتبع فترات الحركة لتحديد الاتجاه والسرعة
 * يساعد في إنشاء تجربة سحب وإفلات طبيعية ومتجاوبة
 */
export const trackMovementInterval = (
  currentPosition: Vector,
  dragAxis: DragAxis,
  dragId: string = "default",
): MovementInterval => {
  const now = Date.now();
  const history = movementHistory.get(dragId);

  if (!history) {
    // أول حركة، إنشاء سجل جديد
    movementHistory.set(dragId, {
      lastPosition: currentPosition,
      lastTimestamp: now,
    });

    return {
      direction: "down", // اتجاه افتراضي
      velocity: 0,
      timestamp: now,
    };
  }

  // حساب الإزاحة من آخر موضع
  const offset = {
    x: currentPosition.x - history.lastPosition.x,
    y: currentPosition.y - history.lastPosition.y,
  };

  // حساب السرعة (pixels per millisecond)
  const timeDelta = now - history.lastTimestamp;
  const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
  const velocity = timeDelta > 0 ? distance / timeDelta : 0;

  // تحديد الاتجاه الحالي
  const currentDirection = getDirection(dragAxis, offset);

  // تحديث السجل
  const previousDirection = history.lastDirection;
  movementHistory.set(dragId, {
    lastPosition: currentPosition,
    lastDirection: currentDirection,
    lastTimestamp: now,
  });

  return {
    direction: currentDirection,
    previous: previousDirection,
    velocity,
    timestamp: now,
  };
};

/**
 * تنظيف سجل الحركة لمعرف معين
 */
export const clearMovementHistory = (dragId: string = "default") => {
  movementHistory.delete(dragId);
};
