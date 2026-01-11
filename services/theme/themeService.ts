import axiosInstance from "@/lib/axiosInstance";
import type {
  ThemesResponse,
  SetActiveThemeResponse,
  PurchaseResponse,
} from "@/components/settings/themes/types";

/**
 * Get all available themes with user access status
 */
export async function getThemes(): Promise<ThemesResponse> {
  const response = await axiosInstance.get<ThemesResponse>(
    "/settings/theme",
  );
  return response.data;
}

/**
 * Set a theme as active (switch theme)
 */
export async function setActiveTheme(
  themeId: string,
): Promise<SetActiveThemeResponse> {
  const response = await axiosInstance.post<SetActiveThemeResponse>(
    "/settings/theme/set-active",
    { theme_id: themeId },
  );
  return response.data;
}

/**
 * Purchase a theme
 */
export async function purchaseTheme(
  themeId: string,
): Promise<PurchaseResponse> {
  const response = await axiosInstance.post<PurchaseResponse>(
    "/settings/theme/purchase",
    { theme_id: themeId },
  );
  return response.data;
}
