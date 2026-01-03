import { ComponentInstance } from "@/lib/types";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { createDefaultData } from "@/components/tenant/live-editor/EditorSidebar/utils";

// دالة مزامنة الحالة مع المحرر
export const syncStateWithEditor = (
  slug: string,
  pageComponents: ComponentInstance[],
) => {
  useEditorStore.getState().setPageComponentsForPage(slug, pageComponents);
};

// دالة تحميل البيانات من قاعدة البيانات
export const loadDataFromDatabase = (
  tenantData: any,
  slug: string,
  setInitialized: (value: boolean) => void,
) => {
  // Load data into editorStore
  useEditorStore.getState().loadFromDatabase(tenantData);
  setInitialized(true);
};

// دالة إعادة تعيين المكون في الحالة
export const resetComponentInState = (
  componentId: string,
  pageComponents: ComponentInstance[],
) => {
  // Clear component state from store
  const store = useEditorStore.getState();
  const resetComponent = pageComponents.find((c) => c.id === componentId);
  if (resetComponent) {
    const defaultData = createDefaultData(resetComponent.type);
    switch (resetComponent.type) {
      case "hero":
        store.setHeroData(resetComponent.componentName, defaultData);
        break;
      case "header":
        store.setHeaderData(resetComponent.componentName, defaultData);
        break;
      case "halfTextHalfImage":
        store.sethalfTextHalfImageData(
          resetComponent.componentName,
          defaultData,
        );
        break;
      case "propertySlider":
        store.setPropertySliderData(resetComponent.componentName, defaultData);
        break;
      case "ctaValuation":
        store.setCtaValuationData(resetComponent.componentName, defaultData);
        break;
    }
  }

  // Clear temp data
  store.setTempData({});
};

// دالة حذف الصفحة من الحالة
export const deletePageFromState = (slug: string) => {
  // Remove page from editorStore
  const store = useEditorStore.getState();
  store.deletePage(slug);

  // Remove page from tenantStore componentSettings
  const { tenantData } = useTenantStore.getState();
  if (tenantData?.componentSettings) {
    const updatedComponentSettings = { ...tenantData.componentSettings };
    delete updatedComponentSettings[slug];

    useTenantStore.setState({
      tenantData: {
        ...tenantData,
        componentSettings: updatedComponentSettings,
      },
    });
  }
};

// دالة تحديث المكونات المسجلة
export const updateRegisteredComponents = (
  tenant: any,
  defaultComponents: any,
  setRegisteredComponents: (components: Record<string, any>) => void,
) => {
  const componentsMap: Record<string, any> = {};

  Object.entries(defaultComponents).forEach(([section, components]) => {
    componentsMap[section] = components;
  });

  if (tenant?.componentSettings) {
    Object.entries(tenant.componentSettings).forEach(
      ([section, components]) => {
        if (typeof components === "object" && components !== null) {
          componentsMap[section] = {
            ...(componentsMap[section] || {}),
            ...components,
          };
        }
      },
    );
  }

  setRegisteredComponents(componentsMap);
};

// دالة التحقق من الصفحات المعرفة مسبقاً
export const isPredefinedPage = (
  slug: string,
  pageDefinitions: Record<string, any>,
) => {
  return Object.keys(pageDefinitions).includes(slug);
};

// دالة الحصول على عنوان الصفحة
export const getPageTitle = (slug: string) => {
  if (slug === "homepage") return "Homepage";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

// دالة إدارة حالة الشريط الجانبي
export const manageSidebarState = {
  openMain: (
    setSidebarView: (view: "main" | "add-section" | "edit-component") => void,
    setSelectedComponentId: (id: string | null) => void,
    setSidebarOpen: (open: boolean) => void,
  ) => {
    setSidebarView("main");
    setSelectedComponentId(null);
    setSidebarOpen(true);
  },

  openAddSection: (
    setSidebarView: (view: "main" | "add-section" | "edit-component") => void,
    setSidebarOpen: (open: boolean) => void,
  ) => {
    setSidebarView("add-section");
    setSidebarOpen(true);
  },

  openEditComponent: (
    componentId: string,
    setSelectedComponentId: (id: string | null) => void,
    setSidebarView: (view: "main" | "add-section" | "edit-component") => void,
    setSidebarOpen: (open: boolean) => void,
  ) => {
    setSelectedComponentId(componentId);
    setSidebarView("edit-component");
    setSidebarOpen(true);
  },

  close: (setSidebarOpen: (open: boolean) => void) => {
    setSidebarOpen(false);
  },
};

// دالة إدارة حالة الحوارات
export const manageDialogState = {
  openDeleteComponent: (
    componentId: string,
    setComponentToDelete: (id: string | null) => void,
    setDeleteDialogOpen: (open: boolean) => void,
  ) => {
    setComponentToDelete(componentId);
    setDeleteDialogOpen(true);
  },

  closeDeleteComponent: (
    setDeleteDialogOpen: (open: boolean) => void,
    setComponentToDelete: (id: string | null) => void,
  ) => {
    setDeleteDialogOpen(false);
    setComponentToDelete(null);
  },

  openDeletePage: (setDeletePageDialogOpen: (open: boolean) => void) => {
    setDeletePageDialogOpen(true);
  },

  closeDeletePage: (
    setDeletePageDialogOpen: (open: boolean) => void,
    setDeletePageConfirmation: (text: string) => void,
  ) => {
    setDeletePageDialogOpen(false);
    setDeletePageConfirmation("");
  },
};

// دالة إدارة حالة السحب
export const manageDragState = {
  start: (activeId: string, setActiveId: (id: string | null) => void) => {
    setActiveId(activeId);
  },

  end: (
    setActiveId: (id: string | null) => void,
    setDropIndicator: (indicator: any) => void,
  ) => {
    setActiveId(null);
    setDropIndicator(null);
  },
};

// دالة التحقق من صحة المستخدم
export const validateUser = (user: any, authLoading: boolean, router: any) => {
  if (!authLoading && !user) {
    router.push("/login");
    return false;
  }
  return true;
};

// دالة تهيئة البيانات الأولية
export const initializeData = (
  tenantId: string,
  fetchTenantData: (id: string) => void,
) => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
};
