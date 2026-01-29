import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default sideBySide data structure (same as halfTextHalfImage1)
export const getDefaultSideBySideData = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    textWidth: 52.8,
    imageWidth: 47.2,
    gap: "16",
    minHeight: "369px",
  },
  spacing: {
    padding: {
      top: 12,
      bottom: 6,
      left: 4,
      right: 4,
    },
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  content: {
    eyebrow: "شريك موثوق",
    title: "نحن شريكك الموثوق في عالم العقارات",
    description:
      "نقدم لك أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. فريقنا من الخبراء يساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك.",
    button: {
      text: "تعرف علينا",
      enabled: true,
      url: "/about-us",
      style: {
        backgroundColor: "#059669",
        textColor: "#ffffff",
        hoverBackgroundColor: "#047857",
        hoverTextColor: "#ffffff",
        width: "119px",
        height: "46px",
        borderRadius: "10px",
      },
    },
  },
  typography: {
    eyebrow: {
      size: "text-xs md:text-base xl:text-lg",
      weight: "font-normal",
      color: "text-muted-foreground",
      lineHeight: "leading-[22.5px]",
    },
    title: {
      size: "section-title-large",
      weight: "font-normal",
      color: "text-foreground",
      lineHeight: "lg:leading-[64px]",
    },
    description: {
      size: "text-sm md:text-sm xl:text-xl",
      weight: "font-normal",
      color: "text-muted-foreground",
      lineHeight: "leading-[35px]",
    },
  },
  image: {
    visible: true,
    src: "https://dalel-lovat.vercel.app/images/trusted-partner-section/house.webp",
    alt: "صورة شريك موثوق",
    style: {
      aspectRatio: "800/500",
      objectFit: "contain",
      borderRadius: "0",
    },
    background: {
      enabled: true,
      color: "#059669",
      width: 54,
      borderRadius: "5px",
    },
  },
  responsive: {
    mobile: {
      textOrder: 2,
      imageOrder: 1,
      textWidth: "w-full",
      imageWidth: "w-full",
      marginBottom: "mb-10",
    },
    tablet: {
      textOrder: 2,
      imageOrder: 1,
      textWidth: "w-full",
      imageWidth: "w-full",
      marginBottom: "mb-10",
    },
    desktop: {
      textOrder: 1,
      imageOrder: 2,
      textWidth: "md:w-[52.8%]",
      imageWidth: "md:w-[47.2%]",
      marginBottom: "md:mb-0",
    },
  },
  animations: {
    text: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    image: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
  },
});

// Default sideBySide2 data structure (with stats - same as halfTextHalfImage2)
export const getDefaultSideBySide2Data = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    gridCols: "md:grid-cols-10",
    gap: {
      x: "gap-x-10",
      y: "gap-y-16",
      yMd: "md:gap-y-10",
    },
  },
  spacing: {
    padding: {
      x: "px-4",
      y: "py-5",
      smX: "sm:px-6",
      smY: "sm:py-20",
      lgX: "lg:px-8",
    },
  },
  content: {
    eyebrow: "تجربتك العقارية تبدأ هنا",
    title: "إيجاد عقار مناسب هو هدفنا",
    description:
      "يقدم لك الشركة العقارية العقاري أفضل الحلول العقارية لتلبية كافة احتياجاتك في البيع والإيجار، مع ضمان تجربة مريحة ومضمونة.",
    stats: {
      stat1: { value: "+100", label: "عميل سعيد" },
      stat2: { value: "+50", label: "عقار تم بيعه" },
      stat3: { value: "+250", label: "عقار تم تأجيره" },
      stat4: { value: "40", label: "تقييمات العملاء" },
    },
  },
  typography: {
    eyebrow: {
      className: "section-title text-emerald-700",
      marginBottom: "mb-3",
    },
    title: {
      className: "section-title leading-[1.25] text-black",
      textBalance: "text-balance",
    },
    description: {
      className: "section-subtitle-large max-w-3xl",
    },
    stats: {
      valueClassName: "text-2xl text-emerald-700",
      labelClassName: "text-xl text-black",
      labelMarginTop: "mt-1",
    },
  },
  image: {
    visible: true,
    src: "https://dalel-lovat.vercel.app/images/experience-intro/CouterSectionImage.webp",
    alt: "صورة داخلية لغرفة معيشة حديثة",
    width: 800,
    height: 600,
    style: {
      className: "w-full h-full object-cover rounded-[15px]",
      borderRadius: "rounded-[15px]",
    },
    background: {
      enabled: true,
      color: "#059669",
      className: "bg-emerald-600 rounded-[10px]",
      positioning: {
        pr: "pr-[15px]",
        pb: "pb-[15px]",
        xlPr: "xl:pr-[21px]",
        xlPb: "xl:pb-[21px]",
      },
    },
  },
  responsive: {
    grid: {
      textCols: "md:col-span-5",
      imageCols: "md:col-span-5",
      textOrder: "order-2 md:order-2",
      imageOrder: "order-2 md:order-2",
    },
    stats: {
      gridCols: "grid-cols-2 sm:grid-cols-4",
      gap: "gap-4",
      marginTop: "mt-10",
    },
  },
  animations: {
    text: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    image: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
    stats: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600,
      stagger: 100,
    },
  },
});

