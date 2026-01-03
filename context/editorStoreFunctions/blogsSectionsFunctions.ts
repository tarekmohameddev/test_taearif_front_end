import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultBlogsSectionsData = (): ComponentData => ({
  visible: true,

  // Content - Two paragraphs
  paragraph1:
    "نصمم رحلتك العقارية بخطى واثقة نجمع بين السلاسة في التعامل والاحترافية في الأداء، لنقدّم لك تجربة سلسة من أول استفسار حتى استلام المفتاح. نُراعي احتياجاتك، ونُرشدك نحو أفضل الخيارات بخبرة ودراية تامة.",
  paragraph2:
    "نمتلك فهماً عميقًا للسوق، وشغفًا بتقديم الأفضل لعملائنا. معنا، ستجد عقارك المثالي بسهولة وثقة.",

  // Cards array
  cards: [
    {
      id: "1",
      image:
        "https://baheya.co/wp-content/uploads/2023/05/62387dd75873914c8bbfe94a9e047b9f3b771b1b.png",
      title: "حلول عقارية سريعة وموثوقة",
      description:
        "نقدّم لك خدمات عقارية متكاملة بمرونة وسرعة، مع فريق يتمتع بالكفاءة والخبرة لتلبية جميع احتياجاتك بسهولة واحترافية",
      readMoreUrl: "#",
      date: "مايو 29, 2023",
    },
    {
      id: "2",
      image:
        "https://baheya.co/wp-content/uploads/2023/05/62387dd75873914c8bbfe94a9e047b9f3b771b1b.png",
      title: "استثمر بثقة… وابدأ حياة جديدة",
      description:
        "في تعاريفللعقارات، نضع بين يديك مجموعة مختارة من العقارات بعناية فائقة، لنمنحك تجربة فريدة ومضمونة من البداية حتى التملّك.",
      readMoreUrl: "#",
      date: "يوليو 9, 2025",
    },
    {
      id: "3",
      image:
        "https://baheya.co/wp-content/uploads/2023/05/62387dd75873914c8bbfe94a9e047b9f3b771b1b.png",
      title: "اختيارك الأول للسكن والاستثمار",
      description:
        "سواء كنت تبحث عن منزل الأحلام أو فرصة استثمارية رابحة، فريقنا المختص يساعدك في اتخاذ القرار الصحيح بكل شفافية ومصداقية",
      readMoreUrl: "#",
      date: "يوليو 9, 2025",
    },
  ],

  // Styling
  styling: {
    backgroundColor: "#8b5f46",
    paragraphColor: "rgba(255, 255, 255, 0.9)",
    dividerColor: "rgba(255, 255, 255, 0.3)",
    cardBackgroundColor: "#ffffff",
    cardTitleColor: "#1f2937",
    cardTitleHoverColor: "#8b5f46",
    cardDescriptionColor: "#4b5563",
    readMoreColor: "#8b5f46",
    readMoreHoverColor: "#6b4630",
    dateColor: "#6b7280",
  },

  // Layout
  layout: {
    maxWidth: "1280px",
    padding: {
      top: "3rem",
      bottom: "3rem",
    },
    gap: {
      paragraphs: "2rem",
      cards: "1.5rem",
    },
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const blogsSectionsFunctions = {
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
      state.blogsSectionsStates[variantId] &&
      Object.keys(state.blogsSectionsStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultBlogsSectionsData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      blogsSectionsStates: { ...state.blogsSectionsStates, [variantId]: data },
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
    state.blogsSectionsStates[variantId] || getDefaultBlogsSectionsData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    blogsSectionsStates: { ...state.blogsSectionsStates, [variantId]: data },
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
      state.blogsSectionsStates[variantId] || getDefaultBlogsSectionsData();
    const newData = updateDataByPath(source, path, value);

    return {
      blogsSectionsStates: {
        ...state.blogsSectionsStates,
        [variantId]: newData,
      },
    } as any;
  },
};
