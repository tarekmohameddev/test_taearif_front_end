import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

export default (set, get) => ({
  // Owner Rentals Management
  rentalOwnerDashboard: {
    owners: [],
    pagination: null,
    loading: false,
    error: null,
    searchTerm: "",
    statusFilter: "all", // all, active, inactive
    isInitialized: false,
    selectedOwnerDetails: null,
    loadingOwnerDetails: false,
    ownerDetailsError: null,
    availableProperties: [],
    loadingProperties: false,
    assignedProperties: [],
    assignedPropertiesPagination: null,
    loadingAssignedProperties: false,
    assignedPropertiesError: null,
    /** PREVENT_DUPLICATE_API_PROMPT */
    lastFetchedOwnerRentalsKey: null,
    lastFetchedOwnerDetailsId: null,
    lastFetchedProperties: false,
    lastFetchedAssignedKey: null,
  },

  setRentalOwnerDashboard: (newState) =>
    set((state) => ({
      rentalOwnerDashboard: {
        ...state.rentalOwnerDashboard,
        ...newState,
      },
    })),

  // Fetch owners with filters
  fetchOwnerRentals: async (page = 1, perPage = 15) => {
    const state = get();
    const {
      searchTerm,
      statusFilter,
      loading,
      lastFetchedOwnerRentalsKey,
    } = state.rentalOwnerDashboard;

    const paramsKey = `${page}|${perPage}|${searchTerm}|${statusFilter}`;
    if (loading) return;
    if (lastFetchedOwnerRentalsKey === paramsKey) return;

    set((state) => ({
      rentalOwnerDashboard: {
        ...state.rentalOwnerDashboard,
        loading: true,
        error: null,
      },
    }));

    try {
      const params = {
        page,
        per_page: perPage,
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
      };

      const response = await axiosInstance.get("/v1/user/owner-rentals", {
        params,
      });

      if (response.data.success) {
        set((state) => ({
          rentalOwnerDashboard: {
            ...state.rentalOwnerDashboard,
            owners: response.data.data.data,
            pagination: {
              current_page: response.data.data.current_page,
              per_page: response.data.data.per_page,
              total: response.data.data.total,
              last_page: response.data.data.last_page,
              from: response.data.data.from,
              to: response.data.data.to,
              has_more_pages:
                response.data.data.current_page < response.data.data.last_page,
              next_page_url: response.data.data.next_page_url,
              prev_page_url: response.data.data.prev_page_url,
            },
            loading: false,
            isInitialized: true,
            lastFetchedOwnerRentalsKey: paramsKey,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching owner rentals:", error);
      set((state) => ({
        rentalOwnerDashboard: {
          ...state.rentalOwnerDashboard,
          loading: false,
          error:
            error.response?.data?.message || "Failed to fetch owner rentals",
        },
      }));
    }
  },

  // Fetch single owner details
  fetchOwnerDetails: async (ownerRentalId) => {
    const state = get();
    const { loadingOwnerDetails, lastFetchedOwnerDetailsId } =
      state.rentalOwnerDashboard;

    if (loadingOwnerDetails) return;
    if (lastFetchedOwnerDetailsId === ownerRentalId) return;

    set((state) => ({
      rentalOwnerDashboard: {
        ...state.rentalOwnerDashboard,
        loadingOwnerDetails: true,
        ownerDetailsError: null,
      },
    }));

    try {
      const response = await axiosInstance.get(
        `/v1/user/owner-rentals/${ownerRentalId}`,
      );

      if (response.data.success) {
        set((state) => ({
          rentalOwnerDashboard: {
            ...state.rentalOwnerDashboard,
            selectedOwnerDetails: response.data.data,
            loadingOwnerDetails: false,
            lastFetchedOwnerDetailsId: ownerRentalId,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching owner details:", error);
      set((state) => ({
        rentalOwnerDashboard: {
          ...state.rentalOwnerDashboard,
          loadingOwnerDetails: false,
          ownerDetailsError:
            error.response?.data?.message || "Failed to fetch owner details",
        },
      }));
    }
  },

  // Fetch available properties (excluding already assigned ones)
  fetchAvailableProperties: async () => {
    const state = get();
    const { loadingProperties, lastFetchedProperties } =
      state.rentalOwnerDashboard;

    if (loadingProperties) return;
    if (lastFetchedProperties) return;

    set((state) => ({
      rentalOwnerDashboard: {
        ...state.rentalOwnerDashboard,
        loadingProperties: true,
      },
    }));

    try {
      const response = await axiosInstance.get("/v1/user/properties", {
        params: {
          per_page: 15,
          exclude_assigned: true,
        },
      });

      // البيانات موجودة في response.data.data.data (array من العقارات)
      const properties =
        response.data.data.data ||
        response.data.data.properties ||
        response.data.data ||
        [];

      set((state) => ({
        rentalOwnerDashboard: {
          ...state.rentalOwnerDashboard,
          availableProperties: Array.isArray(properties) ? properties : [],
          loadingProperties: false,
          lastFetchedProperties: true,
        },
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      set((state) => ({
        rentalOwnerDashboard: {
          ...state.rentalOwnerDashboard,
          availableProperties: [],
          loadingProperties: false,
        },
      }));
    }
  },

  // Assign properties to owner
  assignPropertiesToOwner: async (ownerRentalId, propertyIds) => {
    try {
      const response = await axiosInstance.post(
        `/v1/user/owner-rentals/${ownerRentalId}/properties`,
        { property_ids: propertyIds },
      );

      if (response.data.success) {
        // Update the owner details if they're currently loaded
        const state = get();
        if (
          state.rentalOwnerDashboard.selectedOwnerDetails &&
          state.rentalOwnerDashboard.selectedOwnerDetails.id === ownerRentalId
        ) {
          set((state) => ({
            rentalOwnerDashboard: {
              ...state.rentalOwnerDashboard,
              selectedOwnerDetails: response.data.data.owner_rental,
            },
          }));
        }
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error assigning properties to owner:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to assign properties",
      };
    }
  },

  // Update owner rental
  updateOwnerRental: async (ownerRentalId, updateData) => {
    try {
      const response = await axiosInstance.put(
        `/v1/user/owner-rentals/${ownerRentalId}`,
        updateData,
      );

      if (response.data.success) {
        // Update the owner in the list
        const state = get();
        const updatedOwners = state.rentalOwnerDashboard.owners.map((owner) =>
          owner.id === ownerRentalId ? response.data.data : owner,
        );

        set((state) => ({
          rentalOwnerDashboard: {
            ...state.rentalOwnerDashboard,
            owners: updatedOwners,
          },
        }));

        // Update selected owner details if open
        if (
          state.rentalOwnerDashboard.selectedOwnerDetails &&
          state.rentalOwnerDashboard.selectedOwnerDetails.id === ownerRentalId
        ) {
          set((state) => ({
            rentalOwnerDashboard: {
              ...state.rentalOwnerDashboard,
              selectedOwnerDetails: response.data.data,
            },
          }));
        }

        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error updating owner rental:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update owner rental",
      };
    }
  },

  // Change owner password
  changeOwnerPassword: async (ownerRentalId, password) => {
    try {
      const response = await axiosInstance.put(
        `/v1/user/owner-rentals/${ownerRentalId}`,
        { password },
      );

      if (response.data.success) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error changing owner password:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to change password",
      };
    }
  },

  // Fetch assigned properties for owner
  fetchAssignedProperties: async (ownerRentalId, page = 1, perPage = 15) => {
    const state = get();
    const {
      loadingAssignedProperties,
      lastFetchedAssignedKey,
    } = state.rentalOwnerDashboard;

    const paramsKey = `${ownerRentalId}|${page}|${perPage}`;
    if (loadingAssignedProperties) return;
    if (lastFetchedAssignedKey === paramsKey) return;

    set((state) => ({
      rentalOwnerDashboard: {
        ...state.rentalOwnerDashboard,
        loadingAssignedProperties: true,
        assignedPropertiesError: null,
      },
    }));

    try {
      const response = await axiosInstance.get(
        `/v1/user/owner-rentals/${ownerRentalId}/properties`,
        {
          params: {
            per_page: perPage,
            page,
          },
        },
      );

      if (response.data.success) {
        set((state) => ({
          rentalOwnerDashboard: {
            ...state.rentalOwnerDashboard,
            assignedProperties: response.data.data.data || [],
            assignedPropertiesPagination: {
              current_page: response.data.data.current_page,
              per_page: response.data.data.per_page,
              total: response.data.data.total,
              last_page: response.data.data.last_page,
              from: response.data.data.from,
              to: response.data.data.to,
            },
            loadingAssignedProperties: false,
            lastFetchedAssignedKey: paramsKey,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching assigned properties:", error);
      set((state) => ({
        rentalOwnerDashboard: {
          ...state.rentalOwnerDashboard,
          assignedProperties: [],
          loadingAssignedProperties: false,
          assignedPropertiesError:
            error.response?.data?.message ||
            "Failed to fetch assigned properties",
        },
      }));
    }
  },

  // Remove property from owner rental
  removePropertyFromOwner: async (ownerRentalId, propertyId) => {
    console.log(
      "Store: removePropertyFromOwner called with:",
      ownerRentalId,
      propertyId,
    );
    try {
      const response = await axiosInstance.delete(
        `/v1/user/owner-rentals/${ownerRentalId}/properties/${propertyId}`,
      );

      console.log("Store: API response:", response.data);

      if (response.data.success) {
        // Remove property from the assigned properties list
        const state = get();
        const updatedProperties =
          state.rentalOwnerDashboard.assignedProperties.filter(
            (property) => property.id !== propertyId,
          );

        set((state) => ({
          rentalOwnerDashboard: {
            ...state.rentalOwnerDashboard,
            assignedProperties: updatedProperties,
          },
        }));

        return { success: true, data: response.data };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error("Error removing property from owner:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to remove property",
      };
    }
  },

  // Delete owner rental
  deleteOwnerRental: async (ownerRentalId) => {
    try {
      const response = await axiosInstance.delete(
        `/v1/user/owner-rentals/${ownerRentalId}`,
      );

      if (response.data.success) {
        // Remove owner from the list
        const state = get();
        const updatedOwners = state.rentalOwnerDashboard.owners.filter(
          (owner) => owner.id !== ownerRentalId,
        );

        set((state) => ({
          rentalOwnerDashboard: {
            ...state.rentalOwnerDashboard,
            owners: updatedOwners,
          },
        }));

        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error deleting owner rental:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete owner rental",
      };
    }
  },

  // Create owner rental
  createOwnerRental: async (ownerData) => {
    try {
      const response = await axiosInstance.post(
        `/v1/user/owner-rentals`,
        ownerData,
      );

      if (response.data.success) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error creating owner rental:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create owner rental",
      };
    }
  },

  // Clear owner rentals
  clearOwnerRentals: () =>
    set((state) => ({
      rentalOwnerDashboard: {
        ...state.rentalOwnerDashboard,
        owners: [],
        pagination: null,
        searchTerm: "",
        statusFilter: "all",
        isInitialized: false,
        selectedOwnerDetails: null,
      },
    })),
});
