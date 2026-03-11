import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set, get) => ({
  setupProgressData: null,
  isSetupProgressDataUpdated: false,
  loadingSetupProgress: false,
  lastFetchedSetupProgressAt: null,

  fetchSetupProgressData: async () => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // Prevent duplicate API calls (see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md)
    const homepage = get?.()?.homepage;
    if (homepage?.loadingSetupProgress) {
      return; // CHECK 1: Already fetching
    }
    if (
      homepage?.lastFetchedSetupProgressAt &&
      Date.now() - homepage.lastFetchedSetupProgressAt < 1000
    ) {
      return; // CHECK 2: Fetched within last second
    }

    set((state) => ({
      homepage: {
        ...state.homepage,
        loadingSetupProgress: true,
      },
    }));
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/steps/progress");
      const now = Date.now();
      set((state) => ({
        homepage: {
          ...state.homepage,
          setupProgressData: response.data,
          isSetupProgressDataUpdated: true,
          loadingSetupProgress: false,
          lastFetchedSetupProgressAt: now,
        },
      }));
    } catch (error) {
      set((state) => ({
        homepage: {
          ...state.homepage,
          loadingSetupProgress: false,
        },
      }));
    } finally {
      set({ loading: false });
    }
  },
});
