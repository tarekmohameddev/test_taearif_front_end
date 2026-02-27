import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/context/userStore";

interface PermissionCheck {
  hasPermission: boolean;
  loading: boolean;
  userData: any;
  error: string | null;
}

export const usePermissions = () => {
  const pathname = usePathname();

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

  // Map page slugs to permission names (must match backend permission names from /api/user)
  const getPermissionName = (slug: string): string => {
    const permissionMap: { [key: string]: string } = {
      customers: "customers.view",
      live_editor: "live_editor.view",
      properties: "properties.view",
      rentals: "rentals.view",
      projects: "projects.view",
      employees: "employees.view",
      analytics: "analytics.view",
      settings: "settings.view",
      "access-control": "access.control",
      marketing: "marketing.view",
      templates: "templates.view",
      websites: "websites.view",
      "activity-logs": "activity.logs.view",
      "purchase-management": "purchase.management",
      "rental-management": "rentals.view",
      "financial-reporting": "financial.reporting",
      affiliate: "affiliate.view",
      "help-center": "help.center",
      solutions: "solutions.view",
      apps: "apps.view",
      blogs: "blogs.view",
      messages: "messages.view",
      "whatsapp-ai": "whatsapp.ai",
      buildings: "buildings.view",
      "job-applications": "job_applications.view",
      "property-requests": "property_requests.view",
      matching: "property_requests.view",
    };

    return permissionMap[slug] || `${slug}.view`;
  };

  // Initialize user data on first load
  useEffect(() => {
    if (!isInitialized) {
      fetchUserData();
    }
  }, [isInitialized, fetchUserData]);

  // Get current page slug and check permission
  const pageSlug = pathname ? getPageSlug(pathname) : "";
  const hasPermission = pageSlug ? hasAccessToPage(pageSlug) : true;

  // Create permission check object
  const permissionCheck: PermissionCheck = {
    hasPermission,
    loading,
    userData,
    error,
  };

  return {
    ...permissionCheck,
    getPageSlug: () => (pathname ? getPageSlug(pathname) : ""),
    getPermissionName: (slug: string) => getPermissionName(slug),
  };
};
