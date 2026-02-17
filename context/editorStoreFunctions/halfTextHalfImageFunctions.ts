import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";
import { logEditorStore } from "@/lib/debugLogger";

// Default halfTextHalfImage data structure
export const getDefaultHalfTextHalfImageData = (): ComponentData => ({
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

// Default halfTextHalfImage2 data structure (with stats)
export const getDefaultHalfTextHalfImage2Data = (): ComponentData => ({
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

// Default halfTextHalfImage3 data structure
export const getDefaultHalfTextHalfImage3Data = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    gap: {
      x: "md:gap-x-[30px] lg:gap-x-[74px]",
      y: "gap-[12px]",
    },
    minHeight: "369px",
  },
  spacing: {
    padding: {
      x: "px-4",
      y: "py-[24px]",
      lgY: "lg:py-[52px]",
    },
  },
  // Legacy props for backward compatibility
  title: "رسالتنا",
  description:
    "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
  imageSrc: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
  imageAlt: "Choose Us",
  imagePosition: "left",
  // New structure for editor compatibility - MUST match the legacy props
  content: {
    title: "رسالتنا",
    description:
      "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
    imagePosition: "left",
  },
  image: {
    src: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
    alt: "Choose Us",
  },
});

// Default halfTextHalfImage5 data structure
export const getDefaultHalfTextHalfImage5Data = (): ComponentData => ({
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
        id: "1",
        text: "وقتك أغلى... دعنا ندير عقارك بكفاءة.",
      },
      {
        id: "2",
        text: "نبحث، نُقيّم، ونضمن الأفضل لك.",
      },
      {
        id: "3",
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

// Default halfTextHalfImage6 data structure (ThemeTwo)
export const getDefaultHalfTextHalfImage6Data = (): ComponentData => ({
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

// Default halfTextHalfImage4 data structure (ThemeTwo)
export const getDefaultHalfTextHalfImage4Data = (): ComponentData => ({
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

// Default halfTextHalfImage7 data structure (ThemeTwo)
export const getDefaultHalfTextHalfImage7Data = (): ComponentData => ({
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
    backgroundColor: {
      useMainBgColor: true,
    },
    titleColor: "#000000",
    dividerColor: {
      useDefaultColor: true,
      globalColorType: "primary",
    },
    featureTitleColor: {
      useDefaultColor: true,
      globalColorType: "primary",
    },
    featureDescriptionColor: {
      useDefaultColor: true,
      globalColorType: "primary",
    },
    iconBackgroundColor: {
      useDefaultColor: true,
      globalColorType: "primary",
    },
    iconColor: {
      useDefaultColor: true,
      globalColorType: "primary",
    },
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

export const halfTextHalfImageFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.halfTextHalfImageStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          halfTextHalfImageStates: {
            ...state.halfTextHalfImageStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any;
    }

    // ⭐ STEP 1: Determine componentName (Theme)
    let currentTheme: string | null = null;
    for (const [pageSlug, pageComponents] of Object.entries(
      state.pageComponentsByPage || {},
    )) {
      const found = (pageComponents as any[]).find(
        (comp: any) =>
          comp.type === "halfTextHalfImage" && comp.id === variantId,
      );
      if (found && found.componentName) {
        currentTheme = found.componentName;
        break;
      }
    }

    // Fallback if not found in pageComponents
    if (!currentTheme) {
      const validThemes = [
        "halfTextHalfImage1", "halfTextHalfImage2", "halfTextHalfImage3",
        "halfTextHalfImage4", "halfTextHalfImage5", "halfTextHalfImage6", "halfTextHalfImage7"
      ];
      if (validThemes.includes(variantId)) {
        currentTheme = variantId;
      }
    }

    // ⭐ STEP 2: Get default data for the theme
    let defaultData: ComponentData;
    if (currentTheme === "halfTextHalfImage2" || currentTheme?.includes("halfTextHalfImage2")) {
      defaultData = getDefaultHalfTextHalfImage2Data();
    } else if (currentTheme === "halfTextHalfImage3" || currentTheme?.includes("halfTextHalfImage3")) {
      defaultData = getDefaultHalfTextHalfImage3Data();
    } else if (currentTheme === "halfTextHalfImage4" || currentTheme?.includes("halfTextHalfImage4")) {
      defaultData = getDefaultHalfTextHalfImage4Data();
    } else if (currentTheme === "halfTextHalfImage5" || currentTheme?.includes("halfTextHalfImage5")) {
      defaultData = getDefaultHalfTextHalfImage5Data();
    } else if (currentTheme === "halfTextHalfImage6" || currentTheme?.includes("halfTextHalfImage6")) {
      defaultData = getDefaultHalfTextHalfImage6Data();
    } else if (currentTheme === "halfTextHalfImage7" || currentTheme?.includes("halfTextHalfImage7")) {
      defaultData = getDefaultHalfTextHalfImage7Data();
    } else {
      defaultData = getDefaultHalfTextHalfImageData();
    }

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: data,
      },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   */
  getData: (state: any, variantId: string) =>
    state.halfTextHalfImageStates[variantId] || {},

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => {
    // Update pageComponentsByPage as well
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "halfTextHalfImage" && comp.id === variantId) {
        return { ...comp, data: data };
      }
      return comp;
    });

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: data,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    } as any;
  },

  /**
   * updateByPath - Update specific field in component data
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from halfTextHalfImageStates (saved data)
    const savedData = state.halfTextHalfImageStates[variantId] || {};

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

