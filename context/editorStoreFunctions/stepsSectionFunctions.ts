import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default steps section data structure - Marketing Real Estate Steps
export const getDefaultStepsSectionData = (): ComponentData => ({
  visible: true,
  background: {
    color: "#f2fbf9",
    padding: {
      desktop: "72px",
      tablet: "48px",
      mobile: "20px",
    },
  },
  header: {
    marginBottom: "40px",
    title: {
      text: "خطواتنا في تسويق العقارات",
      className: "section-title",
    },
    description: {
      text: "نتبع خطوات احترافية لضمان تسويق عقارك بأعلى مستوى من الكفاءة والنجاح",
      className: "section-subtitle-xl text-gray-600",
    },
  },
  grid: {
    gapX: "40px",
    gapY: "40px",
    gapYMobile: "48px",
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
  steps: [
    {
      title: "المعاينة الأولية للعقار",
      desc: "زيارة العقار وتقييم حالته ومعرفة ميزاته ومراجعة التفاصيل التي تحتاج إلى توضيح.",
      image: "/images/MarketingStepsSection/1.svg",
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "كتابة تفصيل العقار",
      desc: "وصف دقيق للممتلكات بما في ذلك الموقع، المساحة، المرافق، والحالة العامة.",
      image: "/images/MarketingStepsSection/2.svg",
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "التصوير الاحترافي للعقار",
      desc: "الاستعانة بمصور محترف لالتقاط صور عالية الجودة مع الاهتمام بالإضاءة والزوايا.",
      image: "/images/MarketingStepsSection/3.svg",
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "توقيع اتفاقية الوساطة والتسويق",
      desc: "توقيع عقد رسمي بينك وبين المالك لتنظيم عملية تسويق العقار وحقوق الطرفين.",
      image: "/images/MarketingStepsSection/4.svg",
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "تصميم بوستر للعقار وإضافته لموقعنا",
      desc: "إعداد بوستر يحتوي على الصور والتفاصيل الرئيسية ونشره على موقعنا الإلكتروني.",
      image: "/images/MarketingStepsSection/5.svg",
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "جذب العملاء المحتملين",
      desc: "استخدام وسائل الاتصال المختلفة لجذب المشترين المهتمين مثل الإعلانات.",
      image: "/images/MarketingStepsSection/6.svg",
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
  ],
  iconStyle: {
    size: { mobile: "40px", desktop: "60px" },
    marginTop: "4px",
    shrink: true,
  },
  layout: {
    direction: "rtl",
    alignment: "left",
    maxWidth: "1200px",
  },
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    steps: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      stagger: 100,
    },
  },
  responsive: {
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },
});

export const stepsSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.stepsSectionStates[variantId]) {
      return state;
    }

    const defaultData = getDefaultStepsSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ...state,
      stepsSectionStates: { ...state.stepsSectionStates, [variantId]: data },
    };
  },

  getData: (state: any, variantId: string) =>
    state.stepsSectionStates[variantId] || getDefaultStepsSectionData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    stepsSectionStates: { ...state.stepsSectionStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.stepsSectionStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      stepsSectionStates: { ...state.stepsSectionStates, [variantId]: newData },
    };
  },
};
