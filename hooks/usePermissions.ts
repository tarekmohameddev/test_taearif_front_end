import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/context/userStore";
import useAuthStore from "@/context/AuthContext";
import { getPermissionNameForSlug } from "@/lib/permissions/slugToPermission";

interface PermissionCheck {
  hasPermission: boolean;
  loading: boolean;
  userData: any;
  error: string | null;
}

export const usePermissions = () => {
  const pathname = usePathname();

  // Wait for Auth token before calling userStore.fetchUserData (avoids 401 on /user)
  const { userData: authUserData, IsLoading: authLoading } = useAuthStore();

  // Get state and actions from Zustand store
  const {
    userData,
    loading,
    error,
    fetchUserData,
    hasAccessToPage,
    isInitialized,
  } = useUserStore();

  // Extract slug from pathname (remove locale and /dashboard prefix)
  const getPageSlug = (pathname: string): string => {
    // Remove locale prefix (e.g., /ar, /en)
    let cleanPath = pathname.replace(/^\/[a-z]{2}/, "");

    // Remove /dashboard prefix
    cleanPath = cleanPath.replace(/^\/dashboard/, "");

    // Remove leading slash and get the first segment
    const segments = cleanPath.split("/").filter(Boolean);
    return segments.length > 0 ? segments[0] : "";
  };

  // Initialize user data on first load — only after Auth token is ready to avoid 401
  useEffect(() => {
    if (authLoading || !authUserData?.token) {
      return;
    }
    if (!isInitialized) {
      fetchUserData();
    }
  }, [isInitialized, fetchUserData, authLoading, authUserData?.token]);

  // Get current page slug and check permission
  const pageSlug = pathname ? getPageSlug(pathname) : "";
  const hasPermission = pageSlug ? hasAccessToPage(pageSlug) : true;

  // Consider loading while Auth is still loading (so we don't show content before token is ready)
  const permissionCheck: PermissionCheck = {
    hasPermission,
    loading: loading || authLoading,
    userData,
    error,
  };

  return {
    ...permissionCheck,
    getPageSlug: () => (pathname ? getPageSlug(pathname) : ""),
    getPermissionName: (slug: string) => getPermissionNameForSlug(slug),
  };
};
