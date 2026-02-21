import { ComponentData } from "@/lib/types";
import { createDefaultData, updateDataByPath } from "./types";

// Default data for contactFormSection component
export const getDefaultContactFormSectionData = (): ComponentData => ({
  visible: true,
  layout: {
    container: {
      padding: {
        vertical: "py-8",
        horizontal: "px-4",
      },
      maxWidth: "1600px",
    },
    grid: {
      columns: {
        mobile: "flex-col",
        desktop: "md:flex-row",
      },
      gap: "gap-[16px]",
    },
  },
  content: {
    title: "زوروا صفحتنا على",
    socialLinksEnabled: true,
    socialLinks: [
      {
        href: "https://facebook.com",
        alt: "facebook",
        text: "الشركة العقارية التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://x.com",
        alt: "x",
        text: "الشركة العقارية التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://www.instagram.com/guide__aljiwa?igsh=MWY1amdsaGlhZm1xOA==",
        alt: "instagram",
        text: "الشركة العقارية التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://linkedin.com",
        alt: "linkedin",
        text: "الشركة العقارية التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://wa.me/966537120774",
        alt: "whatsapp",
        text: "الشركة العقارية التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
    ],
  },
  form: {
    fields: [
      {
        id: "name",
        type: "text",
        placeholder: "أدخل اسمك",
        required: true,
        style: {
          className: "border rounded-[6px] p-2 outline-custom-secondarycolor",
        },
      },
      {
        id: "email",
        type: "email",
        placeholder: "بريدك الإلكتروني",
        required: true,
        style: {
          className: "border rounded-[6px] p-2 outline-custom-secondarycolor",
        },
      },
      {
        id: "message",
        type: "textarea",
        placeholder: "رسالتك",
        rows: 2,
        required: true,
        style: {
          className:
            "border rounded p-2 mb-[12px] outline-custom-secondarycolor",
        },
      },
    ],
    submitButton: {
      text: "إرسال",
      style: {
        className:
          "bg-custom-secondarycolor text-white rounded-[6px] w-full text-[14px] md:text-[20px] bg-emerald-700 hover:scale-105 transition duration-300 py-2 md:py-1",
      },
    },
  },
  styling: {
    title: {
      size: "text-[15px] md:text-[24px]",
      color: "text-custom-maincolor",
      weight: "font-normal",
    },
    layout: {
      detailsWidth: "w-full md:w-[35%]",
      formWidth: "w-full md:w-[50%]",
      gap: "gap-[16px] md:gap-[10px]",
    },
  },
});

// ContactFormSection store functions
export const contactFormSectionFunctions = {
  // Get default data
  getDefaultData: getDefaultContactFormSectionData,

  // Ensure variant exists
  ensureVariant: (
    state: any,
    variantId: string,
    initial?: ComponentData,
  ): any => {
    // Priority 1: Check if variant already exists
    const currentData = state.contactFormSectionStates?.[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          contactFormSectionStates: {
            ...state.contactFormSectionStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    // Priority 2: Use provided initial data, else tempData, else defaults
    const defaultData = initial || state.tempData || getDefaultContactFormSectionData();

    return {
      contactFormSectionStates: {
        ...state.contactFormSectionStates,
        [variantId]: defaultData,
      },
    };
  },

  // Get data
  getData: (state: any, variantId: string): ComponentData => {
    return (
      state.contactFormSectionStates?.[variantId] ||
      getDefaultContactFormSectionData()
    );
  },

  // Set data
  setData: (state: any, variantId: string, newData: ComponentData): any => {
    return {
      contactFormSectionStates: {
        ...state.contactFormSectionStates,
        [variantId]: newData,
      },
    };
  },

  // Update title
  updateTitle: (currentData: ComponentData, title: string): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      title,
    },
  }),

  // Add social link
  addSocialLink: (currentData: ComponentData, link: any): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      socialLinks: [...(currentData.content?.socialLinks || []), link],
    },
  }),

  // Remove social link
  removeSocialLink: (
    currentData: ComponentData,
    index: number,
  ): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      socialLinks: (currentData.content?.socialLinks || []).filter(
        (_: any, i: number) => i !== index,
      ),
    },
  }),

  // Update social link
  updateSocialLink: (
    currentData: ComponentData,
    index: number,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      socialLinks: (currentData.content?.socialLinks || []).map(
        (link: any, i: number) =>
          i === index ? { ...link, ...updates } : link,
      ),
    },
  }),

  // Update form field
  updateFormField: (
    currentData: ComponentData,
    fieldId: string,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    form: {
      ...currentData.form,
      fields: (currentData.form?.fields || []).map((field: any) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    },
  }),

  // Update submit button
  updateSubmitButton: (
    currentData: ComponentData,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    form: {
      ...currentData.form,
      submitButton: {
        ...currentData.form?.submitButton,
        ...updates,
      },
    },
  }),

  // Update layout
  updateLayout: (currentData: ComponentData, layout: any): ComponentData => ({
    ...currentData,
    layout: {
      ...currentData.layout,
      ...layout,
    },
  }),

  // Update styling
  updateStyling: (currentData: ComponentData, styling: any): ComponentData => ({
    ...currentData,
    styling: {
      ...currentData.styling,
      ...styling,
    },
  }),

  // Update data by path
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from contactFormSectionStates (saved data) or defaults
    const savedData =
      state.contactFormSectionStates?.[variantId] ||
      getDefaultContactFormSectionData();

    // Merge saved data with existing tempData to preserve all changes
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };

    // Update the specific path in the merged data
    const newData = updateDataByPath(baseData, path, value);

    // Return updated tempData ONLY
    // This ensures changes only appear after "Save Changes" button
    return {
      tempData: newData,
    } as any;
  },
};

