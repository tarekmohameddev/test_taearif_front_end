import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default propertySlider data structure
export const getDefaultPropertySliderData = (): ComponentData => ({
  visible: true,
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "56px",
      bottom: "56px",
    },
  },
  spacing: {
    titleBottom: "24px",
    slideGap: "16px",
  },
  content: {
    title: "أحدث العقارات للإيجار",
    description: "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
    viewAllText: "عرض الكل",
    viewAllUrl: "#",
  },
  typography: {
    title: {
      fontFamily: "Tajawal",
      fontSize: {
        desktop: "2xl",
        tablet: "xl",
        mobile: "lg",
      },
      fontWeight: "extrabold",
      color: "#1f2937",
    },
    subtitle: {
      fontFamily: "Tajawal",
      fontSize: {
        desktop: "lg",
        tablet: "base",
        mobile: "sm",
      },
      fontWeight: "normal",
      color: "#6b7280",
    },
    link: {
      fontSize: "sm",
      color: "#059669",
      hoverColor: "#047857",
    },
  },
  carousel: {
    desktopCount: 4,
    autoplay: true,
  },
  background: {
    color: "transparent",
  },
  cardSettings: {
    theme: "card1",
    showImage: true,
    showPrice: true,
    showDetails: true,
    showViews: true,
    showStatus: true,
    cardStyle: {
      borderRadius: "rounded-xl",
      shadow: "lg",
      hoverEffect: "scale",
    },
    imageSettings: {
      aspectRatio: "16/10",
      objectFit: "cover",
      overlay: {
        enabled: false,
        color: "rgba(0, 0, 0, 0.3)",
        gradient: false,
      },
    },
    contentSettings: {
      titleStyle: {
        fontSize: "lg",
        fontWeight: "bold",
        color: "#1f2937",
      },
      priceStyle: {
        fontSize: "xl",
        color: "#059669",
        currency: "ريال",
      },
    },
    interactionSettings: {
      clickable: true,
      buttonText: "تفاصيل",
      buttonStyle: {
        variant: "ghost",
        color: "#059669",
      },
    },
  },
});

export const propertySliderFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.propertySliderStates[variantId]) return state;

    const defaultData = getDefaultPropertySliderData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ...state,
      propertySliderStates: {
        ...state.propertySliderStates,
        [variantId]: data,
      },
    };
  },

  getData: (state: any, variantId: string) =>
    state.propertySliderStates[variantId] || getDefaultPropertySliderData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    propertySliderStates: { ...state.propertySliderStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.propertySliderStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      propertySliderStates: {
        ...state.propertySliderStates,
        [variantId]: newData,
      },
    };
  },
};
