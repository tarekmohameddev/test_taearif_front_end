import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";
import {
  DEFAULT_LOGO,
  DEFAULT_ADDRESS,
  DEFAULT_EMAIL,
  DEFAULT_LINKS,
  DEFAULT_COPYRIGHT,
} from "@/stories/Footer/data";

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
      showCompanyName: true,
      useCustomFooterLogo: false,
      footerLogo: "",
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
      whatsappInquiry: {
        enabled: true,
        text: "استفسر عن طريق الواتساب",
        phoneNumber: "",
        message: "مرحباً، أريد الاستفسار عن",
        buttonColor: "#10b981",
      },
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
      paddingYMobile: "16",
      paddingYTablet: "20",
      paddingYDesktop: "24",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "none",
      logoRounded: true,
    },
    المقاسات: {
      logo: {
        width: 100,
        height: 100,
      },
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
      showCompanyName: true,
      showDescription: true,
      useCustomFooterLogo: false,
      footerLogo: "",
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
      formEnabled: true,
      placeholder: "رقم الواتساب",
      buttonText: "اشترك الآن",
    },
    contactInfo: {
      enabled: true,
      address: "المملكة العربية السعودية - الرياض",
      email: "contact@baheya.co",
      whatsapp: "0542120011",
    },
    socialMedia: {
      enabled: true,
      platforms: [
        { name: "واتساب", icon: "FaWhatsapp", url: "#", color: "#25D366" },
        { name: "لينكد إن", icon: "Linkedin", url: "#", color: "#0077B5" },
        { name: "إنستغرام", icon: "Instagram", url: "#", color: "#E4405F" },
        { name: "تويتر", icon: "Twitter", url: "#", color: "#1DA1F2" },
        { name: "فيسبوك", icon: "Facebook", url: "#", color: "#1877F2" },
        { name: "يوتيوب", icon: "Youtube", url: "#", color: "#FF0000" },
        { name: "سناب شات", icon: "Snapchat", url: "#", color: "#FFFC00" },
        { name: "تيك توك", icon: "Tiktok", url: "#", color: "#000000" },
      ],
      whatsappInquiry: {
        enabled: true,
        text: "استفسر عن طريق الواتساب",
        phoneNumber: "",
        message: "مرحباً، أريد الاستفسار عن",
        buttonColor: "#8b5f46",
      },
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
  styling: {
    colors: {
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.9)",
      accent: "#a67c5a",
      border: "rgba(255, 255, 255, 0.2)",
      textAndLinksColor: "#ffffff",
    },
    typography: {
      titleSize: "xl",
      titleWeight: "bold",
      bodySize: "base",
      bodyWeight: "normal",
    },
    spacing: {
      sectionPadding: "16",
      paddingYMobile: "16",
      paddingYTablet: "20",
      paddingYDesktop: "24",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "lg",
      logoRounded: true,
    },
    المقاسات: {
      logo: {
        width: 100,
        height: 100,
      },
    },
  },
});

// Default footer3 data (stories/Footer - theme3)
export const getDefaultFooter3Data = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  logo: DEFAULT_LOGO,
  address: DEFAULT_ADDRESS,
  email: DEFAULT_EMAIL,
  links: DEFAULT_LINKS,
  linksHeading: "الروابط",
  socialLinks: [
    { platform: "instagram", href: "https://www.instagram.com/Clusters_ksa" },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/company/clusters-realestate-development-co-/",
    },
    { platform: "tiktok", href: "https://www.tiktok.com/@clusters_ksa" },
    { platform: "x", href: "https://x.com/Clusters_KSA" },
  ],
  socialHeading: "تابعنا",
  copyright: DEFAULT_COPYRIGHT,
  addressLabelTextProps: {},
  addressValueTextProps: {},
  emailTextProps: {},
  linksHeadingTextProps: {},
  socialHeadingTextProps: {},
  copyrightTextProps: {},
});

/** Merge stored with defaults for footer3 so store has full shape including *TextProps. */
function mergeWithDefaultsFooter3(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultFooter3Data();
  return {
    ...defaultData,
    ...stored,
    addressLabelTextProps: { ...(defaultData.addressLabelTextProps || {}), ...(stored.addressLabelTextProps || {}) },
    addressValueTextProps: { ...(defaultData.addressValueTextProps || {}), ...(stored.addressValueTextProps || {}) },
    emailTextProps: { ...(defaultData.emailTextProps || {}), ...(stored.emailTextProps || {}) },
    linksHeadingTextProps: { ...(defaultData.linksHeadingTextProps || {}), ...(stored.linksHeadingTextProps || {}) },
    socialHeadingTextProps: { ...(defaultData.socialHeadingTextProps || {}), ...(stored.socialHeadingTextProps || {}) },
    copyrightTextProps: { ...(defaultData.copyrightTextProps || {}), ...(stored.copyrightTextProps || {}) },
  } as ComponentData;
}

export const footerFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData =
      variantId === "footer2"
        ? getDefaultFooter2Data()
        : variantId === "footer3"
          ? getDefaultFooter3Data()
          : getDefaultFooterData();

    if (variantId === "footer3") {
      const stored = state.footerStates?.[variantId];
      const hasStored = stored && Object.keys(stored).length > 0;
      const data: ComponentData = hasStored
        ? mergeWithDefaultsFooter3(stored)
        : (initial || state.tempData || defaultData);
      return {
        footerStates: { ...(state.footerStates || {}), [variantId]: data },
      } as any;
    }

    const currentData = state.footerStates?.[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      if (initial && Object.keys(initial).length > 0) {
        return {
          footerStates: { ...state.footerStates, [variantId]: initial },
        } as any;
      }
      return {} as any;
    }
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      footerStates: { ...state.footerStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store (footer3: merged with defaults)
   */
  getData: (state: any, variantId: string) =>
    variantId === "footer3"
      ? mergeWithDefaultsFooter3(state.footerStates?.[variantId] || {})
      : (state.footerStates?.[variantId] || {}),

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    footerStates: { ...state.footerStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field (footer3: full merge then update footerStates)
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    if (variantId === "footer3") {
      const stored = state.footerStates?.[variantId] || {};
      const fullSource = mergeWithDefaultsFooter3(stored);
      const newData = updateDataByPath(fullSource, path, value);
      return {
        footerStates: {
          ...(state.footerStates || {}),
          [variantId]: newData,
        },
      } as any;
    }
    const savedData = state.footerStates?.[variantId] || {};
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };
    const newData = updateDataByPath(baseData, path, value);
    return { tempData: newData } as any;
  },
};

