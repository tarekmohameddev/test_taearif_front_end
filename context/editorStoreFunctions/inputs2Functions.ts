import { ComponentData } from "@/lib-liveeditor/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

/**
 * Default inputs2 data structure
 *
 * This contains 99% of the component's data (cards, fields, styling, etc.)
 * The remaining 1% (visibility controls) are added at the end to allow
 * fine-grained control over which cards and fields are visible.
 */
export const getDefaultInputs2Data = (): ComponentData => ({
  visible: true,
  texts: {
    title: "Advanced Inputs System Title",
    subtitle: "This is a sample subtitle for the section.",
  },
  colors: {
    background: "#FFFFFF",
    textColor: "#1F2937",
  },
  settings: {
    enabled: true,
    layout: "default",
  },
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
    columns: "1",
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
    className: "max-w-[50%]",
    backgroundColor: "#059669",
    textColor: "#ffffff",
    hoverColor: "#067a55",
    borderRadius: "8px",
    padding: "12px 24px",
    apiEndpoint: "https://api.taearif.com/api/v1/property-requests/public",
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
    columns: "2",
    gap: "16px",
    responsive: {
      mobile: "1",
      tablet: "2",
      desktop: "2",
    },
  },
  // Card visibility controls (1% of the data)
  cardVisibility: {
    propertyInfoCard: true,
    budgetCard: true,
    additionalDetailsCard: true,
    contactCard: true,
  },
  // Field visibility controls (1% of the data)
  fieldVisibility: {
    propertyType: true,
    propertyCategory: true,
    city: true,
    district: true,
    areaFrom: true,
    areaTo: true,
    purchaseMethod: true,
    budgetFrom: true,
    budgetTo: true,
    seriousness: true,
    purchaseGoal: true,
    similarOffers: true,
    fullName: true,
    phone: true,
    whatsapp: true,
    notes: true,
  },
  // Field required controls (1% of the data)
  fieldRequired: {
    propertyType: true,
    propertyCategory: true,
    city: true,
    district: true,
    areaFrom: false,
    areaTo: false,
    purchaseMethod: true,
    budgetFrom: true,
    budgetTo: false,
    seriousness: false,
    purchaseGoal: false,
    similarOffers: false,
    fullName: true,
    phone: true,
    whatsapp: false,
    notes: false,
  },
  cards: [
    {
      title: "معلومات العقار المطلوب",
      description: null,
      icon: [],
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: null,
      fields: [
        {
          label: "نوع العقار",
          placeholder: "نوع العقار",
          description: "نوع العقار",
          required: true,
          type: "select",
          options: [
            {
              value: "14",
              label: "آخرى",
            },
            {
              value: "4",
              label: "أرض",
            },
            {
              value: "7",
              label: "استراحة",
            },
            {
              value: "13",
              label: "دور في فيلا",
            },
            {
              value: "18",
              label: "شقة",
            },
            {
              value: "2",
              label: "شقة في برج",
            },
            {
              value: "3",
              label: "شقة في عمارة",
            },
            {
              value: "17",
              label: "شقة في فيلا",
            },
            {
              value: "15",
              label: "عمارة",
            },
            {
              value: "1",
              label: "فيلا",
            },
            {
              value: "5",
              label: "قصر",
            },
            {
              value: "12",
              label: "عمارة",
            },
            {
              value: "8",
              label: "محل تجاري",
            },
            {
              value: "6",
              label: "مزرعة",
            },
            {
              value: "11",
              label: "معرض",
            },
            {
              value: "9",
              label: "مكتب",
            },
            {
              value: "10",
              label: "منتجع",
            },
          ],
          validation: null,
          icon: null,
          id: "property_type",
        },
        {
          label: "نوع الملكية",
          placeholder: "نوع الملكية",
          description: null,
          required: false,
          type: "radio",
          options: [
            {
              value: "زراعي",
              label: "زراعي",
            },
            {
              value: "صناعي",
              label: "صناعي",
            },
            {
              value: "تجاري",
              label: "تجاري",
            },
            {
              value: "سكني",
              label: "سكني",
            },
          ],
          validation: null,
          icon: null,
          id: "category",
        },
        {
          id: "region",
          type: "select",
          label: "المدينة",
          placeholder: "المدينة",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "districts_id",
          type: "select",
          label: "الحي",
          placeholder: "الحي",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "area_from",
          type: null,
          label: "المساحة من",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "area_to",
          type: null,
          label: "المساحة إلى",
          placeholder: "المساحة إلى",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
      ],
    },
    {
      id: "معلومات الميزانية والدفع",
      title: "معلومات الميزانية والدفع",
      description: null,
      icon: null,
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: "إضافة جديد",
      fields: [
        {
          id: "purchase_method",
          type: "radio",
          label: "طريقة الشراء",
          placeholder: "طريقة الشراء",
          required: false,
          description: null,
          icon: null,
          options: [
            {
              value: "كاش",
              label: "كاش",
            },
            {
              value: "تمويل بنكي",
              label: "تمويل بنكي",
            },
          ],
          validation: null,
        },
        {
          id: "budget_from",
          type: null,
          label: "الميزانية من",
          placeholder: "الميزانية من",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "budget_to",
          type: null,
          label: "الميزانية إلى",
          placeholder: "الميزانية إلى",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
      ],
    },
    {
      id: "تفاصيل إضافية",
      title: "تفاصيل إضافية",
      description: "تفاصيل إضافية",
      icon: null,
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: "إضافة جديد",
      fields: [
        {
          id: "seriousness",
          type: "radio",
          label: "الجدية",
          placeholder: "الجدية",
          required: false,
          description: null,
          icon: null,
          options: [
            {
              value: "مستعد فورًا",
              label: "مستعد فورًا",
            },
            {
              value: "خلال شهر",
              label: "خلال شهر",
            },
            {
              value: "خلال 3 أشهر",
              label: "خلال 3 أشهر",
            },
            {
              value: "لاحقًا / استكشاف فقط",
              label: "لاحقًا / استكشاف فقط",
            },
          ],
          validation: null,
        },
        {
          id: "purchase_goal",
          type: "radio",
          label: "هدف الشراء",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: [
            {
              value: "سكن خاص",
              label: "سكن خاص",
            },
            {
              value: "استثمار وتأجير",
              label: "استثمار وتأجير",
            },
            {
              value: "بناء وبيع",
              label: "بناء وبيع",
            },
            {
              value: "مشروع تجاري",
              label: "مشروع تجاري",
            },
          ],
          validation: null,
        },
        {
          id: "wants_similar_offers",
          type: "radio",
          label: "يريد عروض مشابهة",
          placeholder: "يريد عروض مشابهة",
          required: false,
          description: null,
          icon: null,
          options: [
            {
              value: "نعم",
              label: "نعم",
            },
            {
              value: "لا",
              label: "لا",
            },
          ],
          validation: null,
        },
      ],
    },
    {
      id: "بيانات التواصل",
      title: "بيانات التواصل",
      description: "بيانات التواصل",
      icon: null,
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: "إضافة جديد",
      fields: [
        {
          id: "full_name",
          type: null,
          label: "الاسم الكامل",
          placeholder: null,
          required: true,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "phone",
          type: null,
          label: "رقم الهاتف",
          placeholder: "رقم الهاتف",
          required: true,
          description: "رقم الهاتف",
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "contact_on_whatsapp",
          type: "radio",
          label: "التواصل عبر واتساب",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: [
            {
              value: "نعم",
              label: "نعم",
            },
            {
              value: "لا",
              label: "لا",
            },
          ],
          validation: null,
        },
        {
          id: "notes",
          type: "textarea",
          label: "ملاحظات",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
      ],
    },
  ],
});

export const inputs2Functions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.inputs2States[variantId]) {
      return state;
    }

    const defaultData = getDefaultInputs2Data();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      ...state,
      inputs2States: { ...state.inputs2States, [variantId]: data },
    };
  },

  getData: (state: any, variantId: string) =>
    state.inputs2States[variantId] || getDefaultInputs2Data(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    inputs2States: { ...state.inputs2States, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.inputs2States[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      inputs2States: { ...state.inputs2States, [variantId]: newData },
    };
  },
};
