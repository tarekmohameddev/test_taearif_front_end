"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { notFound } from "next/navigation";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib/ComponentsList";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import Header1 from "@/components/tenant/header/header1";
import Header2 from "@/components/tenant/header/header2";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import Footer1 from "@/components/tenant/footer/footer1";
import Footer2 from "@/components/tenant/footer/footer2";
import PropertyDetail1 from "@/components/tenant/propertyDetail/propertyDetail1";
import PropertyDetail2 from "@/components/tenant/propertyDetail/propertyDetail2";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageDropdown } from "@/components/tenant/LanguageDropdown";
import { PAGE_DEFINITIONS } from "@/lib/defaultComponents";
import { SkeletonLoader } from "@/components/skeleton";
import {
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  HeroSkeleton2,
  FilterButtonsSkeleton1,
  GridSkeleton1,
  HalfTextHalfImageSkeleton1,
  ContactCardsSkeleton1,
} from "@/components/skeleton";
import { HeaderSkeleton } from "@/components/skeleton/HeaderSkeleton";
import {
  shouldCenterComponent,
  getCenterWrapperClasses,
  getCenterWrapperStyles,
} from "@/lib/ComponentsInCenter";
import { preloadTenantData, clearExpiredCache } from "@/lib/preload";
import GA4Provider from "@/components/GA4Provider";
import GTMProvider from "@/components/GTMProvider";
import { trackProjectView } from "@/lib/ga4-tracking";
import {
  isMultiLevelPage,
  getSlugPropertyName,
} from "@/lib/multiLevelPages";
import { getDefaultComponentForStaticPage } from "@/components/tenant/live-editor/effects/utils/staticPageHelpers";
import { normalizeComponentSettings } from "@/services/live-editor/componentSettingsHelper";

// ⭐ Cache للـ header components
const headerComponentsCache = new Map<string, any>();

// ⭐ Cache للـ footer components
const footerComponentsCache = new Map<string, any>();

// Load header component dynamically
const loadHeaderComponent = (componentName: string) => {
  if (!componentName) return null;

  // ⭐ Check cache first
  if (headerComponentsCache.has(componentName)) {
    return headerComponentsCache.get(componentName);
  }

  // Handle StaticHeader1 specially (no number suffix)
  if (componentName === "StaticHeader1") {
    const component = lazy(() =>
      import(`@/components/tenant/header/StaticHeader1`).catch(() => ({
        default: StaticHeader1,
      })),
    );
    headerComponentsCache.set(componentName, component);
    return component;
  }

  // ⭐ Direct import for known header components (more reliable than dynamic import)
  const headerComponentMap: Record<string, any> = {
    header1: Header1,
    header2: Header2,
  };

  if (headerComponentMap[componentName]) {
    // Wrap in lazy for Suspense compatibility
    const component = lazy(() =>
      Promise.resolve({ default: headerComponentMap[componentName] }),
    );
    headerComponentsCache.set(componentName, component);
    return component;
  }

  // Fallback to dynamic import for other header variants
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch(() => {
        return { default: StaticHeader1 };
      }),
    { ssr: false },
  );

  // ⭐ Cache the component
  headerComponentsCache.set(componentName, component);
  return component;
};

// Load footer component dynamically (same logic as header)
const loadFooterComponent = (componentName: string) => {
  if (!componentName) return null;

  // ⭐ Check cache first
  if (footerComponentsCache.has(componentName)) {
    return footerComponentsCache.get(componentName);
  }

  // Handle StaticFooter1 specially (no number suffix)
  if (componentName === "StaticFooter1") {
    const component = lazy(() =>
      import(`@/components/tenant/footer/StaticFooter1`).catch(() => ({
        default: StaticFooter1,
      })),
    );
    footerComponentsCache.set(componentName, component);
    return component;
  }

  // ⭐ Direct import for known footer components
  const footerComponentMap: Record<string, any> = {
    footer1: Footer1,
    footer2: Footer2,
  };

  if (footerComponentMap[componentName]) {
    const component = lazy(() =>
      Promise.resolve({ default: footerComponentMap[componentName] }),
    );
    footerComponentsCache.set(componentName, component);
    return component;
  }

  // Fallback to dynamic import for other footer variants
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch(() => {
        return { default: StaticFooter1 };
      }),
    { ssr: false },
  );

  footerComponentsCache.set(componentName, component);
  return component;
};

