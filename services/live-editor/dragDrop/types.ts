export type Direction = "up" | "down" | "left" | "right";

export type DragAxis = "x" | "y" | "both";

export interface ComponentDndData {
  areaId?: string;
  zone: string;
  index: number;
  componentType: string;
  containsActiveZone: boolean;
  depth: number;
  path: string[];
  inDroppableZone: boolean;
}

export interface DrawerItemDndData {
  componentType: string;
  section: string;
  data: any;
}

export interface DropZoneDndData {
  areaId?: string;
  depth: number;
  isDroppableTarget: boolean;
}

export interface DragState {
  isDragging: boolean;
  draggedItem: any | null;
  draggedType: "component" | "drawer-item" | null;
  draggedFrom: {
    zone: string;
    index: number;
  } | null;
}

export interface CollisionData {
  direction: Direction;
  deltaX?: number;
  deltaY?: number;
  pointer?: {
    x: number;
    y: number;
  };
}

export interface PreviewData {
  componentType: string;
  type: "insert" | "move";
  index: number;
  zone: string;
  element?: HTMLElement;
  props: {
    id: string;
    [key: string]: any;
  };
}
