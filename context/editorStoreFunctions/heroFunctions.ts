import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default hero1 data structure
export const getDefaultHeroData = (): ComponentData => ({
  visible: true,
  height: {
    desktop: "90vh",
    tablet: "90vh",
    mobile: "90vh",
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "صورة خلفية لغرفة معيشة حديثة",
    overlay: {
      enabled: true,
      opacity: "0.45",
      color: "#000000",
    },
  },
  content: {
    title: "اكتشف عقارك المثالي في أفضل المواقع",
    subtitle: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
    font: {
      title: {
        family: "Tajawal",
        size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
        weight: "extrabold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      subtitle: {
        family: "Tajawal",
        size: { desktop: "2xl", tablet: "2xl", mobile: "2xl" },
        weight: "normal",
        color: "rgba(255, 255, 255, 0.85)",
      },
    },
    alignment: "center",
    maxWidth: "5xl",
    paddingTop: "200px",
  },
  searchForm: {
    enabled: true,
    position: "bottom",
    offset: "32",
    background: {
      color: "#ffffff",
      opacity: "1",
      shadow: "2xl",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "lg",
    },
    fields: {
      purpose: {
        enabled: true,
        options: [
          { value: "rent", label: "إيجار" },
          { value: "sell", label: "بيع" },
        ],
        default: "rent",
      },
      city: {
        enabled: true,
        placeholder: "أدخل المدينة أو المنطقة",
        icon: "MapPin",
      },
      type: {
        enabled: true,
        placeholder: "نوع العقار",
        icon: "Home",
        options: ["شقة", "فيلا", "دوبلكس", "أرض", "شاليه", "مكتب"],
      },
      price: {
        enabled: true,
        placeholder: "السعر",
        icon: "CircleDollarSign",
        options: [
          { id: "any", label: "أي سعر" },
          { id: "0-200k", label: "0 - 200 ألف" },
          { id: "200k-500k", label: "200 - 500 ألف" },
          { id: "500k-1m", label: "500 ألف - 1 مليون" },
          { id: "1m+", label: "أكثر من 1 مليون" },
        ],
      },
      keywords: {
        enabled: true,
        placeholder: "كلمات مفتاحية...",
      },
    },
    responsive: {
      desktop: "all-in-row",
      tablet: "two-rows",
      mobile: "stacked",
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    subtitle: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
    searchForm: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600,
    },
  },
});

