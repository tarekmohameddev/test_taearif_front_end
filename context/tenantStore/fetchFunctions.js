import axiosInstance from "@/lib/axiosInstance";

// Fetch tenant data function
export const createFetchFunctions = (set, get) => ({
  fetchTenantData: async (websiteName) => {
    const state = get();

    if (state.loadingTenantData) {
      return;
    }

    if (
      state.tenantData &&
      state.tenantData.username === websiteName &&
      state.tenantId === websiteName
    ) {
      return;
    }

    if (state.lastFetchedWebsite === websiteName && state.tenantId === websiteName) {
      return;
    }

    set({ loadingTenantData: true, error: null });
    try {
      // إرسال websiteName كـ tenantId للـ API
      // في حالة Custom Domain: websiteName = "hey.com"
      // في حالة Subdomain: websiteName = "tenant1"

      const response = await axiosInstance.post(
        "/v1/tenant-website/getTenant",
        { websiteName },
      );

      if (response.status === 404) {
        throw new Error("Tenant not found");
      } else if (response.status === 204) {
        throw new Error("No content available for this tenant");
      }

      const data = response.data || {}; // If response is empty, use an empty object

      // تحقق من أن البيانات ليست فارغة
      if (!data || Object.keys(data).length === 0) {
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
        return;
      }

      // Load global components data into editor store
      const { useEditorStore } = await import("../editorStore");
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


      set({
        tenantData: data,
        loadingTenantData: false,
        lastFetchedWebsite: websiteName,
      });

    } catch (error) {
      set({ error: error.message, loadingTenantData: false });
    }
  },
});
