import { create } from "zustand";

const useCustomersFiltersStore = create((set, get) => ({
  // Filter states
  searchTerm: "",
  filterType: "all",
  filterCity: "all",
  filterDistrict: "all",
  filterPriority: "all",
  filterEmployee: "all",
  filterEmployeePhone: "all",
  dateRange: { from: undefined, to: undefined },
  filterProcedure: "all",
  filterStage: "all",
  filterName: "",
  filterEmail: "",
  interestedCategoryIds: [],
  interestedPropertyIds: [],
  sortBy: "created_at",
  sortDir: "asc",

  // Filter data from API - initialize with empty arrays to prevent undefined errors
  filterData: {
    cities: [],
    districts: [],
    types: [],
    priorities: [],
    stages: [],
    procedures: [],
    employees: [],
    categories: [],
    properties: [],
  },
  loadingFilters: true,

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterCity: (city) => set({ filterCity: city }),
  setFilterDistrict: (district) => set({ filterDistrict: district }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setFilterEmployee: (employee) => set({ filterEmployee: employee }),
  setFilterEmployeePhone: (phone) => set({ filterEmployeePhone: phone }),
  setDateRange: (range) => set({ dateRange: range }),
  setFilterProcedure: (procedure) => set({ filterProcedure: procedure }),
  setFilterStage: (stage) => set({ filterStage: stage }),
  setFilterName: (name) => set({ filterName: name }),
  setFilterEmail: (email) => set({ filterEmail: email }),
  setInterestedCategoryIds: (ids) => set({ interestedCategoryIds: ids }),
  setInterestedPropertyIds: (ids) => set({ interestedPropertyIds: ids }),
  setSortBy: (sortBy) => set({ sortBy: sortBy }),
  setSortDir: (sortDir) => set({ sortDir: sortDir }),

  // Set filter data from API
  setFilterData: (data) =>
    set({
      filterData: {
        cities: data?.cities || [],
        districts: data?.districts || [],
        types: data?.types || [],
        priorities: data?.priorities || [],
        stages: data?.stages || [],
        procedures: data?.procedures || [],
        employees: data?.employees || [],
        categories: data?.categories || [],
        properties: data?.properties || [],
      },
      loadingFilters: false,
    }),
  setLoadingFilters: (loading) => set({ loadingFilters: loading }),

  // Clear all filters
  clearAllFilters: () =>
    set({
      searchTerm: "",
      filterType: "all",
      filterCity: "all",
      filterDistrict: "all",
      filterPriority: "all",
      filterEmployee: "all",
      filterEmployeePhone: "all",
      dateRange: { from: undefined, to: undefined },
      filterProcedure: "all",
      filterStage: "all",
      filterName: "",
      filterEmail: "",
      interestedCategoryIds: [],
      interestedPropertyIds: [],
      sortBy: "created_at",
      sortDir: "asc",
    }),

  // Check if any filters are applied
  hasActiveFilters: () => {
    const state = get();
    return (
      state.searchTerm.trim() ||
      state.filterType !== "all" ||
      state.filterCity !== "all" ||
      state.filterDistrict !== "all" ||
      state.filterPriority !== "all" ||
      state.filterEmployee !== "all" ||
      state.filterEmployeePhone.trim() ||
      state.dateRange.from ||
      state.dateRange.to ||
      state.filterProcedure !== "all" ||
      state.filterStage !== "all" ||
      state.filterName.trim() ||
      state.filterEmail.trim() ||
      state.interestedCategoryIds.length > 0 ||
      state.interestedPropertyIds.length > 0 ||
      state.sortBy !== "created_at" ||
      state.sortDir !== "asc"
    );
  },

  // Get current filter state as object
  getCurrentFilters: () => {
    const state = get();
    return {
      searchTerm: state.searchTerm,
      filterType: state.filterType,
      filterCity: state.filterCity,
      filterDistrict: state.filterDistrict,
      filterPriority: state.filterPriority,
      filterEmployee: state.filterEmployee,
      filterEmployeePhone: state.filterEmployeePhone,
      dateRange: state.dateRange,
      filterProcedure: state.filterProcedure,
      filterStage: state.filterStage,
      filterName: state.filterName,
      filterEmail: state.filterEmail,
      interestedCategoryIds: state.interestedCategoryIds,
      interestedPropertyIds: state.interestedPropertyIds,
      sortBy: state.sortBy,
      sortDir: state.sortDir,
    };
  },
}));

export default useCustomersFiltersStore;
