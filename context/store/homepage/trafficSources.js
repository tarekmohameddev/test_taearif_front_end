import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set, get) => ({
  trafficSources: [],
  isTrafficSourcesUpdated: false,
  loadingTrafficSources: false,
  lastFetchedTrafficSourcesAt: null,
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

    // Prevent duplicate API calls (see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md)
    const homepage = get?.()?.homepage;
    if (homepage?.loadingTrafficSources) {
      return; // CHECK 1: Already fetching
    }
    if (
      homepage?.lastFetchedTrafficSourcesAt &&
      Date.now() - homepage.lastFetchedTrafficSourcesAt < 1000
    ) {
      return; // CHECK 2: Fetched within last second
    }

    set((state) => ({
      homepage: {
        ...state.homepage,
        loadingTrafficSources: true,
      },
    }));
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/traffic-sources`,
      );
      const now = Date.now();
      set((state) => ({
        homepage: {
          ...state.homepage,
          trafficSources: response.data.sources,
          isTrafficSourcesUpdated: true,
          loadingTrafficSources: false,
          lastFetchedTrafficSourcesAt: now,
        },
      }));
    } catch (error) {
      set((state) => ({
        homepage: {
          ...state.homepage,
          loadingTrafficSources: false,
        },
      }));
    } finally {
      set({ loading: false });
    }
  },
});
