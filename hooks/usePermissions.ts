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

  // Consider this hook in a "permissions loading" state only during the first
  // initialization of userStore. After userStore is initialized once, we keep
  // using cached permissions without re-showing the full-screen loading on
  // every dashboard navigation.
  const isFirstPermissionsLoad = !isInitialized;

  const permissionCheck: PermissionCheck = {
    hasPermission,
    // Show loading only while permissions are being initialized for the first time.
    // After isInitialized becomes true, keep loading=false even if AuthStore
    // performs background fetches, so that \"جاري التحقق من الصلاحيات\" appears
    // only once per session.
    loading: isFirstPermissionsLoad && (loading || authLoading),
    userData,
    error,
  };

  return {
    ...permissionCheck,
    getPageSlug: () => (pathname ? getPageSlug(pathname) : ""),
    getPermissionName: (slug: string) => getPermissionNameForSlug(slug),
  };
};