const loadComponent = (section: string, componentName: string) => {
  if (!componentName) return null;

  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  let baseName = match[1];
  const number = match[2];

  // ⭐ Handle special case: propertyDetail -> propertyDetail
  // Convert propertyDetail to propertyDetail to match COMPONENTS key
  if (
    baseName === "propertyDetail" ||
    baseName.toLowerCase() === "propertydetail"
  ) {
    baseName = "propertyDetail";
  }

  // استخدام القائمة المركزية للحصول على مسارات الأقسام
  const sectionPath = getSectionPath(section) || section;

  if (!sectionPath) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Component Loader] Invalid section: ${section} for component: ${componentName}`,
      );
    }
    return null;
  }

  // استخدام القائمة المركزية للحصول على مسارات المكونات الفرعية
  // ⭐ IMPORTANT: baseName should be "propertyDetail" (with capital P and D) to match COMPONENTS key
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    // استخدام fallback للمكونات غير المعروفة
    const fallbackPath = "hero"; // استخدام hero كـ fallback
    const fallbackFullPath = `${fallbackPath}/${componentName}`;

    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Component Loader] Unknown component type: ${baseName}, using fallback: ${fallbackFullPath}`,
      );
    }

    return lazy(() =>
      import(`@/components/tenant/${fallbackFullPath}`).catch(() => ({
        default: (props: any) => (
          <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg text-center">
            <div className="text-yellow-600 text-lg font-semibold mb-2">
              Unknown Component: {baseName}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              Component file: {componentName} (fallback: {fallbackFullPath})
            </div>
            <div className="text-xs text-gray-500">
              This component type is not recognized. Using fallback.
            </div>
          </div>
        ),
      })),
    );
  }

  // جميع المكونات الآن مستقلة في مجلدات خاصة بها
  // Handle special case for propertyDetail components (propertyDetail1 -> propertyDetail1, propertyDetail1 -> propertyDetail1)
  let fileName = componentName;
  if (
    baseName === "propertyDetail" ||
    baseName.toLowerCase() === "propertydetail"
  ) {
    // Extract the number from componentName (e.g., "1" from "propertyDetail1" or "propertyDetail1")
    const number = componentName.match(/\d+$/)?.[0] || "";
    // Always construct as propertyDetail + number to ensure correct casing
    fileName = `propertyDetail${number}`;
  }
  const fullPath = `${subPath}/${fileName}`;

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Component Loader] Loading component: ${componentName} from path: ${fullPath}`,
    );
  }

  const component = lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[Component Loader] Failed to load component ${componentName} from ${fullPath}:`,
          error,
        );
      }
      return {
        default: () => (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-center">
            <div className="text-red-600 font-semibold mb-2">
              Component {componentName} not found
            </div>
            <div className="text-red-500 text-sm">Path: {fullPath}</div>
          </div>
        ),
      };
    }),
  );

  return component;
};

interface TenantPageWrapperProps {
  tenantId: string | null;
  slug: string;
  dynamicSlug?: string; // ⭐ NEW: For multi-level pages like project/[slug], property/[slug], etc.
  domainType?: "subdomain" | "custom";
}

