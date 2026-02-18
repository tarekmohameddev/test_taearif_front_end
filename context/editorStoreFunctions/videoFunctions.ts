import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultVideoData = (): ComponentData => ({
  visible: true,

  video: {
    src: "",
    poster: "",
    title: "شاهد الفيديو التعريفي",
    description: "لمحة سريعة عن خدماتنا في دقيقة واحدة",
    type: "url",
  },

  playback: {
    autoplay: false,
    loop: false,
    muted: true,
    controls: true,
    playsInline: true,
  },

  layout: {
    aspectRatio: "16:9",
  },

  styling: {
    borderRadius: "12px",
    shadow: "lg",
    backgroundColor: "#000000",
    overlay: {
      enabled: false,
      color: "rgba(0, 0, 0, 0.35)",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const videoFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.videoStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          videoStates: {
            ...state.videoStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultVideoData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      videoStates: { ...state.videoStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.videoStates[variantId] || getDefaultVideoData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    videoStates: { ...state.videoStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from videoStates (saved data) or defaults
    const savedData = state.videoStates[variantId] || getDefaultVideoData();

    // Merge saved data with existing tempData to preserve all changes
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };

    // Update the specific path in the merged data
    const newData = updateDataByPath(baseData, path, value);

    // Return updated tempData ONLY
    return {
      tempData: newData,
    } as any;
  },
};

