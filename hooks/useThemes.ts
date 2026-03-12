import { useState, useEffect, useCallback, useRef } from "react";
import { getThemes, setActiveTheme, purchaseTheme } from "@/services/theme/themeService";
import type { Theme, ThemesResponse, Category } from "@/components/settings/themes/types";
import useAuthStore from "@/context/AuthContext";

const THEMES_FETCH_DEBOUNCE_MS = 2000;

export interface UseThemesReturn {
  themes: Theme[];
  activeThemeId: string;
  categories: Category[];
  loading: boolean;
  error: string | null;
  switchTheme: (themeId: string) => Promise<{
    success: boolean;
    requiresPurchase?: boolean;
    themeId?: string;
    price?: number;
    currency?: string;
    error?: string;
  }>;
  purchaseAndSwitch: (themeId: string) => Promise<{
    success: boolean;
    redirecting?: boolean;
    paymentUrl?: string;
    error?: string;
  }>;
  handleThemeSwitch: (themeId: string) => Promise<{
    success: boolean;
    redirecting?: boolean;
    paymentUrl?: string;
    requiresPurchase?: boolean;
    error?: string;
  }>;
  refreshThemes: () => Promise<void>;
}

export function useThemes(): UseThemesReturn {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeThemeId, setActiveThemeId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const lastFetchedThemesAt = useRef<number>(0);
  const loadingThemesRef = useRef<boolean>(false);
  const switchingThemeIdRef = useRef<string | null>(null);
  const purchasingThemeIdRef = useRef<string | null>(null);

  const isAuthReady = !authLoading && !!userData?.token;

  const fetchThemes = useCallback(async () => {
    if (!isAuthReady) {
      setLoading(false);
      return;
    }

    // 1) Loading guard: do not start another request if one is in progress
    if (loadingThemesRef.current) return;

    // 2) Last-fetched guard: skip if we just fetched (avoid rapid duplicate calls)
    const now = Date.now();
    if (now - lastFetchedThemesAt.current < THEMES_FETCH_DEBOUNCE_MS) {
      setLoading(false);
      return;
    }

    loadingThemesRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await getThemes();
      setThemes(data.themes);
      setActiveThemeId(data.activeTheme);
      setCategories(data.categories);
      lastFetchedThemesAt.current = Date.now();
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        errObj?.response?.data?.message ||
        errObj?.message ||
        "Failed to load themes";
      setError(errorMessage);
    } finally {
      loadingThemesRef.current = false;
      setLoading(false);
    }
  }, [isAuthReady]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const switchTheme = useCallback(
    async (themeId: string) => {
      if (!isAuthReady) {
        return { success: false, error: "Token not ready" };
      }
      if (switchingThemeIdRef.current !== null) {
        return { success: false, error: "Request already in progress" };
      }

      switchingThemeIdRef.current = themeId;
      setError(null);
      try {
        const result = await setActiveTheme(themeId);

        if (result.success) {
          setActiveThemeId(themeId);
          return { success: true };
        } else if (result.requires_purchase) {
          return {
            success: false,
            requiresPurchase: true,
            themeId: result.theme_id || themeId,
            price: result.price,
            currency: result.currency,
          };
        } else {
          throw new Error(result.message || "Failed to switch theme");
        }
      } catch (err: unknown) {
        const errObj = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          errObj?.response?.data?.message ||
          errObj?.message ||
          "Failed to switch theme";
        setError(message);
        return { success: false, error: message };
      } finally {
        switchingThemeIdRef.current = null;
      }
    },
    [isAuthReady],
  );

  const purchaseAndSwitch = useCallback(async (themeId: string) => {
    if (!isAuthReady) {
      return { success: false, error: "Token not ready" };
    }
    if (purchasingThemeIdRef.current !== null) {
      return { success: false, error: "Request already in progress" };
    }

    purchasingThemeIdRef.current = themeId;
    setError(null);
    try {
      const purchaseResult = await purchaseTheme(themeId);

      if (purchaseResult.status === "success" && purchaseResult.payment_url) {
        return {
          success: true,
          redirecting: true,
          paymentUrl: purchaseResult.payment_url,
        };
      } else {
        throw new Error(
          purchaseResult.message || "Failed to initiate purchase",
        );
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errObj?.response?.data?.message ||
        errObj?.message ||
        "Failed to purchase theme";
      setError(message);
      return { success: false, error: message };
    } finally {
      purchasingThemeIdRef.current = null;
    }
  }, [isAuthReady]);

  const handleThemeSwitch = useCallback(
    async (themeId: string) => {
      const switchResult = await switchTheme(themeId);

      if (switchResult.requiresPurchase) {
        return await purchaseAndSwitch(themeId);
      }

      return switchResult;
    },
    [switchTheme, purchaseAndSwitch],
  );

  return {
    themes,
    activeThemeId,
    categories,
    loading,
    error,
    switchTheme,
    purchaseAndSwitch,
    handleThemeSwitch,
    refreshThemes: fetchThemes,
  };
}
