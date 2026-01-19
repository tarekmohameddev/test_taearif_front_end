import axiosInstance from "@/lib/axiosInstance";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

export default (set) => ({
  incomplete_propertiesManagement: {
    viewMode: "grid",
    favorites: [],
    properties: [],
    loading: false,
    error: null,
    isInitialized: false,
    pagination: null,
  },

  setIncompletePropertiesManagement: (newState) =>
    set((state) => ({
      incomplete_propertiesManagement: {
        ...state.incomplete_propertiesManagement,
        ...newState,
      },
    })),
});
