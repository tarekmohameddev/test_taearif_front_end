import { DragAxis, Direction } from "../../types";

/**
 * تحديد الاتجاه بناءً على محور السحب والإزاحة
 */
export const getDirection = (
  dragAxis: DragAxis,
  offset: { x: number; y: number },
): Direction => {
  if (dragAxis === "y") {
    // للمحور الرأسي، نعتمد على الإزاحة الرأسية
    return offset.y > 0 ? "down" : "up";
  } else if (dragAxis === "x") {
    // للمحور الأفقي، نعتمد على الإزاحة الأفقية
    return offset.x > 0 ? "right" : "left";
  } else {
    // للمحور المختلط، نختار الإزاحة الأكبر
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      return offset.x > 0 ? "right" : "left";
    } else {
      return offset.y > 0 ? "down" : "up";
    }
  }
};
