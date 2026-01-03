"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { StaticHeaderSkeleton1, HeaderSkeleton1 } from "@/components/skeleton";
import { notFound } from "next/navigation";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib/ComponentsList";

// Lazy load Header and Footer components
const loadComponent = (componentName: string) => {
  if (!componentName) return null;
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  const baseName = match[1];
  const number = match[2];

  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.error("Invalid component type:", baseName);
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div>Component {componentName} not found</div>,
    })),
  );
};

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  console.log("🌍 GlobalLayout - Component rendered");

  const tenantId = useTenantStore((s) => s.tenantId);
  const slug = useParams<{ slug: string }>()?.slug;
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);

  // Get global components from editor store
  const {
    globalHeaderData,
    globalFooterData,
    setGlobalHeaderData,
    setGlobalFooterData,
  } = useEditorStore();

  console.log("🌍 GlobalLayout - Initial state:", {
    tenantId,
    slug,
    hasTenantData: !!tenantData,
    loadingTenantData,
    hasGlobalHeaderData: !!globalHeaderData,
    hasGlobalFooterData: !!globalFooterData,
  });

  // Initialize global components with default data if not exists (only once)
  useEffect(() => {
    console.log("🚀 GlobalLayout - Initializing global components");
    console.log(
      "🚀 GlobalLayout - Current globalHeaderData:",
      globalHeaderData,
    );
    console.log(
      "🚀 GlobalLayout - Current globalFooterData:",
      globalFooterData,
    );

    // Only initialize if globalHeaderData is completely empty (not just missing some properties)
    if (!globalHeaderData || Object.keys(globalHeaderData).length === 0) {
      console.log("🚀 GlobalLayout - Setting default header data");
      const {
        getDefaultHeaderData,
      } = require("@/context/editorStoreFunctions/headerFunctions");
      const defaultData = getDefaultHeaderData();
      console.log("🚀 GlobalLayout - Default header data:", defaultData);
      setGlobalHeaderData(defaultData);
    }

    // Only initialize if globalFooterData is completely empty (not just missing some properties)
    if (!globalFooterData || Object.keys(globalFooterData).length === 0) {
      console.log("🚀 GlobalLayout - Setting default footer data");
      const {
        getDefaultFooterData,
      } = require("@/context/editorStoreFunctions/footerFunctions");
      const defaultData = getDefaultFooterData();
      setGlobalFooterData(defaultData);
    }
  }, []); // Remove dependencies to prevent re-initialization

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // For pages without tenantId (like homepage), we still want to show global header
  const shouldShowGlobalHeader = !tenantId || tenantData;

  // Load Header and Footer components
  const HeaderComponent = useMemo(() => {
    if (!globalHeaderData || Object.keys(globalHeaderData).length === 0) {
      console.log("❌ GlobalLayout - No globalHeaderData, returning null");
      return null;
    }

    console.log("✅ GlobalLayout - Loading header1 component");
    return loadComponent("header1");
  }, [globalHeaderData]);

  const FooterComponent = useMemo(() => {
    if (!globalFooterData || Object.keys(globalFooterData).length === 0) {
      return null;
    }
    return loadComponent("footer1");
  }, [globalFooterData]);

  // إذا كان التحميل جارياً، أظهر skeleton loading
  if (loadingTenantData && tenantId) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        {/* Header Skeleton */}
        <StaticHeaderSkeleton1 />

        {/* Main Content Skeleton */}
        <main className="flex-1 bg-gray-50 animate-gentle-fade">
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              {/* Content Skeleton Blocks */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm animate-breathing relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-ultra"
                    style={{ animationDelay: `${index * 1}s` }}
                  ></div>
                  <div className="space-y-4 relative z-10">
                    <div className="h-6 bg-gray-200 rounded animate-gentle-fade w-3/4 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"
                        style={{ animationDelay: `${index * 1 + 1}s` }}
                      ></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded animate-breathing w-full relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra"
                          style={{ animationDelay: `${index * 1 + 1.5}s` }}
                        ></div>
                      </div>
                      <div className="h-4 bg-gray-100 rounded animate-breathing w-5/6 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-slow"
                          style={{ animationDelay: `${index * 1 + 2}s` }}
                        ></div>
                      </div>
                      <div className="h-4 bg-gray-100 rounded animate-breathing w-4/6 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra"
                          style={{ animationDelay: `${index * 1 + 2.5}s` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Debug: Log global header data changes

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      {HeaderComponent ? (
        <Suspense fallback={<HeaderSkeleton1 />}>
          <HeaderComponent
            {...(globalHeaderData as any)}
            useStore={true}
            variant="global-header"
            id="global-header"
            key={`global-header-${JSON.stringify(globalHeaderData)}`}
            onRender={() =>
              console.log("🌍 HeaderComponent rendered with props:", {
                variant: "global-header",
                id: "global-header",
                background: globalHeaderData?.background?.colors?.from,
              })
            }
          />
        </Suspense>
      ) : (
        <div style={{ padding: "10px", background: "red", color: "white" }}>
          ❌ NO GLOBAL HEADER - HeaderComponent is null
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      {FooterComponent && (
        <Suspense
          fallback={
            <div className="bg-gray-50 py-8 animate-gentle-fade relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-ultra"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <div className="h-5 bg-gray-200 rounded animate-breathing w-3/4 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"
                          style={{ animationDelay: `${index * 0.5}s` }}
                        ></div>
                      </div>
                      {Array.from({ length: 3 }).map((_, linkIndex) => (
                        <div
                          key={linkIndex}
                          className="h-4 bg-gray-100 rounded animate-gentle-fade w-2/3 relative overflow-hidden"
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra"
                            style={{
                              animationDelay: `${index * 0.5 + linkIndex * 0.2}s`,
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <FooterComponent
            {...(globalFooterData as any)}
            useStore={true}
            variant="global-footer"
            id="global-footer"
          />
        </Suspense>
      )}
    </div>
  );
}
