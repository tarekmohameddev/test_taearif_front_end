"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import useTenantViewStore from "@/context/tenantViewStore";
import { useTenantStaticPagesStore } from "@/context/tenantStaticPagesStore";
import { notFound } from "next/navigation";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib/componentPaths";
import StaticHeader1Viewer, {
  StaticHeader1ViewerData,
} from "@/components/tenant/header/StaticHeader1Viewer";
import StaticFooter1Viewer, {
  StaticFooter1ViewerData,
} from "@/components/tenant/footer/StaticFooter1Viewer";
import Header1 from "@/components/tenant/header/header1";
import Header2 from "@/components/tenant/header/header2";
import Footer1 from "@/components/tenant/footer/footer1";
import Footer2 from "@/components/tenant/footer/footer2";
import Footer3 from "@/components/tenant/footer/footer3";
import PropertyDetail1 from "@/components/tenant/propertyDetail/propertyDetail1";
import PropertyDetail2 from "@/components/tenant/propertyDetail/propertyDetail2";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageDropdown } from "@/components/tenant/LanguageDropdown";
import { PAGE_DEFINITIONS } from "@/lib/defaultComponents";
import { SkeletonLoader } from "@/components/skeleton";
const TenantPageSkeleton = dynamic(
  () => import("@/app/TenantPageSkeleton").then((m) => m.default),
  { ssr: true }
);
import {
  shouldCenterComponent,
  getCenterWrapperClasses,
  getCenterWrapperStyles,
} from "@/lib/ComponentsInCenter";
import GA4Provider from "@/components/GA4Provider";
import GTMProvider from "@/components/GTMProvider";
import { trackProjectView } from "@/lib/ga4-tracking";
import {
  isMultiLevelPage,
  getSlugPropertyName,
} from "@/lib/multiLevelPages";
import { getDefaultComponentForStaticPage } from "@/components/tenant/live-editor/effects/utils/staticPageHelpers";
import { normalizeComponentSettings } from "@/services/live-editor/componentSettingsHelper";
import PixelScripts from "@/components/tracking/PixelScripts";
import {
  trackPropertyView,
  trackProjectViewGTM,
  setTenantInfo,
} from "@/lib/gtm-utils";

// ⭐ Cache للـ header components
const headerComponentsCache = new Map<string, any>();

// ⭐ Cache للـ footer components
const footerComponentsCache = new Map<string, any>();

// Load header component dynamically (viewer-optimized + cached)
const loadHeaderComponent = (componentName: string) => {
  if (!componentName) return null;

  const cached = headerComponentsCache.get(componentName);
  if (cached) return cached;

  const headerComponentMap: Record<string, any> = {
    header1: Header1,
    header2: Header2,
  };

  let Component: any = headerComponentMap[componentName];

  if (!Component) {
    const match = componentName?.match(/^(.*?)(\d+)$/);
    if (!match) return null;

    const baseName = match[1];
    const subPath = getComponentSubPath(baseName);
    if (!subPath) {
      return null;
    }

    const fullPath = `${subPath}/${componentName}`;

    Component = dynamic(
          () => import(`@/components/tenant/${fullPath}`),
      { ssr: false },
    );
  }

  headerComponentsCache.set(componentName, Component);
  return Component;
};

// Load footer component dynamically (viewer-optimized + cached)
const loadFooterComponent = (componentName: string) => {
  if (!componentName) return null;

  const cached = footerComponentsCache.get(componentName);
  if (cached) return cached;

  const footerComponentMap: Record<string, any> = {
    footer1: Footer1,
    footer2: Footer2,
    footer3: Footer3,
  };

  let Component: any = footerComponentMap[componentName];

  if (!Component) {
    const match = componentName?.match(/^(.*?)(\d+)$/);
    if (!match) return null;

    const baseName = match[1];
    const subPath = getComponentSubPath(baseName);
    if (!subPath) {
      return null;
    }

    const fullPath = `${subPath}/${componentName}`;

    Component = dynamic(
      () => import(`@/components/tenant/${fullPath}`),
      { ssr: false },
    );
  }

  footerComponentsCache.set(componentName, Component);
  return Component;
};

