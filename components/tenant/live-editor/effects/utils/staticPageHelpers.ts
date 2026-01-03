import { isMultiLevelPage } from "@/lib/multiLevelPages";

/**
 * Returns the default component configuration for a static page
 * @param slug - The slug of the static page
 * @returns Default component configuration or null if not found
 */
export function getDefaultComponentForStaticPage(slug: string) {
  const defaults: Record<string, any> = {
    project: {
      id: "projectDetails1",
      type: "projectDetails",
      name: "Project Details",
      componentName: "projectDetails1",
      data: { projectSlug: "", visible: true },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    property: {
      id: "propertyDetail1",
      type: "propertyDetail",
      name: "Property Detail",
      componentName: "propertyDetail1",
      data: { propertySlug: "", visible: true },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    "property-requests/create": {
      id: "inputs2",
      type: "inputs2",
      name: "Inputs2",
      componentName: "inputs2",
      data: {
        id: "component",
        type: "unknown",
        visible: true,
        variant: "0",
        useStore: true,
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
          submitButtonGradient:
            "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
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
          apiEndpoint:
            "https://api.taearif.com/api/v1/property-requests/public",
        },
        cardsLayout: {
          columns: "1",
          gap: "24px",
          responsive: {
            mobile: "1",
            tablet: "1",
            desktop: "1",
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
        cards: [],
        cardVisibility: {
          contactCard: true,
          additionalDetailsCard: true,
          budgetCard: true,
          propertyInfoCard: true,
        },
        fieldVisibility: {
          propertyType: true,
          propertyCategory: true,
          purchaseGoal: true,
          similarOffers: true,
          fullName: true,
          notes: true,
          whatsapp: true,
          phone: true,
          seriousness: true,
          budgetTo: true,
          budgetFrom: true,
          purchaseMethod: true,
          areaTo: true,
          areaFrom: true,
          district: true,
          city: true,
        },
      },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    "create-request": {
      id: "inputs2",
      type: "inputs2",
      name: "Inputs2",
      componentName: "inputs2",
      data: {
        id: "component",
        type: "unknown",
        visible: true,
        variant: "0",
        useStore: true,
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
          submitButtonGradient:
            "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
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
          apiEndpoint:
            "https://api.taearif.com/api/v1/property-requests/public",
        },
        cardsLayout: {
          columns: "1",
          gap: "24px",
          responsive: {
            mobile: "1",
            tablet: "1",
            desktop: "1",
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
                  { value: "14", label: "آخرى" },
                  { value: "4", label: "أرض" },
                  { value: "7", label: "استراحة" },
                  { value: "13", label: "دور في فيلا" },
                  { value: "18", label: "شقة" },
                  { value: "2", label: "شقة في برج" },
                  { value: "3", label: "شقة في عمارة" },
                  { value: "17", label: "شقة في فيلا" },
                  { value: "15", label: "عمارة" },
                  { value: "1", label: "فيلا" },
                  { value: "5", label: "قصر" },
                  { value: "12", label: "عمارة" },
                  { value: "8", label: "محل تجاري" },
                  { value: "6", label: "مزرعة" },
                  { value: "11", label: "معرض" },
                  { value: "9", label: "مكتب" },
                  { value: "10", label: "منتجع" },
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
                  { value: "زراعي", label: "زراعي" },
                  { value: "صناعي", label: "صناعي" },
                  { value: "تجاري", label: "تجاري" },
                  { value: "سكني", label: "سكني" },
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
                  { value: "كاش", label: "كاش" },
                  { value: "تمويل بنكي", label: "تمويل بنكي" },
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
                  { value: "مستعد فورًا", label: "مستعد فورًا" },
                  { value: "خلال شهر", label: "خلال شهر" },
                  { value: "خلال 3 أشهر", label: "خلال 3 أشهر" },
                  { value: "لاحقًا / استكشاف فقط", label: "لاحقًا / استكشاف فقط" },
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
                  { value: "سكن خاص", label: "سكن خاص" },
                  { value: "استثمار وتأجير", label: "استثمار وتأجير" },
                  { value: "بناء وبيع", label: "بناء وبيع" },
                  { value: "مشروع تجاري", label: "مشروع تجاري" },
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
                  { value: "نعم", label: "نعم" },
                  { value: "لا", label: "لا" },
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
                  { value: "نعم", label: "نعم" },
                  { value: "لا", label: "لا" },
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
        cardVisibility: {
          contactCard: true,
          additionalDetailsCard: true,
          budgetCard: true,
          propertyInfoCard: true,
        },
        fieldVisibility: {
          propertyType: true,
          propertyCategory: true,
          purchaseGoal: true,
          similarOffers: true,
          fullName: true,
          notes: true,
          whatsapp: true,
          phone: true,
          seriousness: true,
          budgetTo: true,
          budgetFrom: true,
          purchaseMethod: true,
          areaTo: true,
          areaFrom: true,
          district: true,
          city: true,
        },
      },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
    // يمكن إضافة صفحات ثابتة أخرى لاحقاً
    // products: { ... },
    // checkout: { ... },
  };

  return defaults[slug] || null;
}

/**
 * Checks if a page is a static page based on tenantData or editorStore
 * @param slug - The slug of the page to check
 * @param tenantData - Tenant data from getTenant
 * @param editorStore - Editor store instance
 * @returns true if the page is a static page, false otherwise
 */
export function isStaticPage(
  slug: string,
  tenantData: any,
  editorStore: any,
): boolean {
  if (!slug) return false;

  // ⭐ NEW: Check if page is a multi-level page (like "property", "project")
  // These pages should always be treated as static pages, even if no data exists
  if (isMultiLevelPage(slug)) {
    return true;
  }

  // Check if page exists in tenantData.StaticPages
  // Handle both formats: [slug, components] or { slug, components }
  const staticPageFromTenant = tenantData?.StaticPages?.[slug];
  if (staticPageFromTenant) {
    // Format 1: Array [slug, components]
    if (
      Array.isArray(staticPageFromTenant) &&
      staticPageFromTenant.length === 2
    ) {
      return true;
    }
    // Format 2: Object { slug, components }
    if (
      typeof staticPageFromTenant === "object" &&
      !Array.isArray(staticPageFromTenant)
    ) {
      return true;
    }
  }

  // Check if page exists in editorStore.staticPagesData
  const staticPageData = editorStore.getStaticPageData(slug);
  if (staticPageData) {
    return true;
  }

  // ⭐ FALLBACK: Check if default component exists for this slug
  // This ensures newly added static pages are recognized even if not in tenantData or store
  const defaultComponent = getDefaultComponentForStaticPage(slug);
  if (defaultComponent) {
    return true;
  }

  return false;
}

/**
 * Converts static page components to the format expected by setPageComponents
 * @param components - Array of components from static page
 * @param slug - The slug of the static page
 * @returns Formatted components array
 */
export function formatStaticPageComponents(
  components: any[],
  slug: string,
): any[] {
  const defaultComponent = getDefaultComponentForStaticPage(slug);

  return components.map((comp: any) => {
    // Use componentName as id if it exists (for static pages, id should match componentName)
    const finalId =
      comp.componentName || comp.id || defaultComponent?.id || `${slug}1`;

    return {
      id: finalId, // ⭐ FIX: Use componentName as id to match variantId in states
      type: comp.type || defaultComponent?.type || slug,
      name: comp.name || defaultComponent?.name || slug,
      componentName:
        comp.componentName || defaultComponent?.componentName || `${slug}1`,
      data: comp.data || defaultComponent?.data || {},
      position: comp.position || 0,
      layout: comp.layout || { row: 0, col: 0, span: 2 },
      forceUpdate: comp.forceUpdate || 0,
    };
  });
}
