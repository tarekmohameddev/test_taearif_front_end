import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

// Helper function to find the first header in componentSettings
const findFirstHeader = (componentSettings) => {
  if (!componentSettings) return null;

  for (const pageName in componentSettings) {
    const page = componentSettings[pageName];
    for (const componentId in page) {
      const component = page[componentId];
      if (
        component.type === "header" &&
        component.componentName === "header1"
      ) {
        return { id: componentId, data: component.data };
      }
    }
  }
  return null;
};

// Helper function to find the first footer in componentSettings
const findFirstFooter = (componentSettings) => {
  if (!componentSettings) return null;

  for (const pageName in componentSettings) {
    const page = componentSettings[pageName];
    for (const componentId in page) {
      const component = page[componentId];
      if (
        component.type === "footer" &&
        component.componentName === "footer1"
      ) {
        return { id: componentId, data: component.data };
      }
    }
  }
  return null;
};

const useTenantStore = create((set) => ({
  tenantData: null,
  loadingTenantData: false,
  error: null,
  tenant: null,
  tenantId: null,
  lastFetchedWebsite: null,
  setTenant: (tenant) => set({ tenant }),
  setTenantId: (tenantId) => set({ tenantId }),
  updateHeader: (headerData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              header: {
                ...state.tenantData.componentSettings?.header,
                data: headerData,
              },
            },
          }
        : state.tenantData,
    })),
  updateHeaderVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              header: {
                ...state.tenantData.componentSettings?.header,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updateHero: (heroData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              hero: {
                ...state.tenantData.componentSettings?.hero,
                data: heroData,
              },
            },
          }
        : state.tenantData,
    })),
  updateHeroVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              hero: {
                ...state.tenantData.componentSettings?.hero,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  saveHeroChanges: (heroData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              hero: {
                ...state.tenantData.componentSettings?.hero,
                data: heroData,
              },
            },
          }
        : state.tenantData,
    })),
  updateFooter: (footerData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              footer: {
                ...state.tenantData.componentSettings?.footer,
                data: footerData,
              },
            },
          }
        : state.tenantData,
    })),
  updateFooterVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              footer: {
                ...state.tenantData.componentSettings?.footer,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage: (halfTextHalfImageData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage: {
                ...state.tenantData.componentSettings?.halfTextHalfImage,
                data: halfTextHalfImageData,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImageVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage: {
                ...state.tenantData.componentSettings?.halfTextHalfImage,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage2: (halfTextHalfImage2Data) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage2: {
                ...state.tenantData.componentSettings?.halfTextHalfImage2,
                data: halfTextHalfImage2Data,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage2Variant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage2: {
                ...state.tenantData.componentSettings?.halfTextHalfImage2,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage3: (halfTextHalfImage3Data) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage3: {
                ...state.tenantData.componentSettings?.halfTextHalfImage3,
                data: halfTextHalfImage3Data,
              },
            },
          }
        : state.tenantData,
    })),
  updatehalfTextHalfImage3Variant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              halfTextHalfImage3: {
                ...state.tenantData.componentSettings?.halfTextHalfImage3,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updateCtaValuation: (ctaValuationData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              ctaValuation: {
                ...state.tenantData.componentSettings?.ctaValuation,
                data: ctaValuationData,
              },
            },
          }
        : state.tenantData,
    })),
  updateCtaValuationVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              ctaValuation: {
                ...state.tenantData.componentSettings?.ctaValuation,
                variant,
              },
            },
          }
        : state.tenantData,
    })),

  fetchTenantData: async (websiteName) => {
    console.log("🔍 tenantStore.fetchTenantData - Called with:", {
      websiteName,
      timestamp: new Date().toISOString(),
    });

    const state = useTenantStore.getState();

    console.log("🔍 tenantStore.fetchTenantData - Current state:", {
      loadingTenantData: state.loadingTenantData,
      hasTenantData: !!state.tenantData,
      tenantDataUsername: state.tenantData?.username,
      lastFetchedWebsite: state.lastFetchedWebsite,
      usernameMatches: state.tenantData?.username === websiteName,
      lastFetchedMatches: state.lastFetchedWebsite === websiteName,
    });

    // Prevent duplicate requests - تحقق من أن البيانات موجودة ونفس الـ username
    if (
      state.loadingTenantData ||
      (state.tenantData && state.tenantData.username === websiteName)
    ) {
      console.log("❌ tenantStore.fetchTenantData - Skipping (duplicate prevention):", {
        reason: state.loadingTenantData
          ? "Already loading"
          : "Tenant data exists with same username",
        loadingTenantData: state.loadingTenantData,
        existingUsername: state.tenantData?.username,
        requestedWebsiteName: websiteName,
      });
      return;
    }

    // منع الـ duplicate calls إذا كان نفس الـ websiteName
    if (state.lastFetchedWebsite === websiteName) {
      console.log("❌ tenantStore.fetchTenantData - Skipping (already fetched):", {
        lastFetchedWebsite: state.lastFetchedWebsite,
        requestedWebsiteName: websiteName,
      });
      return;
    }

    console.log("✅ tenantStore.fetchTenantData - Conditions met, making API call");
    set({ loadingTenantData: true, error: null });
    try {
      // إرسال websiteName كـ tenantId للـ API
      // في حالة Custom Domain: websiteName = "hey.com"
      // في حالة Subdomain: websiteName = "tenant1"
      console.log("🚀 tenantStore.fetchTenantData - API Request:", {
        url: "/v1/tenant-website/getTenant",
        method: "POST",
        body: { websiteName },
      });

      const response = await axiosInstance.post(
        "/v1/tenant-website/getTenant",
        { websiteName },
      );

      console.log("✅ tenantStore.fetchTenantData - API Response:", {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        hasComponentSettings: !!response.data?.componentSettings,
        componentSettingsKeys: response.data?.componentSettings
          ? Object.keys(response.data.componentSettings)
          : [],
      });
      if (response.status === 404) {
        throw new Error("Tenant not found");
      } else if (response.status === 204) {
        throw new Error("No content available for this tenant");
      }

      const data = response.data || {}; // If response is empty, use an empty object

      console.log("🔍 tenantStore.fetchTenantData - Processing response data:", {
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        dataSize: data ? Object.keys(data).length : 0,
      });

      // تحقق من أن البيانات ليست فارغة
      if (!data || Object.keys(data).length === 0) {
        console.warn("⚠️ tenantStore.fetchTenantData - Empty data, using defaults:", {
          websiteName,
        });
        // بدلاً من رمي خطأ، استخدم بيانات افتراضية
        const defaultData = {
          username: websiteName,
          globalComponentsData: {
            header: {},
            footer: {},
            hero: {},
            halfTextHalfImage: {},
            halfTextHalfImage2: {},
            halfTextHalfImage3: {},
            propertySlider: {},
            ctaValuation: {},
            grid: {},
            filterButtons: {},
            propertyFilter: {},
          },
        };
        set({
          tenantData: defaultData,
          loadingTenantData: false,
          lastFetchedWebsite: websiteName,
        });
        console.log("✅ tenantStore.fetchTenantData - Default data set");
        return;
      }

      // Load global components data into editor store
      const { useEditorStore } = await import("./editorStore");
      const editorStore = useEditorStore.getState();

      // If globalComponentsData exists in backend, use it
      if (data.globalComponentsData) {
        editorStore.setGlobalComponentsData(data.globalComponentsData);

        // Also set individual global components for backward compatibility
        if (data.globalComponentsData.header) {
          editorStore.setGlobalHeaderData(data.globalComponentsData.header);
        }
        if (data.globalComponentsData.footer) {
          editorStore.setGlobalFooterData(data.globalComponentsData.footer);
        }
      } else {
        // If no globalComponentsData, use default data instead of creating from componentSettings
        // Don't set anything - let the component use its default data
      }

      // Load WebsiteLayout data into editor store
      if (
        data.WebsiteLayout &&
        data.WebsiteLayout.metaTags &&
        data.WebsiteLayout.metaTags.pages
      ) {
        editorStore.setWebsiteLayout(data.WebsiteLayout);
      }

      // ⭐ CRITICAL: Load StaticPages data into editor store
      // Convert StaticPages format [slug, components, apiEndpoints] to staticPagesData format
      if (data.StaticPages && typeof data.StaticPages === "object") {
        const convertedStaticPages = {};

        Object.entries(data.StaticPages).forEach(
          ([pageSlug, pageData]) => {
            // Handle Array format: [slug, components, apiEndpoints]
            if (Array.isArray(pageData) && pageData.length >= 2) {
              const slug = pageData[0] || pageSlug;
              const components = Array.isArray(pageData[1]) ? pageData[1] : [];
              const apiEndpoints = pageData[2] || {};

              convertedStaticPages[pageSlug] = {
                slug,
                components,
                apiEndpoints,
              };
            }
            // Handle Object format: { slug, components, apiEndpoints }
            else if (
              typeof pageData === "object" &&
              !Array.isArray(pageData)
            ) {
              convertedStaticPages[pageSlug] = {
                slug: pageData.slug || pageSlug,
                components: Array.isArray(pageData.components)
                  ? pageData.components
                  : [],
                apiEndpoints: pageData.apiEndpoints || {},
              };
            }
          },
        );

        // Load each static page into editorStore
        Object.entries(convertedStaticPages).forEach(([slug, pageData]) => {
          editorStore.setStaticPageData(slug, pageData);
        });

      }

      console.log("✅ tenantStore.fetchTenantData - Setting tenantData in store:", {
        username: data.username,
        hasComponentSettings: !!data.componentSettings,
        componentSettingsKeys: data.componentSettings
          ? Object.keys(data.componentSettings)
          : [],
        hasStaticPages: !!data.StaticPages,
        staticPagesKeys: data.StaticPages ? Object.keys(data.StaticPages) : [],
      });

      set({
        tenantData: data,
        loadingTenantData: false,
        lastFetchedWebsite: websiteName,
      });

      console.log("✅ tenantStore.fetchTenantData - Store updated successfully");
    } catch (error) {
      console.error("❌ tenantStore.fetchTenantData - Error:", {
        error: error.message,
        errorStack: error.stack,
        websiteName,
      });
      set({ error: error.message, loadingTenantData: false });
    }
  },

  saveHeaderChanges: async (tenantId, headerData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          headerData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save header changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  saveHeroChanges: async (tenantId, heroData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          heroData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  saveFooterChanges: async (tenantId, footerData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          footerData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save footer changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  savehalfTextHalfImageChanges: async (
    tenantId,
    halfTextHalfImageData,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/halfTextHalfImage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          halfTextHalfImageData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save half text half image changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  savehalfTextHalfImage2Changes: async (
    tenantId,
    halfTextHalfImage2Data,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/halfTextHalfImage2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          halfTextHalfImage2Data,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save half text half image2 changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
  savehalfTextHalfImage3Changes: async (
    tenantId,
    halfTextHalfImage3Data,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/halfTextHalfImage3", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          halfTextHalfImage3Data,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save half text half image3 changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },

  savePropertySliderChanges: async (tenantId, propertySliderData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/propertySlider", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          propertySliderData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save property slider changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },

  saveCtaValuationChanges: async (tenantId, ctaValuationData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/ctaValuation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          ctaValuationData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save cta valuation changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },

  // Grid functions
  updateGrid: (gridData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              grid: {
                ...state.tenantData.componentSettings?.grid,
                data: gridData,
              },
            },
          }
        : state.tenantData,
    })),
  updateGridVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              grid: {
                ...state.tenantData.componentSettings?.grid,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  saveGridChanges: async (tenantId, gridData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/grid", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          gridData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save grid changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },

  // Filter Buttons functions
  updateFilterButtons: (filterButtonsData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              filterButtons: {
                ...state.tenantData.componentSettings?.filterButtons,
                data: filterButtonsData,
              },
            },
          }
        : state.tenantData,
    })),
  updateFilterButtonsVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              filterButtons: {
                ...state.tenantData.componentSettings?.filterButtons,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  saveFilterButtonsChanges: async (tenantId, filterButtonsData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/filterButtons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          filterButtonsData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save filter buttons changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },

  // Property Filter functions
  updatePropertyFilter: (propertyFilterData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              propertyFilter: {
                ...state.tenantData.componentSettings?.propertyFilter,
                data: propertyFilterData,
              },
            },
          }
        : state.tenantData,
    })),
  updateApplicationForm: (applicationFormData) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              applicationForm: {
                ...state.tenantData.componentSettings?.applicationForm,
                data: applicationFormData,
              },
            },
          }
        : state.tenantData,
    })),
  updatePropertyFilterVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              propertyFilter: {
                ...state.tenantData.componentSettings?.propertyFilter,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  updateApplicationFormVariant: (variant) =>
    set((state) => ({
      tenantData: state.tenantData
        ? {
            ...state.tenantData,
            componentSettings: {
              ...state.tenantData.componentSettings,
              applicationForm: {
                ...state.tenantData.componentSettings?.applicationForm,
                variant,
              },
            },
          }
        : state.tenantData,
    })),
  savePropertyFilterChanges: async (tenantId, propertyFilterData, variant) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/propertyFilter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          propertyFilterData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save property slider changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },

  saveApplicationFormChanges: async (
    tenantId,
    applicationFormData,
    variant,
  ) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    let userData;
    try {
      const authModule = await import("../context/AuthContext");
      const useAuthStore = authModule.default;
      userData = useAuthStore.getState().userData;
      if (!userData?.token) {
        return false;
      }
    } catch (error) {
      return false;
    }

    try {
      const response = await fetch("/api/tenant/applicationForm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          tenantId,
          applicationFormData,
          variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save application form changes");
      }

      const updatedTenant = await response.json();
      set((state) => ({
        tenantData: updatedTenant,
      }));

      return true;
    } catch (error) {
      return false;
    }
  },
}));

export default useTenantStore;
