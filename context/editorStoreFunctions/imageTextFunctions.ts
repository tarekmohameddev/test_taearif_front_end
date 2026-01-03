import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultImageTextData = (): ComponentData => ({
  visible: true,

  backgroundImage:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
  title: "سكن يليق بطموحك وامكاناتك",
  paragraph:
    "نحن لا نعرض عقارات فقط، بل نقدّم تجربة مبنية على الثقة، والشفافية، واحترافية عالية في كل خطوة. سواء كنت تبحث عن سكن، استثمار، أو فرصة تبني بها استقرارك نحن هنا لنقودك إلى قرار تعرف أنه لك، ويشبهك.",
  blockquote:
    "في باهية، نؤمن أن كل شخص يستحق فرصة لبناء مستقبله العقاري بطريقته الخاصة. نمنحك كامل الحرية في اكتشاف الخيارات التي تناسبك، وبأفضل قيمة ممكنة.",
  overlayOpacity: 0.3,
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const imageTextFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID (UUID)
   * @param initial - Optional initial data to override defaults
   * @returns New state object or empty object if already exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Check if variant already exists
    if (
      state.imageTextStates[variantId] &&
      Object.keys(state.imageTextStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultImageTextData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      imageTextStates: { ...state.imageTextStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @returns Component data or default data if not found
   */
  getData: (state: any, variantId: string) =>
    state.imageTextStates[variantId] || getDefaultImageTextData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    imageTextStates: { ...state.imageTextStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "content.title")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.imageTextStates[variantId] || getDefaultImageTextData();
    const newData = updateDataByPath(source, path, value);

    return {
      imageTextStates: { ...state.imageTextStates, [variantId]: newData },
    } as any;
  },
};
