import { Shape } from "@dnd-kit/geometry";
import { Direction } from "../../types";

/**
 * حساب تأثير النقطة الوسطى لتحديد ما إذا كان العنصر المسحوب
 * قد تجاوز النقطة الوسطى للهدف في الاتجاه المطلوب
 */
export const getMidpointImpact = (
  dragShape: Shape,
  dropShape: Shape,
  direction: Direction,
  offset: number = 0.05,
): boolean => {
  const dragCenter = dragShape.center;
  const dropCenter = dropShape.center;
  const dropRect = dropShape.boundingRectangle;

  // حساب الإزاحة كنسبة مئوية من حجم الهدف
  const offsetX = dropRect.width * offset;
  const offsetY = dropRect.height * offset;

  switch (direction) {
    case "up":
      return dragCenter.y < dropCenter.y - offsetY;
    case "down":
      return dragCenter.y > dropCenter.y + offsetY;
    case "left":
      return dragCenter.x < dropCenter.x - offsetX;
    case "right":
      return dragCenter.x > dropCenter.x + offsetX;
    default:
      return true;
  }
};
