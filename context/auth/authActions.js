"use client";

/**
 * Auth store actions. Receives Zustand set/get and returns action map.
 * Split from AuthContext.js for smaller compile units.
 * API calls are delegated to @/context/auth/authApi.
 */

import {
  fetchUserFromBackend,
  fetchUserInfoFromBackend,
  loginToBackend,
  setAuthCookie,
  logoutBackend,
  fetchGoogleAuthUrlFromBackend,
  fetchUserWithTokenFromBackend,
} from "@/context/auth/authApi";

export function createAuthActions(set, get) {
  return {
    hydrateUserFromStorage: () => {
      if (typeof window === "undefined") return;
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (!parsed || (!parsed.token && !parsed.email)) return;
        const currentState = get();
        const merged = {
          ...currentState.userData,
          ...parsed,
          token: parsed.token ?? currentState.userData?.token ?? null,
        };
        set({
          userData: merged,
          UserIslogged: true,
          authenticated: true,
        });
      } catch (error) {
        console.error("Error hydrating user from localStorage:", error);
      }
    },

    clickedONSubButton: async () => {
      set({ clickedOnSubButton: "subscription" });
    },

    fetchUserFromAPI: async () => {
      try {
        const subscriptionDATA = await fetchUserFromBackend();
        const currentState = get();
        const userData = subscriptionDATA.user || subscriptionDATA;
        const updatedUserData = {
          ...currentState.userData,
          id: userData.id || subscriptionDATA.id || userData.user?.id || subscriptionDATA.user?.id || currentState.userData?.id || null,
          email: userData.email || currentState.userData?.email || null,
          username: userData.username || currentState.userData?.username || null,
          first_name: userData.first_name || currentState.userData?.first_name || null,
          last_name: userData.last_name || currentState.userData?.last_name || null,
          days_remaining: subscriptionDATA.membership?.days_remaining || currentState.userData?.days_remaining || null,
          is_free_plan: subscriptionDATA.membership?.is_free_plan ?? currentState.userData?.is_free_plan ?? null,
          is_expired: subscriptionDATA.membership?.is_expired ?? currentState.userData?.is_expired ?? false,
          package_title: subscriptionDATA.membership?.package?.title || currentState.userData?.package_title || null,
          package_features: subscriptionDATA.membership?.package?.features || currentState.userData?.package_features || [],
          project_limit_number: subscriptionDATA.membership?.package?.project_limit_number || currentState.userData?.project_limit_number || null,
          real_estate_limit_number: subscriptionDATA.membership?.package?.real_estate_limit_number || currentState.userData?.real_estate_limit_number || null,
          domain: subscriptionDATA.domain ?? userData.domain ?? currentState.userData?.domain ?? null,
          message: subscriptionDATA.message || currentState.userData?.message || null,
          company_name: subscriptionDATA.company_name ?? userData.company_name ?? currentState.userData?.company_name ?? null,
          onboarding_completed: subscriptionDATA.onboarding_completed ?? currentState.userData?.onboarding_completed ?? false,
          token: currentState.userData?.token || null,
          permissions: userData.permissions || currentState.userData?.permissions || [],
          account_type: userData.account_type || currentState.userData?.account_type || null,
          tenant_id: userData.tenant_id || currentState.userData?.tenant_id || null,
        };
        set({
          authenticated: true,
          UserIslogged: true,
          userData: updatedUserData,
          onboarding_completed: subscriptionDATA.onboarding_completed ?? currentState.onboarding_completed ?? false,
        });
        try {
          localStorage.setItem("user", JSON.stringify(updatedUserData));
        } catch (error) {
          console.error("Error saving user data to localStorage:", error);
        }
        if (typeof window !== "undefined") {
          try {
            const { setPlanCookie } = require("@/lib/planCookie");
            setPlanCookie({
              package_title: subscriptionDATA.membership?.package?.title || null,
              is_free_plan: subscriptionDATA.membership?.is_free_plan || false,
              days_remaining: subscriptionDATA.membership?.days_remaining || null,
              is_expired: subscriptionDATA.membership?.is_expired || false,
              package_features: subscriptionDATA.membership?.package?.features || [],
              project_limit_number: subscriptionDATA.membership?.package?.project_limit_number || null,
              real_estate_limit_number: subscriptionDATA.membership?.package?.real_estate_limit_number || null,
              onboarding_completed: subscriptionDATA.onboarding_completed,
              fetched_at: Date.now(),
            });
          } catch (error) {
            console.error("Error setting plan cookie:", error);
          }
        }
        return { success: true, data: updatedUserData };
      } catch (error) {
        console.error("Error fetching user data from API:", error);
        return { success: false, error: error.message || "خطأ في جلب بيانات المستخدم" };
      }
    },

    fetchUserData: async () => {
      set({ IsLoading: true, error: null });
      if (get().IsDone === true) return;
      set({ IsDone: true, error: null });
      try {
        let userData;
        try {
          userData = await fetchUserInfoFromBackend();
        } catch (err) {
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("user");
              sessionStorage.clear();
            } catch (error) {
              console.error("Error clearing storage after failed fetch:", error);
            }
          }
          set({ authenticated: false, UserIslogged: false, userData: null });
          throw err;
        }
        if (!userData || !userData.email) {
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("user");
              sessionStorage.clear();
            } catch (error) {
              console.error("Error clearing storage after invalid data:", error);
            }
          }
          set({ authenticated: false, UserIslogged: false, userData: null });
          return;
        }
        const currentState = get();
        const mergedUserData = {
          ...userData,
          onboarding_completed: userData.onboarding_completed || false,
          message: currentState.userData?.message || null,
          domain: currentState.userData?.domain ?? userData.domain ?? null,
          company_name: currentState.userData?.company_name ?? userData.company_name ?? null,
        };
        set({ UserIslogged: true, userData: mergedUserData, IsLoading: true, error: null });
        try {
          localStorage.setItem("user", JSON.stringify(mergedUserData));
        } catch (error) {
          console.error("Error saving user data to localStorage:", error);
        }
        if (typeof window !== "undefined") {
          try {
            const { getPlanCookie, hasValidPlanCookie } = require("@/lib/planCookie");
            if (hasValidPlanCookie()) {
              const cachedPlan = getPlanCookie();
              if (cachedPlan) {
                const current = get().userData;
                set({
                  authenticated: true,
                  userData: {
                    ...userData,
                    domain: current?.domain ?? userData.domain ?? null,
                    company_name: current?.company_name ?? userData.company_name ?? null,
                    days_remaining: cachedPlan.days_remaining,
                    is_free_plan: cachedPlan.is_free_plan,
                    is_expired: cachedPlan.is_expired,
                    package_title: cachedPlan.package_title,
                    package_features: cachedPlan.package_features,
                    project_limit_number: cachedPlan.project_limit_number,
                    real_estate_limit_number: cachedPlan.real_estate_limit_number,
                    onboarding_completed: cachedPlan.onboarding_completed !== undefined ? cachedPlan.onboarding_completed : userData.onboarding_completed,
                  },
                  onboarding_completed: cachedPlan.onboarding_completed !== undefined ? cachedPlan.onboarding_completed : userData.onboarding_completed,
                });
                return;
              }
            }
          } catch (error) {
            console.error("Error reading plan cookie:", error);
          }
        }
        if (get().userData.is_free_plan == null) {
          const subscriptionDATA = await fetchUserFromBackend();
          if (typeof window !== "undefined") {
            try {
              const { setPlanCookie } = require("@/lib/planCookie");
              setPlanCookie({
                package_title: subscriptionDATA.membership.package.title || null,
                is_free_plan: subscriptionDATA.membership.is_free_plan || false,
                days_remaining: subscriptionDATA.membership.days_remaining || null,
                is_expired: subscriptionDATA.membership.is_expired || false,
                package_features: subscriptionDATA.membership.package.features || [],
                project_limit_number: subscriptionDATA.membership.package.project_limit_number || null,
                real_estate_limit_number: subscriptionDATA.membership.package.real_estate_limit_number || null,
                onboarding_completed: subscriptionDATA.onboarding_completed,
                fetched_at: Date.now(),
              });
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
              package_features: subscriptionDATA.membership.package.features || [],
              project_limit_number: subscriptionDATA.membership.package.project_limit_number || null,
              real_estate_limit_number: subscriptionDATA.membership.package.real_estate_limit_number || null,
              domain: subscriptionDATA.domain || null,
              message: subscriptionDATA.message || null,
              company_name: subscriptionDATA.company_name || null,
              onboarding_completed: subscriptionDATA.onboarding_completed || false,
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
      set((state) => ({ userData: { ...state.userData, message: null } }));
    },

    setMessage: (message) => {
      set((state) => ({ userData: { ...state.userData, message } }));
    },

    login: async (email, password, recaptchaToken) => {
      set({ IsLoading: true, errorLogin: null, errorLoginATserver: null });
      try {
        const loginResult = await loginToBackend(email, password, recaptchaToken);
        if (!loginResult.success) {
          set({ errorLogin: loginResult.error });
          return { success: false, error: loginResult.error };
        }
        const { user, token: UserToken } = loginResult;
        const setAuthResult = await setAuthCookie(user, UserToken);
        if (!setAuthResult.success) {
          set({ errorLogin: setAuthResult.error });
          return { success: false, error: setAuthResult.error };
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
        try {
          localStorage.setItem("user", JSON.stringify(safeUserData));
        } catch (error) {}
        return { success: true };
      } catch (error) {
        const errorMsg = "حدث خطأ أثناء الاتصال بالخادم";
        set({ errorLoginATserver: errorMsg });
        return { success: false, error: error.message || errorMsg };
      } finally {
        set({ IsLoading: false });
      }
    },

    logout: async (options = { redirect: true, clearStore: true }) => {
      try {
        await logoutBackend();
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("user");
            localStorage.clear();
          } catch (error) {
            console.error("Error clearing localStorage:", error);
          }
          try {
            sessionStorage.clear();
          } catch (error) {
            console.error("Error clearing sessionStorage:", error);
          }
          try {
            const { clearPlanCookie } = require("@/lib/planCookie");
            clearPlanCookie();
          } catch (error) {
            console.error("Error clearing plan cookie:", error);
          }
          try {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i];
              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            }
          } catch (error) {
            console.error("Error clearing cookies:", error);
          }
        }
        if (options.clearStore) {
          set({ UserIslogged: false, authenticated: false, userData: null, IsDone: false });
        }
        if (options.redirect) {
          setTimeout(() => { window.location.href = "/login"; }, 200);
        }
      } catch (error) {
        console.error("خطأ أثناء عملية تسجيل الخروج:", error);
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
        if (options.clearStore) {
          set({ UserIslogged: false, authenticated: false, userData: null, IsDone: false });
        }
        if (options.redirect) {
          setTimeout(() => { window.location.href = "/login"; }, 200);
        }
      }
    },

    setOnboardingCompleted: (boolean) => set({ onboarding_completed: boolean }),
    setErrorLogin: (error) => set({ errorLogin: error }),
    setAuthenticated: (value) => set({ authenticated: value }),
    setUserData: (data) => {
      set({ userData: data });
      if (typeof window !== "undefined" && data && (data.token || data.email)) {
        try {
          localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
          console.error("Error persisting user data to localStorage:", error);
        }
      }
    },
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
        const url = await fetchGoogleAuthUrlFromBackend();
        if (url) {
          set({ googleAuthUrl: url, googleUrlFetched: true });
          return url;
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
        set((state) => ({ userData: { ...state.userData, token }, IsLoading: true }));
        const { user, userData } = await fetchUserWithTokenFromBackend(token);
        set({ UserIslogged: true, authenticated: true, userData });
        try {
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {}
        const setAuthResult = await setAuthCookie(user, token);
        if (!setAuthResult.success) {
          throw new Error(setAuthResult.error || "فشل في تعيين التوكن");
        }
        return { success: true };
      } catch (error) {
        set({ errorLoginATserver: "حدث خطأ أثناء الاتصال بالخادم!" });
        return { success: false, error: error.message || "خطأ غير معروف" };
      }
    },
  };
}
