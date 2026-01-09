import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set) => ({
  dashboardDevice: [],
  isDashboardDeviceUpdated: false,
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

    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/devices`,
      );
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardDevice: response.data.devices,
          isDashboardDeviceUpdated: true,
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
