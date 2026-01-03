import {
  CSSProperties,
  ReactNode,
  Ref,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/react/sortable";
import { ComponentDndData, DragAxis } from "./types";
// import { createDynamicCollisionDetector } from "./collision/dynamic"; // مؤقتاً
import { ZoneStoreContext, dropZoneContext } from "./zoneContext";
import { useShallow } from "zustand/react/shallow";

interface DraggableComponentProps {
  children: (ref: Ref<any>) => ReactNode;
  componentType: string;
  depth: number;
  id: string;
  index: number;
  zoneCompound: string;
  isSelected?: boolean;
  label?: string;
  isLoading?: boolean;
  autoDragAxis?: DragAxis;
  userDragAxis?: DragAxis;
  inDroppableZone?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

// تم نقل الأزرار لتكون مدمجة في المكون نفسه

export const LiveEditorDraggableComponent = ({
  children,
  depth,
  componentType,
  id,
  index,
  zoneCompound,
  isLoading = false,
  isSelected = false,
  label,
  autoDragAxis = "both",
  userDragAxis,
  inDroppableZone = true,
  onEditClick,
  onDeleteClick,
}: DraggableComponentProps) => {
  const ctx = useContext(dropZoneContext);
  const zoneStore = useContext(ZoneStoreContext);

  const [localZones, setLocalZones] = useState<Record<string, boolean>>({});
  const [dragAxis, setDragAxis] = useState(userDragAxis || autoDragAxis);

  const registerLocalZone = useCallback(
    (zoneCompound: string, active: boolean) => {
      ctx?.registerLocalZone?.(zoneCompound, active);
      setLocalZones((obj) => ({
        ...obj,
        [zoneCompound]: active,
      }));
    },
    [setLocalZones, ctx],
  );

  const unregisterLocalZone = useCallback(
    (zoneCompound: string) => {
      ctx?.unregisterLocalZone?.(zoneCompound);
      setLocalZones((obj) => {
        const newLocalZones = { ...obj };
        delete newLocalZones[zoneCompound];
        return newLocalZones;
      });
    },
    [setLocalZones, ctx],
  );

  const containsActiveZone =
    Object.values(localZones).filter(Boolean).length > 0;

  // مؤقتاً - سنستخدم default collision detector
  // const dynamicCollisionDetector = useMemo(
  //   () => createDynamicCollisionDetector(dragAxis),
  //   [dragAxis]
  // );

  const {
    ref: sortableRef,
    isDragging: thisIsDragging,
    sortable,
  } = useSortable<ComponentDndData>({
    id,
    index,
    group: zoneCompound,
    type: "component",
    data: {
      areaId: ctx?.areaId,
      zone: zoneCompound,
      index,
      componentType,
      containsActiveZone,
      depth,
      path: [],
      inDroppableZone,
    },
    collisionPriority: depth,
    // collisionDetector: dynamicCollisionDetector, // مؤقتاً
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    },
    feedback: "clone",
  });

  const ref = useRef<HTMLElement>(null);

  const refSetter = useCallback(
    (el: HTMLElement | null) => {
      sortableRef(el);
      if (el) {
        ref.current = el;
      }
    },
    [sortableRef],
  );

  // لا نحتاج portal أو style calculations بعد الآن

  // لا نحتاج ResizeObserver بعد الآن

  const onClick = useCallback(
    (e: Event | SyntheticEvent) => {
      e.stopPropagation();

      // فتح edit عند النقر على المكون
      if (onEditClick) {
        onEditClick();
      }
    },
    [onEditClick, componentType, id],
  );

  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dragFinished, setDragFinished] = useState(true);
  const [_, startTransition] = useTransition();

  // إضافة cleanup effect للتأكد من إخفاء الأزرار عند unmount
  useEffect(() => {
    return () => {
      setIsVisible(false);
      setHover(false);
    };
  }, []);

  useEffect(() => {
    // إظهار الأزرار عند hover أو selection
    if (hover || isSelected) {
      startTransition(() => {
        setIsVisible(true);
      });
    } else {
      // إخفاء فوري عند إزالة hover وليس selected
      startTransition(() => {
        setIsVisible(false);
      });
    }
  }, [hover, isSelected, startTransition, componentType, id]);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current as HTMLElement;

    const _onMouseOver = (e: Event) => {
      e.stopPropagation();
      setHover(true);
    };

    const _onMouseOut = (e: Event) => {
      e.stopPropagation();
      setHover(false);
    };

    const _onMouseLeave = (e: Event) => {
      e.stopPropagation();
      setHover(false);
    };

    el.setAttribute("data-live-editor-dnd", id);
    el.setAttribute("data-component-id", id);
    el.setAttribute("data-index", index.toString());
    el.style.position = "relative";

    el.addEventListener("click", onClick);
    el.addEventListener("mouseenter", _onMouseOver);
    el.addEventListener("mouseleave", _onMouseLeave);

    return () => {
      el.removeAttribute("data-live-editor-dnd");
      el.removeAttribute("data-component-id");
      el.removeAttribute("data-index");
      el.removeEventListener("click", onClick);
      el.removeEventListener("mouseenter", _onMouseOver);
      el.removeEventListener("mouseleave", _onMouseLeave);
    };
  }, [id, index, onClick]);

  // تحسين تحديد dragAxis بناءً على العنصر
  useEffect(() => {
    if (userDragAxis) {
      setDragAxis(userDragAxis);
      return;
    }

    if (ref.current) {
      const computedStyle = window.getComputedStyle(ref.current);

      if (
        computedStyle.display === "inline" ||
        computedStyle.display === "inline-block"
      ) {
        setDragAxis("x");
        return;
      }
    }

    setDragAxis(autoDragAxis);
  }, [ref, userDragAxis, autoDragAxis]);

  // Debug logging

  return (
    <>
      {children((el: HTMLElement | null) => {
        refSetter(el);

        // إضافة الأزرار داخل المكون نفسه
        if (el && dragFinished && isVisible) {
          // التحقق من وجود الأزرار مسبقاً لتجنب التكرار
          let existingActionBar = el.querySelector(
            ".live-editor-component-actions",
          );

          if (!existingActionBar) {
            const actionDiv = document.createElement("div");
            actionDiv.className = "live-editor-component-actions";
            actionDiv.style.cssText = `
              position: absolute;
              top: 8px;
              right: 8px;
              z-index: 1000;
              pointer-events: auto;
            `;

            // إنشاء الأزرار
            const actionBarHTML = `
              <div class="live-editor-action-bar" style="
                background: rgba(0, 0, 0, 0.9) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                z-index: 1001;
                padding: 4px 6px;
                border-radius: 8px;
                min-width: 100px;
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                ${label ? `<span style="color: white; font-size: 12px;">${label}</span>` : ""}
                <button 
                  class="live-editor-edit-btn"
                  title="تحرير المكون (Edit Component)"
                  style="
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    border: 2px solid rgba(255, 255, 255, 0.2) !important;
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                  "
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button 
                  class="live-editor-delete-btn"
                  title="حذف المكون (Delete Component)"
                  style="
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    border: 2px solid rgba(255, 255, 255, 0.2) !important;
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                  "
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            `;

            actionDiv.innerHTML = actionBarHTML;

            // إضافة event listeners
            const editBtn = actionDiv.querySelector(".live-editor-edit-btn");
            const deleteBtn = actionDiv.querySelector(
              ".live-editor-delete-btn",
            );

            if (editBtn && onEditClick) {
              editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                onEditClick();
              });
            }

            if (deleteBtn && onDeleteClick) {
              deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                onDeleteClick();
              });
            }

            // التأكد من أن المكون له position relative
            if (getComputedStyle(el).position === "static") {
              el.style.position = "relative";
            }

            el.appendChild(actionDiv);
          }
        } else if (el && !isVisible) {
          // إزالة الأزرار عند إخفاءها
          const existingActionBar = el.querySelector(
            ".live-editor-component-actions",
          );
          if (existingActionBar) {
            existingActionBar.remove();
          }
        }
      })}
    </>
  );
};
