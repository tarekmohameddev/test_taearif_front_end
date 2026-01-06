import React, { Suspense, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { loadComponent } from "./componentService";

// Local type definitions
interface ComponentData {
  id: string;
  type: string;
  variant: string;
  [key: string]: any;
}

interface ComponentInstance {
  id: string;
  componentName: string;
  data: ComponentData;
  position: number;
  layout?: any;
}

// مكون منطقة الإفلات بين الصفوف
export function RowDropZone({
  rowIndex,
  isVisible,
}: {
  rowIndex: number;
  isVisible: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `row-gap-${rowIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-10 mx-4 transition-all duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-full rounded-lg border-2 border-dashed transition-all ${
          isOver
            ? "border-blue-500 bg-blue-100 shadow-lg"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <span
            className={`text-xs font-medium transition-colors ${
              isOver ? "text-blue-700" : "text-gray-300"
            }`}
          >
            {"Drop here to create a new row"}
          </span>
        </div>
      </div>
    </div>
  );
}

// مكون الـ Item القابل للسحب
export function SortableItem({
  id,
  children,
  isDragging,
  onEditClick,
  onDeleteClick,
}: {
  id: string;
  children: React.ReactNode;
  isDragging: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        zIndex: 1,
      }}
      className="relative group touch-manipulation"
    >
      {/* الأزرار مع z-index أعلى و pointer-events منفصلة */}
      <div
        className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          pointerEvents: "auto",
          zIndex: 99999,
          position: "absolute",
          top: "18px",
          right: "18px",
          minWidth: "60px",
          minHeight: "10px",
          isolation: "isolate",
        }}
      >
        <button
          type="button"
          className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm cursor-pointer hover:bg-red-700 transition-colors shadow-lg select-none"
          style={{
            pointerEvents: "auto",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteClick();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          Delete
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors shadow-lg select-none"
          style={{
            pointerEvents: "auto",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEditClick();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          Edit
        </button>
      </div>

      {/* منطقة السحب مع pointer-events منفصلة */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move border-2 border-transparent group-hover:border-blue-300 rounded-lg transition-colors p-1"
        style={{ pointerEvents: "auto" }}
      >
        {children}
      </div>
    </div>
  );
}

// مكون مخصص لتجنب إعادة التحميل
export const CachedComponent = React.memo(
  ({
    componentName,
    section,
    data,
    componentId,
  }: {
    componentName: string;
    section: string;
    data: ComponentData;
    componentId?: string;
  }) => {
    const LoadedComponent = useMemo(
      () => loadComponent(section, componentName),
      [section, componentName],
    );

    if (!LoadedComponent) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          Error loading component: {componentName}
        </div>
      );
    }

    // ✅ Pass through merged component data while enforcing safe core props
    const buildSafeProps = (rawData: any) => {
      const safeVariant =
        rawData?.variant &&
        typeof rawData.variant === "string" &&
        rawData.variant.length < 100
          ? rawData.variant
          : "default";

      const safeUseStore =
        typeof rawData?.useStore === "boolean" ? rawData.useStore : true;

      const safeId =
        typeof (componentId || rawData?.id) === "string" &&
        (componentId || rawData.id).length < 100
          ? (componentId || rawData.id)
          : "component";

      const safeType =
        rawData?.type &&
        typeof rawData.type === "string" &&
        rawData.type.length < 100
          ? rawData.type
          : "unknown";

      // استخدم spread للـ mergedData بالكامل، ثم نضمن أن الحقول الأساسية آمنة
      return {
        ...(rawData || {}),
        id: safeId,
        type: safeType,
        visible:
          typeof rawData?.visible === "boolean" ? rawData.visible : true,
        variant: safeVariant,
        useStore: safeUseStore,
      } as ComponentData;
    };

    const safeData = buildSafeProps(data);

    return (
      <Suspense
        fallback={
          <div className="p-8 bg-white border border-red-200 rounded-lg shadow-sm ">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 h-10 w-10" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-300 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* Pass merged data (from backend/default/store) into the component */}
        <LoadedComponent
          {...safeData}
          key={componentId || data.id || "component"}
        />
      </Suspense>
    );
  },
);

CachedComponent.displayName = "CachedComponent";

// مكون مراقب السحب
export const DragMonitor = ({
  pageComponents,
  setDropIndicator,
}: {
  pageComponents: ComponentInstance[];
  setDropIndicator: (indicator: any) => void;
}) => {
  const { useDndMonitor } = require("@dnd-kit/core");

  useDndMonitor({
    onDragOver: (event: any) => {
      const { active, over } = event;

      if (!over) {
        setDropIndicator(null);
        return;
      }

      // إذا كان الهدف هو منطقة بين الصفوف
      if (over.id.toString().startsWith("row-gap-")) {
        const rowIndex = parseInt(over.id.toString().replace("row-gap-", ""));
        setDropIndicator({
          targetId: over.id as string,
          position: "between-rows",
          insertAtRow: rowIndex,
        });
        return;
      }

      if (active.id === over.id) {
        setDropIndicator(null);
        return;
      }

      const overNode = over.rect;
      const dragNode = active.rect.current.translated;

      if (!dragNode) {
        setDropIndicator(null);
        return;
      }

      const dropY = dragNode.top + dragNode.height / 2;
      const overY = overNode.top + overNode.height / 2;

      const dropX = dragNode.left + dragNode.width / 2;
      const overX = overNode.left + overNode.width / 2;

      const overComponent = pageComponents.find((c) => c.id === over.id);
      if (!overComponent) {
        setDropIndicator(null);
        return;
      }

      // تحديد نوع الإفلات بناءً على حجم المكون المستهدف
      if (overComponent.layout?.span === 2) {
        // إذا كان المكون يأخذ العرض الكامل، يمكن تقسيمه يساراً أو يميناً
        const isLeftHalf = dropX < overNode.left + overNode.width / 2;
        if (isLeftHalf) {
          setDropIndicator({ targetId: over.id as string, position: "left" });
        } else {
          setDropIndicator({ targetId: over.id as string, position: "right" });
        }
      } else if (overComponent.layout?.span === 1) {
        // إذا كان المكون يأخذ نصف العرض، يمكن:
        // 1. استبدال موقعه (left/right)
        // 2. وضعه فوقه أو تحته (top/bottom)

        const horizontalThreshold = overNode.width * 0.3; // 30% من العرض
        const verticalThreshold = overNode.height * 0.3; // 30% من الارتفاع

        const distanceFromLeft = dropX - overNode.left;
        const distanceFromRight = overNode.right - dropX;
        const distanceFromTop = dropY - overNode.top;
        const distanceFromBottom = overNode.bottom - dropY;

        // إذا كان قريباً من اليسار أو اليمين
        if (distanceFromLeft < horizontalThreshold) {
          setDropIndicator({ targetId: over.id as string, position: "left" });
        } else if (distanceFromRight < horizontalThreshold) {
          setDropIndicator({ targetId: over.id as string, position: "right" });
        } else if (distanceFromTop < verticalThreshold) {
          setDropIndicator({ targetId: over.id as string, position: "top" });
        } else if (distanceFromBottom < verticalThreshold) {
          setDropIndicator({ targetId: over.id as string, position: "bottom" });
        } else {
          // في الوسط، استخدم الاتجاه الأقرب
          const isLeftHalf = dropX < overNode.left + overNode.width / 2;
          setDropIndicator({
            targetId: over.id as string,
            position: isLeftHalf ? "left" : "right",
          });
        }
      }
    },
    onDragEnd: () => {
      setDropIndicator(null);
    },
  });

  return null;
};

// مكون مؤشر الإفلات المرئي
export const DropIndicator = ({
  dropIndicator,
  componentId,
}: {
  dropIndicator: any;
  componentId: string;
}) => {
  if (!dropIndicator || dropIndicator.targetId !== componentId) {
    return null;
  }

  return (
    <div className={`absolute top-0 w-full h-full pointer-events-none z-10`}>
      <div
        className={`absolute bg-blue-500/30 border-2 border-dashed border-blue-600 rounded-lg transition-all
        ${dropIndicator.position === "top" && "top-0 left-0 w-full h-1/2"}
        ${dropIndicator.position === "bottom" && "bottom-0 left-0 w-full h-1/2"}
        ${dropIndicator.position === "left" && "top-0 left-0 w-1/2 h-full"}
        ${dropIndicator.position === "right" && "top-0 right-0 w-1/2 h-full"}`}
      ></div>
    </div>
  );
};

// مكون الصفحة الفارغة
export const EmptyPage = ({
  onAddComponent,
}: {
  onAddComponent: () => void;
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Empty Page</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          This page doesn't have any components yet. Start building your page by
          adding components from the sidebar.
        </p>
        <button
          onClick={onAddComponent}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Component
        </button>
      </div>
    </div>
  );
};
