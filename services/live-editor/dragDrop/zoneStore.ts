import { createStore } from "zustand";

export interface Preview {
  componentType: string;
  type: "insert" | "move";
  index: number;
  zone: string;
  element?: HTMLElement | Element;
  props: {
    id: string;
    [key: string]: any;
  };
}

export interface ZoneStore {
  zoneDepthIndex: Record<string, boolean>;
  nextZoneDepthIndex: Record<string, boolean>;
  areaDepthIndex: Record<string, boolean>;
  nextAreaDepthIndex: Record<string, boolean>;
  draggedItem: any | null;
  previewIndex: Record<string, Preview>;
  enabledIndex: Record<string, boolean>;
  hoveringComponent: string | null;
}

export const createZoneStore = () =>
  createStore<ZoneStore>(() => ({
    zoneDepthIndex: {},
    nextZoneDepthIndex: {},
    areaDepthIndex: {},
    nextAreaDepthIndex: {},
    draggedItem: null,
    previewIndex: {},
    enabledIndex: {},
    hoveringComponent: null,
  }));

export type ZoneStoreType = ReturnType<typeof createZoneStore>;
