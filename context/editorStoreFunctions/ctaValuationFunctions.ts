import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default ctaValuation data structure
export const getDefaultCtaValuationData = (): ComponentData => ({
  visible: true,
  content: {
    title: "تقييم عقارك",
    description1:
      "لو لديك عقار ترغب في عرضه، اطلب معاينته الآن ليتم تقييمه بشكل دقيق وتحضيره لعرضه",
    description2: "بأفضل طريقة",
    buttonText: "طلب معاينة",
    buttonUrl: "#",
  },
  image: {
    src: "https://dalel-lovat.vercel.app/images/cta-valuation%20section/house.webp",
    alt: "منزل صغير داخل يدين",
    width: 320,
    height: 160,
  },
  styling: {
    bgColor: "bg-emerald-600/95",
    textColor: "text-white",
    buttonBgColor: "bg-white",
    buttonTextColor: "text-emerald-700",
  },
  layout: {
    maxWidth: "9xl",
    innerMaxWidth: "7xl",
    padding: {
      section: {
        top: "56px",
        bottom: "56px",
      },
      inner: {
        horizontal: "24px",
        vertical: "40px",
      },
    },
  },
  spacing: {
    gap: "32px",
    buttonTop: "24px",
    descriptionGap: "8px",
  },
  responsive: {
    grid: {
      mobile: "grid-cols-1",
      tablet: "md:grid-cols-12",
      desktop: "md:grid-cols-12",
    },
    imageOrder: {
      mobile: "order-1",
      tablet: "md:order-1",
      desktop: "md:order-1",
    },
    contentOrder: {
      mobile: "order-2",
      tablet: "md:order-2",
      desktop: "md:order-2",
    },
    textAlignment: {
      mobile: "text-center",
      tablet: "md:text-center",
      desktop: "md:text-center",
    },
  },
  animations: {
    enabled: true,
    fadeIn: {
      enabled: true,
      duration: 600,
      delay: 200,
    },
    slideUp: {
      enabled: true,
      duration: 800,
      delay: 400,
    },
    scale: {
      enabled: true,
      duration: 500,
      delay: 600,
    },
  },
});

export const ctaValuationFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // If variant already exists with data, don't override
    if (
      state.ctaValuationStates?.[variantId] &&
      Object.keys(state.ctaValuationStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    // Use initial data if provided, otherwise use default
    const defaultData = getDefaultCtaValuationData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ctaValuationStates: {
        ...(state.ctaValuationStates || {}),
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) => {
    return state.ctaValuationStates?.[variantId] || {};
  },

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ctaValuationStates: { ...state.ctaValuationStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.ctaValuationStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ctaValuationStates: { ...state.ctaValuationStates, [variantId]: newData },
    } as any;
  },
};
