import { useDraggable } from "@dnd-kit/react";
import React, { useMemo } from "react";

export type DrawerItemDndData = {
  componentType: string;
  section: string;
  data: any;
};

export const DraggableDrawerItem = ({
  children,
  componentType,
  section,
  data,
}: {
  children: React.ReactNode;
  componentType: string;
  section: string;
  data: any;
}) => {
  // إنشاء ID فريد مرة واحدة فقط
  const uniqueId = useMemo(
    () =>
      `drawer-item-${componentType}-${section}-${Math.random().toString(36).substr(2, 9)}`,
    [componentType, section],
  );

  const { ref, isDragging } = useDraggable({
    id: uniqueId,
    type: "drawer", // مهم جداً!
    data: {
      componentType,
      section,
      data,
    } as DrawerItemDndData,
  });

  const style = {
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
    userSelect: "none" as const,
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};
