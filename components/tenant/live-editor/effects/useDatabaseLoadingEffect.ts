import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib/types";
import { createDefaultData } from "../EditorSidebar/utils";
import { getComponentDisplayName } from "@/services/live-editor";
import {
  getDefaultComponentForStaticPage,
  isStaticPage,
  formatStaticPageComponents,
} from "./utils/staticPageHelpers";
import {
  extractComponentType,
  createComponentFromDbData,
} from "./utils/componentTypeHelpers";

interface UseDatabaseLoadingEffectProps {
  initialized: boolean;
  authLoading: boolean;
  tenantLoading: boolean;
  tenantData: any;
  slug: string;
  setPageComponents: (
    components:
      | ComponentInstance[]
      | ((prev: ComponentInstance[]) => ComponentInstance[]),
  ) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useDatabaseLoadingEffect = ({
  initialized,
  authLoading,
  tenantLoading,
  tenantData,
  slug,
  setPageComponents,
  setInitialized,
}: UseDatabaseLoadingEffectProps) => {
  // Database Loading Effect
  useEffect(() => {
    // Always load data into editorStore when tenantData is available
    const editorStore = useEditorStore.getState();

    // Check if this is a static page
    const pageIsStatic = isStaticPage(slug, tenantData, editorStore);

    // For static pages, always check even if initialized
    const shouldLoad = pageIsStatic
      ? !authLoading && !tenantLoading && tenantData
      : !initialized && !authLoading && !tenantLoading && tenantData;

    if (shouldLoad) {
      // ⭐ CRITICAL: Check if theme was recently changed
      // If themeChangeTimestamp > 0, prioritize pageComponentsByPage from store
      // over tenantData.componentSettings to avoid loading old theme data
      const themeChangeTimestamp = editorStore.themeChangeTimestamp;
      const hasRecentThemeChange = themeChangeTimestamp > 0;

      // ⭐ PRIORITY LOGIC: Check store first before loading from tenantData
      // This prevents overwriting recent changes (after save) with old tenantData
      const storePageComponents = editorStore.pageComponentsByPage[slug];

      if (storePageComponents && storePageComponents.length > 0) {
        // Store already has data - use it instead of tenantData to avoid overwriting recent changes
        setPageComponents(storePageComponents);
        setInitialized(true);
        return; // Skip loading from tenantData
      }

      // Load data into editorStore (only if store doesn't have data for this page)
      editorStore.loadFromDatabase(tenantData);

      // Re-check store after loadFromDatabase (in case it was updated)
      const storePageComponentsAfterLoad =
        editorStore.pageComponentsByPage[slug];

      // ⭐ STATIC PAGES: Load with priority from tenantData.StaticPages
      if (pageIsStatic) {
        // ⭐ PRIORITY 0: If theme was recently changed, prioritize staticPagesData from store
        // This ensures we use the new theme data instead of old tenantData.StaticPages
        if (hasRecentThemeChange) {
          const staticPageDataFromStore = editorStore.getStaticPageData(slug);
          const staticPageComponentsFromStore =
            staticPageDataFromStore?.components || [];

          if (staticPageComponentsFromStore.length > 0) {
            const staticComponents = formatStaticPageComponents(
              staticPageComponentsFromStore,
              slug,
            );

            setPageComponents(staticComponents);
            setInitialized(true);
            return; // Skip further loading logic
          }
        }

        // ⭐ PRIORITY 1: Check tenantData.StaticPages[slug] first (from getTenant)
        // ⭐ CRITICAL: Skip tenantData.StaticPages if theme was recently changed
        // This ensures we use the new theme data from staticPagesData instead of old database data
        if (!hasRecentThemeChange) {
          const staticPageFromTenant = tenantData?.StaticPages?.[slug];

          // Handle different formats: [slug, components] or { slug, components }
          let tenantComponents: any[] = [];

          if (staticPageFromTenant) {
            // Format 1: Array format [slug, components]
            if (
              Array.isArray(staticPageFromTenant) &&
              staticPageFromTenant.length === 2
            ) {
              tenantComponents = Array.isArray(staticPageFromTenant[1])
                ? staticPageFromTenant[1]
                : [];
            }
            // Format 2: Object format { slug, components }
            else if (
              typeof staticPageFromTenant === "object" &&
              !Array.isArray(staticPageFromTenant)
            ) {
              tenantComponents = Array.isArray(staticPageFromTenant.components)
                ? staticPageFromTenant.components
                : [];
            }
          }

          const hasStaticPageInTenant = tenantComponents.length > 0;

          if (hasStaticPageInTenant) {
            // Convert static page components to the format expected by setPageComponents
            const staticComponents = formatStaticPageComponents(
              tenantComponents,
              slug,
            );

            setPageComponents(staticComponents);
            setInitialized(true);
            return; // Skip further loading logic
          }
        }

        // ⭐ PRIORITY 2: Check editorStore.staticPagesData[slug] (after loadFromDatabase)
        let staticPageData = editorStore.getStaticPageData(slug);
        let staticPageComponents = staticPageData?.components || [];

        // ⭐ PRIORITY 3: If no components, add default component
        if (staticPageComponents.length === 0) {
          const defaultComponent = getDefaultComponentForStaticPage(slug);

          if (defaultComponent) {
            // Add to staticPagesData
            editorStore.setStaticPageData(slug, {
              slug,
              components: [defaultComponent],
            });

            // Re-read staticPageData after adding
            staticPageData = editorStore.getStaticPageData(slug);
            staticPageComponents = staticPageData?.components || [];
          } else {
            console.warn(
              "⚠️ No default component found for static page:",
              slug,
            );
          }
        }

        // Load components from staticPagesData
        if (staticPageComponents.length > 0) {
          // Convert static page components to the format expected by setPageComponents
          const staticComponents = formatStaticPageComponents(
            staticPageComponents,
            slug,
          );

          setPageComponents(staticComponents);
          setInitialized(true);
          return; // Skip regular page loading logic
        }
      }

      if (hasRecentThemeChange && storePageComponentsAfterLoad !== undefined) {
        // Theme was recently changed - use store data (new theme) instead of tenantData (old theme)
        setPageComponents(storePageComponentsAfterLoad || []);
      } else if (
        tenantData?.componentSettings?.[slug] &&
        Object.keys(tenantData.componentSettings[slug]).length > 0
      ) {
        const pageSettings = tenantData.componentSettings[slug];
        const dbComponents = Object.entries(pageSettings).map(
          ([id, comp]: [string, any]) => {
            // استعادة النوع الصحيح من componentName أو id إذا كان type غير صحيح
            const correctType = extractComponentType(comp);

            return createComponentFromDbData(
              id,
              comp,
              correctType,
              getComponentDisplayName,
              createDefaultData,
            );
          },
        );

        // التحقق من وجود تخطيطات متضاربة وإعادة بنائها إذا لزم الأمر
        const hasLayoutInfo = dbComponents.every(
          (c) => c.layout && c.layout.span,
        );
        if (!hasLayoutInfo) {
          // إذا كانت البيانات قديمة ولا تحتوي على تخطيط، قم ببناء تخطيط افتراضي
          dbComponents.sort((a, b) => a.position - b.position);
          dbComponents.forEach((comp, index) => {
            comp.layout = { row: index, col: 0, span: 2 };
            comp.position = index; // تحديث position أيضاً
          });
        }
        setPageComponents(dbComponents as ComponentInstance[]);
      } else {
        // ⭐ FALLBACK: If no tenantData and no store data, check store first
        // This handles the case where theme was changed but tenantData wasn't updated yet
        if (storePageComponentsAfterLoad !== undefined) {
          console.log("🔄 No tenantData for page, using store data:", {
            slug,
            componentCount: storePageComponentsAfterLoad.length,
          });
          setPageComponents(storePageComponentsAfterLoad || []);
        } else {
          // استيراد createInitialComponents من الخدمة
          const {
            createInitialComponents,
          } = require("@/services/live-editor");
          setPageComponents(createInitialComponents(slug));
        }
      }

      // Initialize default inputs2 data in editorStore if no inputs2 components exist
      const hasInputs2InStore =
        Object.keys(editorStore.inputs2States || {}).length > 0;

      if (!hasInputs2InStore) {
        console.log(
          "🔍 No inputs2 data in editorStore, initializing default inputs2 data",
        );
        const {
          getDefaultInputs2Data,
        } = require("@/context/editorStoreFunctions/inputs2Functions");
        const defaultInputs2Data = getDefaultInputs2Data();

        editorStore.ensureComponentVariant(
          "inputs2",
          "inputs2-default",
          defaultInputs2Data,
        );
        console.log("✅ Default inputs2 data initialized in editorStore");
      }

      setInitialized(true);
    }
  }, [
    initialized,
    authLoading,
    tenantLoading,
    tenantData,
    slug,
    setPageComponents,
    setInitialized,
  ]);
};
