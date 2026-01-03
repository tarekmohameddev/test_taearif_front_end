import { ComponentData } from "@/lib-liveeditor/types";

// Default data for Application Form component
export const getDefaultApplicationFormData = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "800px",
    padding: {
      y: "py-8",
      smY: "sm:py-12",
    },
  },
  header: {
    title: "نموذج طلب معاينة",
    description:
      "املأ البيانات المطلوبة لتقديم طلب المعاينة. سيتم التواصل معك قريبًا لترتيب موعد لزيارة العقار ومعاينته بشكل دقيق.",
    textAlign: "text-center",
    marginBottom: "mb-8",
    typography: {
      title: {
        className:
          "font-bold text-[20px] text-emerald-600 md:text-[32px] leading-[22.32px] md:leading-[35.71px]",
        fontSize: "text-[20px] md:text-[32px]",
        fontWeight: "font-bold",
        color: "text-emerald-600",
      },
      description: {
        className:
          "font-normal text-[16px] leading-[17.86px] text-gray-600 md:text-[20px] md:leading-[22.32px]",
        fontSize: "text-[16px] md:text-[20px]",
        fontWeight: "font-normal",
        color: "text-gray-600",
      },
    },
  },
  form: {
    fields: {
      name: {
        label: "الاسم",
        placeholder: "ادخل الاسم",
        required: true,
        type: "text",
        className:
          "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
      },
      phone: {
        label: "رقم الهاتف",
        placeholder: "ادخل رقم الهاتف",
        required: true,
        type: "tel",
        className:
          "text-[16px] placeholder:text-end font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
      },
      address: {
        label: "العنوان",
        placeholder: "ادخل العنوان",
        required: true,
        type: "text",
        className:
          "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
      },
      requester_type: {
        label: "الملكية",
        placeholder: "ادخل الملكية",
        required: true,
        type: "text",
        className:
          "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
      },
      date: {
        label: "التاريخ",
        placeholder: "من فضلك اختر التاريخ اولا لاظهار الوقت",
        required: true,
        type: "date",
        className:
          "w-full justify-start text-right font-normal cursor-pointer text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
      },
      time: {
        label: "الوقت",
        placeholder: "اختر الوقت",
        required: true,
        type: "time",
        className:
          "order-1 w-full font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none pr-10 focus:border-emerald-600",
        disabled: true,
      },
      offer_type: {
        label: "نوع العرض",
        options: [
          { value: "sale", label: "للبيع" },
          { value: "rent", label: "للإيجار" },
        ],
        required: true,
        type: "radio",
        className:
          "appearance-none border-2 border-emerald-600 rounded-full w-4 h-4 checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none",
      },
      description: {
        label: "الوصف",
        placeholder:
          "يرجى تقديم وصف دقيق للعقار يشمل نوعه (شقة، فيلا، مكتب)، المساحة، الحالة (جديد/مستعمل)، وأي مميزات إضافية (مثل وجود حديقة، مسبح، أو قربه من الخدمات)",
        required: true,
        type: "textarea",
        className:
          "h-48 resize-none text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
      },
    },
    submitButton: {
      text: "رفع المعاينة",
      className:
        "rounded-md bg-emerald-600 text-white font-semibold text-[16px] py-2 w-full md:w-[400px] mx-auto mb-10 hover:bg-emerald-700 transition-colors",
    },
    imageUpload: {
      label: "تحميل صور العقار",
      description:
        "يرجى تحميل 3 صور واضحة للعقار، بما في ذلك واجهته الداخلية والخارجية. يُفضل أن تكون الصور بأعلى جودة لتسهيل عملية المعاينة",
      maxImages: 3,
      className:
        "relative bg-gray-100 w-[300px] h-64 flex flex-col items-center justify-center rounded-md mx-auto",
    },
  },
  styling: {
    bgColor: "#ffffff",
    textColor: "#059669",
    borderColor: "#d1d5db",
    focusColor: "#059669",
  },
});

// Application Form functions
export const applicationFormFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: any) => {
    if (state.applicationFormStates && state.applicationFormStates[variantId]) {
      return state; // Component already exists
    }

    const defaultData = getDefaultApplicationFormData();
    const data: any = initial || state.tempData || defaultData;

    return {
      ...state,
      applicationFormStates: {
        ...state.applicationFormStates,
        [variantId]: data,
      },
    };
  },

  getData: (state: any, variantId: string) => {
    const data = state.applicationFormStates?.[variantId];
    if (!data || Object.keys(data).length === 0) {
      return getDefaultApplicationFormData();
    }
    return data;
  },

  setData: (state: any, variantId: string, data: any) => {
    return {
      ...state,
      applicationFormStates: {
        ...state.applicationFormStates,
        [variantId]: data,
      },
    };
  },

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const currentData =
      state.applicationFormStates?.[variantId] ||
      getDefaultApplicationFormData();
    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    const newData: any = { ...currentData };
    let cursor: any = newData;

    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i]!;
      const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
      const existing = cursor[key];

      if (
        existing == null ||
        typeof existing === "string" ||
        typeof existing === "number" ||
        typeof existing === "boolean"
      ) {
        cursor[key] = nextIsIndex ? [] : {};
      } else if (Array.isArray(existing) && !nextIsIndex) {
        cursor[key] = {};
      } else if (
        typeof existing === "object" &&
        !Array.isArray(existing) &&
        nextIsIndex
      ) {
        cursor[key] = [];
      }
      cursor = cursor[key];
    }

    const lastKey = segments[segments.length - 1]!;
    cursor[lastKey] = value;

    return {
      ...state,
      applicationFormStates: {
        ...state.applicationFormStates,
        [variantId]: newData,
      },
    };
  },
};
