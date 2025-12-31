import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default footer data structure
export const getDefaultFooterData = (): ComponentData => ({
  visible: true,
  background: {
    type: "image",
    image: "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
    alt: "خلفية الفوتر",
    color: "#1f2937",
    gradient: {
      enabled: false,
      direction: "to-r",
      startColor: "#1f2937",
      endColor: "#374151",
      middleColor: "#4b5563",
    },
    overlay: {
      enabled: true,
      opacity: "0.7",
      color: "#000000",
      blendMode: "multiply",
    },
  },
  layout: {
    columns: "3",
    spacing: "8",
    padding: "16",
    maxWidth: "7xl",
  },
  content: {
    companyInfo: {
      enabled: true,
      name: "الشركة العقارية",
      description:
        "نقدم لك أفضل الحلول العقارية بخبرة واحترافية لتلبية كافة احتياجاتك في البيع والإيجار مع ضمان تجربة مريحة وموثوقة",
      tagline: "للخدمات العقارية",
      logo: "",
    },
    quickLinks: {
      enabled: true,
      title: "روابط مهمة",
      links: [
        { text: "الرئيسية", url: "/" },
        { text: "البيع", url: "/for-sale" },
        { text: "الإيجار", url: "/for-rent" },
        { text: "من نحن", url: "/about-us" },
        { text: "تواصل معنا", url: "/contact-us" },
      ],
    },
    contactInfo: {
      enabled: true,
      title: "معلومات التواصل",
      address: "المملكة العربية السعودية",
      phone1: "0000",
      phone2: "0000",
      email: "info@example.com",
    },
    socialMedia: {
      enabled: true,
      title: "وسائل التواصل الاجتماعي",
      platforms: [
        { name: "واتساب", icon: "FaWhatsapp", url: "#", color: "#25D366" },
        { name: "لينكد إن", icon: "Linkedin", url: "#", color: "#0077B5" },
        { name: "إنستغرام", icon: "Instagram", url: "#", color: "#E4405F" },
        { name: "تويتر", icon: "Twitter", url: "#", color: "#1DA1F2" },
        { name: "فيسبوك", icon: "Facebook", url: "#", color: "#1877F2" },
      ],
    },
  },
  footerBottom: {
    enabled: true,
    copyright: "© 2024 الشركة العقارية للخدمات العقارية. جميع الحقوق محفوظة.",
    legalLinks: [
      { text: "سياسة الخصوصية", url: "/privacy" },
      { text: "الشروط والأحكام", url: "/terms" },
    ],
  },
  styling: {
    colors: {
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.7)",
      accent: "#10b981",
      border: "rgba(255, 255, 255, 0.2)",
    },
    typography: {
      titleSize: "xl",
      titleWeight: "bold",
      bodySize: "sm",
      bodyWeight: "normal",
    },
    spacing: {
      sectionPadding: "16",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "none",
    },
  },
});

// Default footer2 data structure (ThemeTwo)
export const getDefaultFooter2Data = (): ComponentData => ({
  visible: true,

  background: {
    type: "color",
    image: "",
    alt: "",
    color: "#8b5f46", // Default background color

    gradient: {
      enabled: false,
      direction: "to-r",
      startColor: "#1f2937",
      endColor: "#374151",
      middleColor: "#4b5563",
    },
    overlay: {
      enabled: false,
      opacity: "0.7",
      color: "#000000",
      blendMode: "multiply",
    },
  },
  layout: {
    columns: "2",
    spacing: "8",
    padding: "16",
    maxWidth: "6xl",
  },
  content: {
    companyInfo: {
      enabled: true,
      name: "تعاريف العقارية",
      description:
        "نحن هنا لمساعدتك في كل خطوة — من البحث عن العقار المناسب، إلى إتمام المعاملة بكل احترافية وشفافية.",
      tagline: "",
      logo: "/images/main/logo.png",
    },
    newsletter: {
      enabled: true,
      title: "اشترك في النشرة البريدية",
      description:
        "كن أول من يتلقى آخر العروض، والأخبار العقارية، ونصائح الاستثمار من فريق تعاريف العقارية. املأ خانة رقم الواتساب وسنوافيك بكل جديد",
      placeholder: "رقم الواتساب",
      buttonText: "اشترك الآن",
    },
    contactInfo: {
      enabled: true,
      address: "المملكة العربية السعودية - الرياض",
      email: "contact@baheya.co",
      whatsapp: "0542120011",
      whatsappUrl: "https://wa.link/0ysvug",
    },
    socialMedia: {
      enabled: true,
      platforms: [
        {
          name: "Facebook",
          url: "#",
        },
        {
          name: "YouTube",
          url: "#",
        },
        {
          name: "Instagram",
          url: "#",
        },
        {
          name: "X (Twitter)",
          url: "#",
        },
        {
          name: "Snapchat",
          url: "#",
        },
      ],
    },
  },
  footerBottom: {
    enabled: true,
    copyright: "جميع الحقوق محفوظة لشركة تعاريف العقارية 2025©",
    companyUrl: "https://baheya.co",
    designerUrl: "http://souhailagency.com",
    legalLinks: [
      { text: "سياسة الخصوصية", url: "/privacy-policy", ThemeTwo: "ThemeTwo" },
      { text: "سياسة الاستخدام", url: "/terms-of-use", ThemeTwo: "ThemeTwo" },
    ],
  },
  floatingWhatsApp: {
    enabled: true,
    url: "https://wa.link/0ysvug",
  },
  styling: {
    colors: {
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.9)",
      accent: "#a67c5a",
      border: "rgba(255, 255, 255, 0.2)",
    },
    typography: {
      titleSize: "xl",
      titleWeight: "bold",
      bodySize: "base",
      bodyWeight: "normal",
    },
    spacing: {
      sectionPadding: "16",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "lg",
    },
  },
});

export const footerFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.footerStates[variantId] &&
      Object.keys(state.footerStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "footer2"
        ? getDefaultFooter2Data()
        : getDefaultFooterData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      footerStates: { ...state.footerStates, [variantId]: data },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.footerStates[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => ({
    footerStates: { ...state.footerStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.footerStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      footerStates: { ...state.footerStates, [variantId]: newData },
    } as any;
  },
};
