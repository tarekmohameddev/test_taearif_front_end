import { createContext, ReactNode, useContext } from "react";
import { ZoneStoreType } from "./zoneStore";

export interface DropZoneContext {
  mode: "edit" | "render";
  areaId: string;
  depth: number;
  zoneCompound?: string;
  index?: number;
  registerLocalZone?: (zoneCompound: string, active: boolean) => void;
  unregisterLocalZone?: (zoneCompound: string) => void;
  registerZone?: (zoneCompound: string) => void;
}

export const ZoneStoreContext = createContext<ZoneStoreType | null>(null);

export const dropZoneContext = createContext<DropZoneContext | null>(null);

export const ZoneStoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: ZoneStoreType;
}) => (
  <ZoneStoreContext.Provider value={store}>
    {children}
  </ZoneStoreContext.Provider>
);

export const DropZoneProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: DropZoneContext;
}) => (
  <dropZoneContext.Provider value={value}>{children}</dropZoneContext.Provider>
);
