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
    if (
      state.videoStates[variantId] &&
      Object.keys(state.videoStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultVideoData();
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
    const source = state.videoStates[variantId] || getDefaultVideoData();
    const newData = updateDataByPath(source, path, value);

    return {
      videoStates: { ...state.videoStates, [variantId]: newData },
    } as any;
  },
};
