"use client";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import InfoPopup from "@/components/ui/popup";

export default function ClientLayout({
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
  const { setOnboardingCompleted } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);
  const clearMessage = useAuthStore((state) => state.clearMessage);
  const setMessage = useAuthStore((state) => state.setMessage);
  // استخدام useRef لمنع إعادة الجلب عند التنقل
  const hasCheckedOnboardingRef = useRef(false);
  const isFetchingOnboardingRef = useRef(false);
  const hasFetchedLiveEditorDataRef = useRef(false);
  const isFetchingLiveEditorDataRef = useRef(false);

  //   setUserData({
  //     email: userData.email,
  //     token: userData.token,
  //     username: userData.username,
  //     first_name: userData.first_name,
  //     last_name: userData.last_name,
  //     onboarding_completed: userData.onboarding_completed || false,
  //   });
  // setUserIsLogged(true);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // لا نحتاج لمسح الرسالة هنا لأن InfoPopup سيقوم بذلك
  };

  // function لاختبار الـ popup في development mode
  const testPopup = () => {
    setMessage("هذه رسالة اختبار للـ popup! 🎉");
    setShowPopup(true);
  };

  // مراقبة التغييرات في userData.message
  useEffect(() => {
    if (userData?.message && !showPopup) {
      setShowPopup(true);
    }
  }, [userData?.message, showPopup]);

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, [fetchUserData]);

  // دالة للتحقق من الصفحات المسموح بها لعرض InfoPopup
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

    // التحقق من الصفحات المسموح بها بدون locale
    if (allowedPages.some((page) => pathname?.startsWith(page))) {
      return true;
    }

    // التحقق من الصفحات المسموح بها مع locale (en/ar/أو أي locale آخر)
    const localePattern = /^\/[a-z]{2}\//;
    if (localePattern.test(pathname)) {
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
      return allowedPages.some((page) => pathWithoutLocale.startsWith(page));
    }

    return false;
  };

  // دالة للتحقق من الصفحات العامة مع دعم الـ locale
  const isPublicPageWithLocale = (pathname: string) => {
    const publicPages = [
      "/", // الصفحة الرئيسية
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

    // التحقق من الصفحات العامة بدون locale
    if (publicPages.some((page) => pathname?.startsWith(page))) {
      return true;
    }

    // التحقق من الصفحات العامة مع locale (en/ar/أو أي locale آخر)
    const localePattern = /^\/[a-z]{2}\//;
    if (localePattern.test(pathname)) {
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, "/");
      return publicPages.some((page) => pathWithoutLocale.startsWith(page));
    }

    // التحقق من الصفحات العامة مع locale فقط (مثل /en, /ar)
    const localeOnlyPattern = /^\/[a-z]{2}$/;
    if (localeOnlyPattern.test(pathname)) {
      return true; // الصفحة الرئيسية مع locale
    }

    return false;
  };

  useEffect(() => {
    if (
      isMounted &&
      !IsLoading &&
      !UserIslogged &&
      !isPublicPageWithLocale(pathname || "")
    ) {
      router.push("/login");
    }
  }, [isMounted, IsLoading, UserIslogged, pathname, router]);

  useEffect(() => {
    async function fetchUser() {
      // منع إعادة الجلب إذا كان هناك طلب قيد التنفيذ
      if (isFetchingOnboardingRef.current) {
        return;
      }

      if (isMounted && !IsLoading && UserIslogged && !onboardingCompleted) {
        // استخدام البيانات من AuthContext بدلاً من جلبها مباشرة
        const currentUserData = useAuthStore.getState().userData;
        const completed = currentUserData?.onboarding_completed;

        // إذا كانت البيانات موجودة في AuthContext، استخدمها
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
          return; // لا حاجة لجلب البيانات من API
        }

        // إذا تم التحقق من قبل، لا تعيد الجلب
        if (hasCheckedOnboardingRef.current) {
          return;
        }

        // التحقق من الكوكي أولاً
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
                return; // لا حاجة لجلب البيانات من API
              }
            }
          } catch (error) {
            console.error("Error reading plan cookie:", error);
          }
        }

        // فقط إذا لم تكن البيانات موجودة في أي مكان، جلبها من API مرة واحدة فقط
        isFetchingOnboardingRef.current = true;
        hasCheckedOnboardingRef.current = true;

        if (pathname !== "/onboarding") {
          try {
            const response = await axiosInstance.get("/user");
            const userData = response.data.data;
            // تحديد onboarding_completed بناءً على account_type
            // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
            const accountType = userData.account_type || userData.user?.account_type;
            const isEmployee = accountType === "employee";
            const completed = isEmployee ? true : (userData.onboarding_completed ?? undefined);
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
            const userData = response.data.data;
            // تحديد onboarding_completed بناءً على account_type
            // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
            const accountType = userData.account_type || userData.user?.account_type;
            const isEmployee = accountType === "employee";
            const completed = isEmployee ? true : (userData.onboarding_completed ?? undefined);
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
      } else {
      }
    }
    fetchUser();
    // إزالة pathname من dependencies لتجنب إعادة الجلب عند التنقل
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, IsLoading, UserIslogged, onboardingCompleted]);

  useEffect(() => {
    if (pathname?.startsWith("/login")) {
      const urlParams = new URLSearchParams(window.location.search);
      const hasToken = urlParams.get("token");
      if (userData && userData.email && !hasToken) {
        router.push("/dashboard");
      }
    }
  }, [userData, router]);

  // دالة لإزالة locale من pathname
  const removeLocaleFromPath = (pathname: string) => {
    const localePattern = /^\/[a-z]{2}\//;
    if (localePattern.test(pathname)) {
      return pathname.replace(/^\/[a-z]{2}\//, "/");
    }
    return pathname;
  };

  // جلب بيانات المستخدم من /user عند فتح صفحة /live-editor
  useEffect(() => {
    if (!isMounted || IsLoading) return;

    const pathWithoutLocale = removeLocaleFromPath(pathname || "");

    if (
      pathWithoutLocale === "/live-editor" ||
      pathWithoutLocale.startsWith("/live-editor/")
    ) {
      // منع إعادة الجلب إذا كان هناك طلب قيد التنفيذ أو تم الجلب من قبل
      if (
        isFetchingLiveEditorDataRef.current ||
        hasFetchedLiveEditorDataRef.current
      ) {
        return;
      }

      // جلب البيانات من /user API
      const fetchUserFromAPI = async () => {
        isFetchingLiveEditorDataRef.current = true;
        try {
          const response = await axiosInstance.get("/user");
          if (response.data && response.data.data) {
            const userApiData = response.data.data;
            // تحديد onboarding_completed بناءً على account_type
            // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
            const accountType = userApiData.account_type || userApiData.user?.account_type;
            const isEmployee = accountType === "employee";
            const onboardingCompleted = isEmployee 
              ? true 
              : (userApiData.onboarding_completed ?? userApiData.user?.onboarding_completed);
            
            // تحديث userData في الـ store مع البيانات الجديدة
            const currentUserData = useAuthStore.getState().userData;
            useAuthStore.getState().setUserData({
              ...currentUserData,
              ...userApiData,
              onboarding_completed: onboardingCompleted,
            });
            hasFetchedLiveEditorDataRef.current = true;
          }
        } catch (error) {
          console.error("Error fetching user data from /user API:", error);
        } finally {
          isFetchingLiveEditorDataRef.current = false;
        }
      };

      fetchUserFromAPI();
    } else {
      // إعادة تعيين المرجع عند الخروج من صفحة /live-editor
      hasFetchedLiveEditorDataRef.current = false;
    }
  }, [isMounted, IsLoading, pathname]);

  // السماح بصفحات معينة بدون تسجيل دخول
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
