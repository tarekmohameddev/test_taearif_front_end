"use client";

/**
 * Loading Component Logic:
 * This component checks the hostname to determine if it's a tenant site or the main Taearif platform.
 * 1. Base Domain (www.taearif.com or taearif.com): Shows blank white page (no tenant).
 * 2. Subdomain (tenant1.taearif.com): Shows loading skeletons (tenant site).
 * 3. Custom Domain (example.com): Shows loading skeletons (tenant site with custom domain).
 * 4. Reserved subdomains (www, api, dashboard, etc.): Treated as non-tenant, shows blank page.
 *
 * منطق مكون التحميل:
 * يتحقق هذا المكون من اسم النطاق (hostname) لتحديد ما إذا كان موقع عميل أم منصة تعاريف الرئيسية.
 * ١. النطاق الأساسي (www.taearif.com أو taearif.com): يعرض صفحة بيضاء فارغة (ليس عميل).
 * ٢. نطاق فرعي (tenant1.taearif.com): يعرض هياكل التحميل (موقع عميل).
 * ٣. نطاق مخصص (example.com): يعرض هياكل التحميل (موقع عميل بنطاق مخصص).
 * ٤. النطاقات الفرعية المحجوزة (www, api, dashboard, إلخ): تعامل كغير عميل، يعرض صفحة فارغة.
 */

import { usePathname } from "next/navigation";
import {
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  HeroSkeleton2,
  FilterButtonsSkeleton1,
  GridSkeleton1,
  HalfTextHalfImageSkeleton1,
  ContactCardsSkeleton1,
} from "@/components/skeleton";
import { memo, useEffect, useState } from "react";

// تحسين الأداء باستخدام memo
const LoadingContent = memo(function LoadingContent({
  slug,
}: {
  slug: string;
}) {
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
      case "/":
        // الصفحة الرئيسية
        return (
          <main className="flex-1">
            <HeroSkeleton1 />
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

  return renderSkeletonContent();
});

export default function Loading() {
  const pathname = usePathname();
  const [hasTenantId, setHasTenantId] = useState<boolean | null>(null);

  // التحقق من وجود tenantId
  useEffect(() => {
    const checkTenantId = () => {
      // التأكد من أن window متاح
      if (typeof window === "undefined") {
        console.log("❌ Loading.tsx - window is undefined");
        return;
      }

      const hostname = window.location.hostname;
      const productionDomain =
        process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
      const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
      const isDevelopment = process.env.NODE_ENV === "development";

      // قائمة الكلمات المحجوزة (نفس middleware)
      const reservedWords = [
        "www",
        "api",
        "admin",
        "app",
        "mail",
        "ftp",
        "blog",
        "shop",
        "store",
        "dashboard",
        "live-editor",
        "auth",
        "login",
        "register",
      ];

      console.log("🔍 Loading.tsx - Starting check:", {
        hostname,
        productionDomain,
        localDomain,
        isDevelopment,
      });

      // 1️⃣ التحقق من أنه الدومين الأساسي
      // Note: window.location.hostname لا يحتوي على port، لذا لا نحتاج للتحقق من :3000
      const isOnBaseDomain = isDevelopment
        ? hostname === localDomain
        : hostname === productionDomain ||
          hostname === `www.${productionDomain}`;

      console.log("🔍 Loading.tsx - Base domain check:", {
        hostname,
        localDomain,
        productionDomain,
        isOnBaseDomain,
      });

      if (isOnBaseDomain) {
        console.log("❌ Loading.tsx - Base domain, no tenant");
        setHasTenantId(false);
        return;
      }

      // 2️⃣ التحقق من Subdomain (tenant1.taearif.com)
      if (
        hostname.includes(productionDomain) ||
        hostname.includes(localDomain)
      ) {
        const parts = hostname.split(".");

        // للتطوير: tenant1.localhost
        if (isDevelopment && hostname.includes(localDomain)) {
          if (process.env.NODE_ENV === "development") {
            console.log("🔍 Loading.tsx - Checking local subdomain:", {
              hostname,
              parts,
              partsLength: parts.length,
              firstPart: parts[0],
              localDomain,
              isFirstPartNotLocalDomain: parts[0] !== localDomain,
            });
          }
          
          if (parts.length > 1 && parts[0] !== localDomain) {
            const potentialTenantId = parts[0];
            if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "✅ Loading.tsx - Valid subdomain (local):",
                  potentialTenantId,
                );
              }
              setHasTenantId(true);
              return;
            } else {
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "❌ Loading.tsx - Reserved word:",
                  potentialTenantId,
                );
              }
            }
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("❌ Loading.tsx - Invalid subdomain structure:", {
                partsLength: parts.length,
                firstPart: parts[0],
                localDomain,
              });
            }
          }
        }

        // للإنتاج: tenant1.taearif.com
        if (!isDevelopment && hostname.includes(productionDomain)) {
          if (parts.length > 2) {
            const potentialTenantId = parts[0];
            const domainPart = parts.slice(1).join(".");

            // التأكد من أن domain part هو بالضبط productionDomain
            if (domainPart === productionDomain) {
              if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
                if (process.env.NODE_ENV === "development") {
                  console.log(
                    "✅ Loading.tsx - Valid subdomain (prod):",
                    potentialTenantId,
                  );
                }
                setHasTenantId(true);
                return;
              }
            }
          }
        }
      }

      // 3️⃣ التحقق من Custom Domain (أي domain مختلف تماماً)
      const hasCustomDomainExtension = /\.([a-z]{2,})$/i.test(hostname);

      if (hasCustomDomainExtension) {
        // إذا وصلنا هنا، يعني الـ hostname:
        // - ليس base domain (www.taearif.com أو taearif.com)
        // - ليس subdomain صالح من taearif.com
        // - له extension صحيح (.com, .net, ...)
        // ✅ إذن هو Custom Domain!
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Loading.tsx - Custom domain detected:", hostname);
        }
        setHasTenantId(true);
        return;
      }

      // ❌ لا يوجد tenant
      console.log("❌ Loading.tsx - No tenant found, setting hasTenantId to false");
      setHasTenantId(false);
    };

    checkTenantId();
  }, []);

  // استخراج الـ slug من المسار
  const getSlugFromPathname = (pathname: string): string => {
    if (!pathname) return "";

    // إزالة الـ / من البداية والنهاية
    const cleanPath = pathname.replace(/^\/+|\/+$/g, "");

    // إذا كان المسار فارغ، فهو الصفحة الرئيسية
    if (!cleanPath) return "/";

    // إذا كان المسار يحتوي على أكثر من جزء، نأخذ الجزء الأول
    const parts = cleanPath.split("/");
    return parts[0];
  };

  const slug = getSlugFromPathname(pathname || "");

  // تقليل console.log في production
  console.log(
    "🔄 Loading component - Render:",
    {
      pathname,
      slug,
      hasTenantId,
      timestamp: new Date().toISOString(),
    },
  );

  // إذا لم يوجد tenantId، اعرض صفحة بيضاء فارغة
  if (hasTenantId === false) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        {/* صفحة بيضاء فارغة */}
      </div>
    );
  }

  // إذا كان هناك tenantId، اعرض loading عادي
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StaticHeaderSkeleton1 />
      <LoadingContent slug={slug} />
    </div>
  );
}
