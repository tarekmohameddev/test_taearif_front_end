import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default contact map section data structure
export const getDefaultContactMapSectionData = (): ComponentData => ({
  visible: true,
  title: "شاركنا تقييمك معنا",
  description:
    "نحن نهتم برأيك! قم بتقييم تجربتك معنا من خلال اختيار عدد النجوم المناسب وكتابة تعليقك. تساعدنا في تحسين الخدمة وتقديم أفضل تجربة لعملائنا",
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
    maxWidth: "max-w-[1600px]",
    paddingX: "px-4",
    headerMarginBottom: "mb-10",
    gridGap: "gap-8",
    formGap: "space-y-6",
    inputGap: "gap-4",
  },
  header: {
    alignment: "text-right",
    title: {
      className: "section-title",
      color: "#1f2937",
      size: "text-3xl sm:text-4xl",
      weight: "font-bold",
    },
    description: {
      className: "section-subtitle",
      color: "#6b7280",
      size: "text-lg",
      weight: "font-normal",
      maxWidth: "max-w-4xl",
      lineHeight: "leading-7",
      marginTop: "mt-4",
    },
  },
  form: {
    title: "تواصل معنا",
    fields: {
      name: {
        label: "الاسم",
        placeholder: "أدخل اسمك",
        required: true,
      },
      email: {
        label: "البريد الإلكتروني",
        placeholder: "أدخل بريدك الإلكتروني",
        required: true,
      },
      phone: {
        label: "رقم الهاتف",
        placeholder: "أدخل رقم هاتفك",
        required: false,
      },
      message: {
        label: "الرسالة",
        placeholder: "اكتب رسالتك هنا...",
        required: true,
        rows: 4,
      },
    },
    button: {
      text: "إرسال الرسالة",
      className: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  },
  map: {
    enabled: true,
    title: "موقعنا",
    address: "المملكة العربية السعودية",
    coordinates: {
      lat: 26.326,
      lng: 43.975,
    },
    zoom: 15,
    height: "h-96",
  },
  styling: {
    background: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#059669",
    borderColor: "#e5e7eb",
    inputBackground: "#ffffff",
  },
});

export const contactMapSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.contactMapSectionStates[variantId]) {
      return state;
    }

    const defaultData = getDefaultContactMapSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ...state,
      contactMapSectionStates: {
        ...state.contactMapSectionStates,
        [variantId]: data,
      },
    };
  },

  getData: (state: any, variantId: string) =>
    state.contactMapSectionStates[variantId] ||
    getDefaultContactMapSectionData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    contactMapSectionStates: {
      ...state.contactMapSectionStates,
      [variantId]: data,
    },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.contactMapSectionStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      contactMapSectionStates: {
        ...state.contactMapSectionStates,
        [variantId]: newData,
      },
    };
  },
};
