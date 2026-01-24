import type { PropertyFormStore } from "./types";
import { initialState } from "./initialState";

export const createMapStateSlice = (
  set: (partial: Partial<PropertyFormStore>) => void,
  get: () => PropertyFormStore
): Pick<
  PropertyFormStore,
  | "map"
  | "marker"
  | "searchBox"
  | "isMapLoaded"
  | "setMap"
  | "setMarker"
  | "setSearchBox"
  | "setIsMapLoaded"
  | "setMapLocation"
> => ({
  map: initialState.map,
  marker: initialState.marker,
  searchBox: initialState.searchBox,
  isMapLoaded: initialState.isMapLoaded,

  setMap: (map) => {
    set({ map });
  },

  setMarker: (marker) => {
    set({ marker });
  },

  setSearchBox: (searchBox) => {
    set({ searchBox });
  },

  setIsMapLoaded: (loaded) => {
    set({ isMapLoaded: loaded });
  },

  setMapLocation: (lat, lng, address) => {
    const current = get();
    set({
      formData: {
        ...current.formData,
        latitude: lat,
        longitude: lng,
        address: address,
      },
    });
  },
});
