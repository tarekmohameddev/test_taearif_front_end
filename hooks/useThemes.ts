import { useState, useEffect, useCallback } from "react";
import { getThemes, setActiveTheme, purchaseTheme } from "@/services/theme/themeService";
import type { Theme, ThemesResponse, Category } from "@/components/settings/themes/types";
import useAuthStore from "@/context/AuthContext";

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

  const fetchThemes = useCallback(async () => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getThemes();
      setThemes(data.themes);
      setActiveThemeId(data.activeTheme);
      setCategories(data.categories);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load themes";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authLoading, userData?.token]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const switchTheme = useCallback(
    async (themeId: string) => {
      // Wait until token is fetched
      if (authLoading || !userData?.token) {
        return { success: false, error: "Token not ready" };
      }

      try {
        setError(null);
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
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to switch theme";
        setError(message);
        return { success: false, error: message };
      }
    },
    [authLoading, userData?.token],
  );

  const purchaseAndSwitch = useCallback(async (themeId: string) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return { success: false, error: "Token not ready" };
    }

    try {
      setError(null);

      // Step 1: Purchase theme
      const purchaseResult = await purchaseTheme(themeId);

      if (purchaseResult.status === "success" && purchaseResult.payment_url) {
        // Step 2: Return payment URL - parent component will handle popup
        return { 
          success: true, 
          redirecting: true,
          paymentUrl: purchaseResult.payment_url 
        };
      } else {
        throw new Error(
          purchaseResult.message || "Failed to initiate purchase",
        );
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to purchase theme";
      setError(message);
      return { success: false, error: message };
    }
  }, [authLoading, userData?.token]);

  const handleThemeSwitch = useCallback(
    async (themeId: string) => {
      // Try to switch directly
      const switchResult = await switchTheme(themeId);

      if (switchResult.requiresPurchase) {
        // If purchase required, initiate purchase
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
