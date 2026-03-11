import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set, get) => ({
  dashboardSummary: null,
  isDashboardSummaryUpdated: false,
  loadingDashboardSummary: false,
  lastFetchedDashboardSummaryAt: null,
  setDashboardSummary: (data) =>
    set((state) => ({
      homepage: {
        ...state.homepage,
        dashboardSummary: data,
        isDashboardSummaryUpdated: true,
      },
    })),

  fetchDashboardSummary: async () => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // Prevent duplicate API calls (see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md)
    const homepage = get?.()?.homepage;
    if (homepage?.loadingDashboardSummary) {
      return; // CHECK 1: Already fetching
    }
    if (
      homepage?.lastFetchedDashboardSummaryAt &&
      Date.now() - homepage.lastFetchedDashboardSummaryAt < 1000
    ) {
      return; // CHECK 2: Fetched within last second
    }

    set((state) => ({
      homepage: {
        ...state.homepage,
        loadingDashboardSummary: true,
      },
    }));
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/summary`,
      );
      const now = Date.now();
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardSummary: response.data,
          isDashboardSummaryUpdated: true,
          loadingDashboardSummary: false,
          lastFetchedDashboardSummaryAt: now,
        },
      }));
    } catch (error) {
      set((state) => ({
        homepage: {
          ...state.homepage,
          loadingDashboardSummary: false,
        },
      }));
    } finally {
      set({ loading: false });
    }
  },
});
