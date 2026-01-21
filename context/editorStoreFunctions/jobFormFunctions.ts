import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// Default data for Job Form component
export const getDefaultJobFormData = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "800px",
    padding: {
      top: "4rem",
      bottom: "4rem",
    },
  },
  header: {
    title: "نموذج التقديم للوظيفة",
    description: "املأ النموذج أدناه لتقديم طلبك للوظيفة",
    textAlign: "text-center",
    marginBottom: "mb-8",
    icon: "briefcase",
  },
  form: {
    fields: {
      name: {
        label: "الاسم الكامل",
        placeholder: "أدخل الاسم الكامل",
        required: true,
        type: "text",
        className:
          "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
      },
      phone: {
        label: "رقم الهاتف",
        placeholder: "05xxxxxxxx",
        required: true,
        type: "tel",
        className:
          "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
      },
      email: {
        label: "البريد الإلكتروني",
        placeholder: "example@email.com",
        required: true,
        type: "email",
        className:
          "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
      },
      description: {
        label: "الوصف / الرسالة",
        placeholder: "اكتب رسالة أو وصف عن نفسك وخبراتك...",
        required: false,
        type: "textarea",
        className:
          "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
        rows: 6,
      },
      pdf: {
        label: "السيرة الذاتية (PDF)",
        placeholder: "اختر ملف PDF",
        required: true,
        type: "file",
        accept: ".pdf,application/pdf",
        maxSize: 5 * 1024 * 1024, // 5MB
        className:
          "hidden",
      },
    },
    submitButton: {
      text: "إرسال الطلب",
      className:
        "w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group",
    },
  },
  styling: {
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderColor: "#e5e7eb",
    focusColor: "#3b82f6",
    errorColor: "#ef4444",
    successColor: "#10b981",
  },
  api: {
    endpoint: "/api/v1/tenant-website",
    tenantId: "", // Will be populated from tenantStore or EditorSidebar
    useTenantStore: true, // Use tenantId from tenantStore if true
  },
});

// Job Form functions
export const jobFormFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: any) => {
    if (
      state.jobFormStates &&
      state.jobFormStates[variantId] &&
      Object.keys(state.jobFormStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultJobFormData();
    const data: any = initial || state.tempData || defaultData;

    return {
      jobFormStates: {
        ...state.jobFormStates,
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) => {
    const data = state.jobFormStates?.[variantId];
    if (!data || Object.keys(data).length === 0) {
      return getDefaultJobFormData();
    }
    return data;
  },

  setData: (state: any, variantId: string, data: any) => {
    return {
      jobFormStates: {
        ...state.jobFormStates,
        [variantId]: data,
      },
    };
  },

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.jobFormStates?.[variantId] || getDefaultJobFormData();
    const newData = updateDataByPath(source, path, value);

    return {
      jobFormStates: {
        ...state.jobFormStates,
        [variantId]: newData,
      },
    } as any;
  },
};