// Generic component loader with simple memoized cache keyed by section+name
const genericComponentsCache = new Map<string, any>();

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
  const cacheKey = `${section}:${componentName}`;
  const cached = genericComponentsCache.get(cacheKey);
  if (cached) return cached;

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

  genericComponentsCache.set(cacheKey, component);
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


  const tenantData = useTenantViewStore((s: any) => s.tenantData);
  const loadingTenantData = useTenantViewStore((s: any) => s.loadingTenantData);
  const fetchTenantData = useTenantViewStore((s: any) => s.fetchTenantData);
  const setTenantId = useTenantViewStore((s: any) => s.setTenantId);
  const staticPagesData = useTenantStaticPagesStore((s) => s.staticPagesData);
  const getStaticPageData = useTenantStaticPagesStore((s) => s.getStaticPageData);



  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
      
      // ⭐ Track tenant info in GTM
      setTenantInfo(tenantId, {
        domainType,
        currentPage: slug,
        dynamicSlug: dynamicSlug || null,
      });
    }
  }, [tenantId, setTenantId, domainType, slug, dynamicSlug]);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {

    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
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

      // Track project views (both GA4 and GTM)
      if (slug === "project") {
        trackProjectView(finalTenantId, dynamicSlug); // GA4
        trackProjectViewGTM(dynamicSlug, {
          tenantId: finalTenantId,
          domainType,
        }); // GTM
      }
      
      // Track property views in GTM
      if (slug === "property") {
        trackPropertyView(dynamicSlug, {
          tenantId: finalTenantId,
          domainType,
        });
      }
    }
  }, [slug, dynamicSlug, tenantId, domainType, tenantData?.username]);

  // ⭐ DYNAMIC PAGE DETECTION: Always allow page if tenantId exists
  // Let the tenant data determine if the page exists or not
  const slugExists = useMemo(() => {
    if (!slug) {
      return false;
    }

    // ✅ If tenantId exists (subdomain/custom domain), always allow the page attempt
    // This enables dynamic page detection based on tenant data from getTenant API
    if (tenantId) {
      return true;
    }

    // ❌ If no tenantId (main domain), use strict validation with static definitions
    // ⭐ Priority 0: Check if it's a multi-level page (project, property, etc.)
    if (isMultiLevelPage(slug)) {
      return true;
    }

    // ⭐ Priority 1: Check static pages in tenantStaticPagesStore
    const staticPageData = getStaticPageData(slug);
    if (staticPageData) {
      return true;
    }

    // ⭐ Priority 2: Check if it's a known static page (has default component)
    const defaultStaticComponent = getDefaultComponentForStaticPage(slug);
    if (defaultStaticComponent) {
      return true;
    }

    // ⭐ Priority 3: Check default definitions
    if ((PAGE_DEFINITIONS as any)[slug]) {
      return true;
    }

    return false;
  }, [
    slug,
    tenantId,
    getStaticPageData,
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
      footer1: "footer1",
      footer2: "footer2",
      footer3: "footer3",
    };

    const componentName = componentMap[globalFooterVariant];
    return componentName ? loadFooterComponent(componentName) : null;
  }, [globalFooterVariant]);

  // Get components from staticPagesData, componentSettings, or default components
  const componentsList = useMemo(() => {
    // ⭐ Priority 1: Multi-level pages (project/property/blog with dynamicSlug)
    if (isMultiLevelPage(slug) && dynamicSlug) {
      const slugPropertyName = getSlugPropertyName(slug);

      const staticPageData = getStaticPageData(slug);
      const componentsSource =
        staticPageData?.components ||
        (Array.isArray(tenantData?.StaticPages?.[slug])
          ? (tenantData!.StaticPages[slug] as any[])[1]
          : (tenantData?.StaticPages?.[slug] as any)?.components) ||
        [];

      if (Array.isArray(componentsSource) && componentsSource.length > 0) {
        return componentsSource
          .map((component: any) => ({
            id: component.id,
            componentName: component.componentName,
            data: { ...component.data, [slugPropertyName]: dynamicSlug },
            position: component.position || 0,
          }))
          .sort((a: any, b: any) => a.position - b.position);
      }

      // Fallback default for multi-level pages
      let defaultComponentName = `${slug}1`;
      let defaultComponentType = slug;

      if (slug === "project") {
        defaultComponentName = "projectDetails1";
        defaultComponentType = "projectDetails";
      } else if (slug === "property") {
        defaultComponentName = "propertyDetail2";
        defaultComponentType = "propertyDetail";
      } else if (slug === "blog") {
        defaultComponentName = "blogDetails2";
        defaultComponentType = "blogDetails";
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

    // ⭐ Priority 2: Static pages data from lightweight store
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

    // ⭐ Priority 3: Static pages from tenantData (both formats)
    const tenantStaticPage = tenantData?.StaticPages?.[slug];
    if (tenantStaticPage) {
      let components: any[] | undefined;

      if (Array.isArray(tenantStaticPage) && tenantStaticPage.length >= 2) {
        components = tenantStaticPage[1];
      } else if (
        typeof tenantStaticPage === "object" &&
        !Array.isArray(tenantStaticPage)
      ) {
        components = tenantStaticPage.components;
      }

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

    // ⭐ Priority 4: Static default component for known static pages
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

    // ⭐ Priority 5: componentSettings for regular pages (non-static)
    if (
      tenantData?.componentSettings &&
      slug &&
      tenantData.componentSettings[slug]
    ) {
      const pageSettings = tenantData.componentSettings[slug];
      const normalizedSettings = normalizeComponentSettings(pageSettings);

      return Object.entries(normalizedSettings)
        .map(([id, component]: [string, any]) => ({
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position,
        }))
        .sort((a, b) => (a.position || 0) - (b.position || 0));
    }

    // ⭐ Priority 6: PAGE_DEFINITIONS fallback
    const pageDefinition = slug ? (PAGE_DEFINITIONS as any)[slug] : null;
    if (pageDefinition) {
      return Object.entries(pageDefinition)
        .map(([id, component]: [string, any]) => ({
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position || 0,
        }))
        .sort((a, b) => (a.position || 0) - (b.position || 0));
    }

    return [];
  }, [slug, dynamicSlug, tenantData?.StaticPages, tenantData?.componentSettings, getStaticPageData]);

  // إذا كان التحميل جارياً أو لم تأت البيانات بعد، أظهر skeleton loading (محمّل ديناميكياً)
  if (loadingTenantData || !tenantData) {
    return (
      <I18nProvider>
        <PixelScripts tenantId={tenantId} pageType={slug} />
        <TenantPageSkeleton slug={slug} />
      </I18nProvider>
    );
  }

  // ⭐ DYNAMIC 404 VALIDATION: Check page existence based on loaded data
  // For tenant pages (with tenantId), validate after data is loaded
  // For main domain pages (no tenantId), use slugExists check
  if (!slugExists) {
    notFound();
  }

  // ✅ For tenant pages: Check if page actually exists in loaded data
  // This allows dynamic page detection - any URL is allowed initially,
  // but 404 is shown if the page doesn't exist in tenant data
  // ⚠️ IMPORTANT: Only check after data is loaded (tenantData exists)
  if (tenantId && !loadingTenantData && tenantData) {
    const hasPageData = 
      componentsList.length > 0 || // Has components
      isMultiLevelPage(slug) || // Is multi-level page (always valid)
      getStaticPageData(slug) || // Exists in static pages
      tenantData?.StaticPages?.[slug] || // Exists in tenant static pages
      tenantData?.componentSettings?.[slug]; // Exists in component settings
    
    
    if (!hasPageData) {
      notFound();
    }
  } else if (tenantId && !loadingTenantData && !tenantData) {
    // Data should have been loaded but it's not there - this means API failed or returned empty
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
        <PixelScripts tenantId={tenantId} pageType={slug} />
        <I18nProvider>
          <div className="min-h-screen flex flex-col" dir="rtl">
            {/* Header with i18n support */}
            <div className="relative">
              <Suspense fallback={<SkeletonLoader componentName="header" />}>
                {(() => {
                  // ⭐ CRITICAL: لا تعرض Header إلا بعد التأكد من وجود tenantData
                  if (!tenantData || !globalHeaderData) {
                    return <SkeletonLoader componentName="header" />;
                  }

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

                  // Viewer-only StaticHeader1 (no editor/tenant store deps)
                  if (componentName === "StaticHeader1") {
                    const viewerData: StaticHeader1ViewerData = {
                      logo: {
                        text:
                          tenantData?.branding?.name ||
                          tenantData?.websiteName ||
                          globalHeaderData?.logo?.text,
                        image:
                          globalHeaderData?.logo?.image ||
                          tenantData?.branding?.logo,
                        url: globalHeaderData?.logo?.url || "/",
                      },
                      menu: Array.isArray(globalHeaderData?.menu)
                        ? globalHeaderData.menu.map((item: any) => ({
                            id: item.id || item.text,
                            text: item.text,
                            url: item.url,
                          }))
                        : undefined,
                    };

                    return (
                      <StaticHeader1Viewer
                        data={viewerData}
                        tenantId={tenantId}
                      />
                    );
                  }

                  const HeaderComponent = loadHeaderComponent(componentName);
                  if (!HeaderComponent) {
                    return null;
                  }

                  return (
                    <HeaderComponent
                      overrideData={globalHeaderData}
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
                      {/* Viewer mode: components receive data only, no editor store binding */}
                      <Cmp
                        {...(comp.data as any)}
                        useStore={false}
                        variant={comp.componentName}
                        id={comp.id}
                      />
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
                // ⭐ CRITICAL: لا تعرض Footer إلا بعد التأكد من وجود tenantData
                if (!tenantData || !globalFooterData) {
                  return <SkeletonLoader componentName="footer" />;
                }

                // Viewer-only StaticFooter1 (no editor/tenant store deps)
                if (globalFooterVariant === "StaticFooter1") {
                  const viewerData: StaticFooter1ViewerData = {
                    companyName:
                      globalFooterData?.content?.companyInfo?.name ||
                      tenantData?.branding?.name ||
                      tenantData?.websiteName,
                    companyTagline:
                      globalFooterData?.content?.companyInfo?.tagline,
                    companyDescription:
                      globalFooterData?.content?.companyInfo?.description,
                    companyLogo:
                      globalFooterData?.content?.companyInfo?.logo ||
                      tenantData?.branding?.logo,
                    quickLinks:
                      globalFooterData?.content?.quickLinks?.links ??
                      undefined,
                    address:
                      globalFooterData?.content?.contactInfo?.address ??
                      undefined,
                    phone1:
                      globalFooterData?.content?.contactInfo?.phone1 ??
                      undefined,
                    phone2:
                      globalFooterData?.content?.contactInfo?.phone2 ??
                      undefined,
                    email:
                      globalFooterData?.content?.contactInfo?.email ??
                      undefined,
                    copyright:
                      globalFooterData?.footerBottom?.copyright ??
                      undefined,
                    legalLinks:
                      globalFooterData?.footerBottom?.legalLinks ?? undefined,
                    backgroundImage:
                      globalFooterData?.background?.image ?? undefined,
                  };

                  return <StaticFooter1Viewer data={viewerData} />;
                }

                if (!FooterComponent) {
                  return null;
                }

                return (
                  <FooterComponent
                    overrideData={globalFooterData}
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
