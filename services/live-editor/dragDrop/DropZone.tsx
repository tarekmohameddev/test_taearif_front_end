import {
  CSSProperties,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useDroppable } from "@dnd-kit/react";
import { pointerIntersection } from "@dnd-kit/collision";
import { ZoneStoreContext, dropZoneContext } from "./zoneContext";

export type DropZoneDndData = {
  areaId?: string;
  depth: number;
  isDroppableTarget: boolean;
};

export type DropZoneProps = {
  zone?: string;
  allow?: string[];
  disallow?: string[];
  style?: CSSProperties;
  className?: string;
  minEmptyHeight?: number;
  children?: React.ReactNode;
};

export const LiveEditorDropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  function LiveEditorDropZone(
    {
      zone = "root",
      allow,
      disallow,
      style,
      className,
      minEmptyHeight = 128,
      children,
    },
    userRef,
  ) {
    const ctx = useContext(dropZoneContext);
    const zoneStore = useContext(ZoneStoreContext);

    const {
      areaId = "root",
      depth = 0,
      registerLocalZone,
      unregisterLocalZone,
    } = ctx ?? {};

    let zoneCompound = "root";

    if (areaId && zone !== "root") {
      zoneCompound = `${areaId}:${zone}`;
    }

    const isRootZone =
      zoneCompound === "root" || zone === "root" || areaId === "root";

    const ref = useRef<HTMLDivElement | null>(null);

    const acceptsTarget = useCallback(
      (componentType: string | null | undefined) => {
        if (!componentType) {
          return true;
        }

        if (disallow) {
          const defaultedAllow = allow || [];

          // Remove any explicitly allowed items from disallow
          const filteredDisallow = (disallow || []).filter(
            (item) => defaultedAllow.indexOf(item) === -1,
          );

          if (filteredDisallow.indexOf(componentType) !== -1) {
            return false;
          }
        } else if (allow) {
          if (allow.indexOf(componentType) === -1) {
            return false;
          }
        }

        return true;
      },
      [allow, disallow],
    );

    const targetAccepted = useMemo(() => {
      if (!zoneStore) return true;

      const state = zoneStore.getState();
      const draggedComponentType = state.draggedItem?.data?.componentType;
      return acceptsTarget(draggedComponentType);
    }, [acceptsTarget, zoneStore]);

    const isEnabled = useMemo(() => {
      if (!zoneStore) return true;

      const state = zoneStore.getState();
      let _isEnabled = true;
      const isDeepestZone = state.zoneDepthIndex[zoneCompound] ?? false;

      _isEnabled = isDeepestZone || isRootZone;

      if (_isEnabled) {
        _isEnabled = targetAccepted;
      }

      return _isEnabled;
    }, [zoneStore, zoneCompound, isRootZone, targetAccepted]);

    useEffect(() => {
      if (registerLocalZone) {
        registerLocalZone(zoneCompound, targetAccepted || isEnabled);
      }

      return () => {
        if (unregisterLocalZone) {
          unregisterLocalZone(zoneCompound);
        }
      };
    }, [
      targetAccepted,
      isEnabled,
      zoneCompound,
      registerLocalZone,
      unregisterLocalZone,
    ]);

    const isDropEnabled = isEnabled;

    useEffect(() => {
      if (!zoneStore) return;

      const { enabledIndex } = zoneStore.getState();
      zoneStore.setState({
        enabledIndex: { ...enabledIndex, [zoneCompound]: isEnabled },
      });
    }, [isEnabled, zoneStore, zoneCompound]);

    const { ref: dropRef } = useDroppable({
      id: zoneCompound,
      collisionPriority: isEnabled ? depth : 0,
      disabled: !isDropEnabled,
      collisionDetector: pointerIntersection,
      type: "dropzone",
      data: {
        areaId,
        depth,
        isDroppableTarget: targetAccepted,
      } as DropZoneDndData,
    });

    const isDraggedOver = useMemo(() => {
      if (!zoneStore) return false;

      const state = zoneStore.getState();
      return !!state.previewIndex[zoneCompound];
    }, [zoneStore, zoneCompound]);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        ref.current = node;
        dropRef(node);

        if (typeof userRef === "function") {
          userRef(node);
        } else if (userRef) {
          userRef.current = node;
        }
      },
      [dropRef, userRef],
    );

    return (
      <div
        className={`live-editor-dropzone ${
          isRootZone ? "live-editor-dropzone--root" : ""
        } ${isEnabled ? "live-editor-dropzone--enabled" : ""} ${
          isDraggedOver ? "live-editor-dropzone--dragged-over" : ""
        }${className ? ` ${className}` : ""}`}
        ref={setRefs}
        data-testid={`dropzone:${zoneCompound}`}
        data-live-editor-dropzone={zoneCompound}
        style={
          {
            ...style,
            minHeight: children ? "auto" : `${minEmptyHeight}px`,
            position: "relative",
            borderRadius: "4px",
            border: isDraggedOver
              ? "2px dashed #3b82f6"
              : isEnabled
                ? "2px dashed transparent"
                : "none",
            backgroundColor: isDraggedOver
              ? "rgba(59, 130, 246, 0.1)"
              : "transparent",
            background: undefined, // Remove any conflicting background property
            transition: "all 200ms ease",
          } as CSSProperties
        }
      >
        {children}

        {/* Empty state when no children */}
        {!children && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${minEmptyHeight}px`,
              color: "#9ca3af",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {isDraggedOver ? "Drop component here" : "Drag components here"}
          </div>
        )}
      </div>
    );
  },
);
