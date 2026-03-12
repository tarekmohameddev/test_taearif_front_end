import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set, get) => ({
  visitorData: {
    7: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false,
    },
    30: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false,
    },
    90: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false,
    },
    365: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false,
    },
  },
  selectedTimeRange: "7",
  loadingVisitorData: false,
  lastFetchedVisitorDataKey: null,
  lastFetchedVisitorDataAt: null,

  setVisitorData: (timeRange, data) =>
    set((state) => ({
      homepage: {
        ...state.homepage,
        visitorData: {
          ...state.homepage.visitorData,
          [timeRange]: data,
        },
      },
    })),

  setSelectedTimeRange: (timeRange) =>
    set((state) => ({
      homepage: {
        ...state.homepage,
        selectedTimeRange: timeRange,
      },
    })),

  fetchVisitorData: async (timeRange) => {
    // Wait until token is fetched
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    // Prevent duplicate API calls (see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md)
    const homepage = get?.()?.homepage;
    if (homepage?.loadingVisitorData) {
      return; // CHECK 1: Already fetching
    }
    if (
      homepage?.lastFetchedVisitorDataKey === String(timeRange) &&
      homepage?.lastFetchedVisitorDataAt &&
      Date.now() - homepage.lastFetchedVisitorDataAt < 1000
    ) {
      return; // CHECK 2: Same timeRange fetched within last second
    }

    set((state) => ({
      homepage: {
        ...state.homepage,
        loadingVisitorData: true,
      },
    }));
    set({ loading: true });
    try {
      const response = await axiosInstance.post(
        "/dashboard/visitors",
        { time_range: timeRange },
      );
      const now = Date.now();
      set((state) => ({
        homepage: {
          ...state.homepage,
          visitorData: {
            ...state.homepage.visitorData,
            [timeRange]: {
              data: response.data.visitor_data,
              totalVisits: response.data.total_visits,
              totalUniqueVisitors: response.data.total_unique_visitors,
              fetched: true,
            },
          },
          loadingVisitorData: false,
          lastFetchedVisitorDataKey: String(timeRange),
          lastFetchedVisitorDataAt: now,
        },
      }));
    } catch (error) {
      set((state) => ({
        homepage: {
          ...state.homepage,
          loadingVisitorData: false,
        },
      }));
    } finally {
      set({ loading: false });
    }
  },
});
