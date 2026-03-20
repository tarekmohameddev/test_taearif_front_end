"use client";

import { useEffect, useState } from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import dynamic from "next/dynamic";
import useAuthStore from "@/context/AuthContext";

const GTMProvider = dynamic(
  () => import("@/components/GTMProvider2").then((mod) => ({ default: mod.default })),
  { ssr: false, loading: () => <div className="min-h-screen" dir="rtl" /> },
);

const PermissionWrapper = dynamic(
  () => import("@/components/PermissionWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    ),
  },
);
import { DashboardHeader } from "@/components/mainCOMP/DashboardHeader";
import { DashboardSideMenu } from "@/components/mainCOMP/DashboardSideMenu";
import useSidebarStore from "@/context/sidebarStore";

// مفتاح sessionStorage لتخزين حالة التحقق
const SESSION_VALIDATION_KEY = "dashboard_session_validated";

// استيراد TenantPageWrapper ديناميكياً (للاستخدام عند الحاجة)
const TenantPageWrapper = dynamic(() => import("@/app/TenantPageWrapper"), {
  ssr: false,
});

/*
 * ========================================
 * DASHBOARD LAYOUT - ARABIC RTL ENFORCEMENT
 * ========================================
 *
 * This layout component is specifically designed for Arabic RTL dashboard pages.
 *
 * PURPOSE:
 * - Enforces RTL (Right-to-Left) direction for all dashboard pages
 * - Ensures consistent Arabic language experience
 * - Applies RTL styling automatically to all dashboard content
 *
 * HOW IT WORKS:
 * 1. Automatically applies RTL direction to HTML, body, and all elements
 * 2. Validates user authentication before rendering content
 * 3. Provides loading state during token validation
 *
 * NOTE:
 * This layout works in conjunction with middleware.ts which automatically
 * redirects all dashboard pages to Arabic locale (/ar/dashboard/*)
 *
 * MODIFICATION NOTES:
 * - To disable RTL enforcement: Remove the useEffect with RTL styling
 * - To change language direction: Modify the direction CSS properties
 * - To add LTR support: Add conditional logic based on locale detection
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Token validation (useTokenValidation already fetches user once and syncs AuthStore + userStore)
  const { tokenValidation } = useTokenValidation();
  const [isValidDomain, setIsValidDomain] = useState<boolean | null>(null);
  const hydrateUserFromStorage = useAuthStore(
    (state) => state.hydrateUserFromStorage,
  );

  // تهيئة الـ store من localStorage فوراً لعرض اسم الـ tenant والرابط في الـ sidebar قبل وصول استجابة API
  useEffect(() => {
    hydrateUserFromStorage?.();
  }, [hydrateUserFromStorage]);

  // قراءة حالة التحقق من sessionStorage مباشرة في initial state
  const [hasValidatedSession, setHasValidatedSession] = useState<boolean>(
    () => {
      if (typeof window !== "undefined") {
        return sessionStorage.getItem(SESSION_VALIDATION_KEY) === "true";
      }
      return false;
    },
  );

  // حفظ حالة التحقق في sessionStorage عند اكتمال التحقق بنجاح
  // هذا يضمن عدم عرض رسالة التحميل عند التنقل بين الصفحات في نفس الجلسة
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      tokenValidation.isValid === true &&
      !tokenValidation.loading
    ) {
      sessionStorage.setItem(SESSION_VALIDATION_KEY, "true");
      setHasValidatedSession(true);
    }
    // في حالة فشل التحقق، احذف المفتاح من sessionStorage لإجبار التحقق مرة أخرى
    if (
      typeof window !== "undefined" &&
      tokenValidation.isValid === false &&
      !tokenValidation.loading
    ) {
      sessionStorage.removeItem(SESSION_VALIDATION_KEY);
      setHasValidatedSession(false);
    }
  }, [tokenValidation.isValid, tokenValidation.loading]);

  // Start sidebar menu fetch as soon as token is valid (runs in parallel with PermissionWrapper)
  useEffect(() => {
    if (tokenValidation.isValid === true && !tokenValidation.loading) {
      useSidebarStore.getState().fetchSideMenus();
    }
  }, [tokenValidation.isValid, tokenValidation.loading]);

  // التحقق من نوع الدومين
  useEffect(() => {
    const checkDomain = () => {
      if (typeof window === "undefined") return;

      const hostname = window.location.hostname;
      const productionDomain =
        process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
      const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
      const isDevelopment = process.env.NODE_ENV === "development";

      // 🔒 Base domains list: includes both production and staging/pre-production domains
      const baseDomains = [
        productionDomain, // taearif.com (production)
        `www.${productionDomain}`, // www.taearif.com
        "mandhoor.com", // mandhoor.com (staging/pre-production on Vercel)
        "www.mandhoor.com", // www.mandhoor.com
      ];

      // التحقق من أن المستخدم على الدومين الأساسي (الأولوية الأولى)
      const isOnBaseDomain = isDevelopment
        ? hostname === localDomain || hostname === `${localDomain}:3000`
        : baseDomains.includes(hostname);

      // إذا كان الدومين الأساسي، اعرض Dashboard العادي (لا تتحقق من custom domain)
      if (isOnBaseDomain) {
        console.log(
          "🏠 Dashboard Layout: Base domain detected, showing main dashboard",
          { hostname, productionDomain, isDevelopment }
        );
        setIsValidDomain(true); // true يعني أنه الدومين الأساسي
        return;
      }

      // التحقق من أن الـ host هو custom domain (يحتوي على .com, .net, .org, إلخ)
      // فقط إذا لم يكن الدومين الأساسي
      const isCustomDomain =
        /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(
          hostname,
        );

      if (isCustomDomain) {
        // إذا كان custom domain وليس الدومين الأساسي، اعتبره tenant domain
        console.log(
          "🏢 Dashboard Layout: Custom domain detected, treating as tenant domain:",
          hostname,
        );
        setIsValidDomain(false); // false يعني أنه tenant domain
        return;
      }

      // إذا لم يكن أي منهما، اعتبره غير صالح
      console.log("❌ Dashboard Layout: Unknown domain type:", hostname);
      setIsValidDomain(false);
    };

    checkDomain();
  }, []);

  useEffect(() => {
    // إضافة CSS لضمان RTL
    const style = document.createElement("style");
    style.id = "dashboard-rtl-styles";
    style.textContent = `
      html {
        direction: rtl !important;
      }
      body {
        direction: rtl !important;
      }
      * {
        direction: rtl !important;
      }
    `;
    document.head.appendChild(style);

    // تنظيف عند الخروج من المجلد
    return () => {
      // إزالة الـ CSS
      const styleElement = document.getElementById("dashboard-rtl-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // عرض رسالة التحميل فقط في الحالات التالية:
  // 1. عند التحقق من الدومين لأول مرة (isValidDomain === null)
  // 2. عند التحقق من الجلسة لأول مرة في هذه الجلسة (tokenValidation.loading && !hasValidatedSession)
  // ملاحظة: إذا تم التحقق من الجلسة من قبل في هذه الجلسة، لن تظهر رسالة التحميل عند التنقل
  const shouldShowLoading =
    isValidDomain === null || (tokenValidation.loading && !hasValidatedSession);

  if (shouldShowLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isValidDomain === null
              ? "جاري التحقق من الدومين..."
              : "جاري التحقق من صحة الجلسة..."}
          </p>
        </div>
      </div>
    );
  }

  // إذا كان tenant domain (custom domain)، اعرض TenantPageWrapper
  if (isValidDomain === false) {
    return <TenantPageWrapper tenantId={null} slug="" domainType="custom" />;
  }

  return (
    <GTMProvider containerId="GTM-KBL37C9T">
      <div dir="rtl" style={{ direction: "rtl" }}>
        <PermissionWrapper>
          <div className="flex min-h-screen flex-col lg:flex-row" dir="rtl">
            <DashboardSideMenu />
            <main className="flex min-w-0 flex-1 flex-col ">
              <DashboardHeader />
              <div className="min-h-0 flex-1">{children}</div>
            </main>
          </div>
        </PermissionWrapper>
      </div>
    </GTMProvider>
  );
}
