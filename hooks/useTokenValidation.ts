import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/context/AuthContext";

interface TokenValidation {
  isValid: boolean | null;
  message: string;
  loading: boolean;
}

export const useTokenValidation = () => {
  const [tokenValidation, setTokenValidation] = useState<TokenValidation>({
    isValid: null,
    message: "",
    loading: true,
  });
  const [isSameAccount, setIsSameAccount] = useState(false);
  const [newUserData, setNewUserData] = useState<any>(null);
  const [userData, setUserDataState] = useState<any>(null);
  // استخدام useRef لمنع إعادة الجلب
  const hasValidatedRef = useRef(false);
  const isValidatingRef = useRef(false);

  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const setUserData = useAuthStore((state) => state.setUserData);
  const setUserIsLogged = useAuthStore((state) => state.setUserIsLogged);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const fetchUserInfo = async () => {
    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo", {
        credentials: "include",
      });
      const userData = await userInfoResponse.json();
      setUserDataState(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const validateToken = async (token: string) => {
    if (isValidatingRef.current) return;
    if (hasValidatedRef.current && tokenValidation.isValid === true) return;

    setTokenValidation({ isValid: null, message: "", loading: true });
    isValidatingRef.current = true;

    try {
      const store = useAuthStore.getState();
      setUserData({ ...store.userData, token } as any);
      setUserIsLogged(true);
      setAuthenticated(true);

      const result = await store.fetchUserFromAPI();

      if (result.success && result.data) {
        setNewUserData(result.data);
        hasValidatedRef.current = true;
        setTokenValidation({
          isValid: true,
          message: "الـ token صالح - يمكن تسجيل الدخول",
          loading: false,
        });
        setIsLoading(false);
      } else {
        const errorMessage = (result as { error?: string }).error || "الـ token غير صالح";
        setTokenValidation({
          isValid: false,
          message: errorMessage,
          loading: false,
        });
        hasValidatedRef.current = false;
      }
    } catch (error: any) {
      let errorMessage = "الـ token غير صالح";
      if (error?.response?.status === 401) {
        errorMessage = "الـ token منتهي الصلاحية أو غير صحيح";
        clearAuthCookie();
        clearAuthContextData();
        try {
          await logout({ redirect: false, clearStore: true });
        } catch (logoutError) {
          console.error("❌ Error during AuthContext logout:", logoutError);
        }
      } else if (error?.response?.status === 500) {
        errorMessage = "خطأ في الخادم";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setTokenValidation({
        isValid: false,
        message: errorMessage,
        loading: false,
      });
      hasValidatedRef.current = false;
    } finally {
      isValidatingRef.current = false;
    }
  };

  const clearAuthCookie = () => {
    // حذف authToken cookie المحدد
    document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = `authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  };

  const clearAuthContextData = () => {
    // حذف جميع البيانات من AuthContext مباشرة
    setUserData({
      email: null,
      token: null,
      username: null,
      domain: null,
      first_name: null,
      last_name: null,
      is_free_plan: null,
      days_remaining: null,
      package_title: null,
      package_features: [],
      project_limit_number: null,
      real_estate_limit_number: null,
      message: null,
      company_name: null,
      permissions: [],
      account_type: null,
      tenant_id: null,
    });
    setUserIsLogged(false);
    setAuthenticated(false);
    setIsLoading(false);
  };

  const clearAllCookies = () => {
    // حذف authToken cookie أولاً
    clearAuthCookie();

    // حذف جميع الـ cookies الأخرى
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });

    // حذف localStorage
    localStorage.clear();

    // حذف sessionStorage
    sessionStorage.clear();
  };

  const handleInvalidToken = () => {
    clearAllCookies();
    const loginPath = pathname?.startsWith("/ar") ? "/ar/login" : "/login";
    router.push(loginPath);
  };

  useEffect(() => {
    const initializeTokenValidation = async () => {
      // إذا تم التحقق من قبل، لا تعيد التحقق
      if (hasValidatedRef.current) {
        return;
      }

      // التحقق من أن المستخدم ليس في صفحة register
      const currentPath = window.location.pathname;
      // فحص register مع أو بدون locale (مثل /register أو /en/register أو /ar/register)
      const isRegisterPage =
        currentPath === "/register" ||
        currentPath.startsWith("/register/") ||
        /^\/[a-z]{2}\/register(\/|$)/.test(currentPath);

      if (isRegisterPage) {
        setTokenValidation({
          isValid: null,
          message: "تخطي التحقق - صفحة التسجيل",
          loading: false,
        });
        return;
      }

      // جلب بيانات المستخدم من API
      const userInfo = await fetchUserInfo();

      if (!userInfo || !userInfo.token) {
        // بعد تسجيل الدخول مباشرة، الـ store قد يكون محدثاً بينما الـ API لم يُحدّث بعد
        const storeToken = useAuthStore.getState().userData?.token;
        const storeLogged = useAuthStore.getState().UserIslogged;
        if (storeToken && storeLogged) {
          validateToken(storeToken);
          return;
        }
        setTokenValidation({
          isValid: false,
          message: "لا يوجد token",
          loading: false,
        });
        handleInvalidToken();
        return;
      }

      // التحقق من صحة الـ token
      validateToken(userInfo.token);
    };

    initializeTokenValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // تشغيل مرة واحدة فقط

  useEffect(() => {
    // التحقق من أن المستخدم ليس في صفحة register قبل إعادة التوجيه
    const currentPath = window.location.pathname;
    // فحص register مع أو بدون locale (مثل /register أو /en/register أو /ar/register)
    const isRegisterPage =
      currentPath === "/register" ||
      currentPath.startsWith("/register/") ||
      /^\/[a-z]{2}\/register(\/|$)/.test(currentPath);

    if (isRegisterPage) {
      return;
    }

    if (tokenValidation.isValid === false && !tokenValidation.loading) {
      handleInvalidToken();
    }
  }, [tokenValidation.isValid, tokenValidation.loading]);

  return {
    tokenValidation,
    isSameAccount,
    newUserData,
    validateToken,
    clearAuthCookie,
    clearAuthContextData,
    clearAllCookies,
    handleInvalidToken,
  };
};
