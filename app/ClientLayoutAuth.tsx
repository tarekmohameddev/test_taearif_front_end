"use client";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import InfoPopup from "@/components/ui/popup";
import { hasSessionSync } from "@/lib/session";

/**
 * Wraps children with full auth: AuthProvider, redirects, onboarding, popup.
 * Loaded only for routes that require auth (dashboard, login, live-editor, etc.)
 * so public routes (e.g. /ar, /landing) do not pull AuthContext/axios into their bundle.
 */
export default function ClientLayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const IsLoading = useAuthStore((state) => state.IsLoading);
  const onboardingCompleted = useAuthStore(
    (state) => state.onboarding_completed,
  );

  const userData = useAuthStore((state) => state.userData);
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const [showPopup, setShowPopup] = useState(false);
  const clearMessage = useAuthStore((state) => state.clearMessage);
  const setMessage = useAuthStore((state) => state.setMessage);
  const hasCheckedOnboardingRef = useRef(false);
  const isFetchingOnboardingRef = useRef(false);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const testPopup = () => {
    setMessage("هذه رسالة اختبار للـ popup! 🎉");
    setShowPopup(true);
  };

  useEffect(() => {
    if (userData?.message && !showPopup) {
      setShowPopup(true);
    }
  }, [userData?.message, showPopup]);

  useEffect(() => {
    setIsMounted(true);
    const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}\//, "/") || pathname;
    if (pathWithoutLocale?.startsWith("/login")) {
      return;
    }
    fetchUserData();
  }, [fetchUserData, pathname]);

  const isAllowedPageForPopup = (pathname: string) => {
    const allowedPages = [
      "/dashboard/affiliate",
      "/dashboard/analytics",
      "/dashboard/apps",
      "/dashboard/blog",
      "/dashboard/blogs",
      "/dashboard/content",
      "/dashboard/crm",
      "/dashboard/customers",
      "/dashboard/forgot-password",
      "/dashboard/marketing",
      "/dashboard/messages",
      "/dashboard/projects",
      "/dashboard/properties",
      "/dashboard/property-requests",
      "/dashboard/purchase-management",
      "/dashboard/rental-management",
      "/dashboard/reset",
      "/dashboard/settings",
      "/dashboard/templates",
      "/dashboard/whatsapp-ai",
      "/dashboard",
      "/register",
      "/oauth",
      "/login",
    ];

    if (allowedPages.some((page) => pathname?.startsWith(page))) {
      return true;
    }

    const localePattern = /^\/[a-z]{2}\//;
    if (localePattern.test(pathname)) {
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
      return allowedPages.some((page) => pathWithoutLocale.startsWith(page));
    }

    return false;
  };

  const isPublicPageWithLocale = (pathname: string) => {
    const publicPages = [
      "/",
      "/oauth",
      "/not-found",
      "/forgot-password",
      "/reset",
      "/register",
      "/login",
      "/landing",
      "/live-editor",
      "/properties",
      "/property",
      "/for-sale",
      "/for-rent",
    ];

    if (publicPages.some((page) => pathname?.startsWith(page))) {
      return true;
    }

    const localePattern = /^\/[a-z]{2}\//;
    if (localePattern.test(pathname)) {
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
      return publicPages.some((page) => pathWithoutLocale.startsWith(page));
    }

    const localeOnlyPattern = /^\/[a-z]{2}$/;
    if (localeOnlyPattern.test(pathname)) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const isPublic = isPublicPageWithLocale(pathname || "");
    const wouldRedirectToLogin =
      isMounted &&
      !IsLoading &&
      !UserIslogged &&
      !isPublic;

    if (wouldRedirectToLogin) {
      router.push("/login");
    }
  }, [isMounted, IsLoading, UserIslogged, pathname, router]);

  useEffect(() => {
    async function fetchUser() {
      if (isFetchingOnboardingRef.current) {
        return;
      }

      if (isMounted && !IsLoading && UserIslogged && !onboardingCompleted) {
        const currentUserData = useAuthStore.getState().userData;
        const completed = currentUserData?.onboarding_completed;

        if (completed !== undefined && completed !== null) {
          setOnboardingCompleted(completed);
          hasCheckedOnboardingRef.current = true;
          if (completed === false) {
            if (pathname !== "/onboarding") {
              router.push("/onboarding");
            }
          } else if (pathname === "/onboarding") {
            router.push("/dashboard");
          }
          return;
        }

        if (hasCheckedOnboardingRef.current) {
          return;
        }

        if (typeof window !== "undefined") {
          try {
            const {
              getPlanCookie,
              hasValidPlanCookie,
            } = require("@/lib/planCookie");
            if (hasValidPlanCookie()) {
              const cachedPlan = getPlanCookie();
              if (cachedPlan && cachedPlan.onboarding_completed !== undefined) {
                setOnboardingCompleted(cachedPlan.onboarding_completed);
                hasCheckedOnboardingRef.current = true;
                if (cachedPlan.onboarding_completed === false) {
                  if (pathname !== "/onboarding") {
                    router.push("/onboarding");
                  }
                } else if (pathname === "/onboarding") {
                  router.push("/dashboard");
                }
                return;
              }
            }
          } catch (error) {
            console.error("Error reading plan cookie:", error);
          }
        }

        isFetchingOnboardingRef.current = true;
        hasCheckedOnboardingRef.current = true;

        if (pathname !== "/onboarding") {
          try {
            const response = await axiosInstance.get("/user");
            const completed = response.data.data.onboarding_completed;
            setOnboardingCompleted(completed);
            if (completed == undefined) {
              router.push("/onboarding");
            }
          } catch (error) {
            router.push("/onboarding");
          } finally {
            isFetchingOnboardingRef.current = false;
          }
        } else {
          try {
            const response = await axiosInstance.get("/user");
            const completed = response.data.data.onboarding_completed;
            setOnboardingCompleted(completed);
            if (completed == undefined) {
              router.push("/onboarding");
            } else {
              router.push("/dashboard");
            }
          } catch (error) {
            router.push("/onboarding");
          } finally {
            isFetchingOnboardingRef.current = false;
          }
        }
      }
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, IsLoading, UserIslogged, onboardingCompleted]);

  useEffect(() => {
    if (pathname?.startsWith("/login")) {
      const urlParams = new URLSearchParams(window.location.search);
      const hasToken = urlParams.get("token");
      const hasSession = hasSessionSync();

      // إذا لم يكن هناك token في URL (تسجيل دخول جديد)، لكن توجد جلسة محفوظة
      // بحسب نفس منطق AuthGate، أعد التوجيه مباشرةً إلى /dashboard.
      if (!hasToken && hasSession) {
        const redirectTimer = setTimeout(() => {
          window.location.assign("/dashboard");
        }, 100);

        return () => clearTimeout(redirectTimer);
      }
    }
  }, [router, pathname]);

  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset",
    "/onboarding",
    "/test-reset",
    "/landing",
    "/live-editor",
  ];

  const isPublicPage =
    isPublicPageWithLocale(pathname || "") ||
    pathname?.startsWith("/oauth") ||
    pathname?.startsWith("/not-found");

  if (!UserIslogged && !isPublicPage) {
    return null;
  }

  return (
    <AuthProvider>
      {children}

      {showPopup &&
        userData?.message &&
        isAllowedPageForPopup(pathname || "") && (
          <InfoPopup
            message={userData.message}
            isVisible={showPopup}
            onClose={handleClosePopup}
          />
        )}
    </AuthProvider>
  );
}
