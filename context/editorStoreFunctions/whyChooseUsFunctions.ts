import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default why choose us data structure
export const getDefaultWhyChooseUsData = (): any => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
  },
  header: {
    title: "لماذا تختارنا؟",
    description:
      "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
    marginBottom: "mb-10",
    textAlign: "text-right",
    paddingX: "px-5",
    typography: {
      title: {
        className: "section-title text-right",
      },
      description: {
        className: "section-subtitle-xl",
      },
    },
  },
  features: {
    list: [
      {
        title: "خدمة شخصية",
        desc: "نحن نركز على تقديم تجربة تركز على العملاء لجعل بحثك عن العقارات سلسًا وناجحًا.",
        icon: {
          type: "icon1",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "مجموعة واسعة من العقارات",
        desc: "من الشقق إلى الفلل والمكاتب والمساحات التجارية، لدينا خيارات تناسب جميع الاحتياجات.",
        icon: {
          type: "icon2",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "خبرة واسعة",
        desc: "فريقنا من الخبراء لديه سنوات من الخبرة في السوق العقاري المحلي والدولي.",
        icon: {
          type: "icon3",
          size: "80",
          className: "w-20 h-20",
        },
      },
    ],
    grid: {
      gap: "gap-8",
      columns: {
        sm: "sm:grid-cols-2",
        lg: "lg:grid-cols-3",
      },
    },
    icon: {
      className: "h-[7rem] w-[7rem]",
      height: "h-[7rem]",
      width: "w-[7rem]",
    },
  },
  typography: {
    title: {
      className: "mt-6 text-center text-lg font-bold text-emerald-700",
      marginTop: "mt-6",
      textAlign: "text-center",
      fontSize: "text-lg",
      fontWeight: "font-bold",
      color: "text-emerald-700",
    },
    description: {
      className: "mt-3 text-center text-lg leading-7 text-gray-600",
      marginTop: "mt-3",
      textAlign: "text-center",
      fontSize: "text-lg",
      lineHeight: "leading-7",
      color: "text-gray-600",
    },
  },
  responsive: {
    mobile: {
      padding: "py-14",
      gridCols: "grid-cols-1",
    },
    tablet: {
      padding: "sm:py-16",
      gridCols: "sm:grid-cols-2",
    },
    desktop: {
      gridCols: "xl:grid-cols-3",
    },
  },
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    features: {
      enabled: true,
      type: "fade-up",
      duration: 500,
      delay: 300,
      stagger: 100,
    },
  },
  styling: {
    background: "#ffffff",
    textColor: "#1f2937",
    accentColor: "#059669",
    borderColor: "#e5e7eb",
    ringColor: "#059669",
  },
});

export const whyChooseUsFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: any) => {
    if (state.whyChooseUsStates[variantId]) {
      return state;
    }

    const defaultData = getDefaultWhyChooseUsData();
    const data: any = initial || state.tempData || defaultData;

    return {
      ...state,
      whyChooseUsStates: { ...state.whyChooseUsStates, [variantId]: data },
    };
  },

  getData: (state: any, variantId: string) => {
    const data =
      state.whyChooseUsStates[variantId] || getDefaultWhyChooseUsData();
    return data;
  },

  setData: (state: any, variantId: string, data: any) => ({
    ...state,
    whyChooseUsStates: { ...state.whyChooseUsStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.whyChooseUsStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      whyChooseUsStates: { ...state.whyChooseUsStates, [variantId]: newData },
    };
  },
};
