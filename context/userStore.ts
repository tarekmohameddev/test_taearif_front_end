import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";

interface Permission {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description: string | null;
}

interface UserData {
  id: number;
  tenant_id: number | null;
  account_type: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string | null;
  profile_image: string | null;
  permissions: Permission[];
  [key: string]: any;
}

interface UserState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
}

interface UserActions {
  fetchUserData: () => Promise<void>;
  setUserData: (userData: UserData) => void;
  clearUserData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkPermission: (permissionName: string) => boolean;
  hasAccessToPage: (pageSlug: string | null) => boolean;
  refreshUserData: () => Promise<void>;
}

// Cache duration: 5 minutes (300000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // Initial state
      userData: null,
      loading: false,
      error: null,
      lastFetched: null,
      isInitialized: false,

      // Actions
      fetchUserData: async () => {
        const { lastFetched, userData } = get();

        // Check if we have cached data that's still valid
        if (
          userData &&
          lastFetched &&
          Date.now() - lastFetched < CACHE_DURATION
        ) {
          set({ isInitialized: true });
          return;
        }

        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get("/user");

          if (response.data.status === "success" && response.data.data) {
            const userData: UserData = response.data.data;
            set({
              userData,
              loading: false,
              error: null,
              lastFetched: Date.now(),
              isInitialized: true,
            });
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error);
          set({
            loading: false,
            error: error.message || "خطأ في جلب بيانات المستخدم",
            isInitialized: true,
          });
        }
      },

      setUserData: (userData: UserData) => {
        set({
          userData,
          lastFetched: Date.now(),
          isInitialized: true,
        });
      },

      clearUserData: () => {
        set({
          userData: null,
          loading: false,
          error: null,
          lastFetched: null,
          isInitialized: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      checkPermission: (permissionName: string) => {
        const { userData } = get();
        if (!userData || !userData.permissions) return false;

        return userData.permissions.some(
          (permission) => permission.name === permissionName,
        );
      },

      hasAccessToPage: (pageSlug: string | null) => {
        const { userData } = get();
        if (!userData || !pageSlug) return false;

        // Special handling for access-control page - only for tenants
        if (pageSlug === "access-control") {
          return userData.account_type === "tenant";
        }

        // If user is a tenant, give full access to other pages
        if (userData.account_type === "tenant") {
          return true;
        }

        // Map page slugs to permission names
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
          "rental-management": "rental.management",
          "financial-reporting": "financial.reporting",
          affiliate: "affiliate.view",
          "help-center": "help.center",
          solutions: "solutions.view",
          apps: "apps.view",
          blogs: "blogs.view",
          messages: "messages.view",
          "whatsapp-ai": "whatsapp.ai",
        };

        const requiredPermission =
          permissionMap[pageSlug] || `${pageSlug}.view`;
        return get().checkPermission(requiredPermission);
      },

      refreshUserData: async () => {
        set({ lastFetched: null }); // Force refresh
        await get().fetchUserData();
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        userData: state.userData,
        lastFetched: state.lastFetched,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
