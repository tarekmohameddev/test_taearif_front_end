"use client";

import PixelScripts from "@/components/tracking/PixelScripts";

import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  Fragment,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { PAGE_DEFINITIONS } from "@/lib/defaultComponents";
import { useAuth } from "@/context/AuthContext";
import useTenantStore from "@/context/tenantStore";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib/ComponentsList";
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
import { I18nProvider } from "@/components/providers/I18nProvider";
import GA4Provider from "@/components/GA4Provider";
import GTMProvider from "@/components/GTMProvider";
import { LanguageSwitcher } from "@/components/tenant/LanguageSwitcher";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import Header1 from "@/components/tenant/header/header1";
import Header2 from "@/components/tenant/header/header2";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import Footer1 from "@/components/tenant/footer/footer1";
import Footer2 from "@/components/tenant/footer/footer2";
import dynamic from "next/dynamic";
import {
  shouldCenterComponent,
  getCenterWrapperClasses,
  getCenterWrapperStyles,
} from "@/lib/ComponentsInCenter";

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
    console.warn(
      `[Header Component] No subPath found for baseName: ${baseName}`,
    );
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  // Debug log (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    console.log("[Header Import Debug]", {
      baseName,
      subPath,
      fullPath,
      "Import path": `@/components/tenant/${fullPath}`,
    });
  }

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch((error) => {
        console.error(
          `[Header Import Error] Failed to load ${fullPath}:`,
          error,
        );
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
    console.warn(
      `[Footer Component] No subPath found for baseName: ${baseName}`,
    );
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch((error) => {
        console.error(
          `[Footer Import Error] Failed to load ${fullPath}:`,
          error,
        );
        return { default: StaticFooter1 };
      }),
    { ssr: false },
  );

  footerComponentsCache.set(componentName, component);
  return component;
};

// دالة لتحميل المكونات ديناميكيًا بناءً على الاسم والرقم الأخير
const loadComponent = (section: string, componentName: string) => {
  // التحقق من صحة componentName
  if (!componentName || typeof componentName !== "string") {
    return null;
  }

  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) {
    return null;
  }

  const baseName = match[1];
  const number = match[2];

  // استخدام القائمة المركزية للحصول على مسارات الأقسام
  const sectionPath = getSectionPath(section) || section;

  if (!sectionPath) {
    console.error("Invalid section:", section);
    return null;
  }

  // استخدام القائمة المركزية للحصول على مسارات المكونات الفرعية
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.error("Invalid component type:", baseName);
    // استخدام fallback للمكونات غير المعروفة
    const fallbackPath = "hero"; // استخدام hero كـ fallback
    const fallbackFullPath = `${fallbackPath}/${componentName}`;

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
  const fullPath = `${subPath}/${componentName}`;

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div>Component {componentName} not found</div>,
    })),
  );
};

interface HomePageWrapperProps {
  tenantId: string | null;
  domainType?: "subdomain" | "custom" | null;
}

