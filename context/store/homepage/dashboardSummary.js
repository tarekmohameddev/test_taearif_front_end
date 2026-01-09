import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set) => ({
  dashboardSummary: null,
  isDashboardSummaryUpdated: false,
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

    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/summary`,
      );
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardSummary: response.data,
          isDashboardSummaryUpdated: true,
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
