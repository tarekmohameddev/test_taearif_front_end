import axiosInstance from "@/lib/axiosInstance";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

export default (set) => ({
  propertiesManagement: {
    viewMode: "grid",
    priceRange: [200000, 1000000],
    favorites: [],
    properties: [],
    loading: false,
    error: null,
    isInitialized: false,
    pagination: null,
    propertiesAllData: null,
    incompleteCount: 0,
  },

  setPropertiesManagement: (newState) =>
    set((state) => ({
      propertiesManagement: {
        ...state.propertiesManagement,
        ...newState,
      },
    })),
});
