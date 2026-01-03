import { ComponentData } from "@/lib-liveeditor/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default inputs data structure
export const getDefaultInputsData = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
  },
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    accentColor: "#60a5fa",
    submitButtonGradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  },
  submitButton: {
    text: "إرسال",
    show: true,
    className: "w-full",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    hoverColor: "#1e40af",
    borderRadius: "8px",
    padding: "12px 24px",
    apiEndpoint: "/api/submit-form",
  },
  cardsLayout: {
    columns: "1",
    gap: "24px",
    responsive: {
      mobile: "1",
      tablet: "2",
      desktop: "3",
    },
  },
  fieldsLayout: {
    columns: "1",
    gap: "16px",
    responsive: {
      mobile: "1",
      tablet: "2",
      desktop: "3",
    },
  },
  cards: [
    {
      id: "card_expenses",
      title: "المصاريف",
      description: "أدخل تفاصيل المصاريف",
      fields: [
        {
          id: "field_expense_name",
          type: "text",
          label: "اسم المصروف",
          placeholder: "أدخل اسم المصروف",
          required: true,
        },
        {
          id: "field_expense_amount",
          type: "currency",
          label: "المبلغ",
          placeholder: "أدخل المبلغ",
          required: true,
        },
        {
          id: "field_expense_date",
          type: "date",
          label: "التاريخ",
          required: true,
        },
        {
          id: "field_expense_category",
          type: "radio",
          label: "فئة المصروف",
          required: true,
          options: [
            { value: "مكتب", label: "مكتب" },
            { value: "سكن", label: "سكن" },
            { value: "نقل", label: "نقل" },
            { value: "أخرى", label: "أخرى" },
          ],
        },
      ],
      customColors: {
        primary: "#10b981",
        secondary: "#059669",
        hover: "#34d399",
        shadow: "rgba(16, 185, 129, 0.1)",
      },
    },
    {
      id: "card_new_expense",
      title: "إضافة مصروف جديد",
      description: "أضف مصروف جديد للنظام",
      fields: [
        {
          id: "field_new_expense_name",
          type: "text",
          label: "اسم المصروف الجديد",
          placeholder: "أدخل اسم المصروف الجديد",
          required: true,
        },
        {
          id: "field_new_expense_amount",
          type: "currency",
          label: "المبلغ",
          placeholder: "أدخل المبلغ",
          required: true,
        },
      ],
      customColors: {
        primary: "#f59e0b",
        secondary: "#d97706",
        hover: "#fbbf24",
        shadow: "rgba(245, 158, 11, 0.1)",
      },
    },
  ],
});

export const inputsFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.inputsStates[variantId]) {
      return state;
    }

    const defaultData = getDefaultInputsData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ...state,
      inputsStates: { ...state.inputsStates, [variantId]: data },
    };
  },

  getData: (state: any, variantId: string) =>
    state.inputsStates[variantId] || getDefaultInputsData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    inputsStates: { ...state.inputsStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.inputsStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      inputsStates: { ...state.inputsStates, [variantId]: newData },
    };
  },
};
