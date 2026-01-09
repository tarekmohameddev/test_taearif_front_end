import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export default (set) => ({
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

    set({ loading: true });
    try {
      const response = await axiosInstance.post(
        // تغيير من get إلى post
        "/dashboard/visitors",
        { time_range: timeRange }, // هذا سيذهب في body الطلب
      );

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
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