// Default sideBySide4 data structure (ThemeTwo - same as halfTextHalfImage4)
export const getDefaultSideBySide4Data = (): ComponentData => ({
  visible: true,

  layout: {
    direction: "rtl",
    minHeight: "350px",
  },
  spacing: {
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  content: {
    title: "ابنِ طريقك... ولا تنتظر أن تُمنح",
    paragraphs: [
      {
        text: "لا أحد يعرف ثمن النعيم الذي تريد الوصول إليه غيرك. ليس في الوعود ولا في التمنّي، بل في خطواتك، في عزمك، في سكونك حين يتخلّى عنك كل شيء إلا إيمانك بما تستحق.",
      },
      {
        text: "لا أحد سيأتي ليكملك. كل ما تبحث عنه، يبدأ حين تتوقف عن تقليد من سبقوك، وتبدأ في كتابة فصلك الأول بيدك، بصوتك، بخوفك حتى.",
      },
      {
        text: "اختر أن تنهض، لا لأنك مجبر، بل لأنك تستحق أن ترى ما خلف الجدار.",
      },
    ],
    button: {
      text: "اكتشف عقارك الآن",
      url: "/projects",
      enabled: true,
    },
  },
  styling: {
    textBackground: {
      color: "#e4bfa1",
    },
    divider: {
      color: "#8b5f46",
      width: "96px",
      height: "2px",
    },
    button: {
      backgroundColor: "#8b5f46",
      hoverBackgroundColor: "#6b4630",
      textColor: "#ffffff",
      borderRadius: "8px",
    },
    textColors: {
      title: "#1f2937",
      paragraph: "#374151",
    },
  },
  image: {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000",
    alt: "منظر المدينة",
    visible: true,
  },
  responsive: {
    mobile: {
      textOrder: 2,
      imageOrder: 1,
      textWidth: "w-full",
      imageWidth: "w-full",
      imageHeight: "h-[200px]",
    },
    desktop: {
      textOrder: 1,
      imageOrder: 2,
      textWidth: "md:w-[60%]",
      imageWidth: "md:w-[40%]",
      imageHeight: "md:h-auto",
    },
  },
});

// Default sideBySide6 data structure (ThemeTwo - same as halfTextHalfImage6)
export const getDefaultSideBySide6Data = (): ComponentData => ({
  visible: true,

  layout: {
    maxWidth: "1280px",
  },
  spacing: {
    padding: {
      top: "5rem",
      bottom: "3rem",
    },
  },
  content: {
    title: "خبراء في خدمتك – نرافقك نحو استثمار آمن",
    titleUnderlined: "خبراء في",
    paragraph:
      "نقدّم لك خدمات احترافية في سوق العقارات، بفريق يتمتع بالخبرة والموثوقية، لنساعدك على اتخاذ القرار السليم.",
  },
  image: {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000",
    alt: "صورة",
    visible: true,
  },
  styling: {
    backgroundColor: "#f5f0e8",
    titleColor: "#000000",
    paragraphColor: "#000000",
    dividerColor: "#8b5f46",
  },
});

// Default sideBySide5 data structure (ThemeTwo - same as halfTextHalfImage5)
export const getDefaultSideBySide5Data = (): ComponentData => ({
  visible: true,

  layout: {
    direction: "rtl",
    maxWidth: "1152px",
    gap: "gap-6 md:gap-8",
  },
  spacing: {
    padding: {
      top: "3rem",
      bottom: "4rem",
      left: "1rem",
      right: "1rem",
    },
  },
  content: {
    description:
      "ندير عنك كل شيء… من الإعلان حتى التوقيع. في باهية، نوفّر لك مستأجرًا موثوقًا ونتولى إدارة عملية التأجير بالكامل، من التسويق والتواصل، حتى إعداد العقود واستلام الدفعات. كل ذلك باحترافية، شفافية، وتجربة تُبقيك مطمئنًا دائمًا",
    items: [
      {
        text: "وقتك أغلى... دعنا ندير عقارك بكفاءة.",
      },
      {
        text: "نبحث، نُقيّم، ونضمن الأفضل لك.",
      },
      {
        text: "راحة بالك هي أولويتنا.",
      },
    ],
  },
  styling: {
    backgroundColor: "#f5f0e8",
    textColor: "#5c3e2a",
    dividerColor: "#5c3e2a",
    iconColor: "#5c3e2a",
  },
  image: {
    visible: true,
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000",
    alt: "منظر المدينة",
  },
});

// Default sideBySide7 data structure (ThemeTwo - same as halfTextHalfImage7)
export const getDefaultSideBySide7Data = (): ComponentData => ({
  visible: true,

  layout: {
    direction: "rtl",
    maxWidth: "1350px",
  },
  spacing: {
    padding: {
      top: "3rem",
      bottom: "4rem",
      left: "1rem",
      right: "1rem",
    },
  },
  content: {
    title: "خدمات موثوقة تستحق ثقتك",
    features: [
      {
        id: "1",
        title: "الشفافية",
        description:
          "نلتزم بالوضوح في جميع تعاملاتنا. نؤمن بأن الشفافية تبني الثقة، ولهذا نحرص على تزويدك بكل التفاصيل بصدق ومصداقية، دون مفاجآت أو معلومات مخفية.",
        icon: "transparency",
      },
      {
        id: "2",
        title: "الالتزام",
        description:
          "نعمل من أجلك بكل إخلاص واحترافية. فريقنا ملتزم بتقديم أفضل الحلول العقارية، ويقف إلى جانبك خطوة بخطوة حتى تحقق هدفك، سواء بالشراء أو الاستثمار",
        icon: "commitment",
      },
      {
        id: "3",
        title: "الابتكار",
        description:
          "نواكب المستقبل بخدمات ذكية. نستخدم أحدث الأدوات والمنصات لتوفير تجربة عقارية سلسة وسهلة، تجمع بين السرعة، الدقة، والراحة.",
        icon: "innovation",
      },
    ],
  },
  styling: {
    backgroundColor: "#f5f0e8",
    titleColor: "#000000",
    dividerColor: "#8b5f46",
    featureTitleColor: "#8b5f46",
    featureDescriptionColor: "#8b5f46",
    iconBackgroundColor: "#d4a574",
    iconColor: "#896042",
  },
  image: {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000",
    alt: "صورة",
    visible: true,
  },
  responsive: {
    mobile: {
      imageOrder: 1,
      textOrder: 2,
      imageHeight: "h-[300px]",
    },
    desktop: {
      imageOrder: 2,
      textOrder: 1,
      imageHeight: "md:min-h-[500px]",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTION: Get componentName from pageComponentsByPage
// ═══════════════════════════════════════════════════════════
/**
 * Helper function to get componentName from pageComponentsByPage
 * This is needed when variantId is a UUID and we need to determine the variant type
 * 
 * @param state - Current editorStore state
 * @param variantId - Unique component ID (UUID)
 * @returns componentName (e.g., "sideBySide6") or null if not found
 */
const getComponentNameFromPageComponents = (
  state: any,
  variantId: string,
): string | null => {
  // Search through all pages in pageComponentsByPage
  for (const [pageSlug, pageComponents] of Object.entries(
    state.pageComponentsByPage || {},
  )) {
    if (Array.isArray(pageComponents)) {
      const component = pageComponents.find(
        (comp: any) =>
          comp.type === "sideBySide" && comp.id === variantId,
      );
      if (component?.componentName) {
        return component.componentName;
      }
    }
  }
  return null;
};

export const sideBySideFunctions = {
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
      state.sideBySideStates[variantId] &&
      Object.keys(state.sideBySideStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // ⭐ FIX: Get componentName from pageComponentsByPage if variantId is UUID
    let actualVariantId = variantId;
    if (!variantId.includes("sideBySide")) {
      const componentName = getComponentNameFromPageComponents(state, variantId);
      if (componentName) {
        actualVariantId = componentName;
      }
    }

    // Determine default data based on actualVariantId
    let defaultData: ComponentData;
    if (
      actualVariantId === "sideBySide2" ||
      actualVariantId.includes("sideBySide2")
    ) {
      defaultData = getDefaultSideBySide2Data();
    } else if (
      actualVariantId === "sideBySide4" ||
      actualVariantId.includes("sideBySide4")
    ) {
      defaultData = getDefaultSideBySide4Data();
    } else if (
      actualVariantId === "sideBySide5" ||
      actualVariantId.includes("sideBySide5")
    ) {
      defaultData = getDefaultSideBySide5Data();
    } else if (
      actualVariantId === "sideBySide6" ||
      actualVariantId.includes("sideBySide6")
    ) {
      defaultData = getDefaultSideBySide6Data();
    } else if (
      actualVariantId === "sideBySide7" ||
      actualVariantId.includes("sideBySide7")
    ) {
      defaultData = getDefaultSideBySide7Data();
    } else {
      defaultData = getDefaultSideBySideData();
    }

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      sideBySideStates: { ...state.sideBySideStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @returns Component data or default data if not found
   */
  getData: (state: any, variantId: string) => {
    // ⭐ FIX: Get componentName from pageComponentsByPage if variantId is UUID
    let actualVariantId = variantId;
    if (!variantId.includes("sideBySide")) {
      const componentName = getComponentNameFromPageComponents(state, variantId);
      if (componentName) {
        actualVariantId = componentName;
      }
    }

    // Determine default data based on actualVariantId
    if (
      actualVariantId === "sideBySide2" ||
      actualVariantId.includes("sideBySide2")
    ) {
      return state.sideBySideStates[variantId] || getDefaultSideBySide2Data();
    }
    if (
      actualVariantId === "sideBySide4" ||
      actualVariantId.includes("sideBySide4")
    ) {
      return state.sideBySideStates[variantId] || getDefaultSideBySide4Data();
    }
    if (
      actualVariantId === "sideBySide5" ||
      actualVariantId.includes("sideBySide5")
    ) {
      return state.sideBySideStates[variantId] || getDefaultSideBySide5Data();
    }
    if (
      actualVariantId === "sideBySide6" ||
      actualVariantId.includes("sideBySide6")
    ) {
      return state.sideBySideStates[variantId] || getDefaultSideBySide6Data();
    }
    if (
      actualVariantId === "sideBySide7" ||
      actualVariantId.includes("sideBySide7")
    ) {
      return state.sideBySideStates[variantId] || getDefaultSideBySide7Data();
    }
    return state.sideBySideStates[variantId] || getDefaultSideBySideData();
  },

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => {
    // Update pageComponentsByPage as well
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "sideBySide" && comp.id === variantId) {
        return { ...comp, data: data };
      }
      return comp;
    });

    return {
      sideBySideStates: { ...state.sideBySideStates, [variantId]: data },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    } as any;
  },

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
    // ⭐ FIX: Get componentName from pageComponentsByPage if variantId is UUID
    let actualVariantId = variantId;
    if (!variantId.includes("sideBySide")) {
      const componentName = getComponentNameFromPageComponents(state, variantId);
      if (componentName) {
        actualVariantId = componentName;
      }
    }

    // Determine default data based on actualVariantId
    let defaultData: ComponentData;
    if (
      actualVariantId === "sideBySide2" ||
      actualVariantId.includes("sideBySide2")
    ) {
      defaultData = getDefaultSideBySide2Data();
    } else if (
      actualVariantId === "sideBySide4" ||
      actualVariantId.includes("sideBySide4")
    ) {
      defaultData = getDefaultSideBySide4Data();
    } else if (
      actualVariantId === "sideBySide5" ||
      actualVariantId.includes("sideBySide5")
    ) {
      defaultData = getDefaultSideBySide5Data();
    } else if (
      actualVariantId === "sideBySide6" ||
      actualVariantId.includes("sideBySide6")
    ) {
      defaultData = getDefaultSideBySide6Data();
    } else if (
      actualVariantId === "sideBySide7" ||
      actualVariantId.includes("sideBySide7")
    ) {
      defaultData = getDefaultSideBySide7Data();
    } else {
      defaultData = getDefaultSideBySideData();
    }
    const source = state.sideBySideStates[variantId] || defaultData;
    const newData = updateDataByPath(source, path, value);

    // Update pageComponentsByPage as well
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "sideBySide" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });

    return {
      sideBySideStates: { ...state.sideBySideStates, [variantId]: newData },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    } as any;
  },
};