export default function TenantPageWrapper({
  tenantId,
  slug,
  dynamicSlug,
  domainType = "subdomain",
}: TenantPageWrapperProps) {
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);
  const staticPagesData = useEditorStore((s) => s.staticPagesData);
  const getStaticPageData = useEditorStore((s) => s.getStaticPageData);

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    }
  }, [tenantId, setTenantId, domainType]);

  // تنظيف cache المنتهية الصلاحية عند تحميل المكون
  useEffect(() => {
    clearExpiredCache();
  }, []);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      // محاولة تحميل البيانات من cache أولاً
      const loadData = async () => {
        try {
          const cachedData = await preloadTenantData(tenantId);
          if (cachedData) {
            // إذا كانت البيانات موجودة في cache، استخدمها مباشرة
            return;
          }
        } catch (error) {}

        // إذا لم تكن البيانات في cache، جلبها من API
        fetchTenantData(tenantId);
      };

      loadData();
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // Track views for multi-level pages (project, property, etc.)
  useEffect(() => {
    if (isMultiLevelPage(slug) && dynamicSlug && tenantId) {
      // ✅ للـ custom domains: استخدم username من API
      const finalTenantId =
        domainType === "custom" && tenantData?.username
          ? tenantData.username
          : tenantId;

      // Track project views specifically
      if (slug === "project") {
        trackProjectView(finalTenantId, dynamicSlug);
      }
      // يمكن إضافة tracking لأنواع أخرى من الصفحات هنا لاحقاً
    }
  }, [slug, dynamicSlug, tenantId, domainType, tenantData?.username]);

  // التحقق من وجود الـ slug في staticPagesData, componentSettings أو البيانات الافتراضية
  const slugExists = useMemo(() => {
    if (!slug) {
      return false;
    }

    // ⭐ Priority 0: Check if it's a multi-level page (project, property, etc.)
    // Multi-level pages are always valid even if not in StaticPages
    if (isMultiLevelPage(slug)) {
      return true;
    }

    // ⭐ Priority 1: Check static pages in editorStore
    const staticPageData = getStaticPageData(slug);
    if (staticPageData) {
      return true;
    }

    // ⭐ Priority 2: Check tenantData.StaticPages
    if (tenantData?.StaticPages?.[slug]) {
      return true;
    }

    // ⭐ Priority 2.5: Check if it's a known static page (has default component)
    // This ensures static pages are always available even if not in tenantData
    const defaultStaticComponent = getDefaultComponentForStaticPage(slug);
    if (defaultStaticComponent) {
      return true;
    }

    // ⭐ Priority 3: Check componentSettings (skip for static pages)
    // Static pages should ignore componentSettings and only use StaticPages or default data
    // If it's a static page (has default component), skip componentSettings check
    if (!defaultStaticComponent && tenantData?.componentSettings && slug in tenantData.componentSettings) {
      return true;
    }

    // ⭐ Priority 4: Check default definitions
    if ((PAGE_DEFINITIONS as any)[slug]) {
      return true;
    }

    return false;
  }, [
    tenantData?.componentSettings,
    tenantData?.StaticPages,
    slug,
    getStaticPageData,
    dynamicSlug,
  ]);

  // Get global header data and variant
  const globalHeaderData = tenantData?.globalComponentsData?.header;
  const globalHeaderVariant = useMemo(() => {
    // Priority: header.variant > globalHeaderVariant > default
    const variant =
      globalHeaderData?.variant ||
      tenantData?.globalComponentsData?.globalHeaderVariant ||
      "StaticHeader1";

    return variant;
  }, [
    globalHeaderData?.variant,
    tenantData?.globalComponentsData?.globalHeaderVariant,
    tenantData,
  ]);

  // Get global footer data and variant
  const globalFooterData = tenantData?.globalComponentsData?.footer;
  const globalFooterVariant = useMemo(() => {
    // Priority: footer.variant > globalFooterVariant > default (same as header)
    const variant =
      globalFooterData?.variant ||
      tenantData?.globalComponentsData?.globalFooterVariant ||
      "StaticFooter1";

    return variant;
  }, [
    globalFooterData?.variant,
    tenantData?.globalComponentsData?.globalFooterVariant,
    tenantData,
  ]);

  // Load footer component dynamically
  const FooterComponent = useMemo(() => {
    const componentMap: Record<string, string> = {
      StaticFooter1: "StaticFooter1",
      footer1: "footer1",
      footer2: "footer2",
    };

    const componentName = componentMap[globalFooterVariant] || "StaticFooter1";
    return loadFooterComponent(componentName) || StaticFooter1;
  }, [globalFooterVariant]);

  // Get components from staticPagesData, componentSettings, or default components
  const componentsList = useMemo(() => {
    // ⭐ Priority 1: Check multi-level pages (like "project", "property") with dynamicSlug
    if (isMultiLevelPage(slug) && dynamicSlug) {
      // Get the slug property name (e.g., "projectSlug", "propertySlug")
      const slugPropertyName = getSlugPropertyName(slug);

      // ⭐ Priority 1.1: Try to get from staticPagesData[slug]
      const staticPageData = getStaticPageData(slug);
      if (staticPageData && Array.isArray(staticPageData.components)) {
        return staticPageData.components
          .map((component: any) => ({
            id: component.id,
            componentName: component.componentName,
            data: { ...component.data, [slugPropertyName]: dynamicSlug },
            position: component.position || 0,
          }))
          .sort((a: any, b: any) => a.position - b.position);
      }

      // ⭐ Priority 1.2: Try to get from tenantData.StaticPages
      // Handle both formats: { slug, components, apiEndpoints } or [slug, components, apiEndpoints]
      if (tenantData?.StaticPages?.[slug]) {
        const staticPage = tenantData.StaticPages[slug];

        // Format 1: Array format [slug, components, apiEndpoints]
        if (Array.isArray(staticPage) && staticPage.length >= 2) {
          const components = staticPage[1];
          if (Array.isArray(components)) {
            return components
              .map((component: any) => ({
                id: component.id,
                componentName: component.componentName,
                data: { ...component.data, [slugPropertyName]: dynamicSlug },
                position: component.position || 0,
              }))
              .sort((a: any, b: any) => a.position - b.position);
          }
        }

        // Format 2: Object format { slug, components, apiEndpoints }
        if (
          staticPage &&
          typeof staticPage === "object" &&
          !Array.isArray(staticPage)
        ) {
          if (Array.isArray(staticPage.components)) {
            return staticPage.components
              .map((component: any) => ({
                id: component.id,
                componentName: component.componentName,
                data: { ...component.data, [slugPropertyName]: dynamicSlug },
                position: component.position || 0,
              }))
              .sort((a: any, b: any) => a.position - b.position);
          }
        }
      }

      // ⭐ Fallback: Return default component based on slug
      // For project, use projectDetails1; for property, use propertyDetail2; for others, can be customized
      let defaultComponentName = `${slug}1`;
      let defaultComponentType = slug;

      if (slug === "project") {
        defaultComponentName = "projectDetails1";
        defaultComponentType = "projectDetails";
      } else if (slug === "property") {
        defaultComponentName = "propertyDetail2";
        defaultComponentType = "propertyDetail";
      }

      return [
        {
          id: defaultComponentName,
          type: defaultComponentType,
          componentName: defaultComponentName,
          data: { [slugPropertyName]: dynamicSlug, visible: true },
          position: 0,
        },
      ];
    }

    // ⭐ Priority 2: Check static pages without additional segments
    const staticPageData = getStaticPageData(slug);
    if (staticPageData && Array.isArray(staticPageData.components)) {
      return staticPageData.components
        .map((component: any) => ({
          id: component.id,
          componentName: component.componentName,
          data: component.data,
          position: component.position || 0,
        }))
        .sort((a: any, b: any) => a.position - b.position);
    }

    // ⭐ Priority 3: Check tenantData.StaticPages
    // Support format: [slug, components, apiEndpoints] or { slug, components, apiEndpoints }
    if (tenantData?.StaticPages?.[slug]) {
      const staticPage = tenantData.StaticPages[slug];

      // Format 1: Array format [slug, components, apiEndpoints]
      if (Array.isArray(staticPage) && staticPage.length >= 2) {
        const components = staticPage[1];
        if (Array.isArray(components)) {
          return components
            .map((component: any) => ({
              id: component.id,
              componentName: component.componentName,
              data: component.data,
              position: component.position || 0,
            }))
            .sort((a: any, b: any) => a.position - b.position);
        }
      }

      // Format 2: Object format { slug, components, apiEndpoints }
      if (
        staticPage &&
        typeof staticPage === "object" &&
        !Array.isArray(staticPage)
      ) {
        if (Array.isArray(staticPage.components)) {
          return staticPage.components
            .map((component: any) => ({
              id: component.id,
              componentName: component.componentName,
              data: component.data,
              position: component.position || 0,
            }))
            .sort((a: any, b: any) => a.position - b.position);
        }
      }
    }

    // ⭐ Priority 3.5: Check if it's a known static page (has default component)
    // This ensures static pages are always available even if not in tenantData
    const defaultStaticComponent = getDefaultComponentForStaticPage(slug);
    if (defaultStaticComponent) {
      return [
        {
          id: defaultStaticComponent.id,
          componentName: defaultStaticComponent.componentName,
          data: defaultStaticComponent.data,
          position: defaultStaticComponent.position || 0,
        },
      ];
    }

    // ⭐ Priority 4: Check componentSettings (regular pages only, skip for static pages)
    // Static pages should ignore componentSettings and only use StaticPages or default data
    // If it's a static page (has default component), skip componentSettings check
    if (
      !defaultStaticComponent &&
      tenantData?.componentSettings &&
      slug &&
      tenantData.componentSettings[slug]
    ) {
      const pageSettings = tenantData.componentSettings[slug];
      const normalizedSettings = normalizeComponentSettings(pageSettings);

      // تحويل componentSettings إلى قائمة مكونات
      const components = Object.entries(normalizedSettings)
        .map(([id, component]: [string, any]) => ({
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position,
        }))
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      return components;
    }

    // ⭐ Priority 5: استخدام البيانات الافتراضية من PAGE_DEFINITIONS
    if (slug && (PAGE_DEFINITIONS as any)[slug]) {
      const defaultPageData = (PAGE_DEFINITIONS as any)[slug];
      const components = Object.entries(defaultPageData)
        .map(([id, component]: [string, any]) => ({
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position || 0,
        }))
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      return components;
    }

    return [];
  }, [
    tenantData?.componentSettings,
    tenantData?.StaticPages,
    slug,
    dynamicSlug,
    staticPagesData,
    getStaticPageData,
  ]);

  // دالة لتحديد الـ skeleton المناسب حسب الـ slug
  const renderSkeletonContent = () => {
    switch (slug) {
      case "for-rent":
      case "for-sale":
        return (
          <main className="flex-1">
            <FilterButtonsSkeleton1 />
            <GridSkeleton1 />
          </main>
        );
      case "about-us":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <HalfTextHalfImageSkeleton1 />
          </main>
        );
      case "contact-us":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <ContactCardsSkeleton1 />
          </main>
        );
      case "property-requests/create":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        );
      default:
        // الصفحات الأخرى تعرض HeroSkeleton1
        return (
          <main className="flex-1">
            <HeroSkeleton1 />
          </main>
        );
    }
  };

  // إذا كان التحميل جارياً، أظهر skeleton loading
  if (loadingTenantData) {
    return (
      <I18nProvider>
        <div className="min-h-screen flex flex-col" dir="rtl">
          {/* Header Skeleton */}
          <StaticHeaderSkeleton1 />

          {/* Page-specific Skeleton Content */}
          {renderSkeletonContent()}
        </div>
      </I18nProvider>
    );
  }

  // إذا لم يكن الـ slug موجود في componentSettings، أظهر 404
  if (!slugExists) {
    notFound();
  }

  // Filter out header and footer components since they are now global
  const filteredComponentsList = componentsList.filter((comp: any) => {
    if (comp.componentName?.startsWith("header")) {
      return false;
    }
    if (comp.componentName?.startsWith("footer")) {
      return false;
    }
    return true;
  });

  return (
    <GTMProvider>
      <GA4Provider tenantId={tenantId} domainType={domainType}>
        <I18nProvider>
          <div className="min-h-screen flex flex-col" dir="rtl">
            {/* Header with i18n support */}
            <div className="relative">
              <Suspense fallback={<SkeletonLoader componentName="header" />}>
                {(() => {
                  // Map variant names to component names
                  const componentMap: Record<string, string> = {
                    StaticHeader1: "StaticHeader1",
                    header1: "header1",
                    header2: "header2",
                    header3: "header3",
                    header4: "header4",
                    header5: "header5",
                    header6: "header6",
                  };

                  const componentName =
                    componentMap[globalHeaderVariant] || "StaticHeader1";

                  const HeaderComponent = loadHeaderComponent(componentName);

                  if (!HeaderComponent) {
                    return (
                      <StaticHeader1 overrideData={globalHeaderData || {}} />
                    );
                  }

                  // Remove variant from data before passing to component
                  const headerDataWithoutVariant = globalHeaderData
                    ? (() => {
                        const { variant: _variant, ...data } = globalHeaderData;
                        return data;
                      })()
                    : {};

                  return (
                    <HeaderComponent
                      overrideData={headerDataWithoutVariant}
                      variant={globalHeaderVariant}
                      id="global-header"
                    />
                  );
                })()}
              </Suspense>
              {/* لا اريد ازالة هذا  , فقط اريده ككومنت */}
              {/* <div className="absolute top-4 right-4 z-50"> 
            <LanguageDropdown />
          </div> */}
            </div>

            {/* Page Content */}
            <main className="flex-1">
              {Array.isArray(filteredComponentsList) &&
              filteredComponentsList.length > 0 ? (
                filteredComponentsList.map((comp: any) => {
                  const Cmp = loadComponent(slug as string, comp.componentName);
                  if (!Cmp) {
                    return <Fragment key={comp.id} />;
                  }

                  // التحقق من ما إذا كان المكون يحتاج للتوسيط
                  const centerWrapperClasses = getCenterWrapperClasses(
                    comp.componentName,
                  );
                  const centerWrapperStyles = getCenterWrapperStyles(
                    comp.componentName,
                  );

                  const componentElement = (
                    <Suspense
                      key={comp.id}
                      fallback={
                        <SkeletonLoader componentName={comp.componentName} />
                      }
                    >
                      <Cmp {...(comp.data as any)} useStore variant={comp.id} />
                    </Suspense>
                  );

                  // إذا كان المكون يحتاج للتوسيط، لفه في div مع الكلاسات والستايل المناسب
                  if (shouldCenterComponent(comp.componentName)) {
                    return (
                      <div
                        key={comp.id}
                        className={centerWrapperClasses}
                        style={centerWrapperStyles as React.CSSProperties}
                      >
                        {componentElement}
                      </div>
                    );
                  }

                  return componentElement;
                })
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No components
                </div>
              )}
            </main>

            {/* Footer with i18n support */}
            <Suspense fallback={<SkeletonLoader componentName="footer" />}>
              {(() => {
                const footerDataWithoutVariant = globalFooterData
                  ? (() => {
                      const { variant: _variant, ...data } = globalFooterData;
                      return data;
                    })()
                  : {};

                if (!FooterComponent) {
                  return (
                    <StaticFooter1 overrideData={footerDataWithoutVariant} />
                  );
                }

                return (
                  <FooterComponent
                    overrideData={footerDataWithoutVariant}
                    variant={globalFooterVariant}
                    id="global-footer"
                  />
                );
              })()}
            </Suspense>
          </div>
        </I18nProvider>
      </GA4Provider>
    </GTMProvider>
  );
}
