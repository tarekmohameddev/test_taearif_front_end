import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set) => ({
  recentActivityData: [],
  isRecentActivityUpdated: false,

  setRecentActivityData: (data) =>
    set({ recentActivityData: data, isRecentActivityUpdated: true }),

  fetchRecentActivityData: async () => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/recent-activity`,
      );
      set({ recentActivityData: response.data, isRecentActivityUpdated: true });
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