export default function HomePageWrapper({
  tenantId,
  domainType = "subdomain",
}: HomePageWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const error = useTenantStore((s) => s.error);

  // Debug: Log error state
  useEffect(() => {
    if (error) {
      console.error("🏠 HomePageWrapper - Error detected:", error);
    }
  }, [error]);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);

  // Use ref to track if data has been fetched
  const hasFetchedRef = useRef(false);
  const isInitializedRef = useRef(false);
  const lastTenantIdRef = useRef<string | null>(null);

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId && !isInitializedRef.current) {
      setTenantId(tenantId);
      isInitializedRef.current = true;
      lastTenantIdRef.current = tenantId;
      console.log(
        `🏠 HomePageWrapper: Setting tenant ID: ${tenantId} (${domainType} domain)`,
      );
    }
  }, [tenantId, domainType]);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (
      tenantId &&
      !tenantData &&
      !loadingTenantData &&
      !hasFetchedRef.current
    ) {
      console.warn("🏠 HomePageWrapper - Fetching tenant data for:", tenantId);
      hasFetchedRef.current = true;
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // Reset fetch flag when tenantId changes
  useEffect(() => {
    if (tenantId && tenantId !== lastTenantIdRef.current) {
      // console.log("🏠 HomePageWrapper - TenantId changed, resetting flags");
      hasFetchedRef.current = false;
      isInitializedRef.current = false;
      lastTenantIdRef.current = tenantId;
    }
  }, [tenantId]);

  // منع إعادة render عند تغيير loadingTenantData
  const shouldShowLoading = loadingTenantData && !tenantData;

  // Get components from defaultComponents or tenantData
  const componentsList = useMemo(() => {
    // إذا كان التحميل جارياً أو لا توجد بيانات tenant بعد، ارجع null
    if (!tenantData) {
      return null;
    }

    // التحقق من أن componentSettings موجود وأنه object وليس array فارغ
    if (
      tenantData?.componentSettings &&
      typeof tenantData.componentSettings === "object" &&
      !Array.isArray(tenantData.componentSettings) &&
      tenantData.componentSettings.homepage &&
      Object.keys(tenantData.componentSettings.homepage).length > 0
    ) {
      const pageSettings = tenantData.componentSettings.homepage;

      const components = Object.entries(pageSettings)
        .map(([id, component]: [string, any]) => {
          // التحقق من وجود componentName
          if (
            !component.componentName ||
            typeof component.componentName !== "string"
          ) {
            // استخدام fallback
            const fallbackName = `${component.type || "hero"}1`;
            return {
              id,
              componentName: fallbackName,
              data: component.data,
              position: component.position,
            };
          }

          return {
            id,
            componentName: component.componentName,
            data: component.data,
            position: component.position,
          };
        })
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      return components;
    }

    // إذا كان tenantData موجود ولكن componentSettings فارغ، استخدم البيانات الافتراضية
    const defaultComponentsList = Object.entries(PAGE_DEFINITIONS.homepage).map(
      ([key, component], index) => {
        return {
          id: `default-${index}`,
          componentName: component.componentName, // استخراج componentName من object
          data: component.data || {},
          position: component.position || index,
        };
      },
    );

    return defaultComponentsList;
  }, [tenantData]);

  // Get global header data and variant
  const globalHeaderData = tenantData?.globalComponentsData?.header;
  const globalHeaderVariant = useMemo(() => {
    // Priority: header.variant > globalHeaderVariant > default
    const variant =
      globalHeaderData?.variant ||
      tenantData?.globalComponentsData?.globalHeaderVariant ||
      "StaticHeader1";

    // Debug log (can be removed in production)
    if (process.env.NODE_ENV === "development") {
      console.log("[HomePageWrapper] Header Variant Debug:", {
        "globalHeaderData?.variant": globalHeaderData?.variant,
        "tenantData?.globalComponentsData?.globalHeaderVariant":
          tenantData?.globalComponentsData?.globalHeaderVariant,
        "resolved variant": variant,
        "tenantData exists": !!tenantData,
        "globalComponentsData exists": !!tenantData?.globalComponentsData,
      });
    }

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

    // Debug log (can be removed in production)
    if (process.env.NODE_ENV === "development") {
      console.log("[HomePageWrapper] Footer Variant Debug:", {
        "globalFooterData?.variant": globalFooterData?.variant,
        "tenantData?.globalComponentsData?.globalFooterVariant":
          tenantData?.globalComponentsData?.globalFooterVariant,
        "resolved variant": variant,
        "tenantData exists": !!tenantData,
        "globalComponentsData exists": !!tenantData?.globalComponentsData,
      });
    }

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

  // منع إعادة render عند تغيير loadingTenantData
  const memoizedComponentsList = useMemo(
    () => componentsList,
    [componentsList],
  );

  // التحقق من الخطأ أولاً قبل التحقق من التحميل
  // إذا كان هناك خطأ أو لم توجد بيانات للـ tenant، اعرض not-found
  if (error || !tenantId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Tenant Not Found</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The tenant "{tenantId}" you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  // إذا كان التحميل جارياً أو لا توجد بيانات بعد، أظهر skeleton loading
  // دالة لتحديد الـ skeleton المناسب حسب الصفحة
  const renderSkeletonContent = () => {
    // الصفحة الرئيسية (homepage) - slug = "/"
    return (
      <main className="flex-1">
        <HeroSkeleton1 />
      </main>
    );
  };

  // ⭐ CRITICAL: لا تعرض المكونات إلا بعد التأكد التام من وجود tenantData
  if (shouldShowLoading || !componentsList || !tenantData) {
    return (
      <I18nProvider>
        <div className="min-h-screen flex flex-col" dir="rtl">
          {/* Header Skeleton */}
          <StaticHeaderSkeleton1 />

          {/* Page-specific Skeleton Content */}
          {renderSkeletonContent()}
          
          {/* Footer Skeleton */}
          <SkeletonLoader componentName="footer" />
        </div>
      </I18nProvider>
    );
  }

  // Filter out header and footer components since they are now global
  const filteredComponentsList = (memoizedComponentsList || []).filter(
    (comp: any) => {
      // التحقق من أن componentName موجود وأنه string
      if (!comp.componentName || typeof comp.componentName !== "string") {
        console.warn(
          "🏠 HomePageWrapper - Invalid componentName:",
          comp.componentName,
        );
        return true; // احتفظ بالمكون إذا كان componentName غير صحيح
      }

      if (comp.componentName.startsWith("header")) {
        return false;
      }
      if (comp.componentName.startsWith("footer")) {
        return false;
      }
      return true;
    },
  );

  return (
    <GTMProvider>
      <GA4Provider tenantId={tenantId} domainType={domainType}>
        <PixelScripts tenantId={tenantId} />
        <I18nProvider>
          <div className="min-h-screen flex flex-col" dir="rtl">
            {/* Header from globalComponentsData */}
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

                  // Debug log (can be removed in production)
                  if (process.env.NODE_ENV === "development") {
                    console.log("[HomePageWrapper] Header Component Debug:", {
                      globalHeaderVariant: globalHeaderVariant,
                      componentName: componentName,
                      "componentMap[globalHeaderVariant]":
                        componentMap[globalHeaderVariant],
                    });
                  }

                  const HeaderComponent = loadHeaderComponent(componentName);

                  if (!HeaderComponent) {
                    console.warn(
                      "[HomePageWrapper] HeaderComponent is null, falling back to StaticHeader1",
                    );
                    return (
                      <StaticHeader1 overrideData={globalHeaderData} />
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
            </div>

            {/* Page Content */}
            <main className="flex-1">
              {Array.isArray(filteredComponentsList) &&
              filteredComponentsList.length > 0 ? (
                filteredComponentsList.map((comp: any) => {
                  const Cmp = loadComponent("homepage", comp.componentName);
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

            {/* Footer from globalComponentsData */}
            <Suspense fallback={<SkeletonLoader componentName="footer" />}>
              {(() => {
                // ⭐ CRITICAL: لا تعرض Footer إلا بعد التأكد من وجود tenantData
                if (!tenantData || !globalFooterData) {
                  return <SkeletonLoader componentName="footer" />;
                }

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
