import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set) => ({
  trafficSources: [],
  isTrafficSourcesUpdated: false,
  setTrafficSources: (data) =>
    set((state) => ({
      homepage: {
        ...state.homepage,
        trafficSources: data,
        isTrafficSourcesUpdated: true,
      },
    })),

  fetchTrafficSources: async () => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/traffic-sources`,
      );
      set((state) => ({
        homepage: {
          ...state.homepage,
          trafficSources: response.data.sources,
          isTrafficSourcesUpdated: true,
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
