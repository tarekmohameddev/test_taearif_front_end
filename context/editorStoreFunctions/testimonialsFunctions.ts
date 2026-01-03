import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default testimonials data structure
export const getDefaultTestimonialsData = (): ComponentData => ({
  visible: true,
  title: "آراء عملائنا",
  description:
    "نحن نفخر بشركائنا وعملائنا ونسعى دائمًا لتقديم أفضل الحلول التي تدعم نموهم ونجاحهم.",
  background: {
    color: "#ffffff",
    image: "",
    alt: "",
    overlay: {
      enabled: false,
      opacity: "0.1",
      color: "#000000",
    },
  },
  spacing: {
    paddingY: "py-14 sm:py-16",
    marginBottom: "mb-8",
  },
  header: {
    alignment: "text-center md:text-right",
    maxWidth: "mx-auto px-5 sm:px-26",
    title: {
      className: "section-title",
      color: "#1f2937",
      size: "text-3xl sm:text-4xl",
      weight: "font-bold",
    },
    description: {
      className: "section-subtitle-large",
      color: "#6b7280",
      size: "text-lg",
      weight: "font-normal",
    },
  },
  carousel: {
    autoplay: true,
    intervalMs: 5000,
    slidesPerView: 1,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },
  testimonials: [
    {
      id: "1",
      quote:
        "خدمة ممتازة وسريعة، ساعدوني في العثور على العقار المثالي في وقت قياسي.",
      name: "أحمد محمد",
      location: "الرياض",
      rating: 5,
      avatar: "",
      company: "",
      date: "2024",
    },
    {
      id: "2",
      quote: "فريق محترف ومتفهم لاحتياجات العملاء، أنصح بالتعامل معهم.",
      name: "فاطمة علي",
      location: "جدة",
      rating: 5,
      avatar: "",
      company: "",
      date: "2024",
    },
    {
      id: "3",
      quote: "تجربة رائعة من البداية للنهاية، شكراً لكم على الخدمة المتميزة.",
      name: "محمد السعد",
      location: "الدمام",
      rating: 5,
      avatar: "",
      company: "",
      date: "2024",
    },
  ],
  styling: {
    cardBackground: "#ffffff",
    textColor: "#1f2937",
    quoteColor: "#374151",
    nameColor: "#059669",
    locationColor: "#6b7280",
  },
});

export const testimonialsFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.testimonialsStates[variantId]) {
      return state;
    }

    const defaultData = getDefaultTestimonialsData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ...state,
      testimonialsStates: { ...state.testimonialsStates, [variantId]: data },
    };
  },

  getData: (state: any, variantId: string) =>
    state.testimonialsStates[variantId] || getDefaultTestimonialsData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    testimonialsStates: { ...state.testimonialsStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.testimonialsStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      testimonialsStates: { ...state.testimonialsStates, [variantId]: newData },
    };
  },
};