// Default hero2 data structure
export const getDefaultHero2Data = (): ComponentData => ({
  visible: true,
  title: "من نحن",
  description: "شريكك الموثوق في تحقيق أفضل الفرص العقارية",
  imageSrc: "https://dalel-lovat.vercel.app/images/hero.webp",
  imageAlt: "Background",
  height: {
    desktop: "229px",
    tablet: "229px",
    mobile: "229px",
  },
  minHeight: {
    desktop: "229px",
    tablet: "229px",
    mobile: "229px",
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "Background",
    overlay: {
      enabled: true,
      opacity: "0.6",
      color: "#000000",
    },
  },
  content: {
    title: "من نحن",
    description: "شريكك الموثوق في تحقيق أفضل الفرص العقارية",
    alignment: "center",
    maxWidth: "5xl",
    font: {
      title: {
        family: "Tajawal",
        size: { desktop: "36px", tablet: "36px", mobile: "36px" },
        weight: "bold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      description: {
        family: "Tajawal",
        size: { desktop: "15px", tablet: "15px", mobile: "15px" },
        weight: "normal",
        color: "#ffffff",
      },
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    description: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
  },
});

// Default hero3 data structure
export const getDefaultHero3Data = (): ComponentData => ({
  visible: true,
  height: {
    desktop: "90vh",
    tablet: "80vh",
    mobile: "70vh",
  },
  background: {
    video: "https://youtu.be/ULzl51V38lw?si=iwlRp_cUXmTe50Gc",
    videoStart: 5,
    playOnMobile: true,
    privacyMode: true,
    alt: "صورة خلفية",
    overlay: {
      enabled: true,
      opacity: "0.45",
      color: "#000000",
    },
  },
  content: {
    title: "مع باهية... اجعل حلمك السكني استثمارا يد22وم",
    subtitle:
      "في باهية، نرتقي بتجربة العقار عبر رؤية احترافية، وخدمة مصمّمة خصيصًا لتليق بتطلعاتك، لنمنحك حلولًا عقارية متكاملة تُلبي طموحاتك وتحقق استثمارًا يدوم.",
    font: {
      title: {
        family: "Tajawal",
        size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
        weight: "extrabold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      subtitle: {
        family: "Tajawal",
        size: { desktop: "md", tablet: "md", mobile: "sm" },
        weight: "normal",
        color: "rgba(255, 255, 255, 0.85)",
      },
    },
    alignment: "center",
    maxWidth: "5xl",
    paddingTop: "200px",
  },
  searchForm: {
    enabled: true,
    position: "bottom",
    offset: "32",
    background: {
      color: "#ffffff",
      opacity: "1",
      shadow: "2xl",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "lg",
    },
    fields: {
      type: {
        enabled: true,
        placeholder: "نوع العقار",
        icon: "Home",
        options: [
          "الكل",
          "شقق",
          "فلل",
          "اراضي",
          "ادوار",
          "عمائر",
          "تاون هاوس",
          "أبراج",
        ],
      },
      city: {
        enabled: true,
        placeholder: "موقع العقار",
        icon: "MapPin",
        options: [
          "اختر المدينة",
          "الرياض",
          "جدة",
          "مكة المكرمة",
          "المدينة المنورة",
          "الدمام",
        ],
      },
      status: {
        enabled: true,
        placeholder: "حالة العقار",
        icon: "Tag",
        options: ["بيع / ايجار", "للبيع", "للإيجار"],
      },
    },
    responsive: {
      desktop: "xl",
      tablet: "lg",
      mobile: "md",
    },
    buttons: {
      color: {
        useDefaultColor: true, // استخدام اللون الافتراضي من إعدادات التاجر
        globalColorType: "primary", // primary أو secondary أو accent
        // color value is not stored when useDefaultColor = true
      },
      advancedButtonEnabled: true, // إظهار زر البحث المتقدم بشكل افتراضي
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    subtitle: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
    searchForm: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600,
    },
  },
});

// Default hero4 data structure
export const getDefaultHero4Data = (): ComponentData => ({
  visible: true,
  showTitle: true, // Show title by default
  title: "عن تعاريف العقارية",
  backgroundImage: "https://dalel-lovat.vercel.app/images/hero.webp",
  barType: "default", // "default" | "contact" | "propertyFilter"
  contact: false,
  defaultBarConfig: {
    questionText: "هل لديك استفسار؟",
    whatsapp: {
      number: "0542120011",
      link: "https://wa.link/0ysvug",
    },
    email: {
      address: "contact@baheya.co",
      link: "mailto:contact@baheya.co",
    },
    accentColor: "#8b5f46", // Default custom color (Brown)
  },
  propertyFilterConfig: {
    propertyTypesSource: "dynamic",
    propertyTypesApiUrl: "https://api.taearif.com/api/v1/tenant-website/{tenantId}/properties/categories/direct",
    searchPlaceholder: "أدخل المدينة أو المنطقة",
    propertyTypePlaceholder: "نوع العقار",
    pricePlaceholder: "السعر",
    searchButtonText: "بحث",
    accentColor: "#8b5f46", // Default custom color (Brown)
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "صورة خلفية",
    overlay: {
      enabled: true,
      opacity: "0.3",
      color: "#000000",
    },
  },
  content: {
    title: "عن تعاريف العقارية",
    alignment: "center",
    maxWidth: "5xl",
    font: {
      title: {
        family: "Tajawal",
        size: {
          desktop: "4xl",
          tablet: "3xl",
          mobile: "2xl",
        },
        weight: "bold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
  },
  contactForm: {
    fields: {
      fullName: {
        label: "الاسم الكامل",
        placeholder: "الاسم الكامل",
      },
      whatsapp: {
        label: "رقم الواتساب",
        placeholder: "رقم الواتساب",
      },
      email: {
        label: "البريد الالكتروني",
        placeholder: "البريد الالكتروني",
      },
      subject: {
        label: "الموضوع",
        placeholder: "موضوع الرسالة",
      },
      message: {
        label: "محتوى الرسالة",
        placeholder: "محتوى الرسالة",
      },
    },
    submitButton: {
      text: "إرسال",
    },
    accentColor: "#8b5f46", // Default custom color (Brown)
  },
  contactInfo: {
    contactText: "أو تواصل معنا مباشرة عبر:",
    whatsappNumbers: [
      {
        number: "0542120011",
        link: "https://api.whatsapp.com/send?phone=966542120011",
      },
      {
        number: "0543332538",
        link: "https://api.whatsapp.com/send/?phone=966543332538&text&type=phone_number&app_absent=0",
      },
    ],
    email: {
      address: "contact@baheya.co",
      link: "mailto:contact@baheya.co",
    },
    location: {
      text: "المملكة العربية السعودية - الرياض",
      link: "#",
    },
  },
  socialMedia: {
    title: "لا تنسى متابعتنا على مواقع التواصل الاجتماعي",
    platforms: {
      snapchat: {
        enabled: true,
        url: "https://www.snapchat.com/add/baheyarealstate?share_id=CH-Am1w1NlU&locale=ar-AE",
      },
      twitter: {
        enabled: true,
        url: "https://x.com/bahiarealstate?t=U_Fm4pDkJj73HPkY_mHDWQ&s=08",
      },
      instagram: {
        enabled: true,
        url: "https://www.instagram.com/baheyarealestat?igsh=enA3cW1tbjRjbHU4",
      },
      youtube: {
        enabled: true,
        url: "https://youtube.com/channel/UCVru6ldyQvpyuxl1lkd_oUQ?si=v6LprF-hXxagAhrp",
      },
      facebook: {
        enabled: true,
        url: "https://www.facebook.com/share/1C974jrjRc/",
      },
    },
  },
});

export const heroFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.heroStates[variantId] &&
      Object.keys(state.heroStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    // تحديد البيانات الافتراضية حسب نوع المكون
    const defaultData =
      variantId === "hero2"
        ? getDefaultHero2Data()
        : variantId === "hero3"
          ? getDefaultHero3Data()
          : variantId === "hero4"
            ? getDefaultHero4Data()
            : getDefaultHeroData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      heroStates: { ...state.heroStates, [variantId]: data },
    } as any;
  },

  getData: (state: any, variantId: string) => state.heroStates[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => ({
    heroStates: { ...state.heroStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.heroStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    // Update pageComponentsByPage as well
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "hero" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });

    return {
      heroStates: { ...state.heroStates, [variantId]: newData },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    } as any;
  },
};
