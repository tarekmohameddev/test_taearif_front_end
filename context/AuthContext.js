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

      // تحديد onboarding_completed بناءً على account_type
      // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
      const accountType = userData.account_type || subscriptionDATA.account_type || currentState.userData?.account_type;
      const isEmployee = accountType === "employee";
      const onboardingCompleted = isEmployee 
        ? true 
        : (subscriptionDATA.onboarding_completed ?? currentState.userData?.onboarding_completed ?? false);

      // دمج البيانات الجديدة مع البيانات الموجودة
      const updatedUserData = {
        ...currentState.userData,
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
        onboarding_completed: onboardingCompleted,
        // الحفاظ على التوكن الموجود
        token: currentState.userData?.token || null,
        // الحفاظ على البيانات الأخرى
        permissions:
          userData.permissions || currentState.userData?.permissions || [],
        account_type:
          userData.account_type || subscriptionDATA.account_type || currentState.userData?.account_type || null,
        tenant_id:
          userData.tenant_id || subscriptionDATA.tenant_id || currentState.userData?.tenant_id || null,
      };

      // تحديث الـ store
      set({
        authenticated: true,
        UserIslogged: true,
        userData: updatedUserData,
        onboarding_completed: onboardingCompleted,
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
            onboarding_completed: onboardingCompleted,
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
      const userInfoResponse = await fetch("/api/user/getUserInfo");

      if (!userInfoResponse.ok) {
        set({ authenticated: false });
        throw new Error("فشل في جلب بيانات المستخدم");
      }

      const userData = await userInfoResponse.json();
      const currentState = get();
      
      // تحديد onboarding_completed بناءً على account_type
      // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
      const accountType = userData.account_type || currentState.userData?.account_type;
      const isEmployee = accountType === "employee";
      const onboardingCompleted = isEmployee ? true : (userData.onboarding_completed || false);
      
      set({
        UserIslogged: true,
        userData: {
          ...userData,
          onboarding_completed: onboardingCompleted,
          message: currentState.userData?.message || null, // حفظ الـ message الموجود
        },
        IsLoading: true,
        error: null,
      });

      // تحديث localStorage للتوافق مع AuthProvider
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {}

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
                  onboarding_completed: onboardingCompleted,
                },
                onboarding_completed: onboardingCompleted,
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

        // تحديد onboarding_completed بناءً على account_type
        // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
        const subscriptionAccountType = subscriptionDATA.account_type || subscriptionDATA.user?.account_type || userData.account_type;
        const subscriptionIsEmployee = subscriptionAccountType === "employee";
        const subscriptionOnboardingCompleted = subscriptionIsEmployee 
          ? true 
          : (subscriptionDATA.onboarding_completed || false);

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
              onboarding_completed: subscriptionOnboardingCompleted,
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
            account_type: subscriptionAccountType || userData.account_type || null,
            tenant_id: subscriptionDATA.tenant_id || subscriptionDATA.user?.tenant_id || userData.tenant_id || null,
            onboarding_completed: subscriptionOnboardingCompleted,
          },
          onboarding_completed: subscriptionOnboardingCompleted,
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

      // تحديد onboarding_completed بناءً على account_type
      // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
      const accountType = user.account_type;
      const isEmployee = accountType === "employee";
      const onboardingCompleted = isEmployee ? true : (user.onboarding_completed || false);

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
        account_type: user.account_type || null,
        tenant_id: user.tenant_id || null,
        onboarding_completed: onboardingCompleted,
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
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: get().userData.token }),
      });

      if (response.ok) {
        if (options.clearStore) {
          set({ UserIslogged: false, authenticated: false, userData: null });
        }
        if (options.redirect) {
          window.location.href = "/login";
        }
      } else {
        console.error("فشل تسجيل الخروج");
      }
    } catch (error) {
      console.error("خطأ أثناء عملية تسجيل الخروج:", error);
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

      // تحديد onboarding_completed بناءً على account_type
      // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
      const accountType = user.account_type;
      const isEmployee = accountType === "employee";
      const onboardingCompleted = isEmployee ? true : (user.onboarding_completed || false);

      const userData = {
        ...user,
        token,
        onboarding_completed: onboardingCompleted,
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

  // Live Editor Auth Functions
  liveEditorUser: null,
  liveEditorLoading: false,
  liveEditorError: null,

  // Live Editor Login
  liveEditorLogin: async (email, password) => {
    try {
      set({ liveEditorLoading: true, liveEditorError: null });
      const response = await axios.post(`/api/users/login`, {
        email,
        password,
      });

      const userData = response.data;
      set({ liveEditorUser: userData });
      localStorage.setItem("liveEditorUser", JSON.stringify(userData));

      // Set cookie for backend APIs
      try {
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/`;
      } catch {}

      toast.success("تم تسجيل الدخول بنجاح!");
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل تسجيل الدخول";
      set({ liveEditorError: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ liveEditorLoading: false });
    }
  },

  // Live Editor Register
  liveEditorRegister: async (
    username,
    websiteName,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  ) => {
    try {
      set({ liveEditorLoading: true, liveEditorError: null });
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
      set({ liveEditorUser: userData });
      localStorage.setItem("liveEditorUser", JSON.stringify(userData));

      // Set cookie for backend APIs
      try {
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/`;
      } catch {}

      toast.success("تم التسجيل بنجاح!");
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل التسجيل";
      set({ liveEditorError: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ liveEditorLoading: false });
    }
  },

  // Live Editor Fetch User
  liveEditorFetchUser: async (username, options = {}) => {
    try {
      set({ liveEditorLoading: true, liveEditorError: null });
      const response = await axios.post(
        `/api/users/fetchUsername`,
        { username },
        { signal: options.signal },
      );

      const userData = response.data;
      set({ liveEditorUser: userData });
      localStorage.setItem("liveEditorUser", JSON.stringify(userData));
      return userData;
    } catch (err) {
      if (!axios.isCancel(err)) {
        const errorMessage =
          err.response?.data?.message || "فشل تحميل البيانات";
        set({ liveEditorError: errorMessage });
        throw err;
      }
    } finally {
      set({ liveEditorLoading: false });
    }
  },

  // Live Editor Logout
  liveEditorLogout: async () => {
    try {
      set({ liveEditorLoading: true });
      await axios.post(`/api/users/logout`);
    } catch {
      // Ignore errors
    } finally {
      set({ liveEditorUser: null });
      localStorage.removeItem("liveEditorUser");
      try {
        document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } catch {}
      set({ liveEditorLoading: false });
    }
  },

  // Live Editor Toggle Image
  liveEditorToggleImage: async () => {
    const { liveEditorUser } = get();
    if (!liveEditorUser) return;

    try {
      set({ liveEditorLoading: true });
      const response = await axios.put(`/api/images/toggle-image`, {
        username: liveEditorUser.username,
      });

      const updatedUser = {
        ...liveEditorUser,
        imageToggle: response.data.imageToggle,
      };
      set({ liveEditorUser: updatedUser });
      localStorage.setItem("liveEditorUser", JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to toggle image";
      set({ liveEditorError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ liveEditorLoading: false });
    }
  },

  // Initialize Live Editor User from localStorage
  initializeLiveEditorUser: () => {
    try {
      const storedUser = localStorage.getItem("liveEditorUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        set({ liveEditorUser: userData });
      }
    } catch (error) {
      console.error("Error initializing live editor user:", error);
    }
  },
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
