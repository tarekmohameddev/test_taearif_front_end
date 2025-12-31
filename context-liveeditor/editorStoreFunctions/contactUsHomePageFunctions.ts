import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultContactUsHomePageData = (): ComponentData => ({
  visible: true,

  // Background configuration
  background: {
    image:
      "https://baheya.co/wp-content/uploads/2025/09/Screenshot-2025-09-21-005950.png",
    alt: "خلفية",
    overlay: {
      enabled: true,
      color: "rgba(139, 95, 70, 0.8)",
    },
  },

  // Header text
  header: {
    text: "سنعثر لك على مستأجر موثوق ونتولى إدارة عملية الإيجار بالكامل بكل احترافية.\nنضمن لك مستأجرًا موثوقًا ونتكفّل بجميع خطوات التأجير نيابةً عنك.",
  },

  // Form configuration
  form: {
    submitButton: {
      text: "اشترك الآن",
      loadingText: "جاري الإرسال...",
      backgroundColor: "#c9a882",
      hoverColor: "#b8966f",
      textColor: "#ffffff",
    },
    fields: {
      fullName: {
        label: "الاسم الكامل",
        placeholder: "الاسم الكامل",
        required: true,
        type: "text",
      },
      whatsappNumber: {
        label: "رقم الواتساب",
        placeholder: "رقم الواتساب",
        required: true,
        type: "tel",
      },
      email: {
        label: "البريد الالكتروني",
        placeholder: "البريد الالكتروني",
        required: true,
        type: "email",
      },
      paymentMethod: {
        label: "طريقة الدفع",
        placeholder: "اختر طريقة الدفع",
        required: true,
        type: "select",
        options: [
          { value: "بنك مدعوم", label: "بنك مدعوم" },
          {
            value: "بنك غير مدعوم",
            label: "بنك غير مدعوم",
          },
          { value: "كاش", label: "كاش" },
        ],
      },
      city: {
        label: "المدينة",
        placeholder: "اختر المدينة",
        required: true,
        type: "select",
        options: [
          { value: "الرياض", label: "الرياض" },
          { value: "جدة", label: "جدة" },
          { value: "مكة المكرمة", label: "مكة المكرمة" },
          {
            value: "المدينة المنورة",
            label: "المدينة المنورة",
          },
          { value: "الدمام", label: "الدمام" },
        ],
      },
      unitType: {
        label: "نوع الوحدة",
        placeholder: "اختر نوع الوحدة",
        required: true,
        type: "select",
        options: [
          { value: "أدوار", label: "أدوار" },
          { value: "بنتهاوس", label: "بنتهاوس" },
          { value: "تاون هاوس", label: "تاون هاوس" },
          { value: "شقق", label: "شقق" },
          { value: "فيلا", label: "فيلا" },
        ],
      },
      budget: {
        label: "الميزانية",
        placeholder: "الميزانية",
        required: true,
        type: "number",
      },
      message: {
        label: "محتوى الرسالة",
        placeholder: "محتوى الرسالة",
        required: true,
        type: "textarea",
        rows: 4,
      },
    },
  },

  // Styling
  styling: {
    inputBackground: "#f5f0e8",
    inputBorder: "#c4b5a0",
    inputText: "#ffffff",
    inputPlaceholder: "#8b7a6a",
    inputFocus: "#8b5f46",
    labelColor: "#ffffff",
    errorColor: "#ef4444",
  },

  // Layout
  layout: {
    maxWidth: "4xl",
    padding: {
      mobile: "1rem",
      tablet: "2rem",
      desktop: "3rem",
    },
    gap: {
      mobile: "1rem",
      tablet: "1.5rem",
      desktop: "1.5rem",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const contactUsHomePageFunctions = {
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
      state.contactUsHomePageStates[variantId] &&
      Object.keys(state.contactUsHomePageStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultContactUsHomePageData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      contactUsHomePageStates: {
        ...state.contactUsHomePageStates,
        [variantId]: data,
      },
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
    state.contactUsHomePageStates[variantId] ||
    getDefaultContactUsHomePageData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    contactUsHomePageStates: {
      ...state.contactUsHomePageStates,
      [variantId]: data,
    },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "form.submitButton.text")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.contactUsHomePageStates[variantId] ||
      getDefaultContactUsHomePageData();
    const newData = updateDataByPath(source, path, value);

    return {
      contactUsHomePageStates: {
        ...state.contactUsHomePageStates,
        [variantId]: newData,
      },
    } as any;
  },
};
