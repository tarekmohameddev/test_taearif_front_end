import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set, get) => ({
  dashboardDevice: [],
  isDashboardDeviceUpdated: false,
  loadingDashboardDevice: false,
  lastFetchedDashboardDeviceAt: null,
  setDashboardDevice: (data) =>
    set((state) => ({
      homepage: {
        ...state.homepage,
        dashboardDevice: data,
        isDashboardDeviceUpdated: true,
      },
    })),

  fetchDashboardDevice: async () => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // Prevent duplicate API calls (see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md)
    const homepage = get?.()?.homepage;
    if (homepage?.loadingDashboardDevice) {
      return; // CHECK 1: Already fetching
    }
    if (
      homepage?.lastFetchedDashboardDeviceAt &&
      Date.now() - homepage.lastFetchedDashboardDeviceAt < 1000
    ) {
      return; // CHECK 2: Fetched within last second
    }

    set((state) => ({
      homepage: {
        ...state.homepage,
        loadingDashboardDevice: true,
      },
    }));
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/devices`,
      );
      const now = Date.now();
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardDevice: response.data.devices,
          isDashboardDeviceUpdated: true,
          loadingDashboardDevice: false,
          lastFetchedDashboardDeviceAt: now,
        },
      }));
    } catch (error) {
      set((state) => ({
        homepage: {
          ...state.homepage,
          loadingDashboardDevice: false,
        },
      }));
    } finally {
      set({ loading: false });
    }
  },
});
