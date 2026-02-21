import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultImageTextData = (): ComponentData => ({
  visible: true,

  backgroundImage:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
  background: {
    type: "image", // Default: image background
    // Default: no color (transparent), user can set custom color or primary color
    // When useDefaultColor = false: color is stored as string (custom color or empty for transparent)
    // When useDefaultColor = true: color uses branding color from merchant settings
    color: "", // Empty string = transparent (default)
    opacity: 1,
  },
  texts: [
    {
      type: "heading",
      text: "سكن يليق بطموحك وامكاناتك",
      color: "#ffffff",
    },
    {
      type: "paragraph",
      text: "نحن لا نعرض عقارات فقط، بل نقدّم تجربة مبنية على الثقة، والشفافية، واحترافية عالية في كل خطوة. سواء كنت تبحث عن سكن، استثمار، أو فرصة تبني بها استقرارك نحن هنا لنقودك إلى قرار تعرف أنه لك، ويشبهك.",
      color: "#ffffff",
    },
    {
      type: "blockquote",
      text: "في باهية، نؤمن أن كل شخص يستحق فرصة لبناء مستقبله العقاري بطريقته الخاصة. نمنحك كامل الحرية في اكتشاف الخيارات التي تناسبك، وبأفضل قيمة ممكنة.",
      color: "#ffffff",
    },
  ],
  overlayOpacity: 0.3,
  styling: {
    height: 500,
  },
});

// ═══════════════════════════════════════════════════════════
// VALIDATION FUNCTION
// ═══════════════════════════════════════════════════════════
/**
 * Validates if the data structure matches the expected imageText format
 * Returns false if data has old/incompatible structure (e.g., texts as object, colors/settings fields)
 */
const isValidImageTextData = (data: any): boolean => {
  // If no data, it's invalid
  if (!data || typeof data !== "object") {
    return false;
  }

  // Check if texts exists and is an array
  if (!data.texts || !Array.isArray(data.texts)) {
    return false;
  }

  // Check if texts array has valid structure
  const hasValidTexts = data.texts.every((item: any) => {
    return (
      item &&
      typeof item === "object" &&
      typeof item.type === "string" &&
      typeof item.text === "string"
    );
  });

  if (!hasValidTexts) {
    return false;
  }

  // If data has old structure fields (colors, settings as top-level), it's invalid
  if (data.colors || data.settings) {
    return false;
  }

  // If texts is an object (old structure), it's invalid
  if (data.texts && typeof data.texts === "object" && !Array.isArray(data.texts)) {
    return false;
  }

  return true;
};

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
    // Priority 1: Check if variant already exists
    const currentData = state.imageTextStates?.[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // Validate current data - if invalid, replace with default
      const isCurrentDataValid = isValidImageTextData(currentData);
      if (!isCurrentDataValid) {
        // Current data is invalid, replace with default or initial (if valid)
        const defaultData = getDefaultImageTextData();
        if (initial && Object.keys(initial).length > 0) {
          const isInitialValid = isValidImageTextData(initial);
          return {
            imageTextStates: {
              ...state.imageTextStates,
              [variantId]: isInitialValid ? initial : defaultData,
            },
          } as any;
        }
        return {
          imageTextStates: {
            ...state.imageTextStates,
            [variantId]: defaultData,
          },
        } as any;
      }

      // Current data is valid, proceed with normal logic
      // If initial data provided, validate it first
      if (initial && Object.keys(initial).length > 0) {
        // Validate initial data structure
        const isValid = isValidImageTextData(initial);
        if (!isValid) {
          // Use default data if invalid
          const defaultData = getDefaultImageTextData();
          return {
            imageTextStates: {
              ...state.imageTextStates,
              [variantId]: defaultData,
            },
          } as any;
        }

        return {
          imageTextStates: {
            ...state.imageTextStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists and is valid, skip initialization
    }

    // Priority 2: Create with default data
    const defaultData = getDefaultImageTextData();

    // Validate initial data if provided
    let data: ComponentData = defaultData;
    if (initial && Object.keys(initial).length > 0) {
      const isValid = isValidImageTextData(initial);
      if (isValid) {
        data = initial;
      } else {
        // If invalid, use tempData or default
        data = state.tempData || defaultData;
      }
    } else {
      data = state.tempData || defaultData;
    }

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
    state.imageTextStates?.[variantId] || getDefaultImageTextData(),

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
   * IMPORTANT: This function updates tempData ONLY, not imageTextStates directly.
   * This ensures changes only appear in iframe after "Save Changes" button is pressed.
   * On save, tempData is merged into imageTextStates via setComponentData.
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "content.title")
   * @param value - New value for the field
   * @returns New state object with updated tempData
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from imageTextStates (saved data) or defaults
    const savedData =
      state.imageTextStates?.[variantId] || getDefaultImageTextData();

    // Merge saved data with existing tempData to preserve all changes
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };

    // Update the specific path in the merged data
    const newData = updateDataByPath(baseData, path, value);

    // Return updated tempData (NOT imageTextStates)
    // This ensures changes only appear after "Save Changes" button
    return {
      tempData: newData,
    } as any;
  },
};
