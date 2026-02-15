"use client";
import { create } from "zustand";
import { serialize as serializeCookie } from "cookie";
import axiosInstance, { unlockAxios } from "@/lib/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  UserIslogged: false,
  IsLoading: true,
  IsDone: false,
  authenticated: false,
  error: null,
  errorLogin: null,
  errorLoginATserver: null,
  onboarding_completed: false,
  clickedOnSubButton: "domains",
  userData: {
    email: null,
    token: null,
    username: null,
    domain: null,
    first_name: null,
    last_name: null,
    is_free_plan: null,
    is_expired: false,
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
  },
  googleUrlFetched: false,
  googleAuthUrl: null,

  clickedONSubButton: async () => {
    set({ clickedOnSubButton: "subscription" });
  },

  // دالة جديدة لجلب بيانات المستخدم من API مباشرة باستخدام axiosInstance
  fetchUserFromAPI: async () => {
    try {
      // فتح axios قبل جلب البيانات لضمان عدم حظر الطلبات
      unlockAxios();

      const response = await axiosInstance.get("/user");
      const subscriptionDATA = response.data.data;
      const currentState = get();

      // استخراج بيانات المستخدم (قد تكون في subscriptionDATA.user أو subscriptionDATA مباشرة)
      const userData = subscriptionDATA.user || subscriptionDATA;

      // دمج البيانات الجديدة مع البيانات الموجودة
      const updatedUserData = {
        ...currentState.userData,
        // إضافة user ID - جرب عدة مسارات محتملة
        id: userData.id || subscriptionDATA.id || userData.user?.id || subscriptionDATA.user?.id || currentState.userData?.id || null,
        // بيانات المستخدم الأساسية
        email: userData.email || currentState.userData?.email || null,
        username: userData.username || currentState.userData?.username || null,
        first_name:
          userData.first_name || currentState.userData?.first_name || null,
        last_name:
          userData.last_name || currentState.userData?.last_name || null,
        // بيانات الاشتراك
        days_remaining:
          subscriptionDATA.membership?.days_remaining ||
          currentState.userData?.days_remaining ||
          null,
        is_free_plan:
          subscriptionDATA.membership?.is_free_plan ??
          currentState.userData?.is_free_plan ??
          null,
        is_expired:
          subscriptionDATA.membership?.is_expired ??
          currentState.userData?.is_expired ??
          false,
        package_title:
          subscriptionDATA.membership?.package?.title ||
          currentState.userData?.package_title ||
          null,
        package_features:
          subscriptionDATA.membership?.package?.features ||
          currentState.userData?.package_features ||
          [],
        project_limit_number:
          subscriptionDATA.membership?.package?.project_limit_number ||
          currentState.userData?.project_limit_number ||
          null,
        real_estate_limit_number:
          subscriptionDATA.membership?.package?.real_estate_limit_number ||
          currentState.userData?.real_estate_limit_number ||
          null,
        // بيانات إضافية
        domain:
          subscriptionDATA.domain || currentState.userData?.domain || null,
        message:
          subscriptionDATA.message || currentState.userData?.message || null,
        company_name:
          subscriptionDATA.company_name ||
          currentState.userData?.company_name ||
          null,
        onboarding_completed:
          subscriptionDATA.onboarding_completed ??
          currentState.userData?.onboarding_completed ??
          false,
        // الحفاظ على التوكن الموجود
        token: currentState.userData?.token || null,
        // الحفاظ على البيانات الأخرى
        permissions:
          userData.permissions || currentState.userData?.permissions || [],
        account_type:
          userData.account_type || currentState.userData?.account_type || null,
        tenant_id:
          userData.tenant_id || currentState.userData?.tenant_id || null,
      };

      // تحديث الـ store
      set({
        authenticated: true,
        UserIslogged: true,
        userData: updatedUserData,
        onboarding_completed:
          subscriptionDATA.onboarding_completed ??
          currentState.onboarding_completed ??
          false,
      });

      // حفظ البيانات في localStorage
      try {
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      } catch (error) {
        console.error("Error saving user data to localStorage:", error);
      }

      // حفظ بيانات الخطة في الكوكي
      if (typeof window !== "undefined") {
        try {
          const { setPlanCookie } = require("@/lib/planCookie");
          const planData = {
            package_title: subscriptionDATA.membership?.package?.title || null,
            is_free_plan: subscriptionDATA.membership?.is_free_plan || false,
            days_remaining: subscriptionDATA.membership?.days_remaining || null,
            is_expired: subscriptionDATA.membership?.is_expired || false,
            package_features:
              subscriptionDATA.membership?.package?.features || [],
            project_limit_number:
              subscriptionDATA.membership?.package?.project_limit_number ||
              null,
            real_estate_limit_number:
              subscriptionDATA.membership?.package?.real_estate_limit_number ||
              null,
            onboarding_completed: subscriptionDATA.onboarding_completed,
            fetched_at: Date.now(),
          };
          setPlanCookie(planData);
        } catch (error) {
          console.error("Error setting plan cookie:", error);
        }
      }

      return { success: true, data: updatedUserData };
    } catch (error) {
      console.error("Error fetching user data from API:", error);
      // لا نحدث حالة الخطأ هنا لأننا لا نريد منع الوصول للداشبورد
      return {
        success: false,
        error: error.message || "خطأ في جلب بيانات المستخدم",
      };
    }
  },

  fetchUserData: async () => {
    set({ IsLoading: true, error: null });
    if (get().IsDone === true) return;
    set({ IsDone: true, error: null });

    // فتح axios قبل جلب البيانات لضمان عدم حظر الطلبات
    unlockAxios();

    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo", {
        credentials: "include", // مهم لإرسال cookies
      });

      if (!userInfoResponse.ok) {
        // إذا فشل جلب البيانات، مسح localStorage و sessionStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("user");
            sessionStorage.clear();
          } catch (error) {
            console.error("Error clearing storage after failed fetch:", error);
          }
        }
        set({
          authenticated: false,
          UserIslogged: false,
          userData: null,
        });
        throw new Error("فشل في جلب بيانات المستخدم");
      }

      const userData = await userInfoResponse.json();
      
      // التحقق من وجود بيانات صحيحة
      if (!userData || !userData.email) {
        // إذا لم تكن هناك بيانات صحيحة، مسح localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("user");
            sessionStorage.clear();
          } catch (error) {
            console.error("Error clearing storage after invalid data:", error);
          }
        }
        set({
          authenticated: false,
          UserIslogged: false,
          userData: null,
        });
        return;
      }

      const currentState = get();
      set({
        UserIslogged: true,
        userData: {
          ...userData,
          onboarding_completed: userData.onboarding_completed || false,
          message: currentState.userData?.message || null, // حفظ الـ message الموجود
        },
        IsLoading: true,
        error: null,
      });

      // تحديث localStorage للتوافق مع AuthProvider
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error saving user data to localStorage:", error);
      }

      // استخدام بيانات الخطة من الكوكي إذا كانت موجودة
      if (typeof window !== "undefined") {
        try {
          const {
            getPlanCookie,
            hasValidPlanCookie,
          } = require("@/lib/planCookie");
          if (hasValidPlanCookie()) {
            const cachedPlan = getPlanCookie();
            if (cachedPlan) {
              set({
                authenticated: true,
                userData: {
                  ...userData,
                  days_remaining: cachedPlan.days_remaining,
                  is_free_plan: cachedPlan.is_free_plan,
                  is_expired: cachedPlan.is_expired,
                  package_title: cachedPlan.package_title,
                  package_features: cachedPlan.package_features,
                  project_limit_number: cachedPlan.project_limit_number,
                  real_estate_limit_number: cachedPlan.real_estate_limit_number,
                  onboarding_completed:
                    cachedPlan.onboarding_completed !== undefined
                      ? cachedPlan.onboarding_completed
                      : userData.onboarding_completed,
                },
                onboarding_completed:
                  cachedPlan.onboarding_completed !== undefined
                    ? cachedPlan.onboarding_completed
                    : userData.onboarding_completed,
              });
              return; // لا حاجة لجلب البيانات من API
            }
          }
        } catch (error) {
          console.error("Error reading plan cookie:", error);
        }
      }

      // إذا لم تكن موجودة في الكوكي، جلبها من API مرة واحدة فقط
      if (get().userData.is_free_plan == null) {
        const ress = await axiosInstance.get("/user");
        const subscriptionDATA = ress.data.data;

        // حفظ البيانات في الكوكي
        if (typeof window !== "undefined") {
          try {
            const { setPlanCookie } = require("@/lib/planCookie");
            const planData = {
              package_title: subscriptionDATA.membership.package.title || null,
              is_free_plan: subscriptionDATA.membership.is_free_plan || false,
              days_remaining:
                subscriptionDATA.membership.days_remaining || null,
              is_expired: subscriptionDATA.membership.is_expired || false,
              package_features:
                subscriptionDATA.membership.package.features || [],
              project_limit_number:
                subscriptionDATA.membership.package.project_limit_number ||
                null,
              real_estate_limit_number:
                subscriptionDATA.membership.package.real_estate_limit_number ||
                null,
              onboarding_completed: subscriptionDATA.onboarding_completed,
              fetched_at: Date.now(),
            };
            setPlanCookie(planData);
          } catch (error) {
            console.error("Error setting plan cookie:", error);
          }
        }

        set({
          authenticated: true,
          userData: {
            ...userData,
            days_remaining: subscriptionDATA.membership.days_remaining || null,
            is_free_plan: subscriptionDATA.membership.is_free_plan || false,
            is_expired: subscriptionDATA.membership.is_expired || false,
            package_title: subscriptionDATA.membership.package.title || null,
            package_features:
              subscriptionDATA.membership.package.features || [],
            project_limit_number:
              subscriptionDATA.membership.package.project_limit_number || null,
            real_estate_limit_number:
              subscriptionDATA.membership.package.real_estate_limit_number ||
              null,
            domain: subscriptionDATA.domain || null,
            message: subscriptionDATA.message || null,
            company_name: subscriptionDATA.company_name || null,
            onboarding_completed:
              subscriptionDATA.onboarding_completed || false,
          },
          onboarding_completed: subscriptionDATA.onboarding_completed || false,
        });
      }

      set({ IsDone: false, error: null });
    } catch (error) {
      set({
        error: error.message || "خطأ في جلب بيانات المستخدم",
        authenticated: false,
        UserIslogged: false,
      });
      set({ IsDone: false, error: null });
    } finally {
      set({ IsLoading: false });
      set({ IsDone: false, error: null });
    }
  },

  clearMessage: () => {
    set((state) => ({
      userData: {
        ...state.userData,
        message: null,
      },
    }));
  },

  setMessage: (message) => {
    set((state) => ({
      userData: {
        ...state.userData,
        message: message,
      },
    }));
  },

  login: async (email, password, recaptchaToken) => {
    set({ IsLoading: true, errorLogin: null, errorLoginATserver: null });

    // فتح axios قبل تسجيل الدخول لضمان عدم حظر الطلبات
    unlockAxios();

    try {
      const externalResponse = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            recaptcha_token: recaptchaToken,
          }),
        },
      );
      if (!externalResponse.ok) {
        const errorData = await externalResponse.json().catch(() => ({}));
        let errorMsg = errorData.message || "فشل تسجيل الدخول";
        if (errorMsg == "Invalid credentials") {
          errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        }
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }

      const { user, token: UserToken } = await externalResponse.json();

      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, UserToken }),
      });

      if (!setAuthResponse.ok) {
        const errorData = await setAuthResponse.json().catch(() => ({}));
        const errorMsg = errorData.error || "فشل في تعيين التوكن";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }

      const data = await setAuthResponse.json();
      if (!data.success) {
        const errorMsg = data.error || "فشل في تعيين التوكن";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }
      const safeUserData = {
        email: user.email,
        token: UserToken,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_completed: user.onboarding_completed || false,
      };
      set({ UserIslogged: true, userData: safeUserData });

      // تحديث localStorage للتوافق مع AuthProvider
      try {
        localStorage.setItem("user", JSON.stringify(safeUserData));
      } catch (error) {}

      unlockAxios(); // ✅ إعادة تفعيل axios

      return { success: true };
    } catch (error) {
      const errorMsg = "حدث خطأ أثناء الاتصال بالخادم";
      set({ errorLoginATserver: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      set({ IsLoading: false });
    }
  },

  logout: async (options = { redirect: true, clearStore: true }) => {
    try {
      // 1. استدعاء API logout لمسح cookie من الخادم
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // مهم لإرسال cookies
      });

      // 2. مسح localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("user");
          localStorage.clear(); // مسح جميع البيانات من localStorage
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }
      }

      // 3. مسح sessionStorage
      if (typeof window !== "undefined") {
        try {
          sessionStorage.clear();
        } catch (error) {
          console.error("Error clearing sessionStorage:", error);
        }
      }

      // 4. مسح plan cookie
      if (typeof window !== "undefined") {
        try {
          const { clearPlanCookie } = require("@/lib/planCookie");
          clearPlanCookie();
        } catch (error) {
          console.error("Error clearing plan cookie:", error);
        }
      }

      // 5. محاولة مسح cookies من جانب العميل (للاستخدام مع cookies غير httpOnly)
      if (typeof window !== "undefined") {
        try {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // محاولة مسح الكوكي من جميع المسارات والنطاقات
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          }
        } catch (error) {
          console.error("Error clearing cookies:", error);
        }
      }

      // 6. مسح الـ store
      if (options.clearStore) {
        set({
          UserIslogged: false,
          authenticated: false,
          userData: null,
          IsDone: false, // إعادة تعيين IsDone للسماح بإعادة جلب البيانات في المستقبل
        });
      }

      // 7. إعادة التوجيه مع تأخير بسيط لضمان اكتمال عملية المسح
      if (options.redirect) {
        // استخدام setTimeout لإعطاء الوقت لضمان اكتمال عملية المسح
        setTimeout(() => {
          window.location.href = "/login";
        }, 200);
      }
    } catch (error) {
      console.error("خطأ أثناء عملية تسجيل الخروج:", error);
      // حتى في حالة الخطأ، حاول مسح البيانات المحلية
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
          const { clearPlanCookie } = require("@/lib/planCookie");
          clearPlanCookie();
        } catch (clearError) {
          console.error("Error clearing data after logout error:", clearError);
        }
      }
      // مسح الـ store حتى في حالة الخطأ
      if (options.clearStore) {
        set({
          UserIslogged: false,
          authenticated: false,
          userData: null,
          IsDone: false,
        });
      }
      // إعادة التوجيه حتى في حالة الخطأ
      if (options.redirect) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 200);
      }
    }
  },

  setOnboardingCompleted: (boolean) => set({ onboarding_completed: boolean }),
  setErrorLogin: (error) => set({ errorLogin: error }),
  setAuthenticated: (value) => set({ authenticated: value }),
  setUserData: (data) => set({ userData: data }),
  setUserIsLogged: (isLogged) => set({ UserIslogged: isLogged }),
  setIsLoading: (loading) => set({ IsLoading: loading }),
  setHasAttemptedLogin: (attempted) => set({ hasAttemptedLogin: attempted }),
  setGoogleUrlFetched: (value) => set({ googleUrlFetched: value }),
  setGoogleAuthUrl: (url) => set({ googleAuthUrl: url }),

  fetchGoogleAuthUrl: async () => {
    const { googleUrlFetched, googleAuthUrl } = get();

    if (googleAuthUrl) return googleAuthUrl;
    if (googleUrlFetched) return null;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/redirect`,
      );
      const data = await response.json();

      if (data.url) {
        set({ googleAuthUrl: data.url, googleUrlFetched: true });
        return data.url;
      }

      set({ googleUrlFetched: true });
      return null;
    } catch (error) {
      console.error("Error fetching Google auth URL:", error);
      set({ googleUrlFetched: true });
      return null;
    }
  },

  loginWithToken: async (token) => {
    try {
      set((state) => ({
        userData: {
          ...state.userData,
          token,
        },
        IsLoading: true,
      }));

      const response = await axiosInstance.get("/user");
      const user =
        response.data.data?.user ||
        response.data.data ||
        response.data.user ||
        response.data;

      const userData = {
        ...user,
        token,
        onboarding_completed: user.onboarding_completed || false,
      };

      set({
        UserIslogged: true,
        authenticated: true,
        userData,
      });

      // تحديث localStorage للتوافق مع AuthProvider
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {}

      unlockAxios(); // ✅ إعادة تفعيل axios

      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, UserToken: token }),
      });

      if (!setAuthResponse.ok) {
        const errorData = await setAuthResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل في تعيين التوكن");
      }

      return { success: true };
    } catch (error) {
      set({ errorLoginATserver: "حدث خطأ أثناء الاتصال بالخادم!" });
      return { success: false, error: error.message || "خطأ غير معروف" };
    }
  },

  liveEditorLoading: false,
  liveEditorError: null,

}));

export default useAuthStore;

// Live Editor React Context (for backward compatibility)
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/login`, {
        email,
        password,
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // also set cookie for backend APIs to read
      try {
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/`;
      } catch {}

      toast.success("تم تسجيل الدخول بنجاح!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل تسجيل الدخول";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username,
    websiteName,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/register`, {
        username,
        websiteName,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      try {
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/`;
      } catch {}
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل التسجيل";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = useCallback(async (username, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `/api/users/fetchUsername`,
        { username },
        { signal: options.signal }, // إضافة الـ signal هنا
      );
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData; // إرجاع البيانات للاستخدام في المكونات الأخرى
    } catch (err) {
      if (!axios.isCancel(err)) {
        // التحقق من أن الخطأ ليس بسبب إلغاء الطلب
        setError(err.response?.data?.message || "فشل تحميل البيانات");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/users/logout`);
    } catch {
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      try {
        document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } catch {}
      setLoading(false);
    }
  };

  const toggleImage = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.put(`/api/images/toggle-image`, {
        username: user.username,
      });
      const updatedUser = { ...user, imageToggle: response.data.imageToggle };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        toggleImage,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
