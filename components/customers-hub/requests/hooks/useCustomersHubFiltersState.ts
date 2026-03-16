import { useState, useEffect, useMemo, useRef } from "react";
import type { CustomerSource, Priority, ObjectType } from "@/types/unified-customer";
import type { AppointmentTypeFilter } from "@/lib/services/customers-hub-requests-api";

export const useCustomersHubFiltersState = () => {
  // Filter states - local state like Properties
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"inbox" | "followups" | "all" | "completed">("all");
  // Default to empty sources (property_request moved to objectTypes)
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>([]);
  // Default to property_request objectType only (moved from sources)
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<ObjectType[]>(["property_request"]); // Kind of record
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedAppointmentTypes, setSelectedAppointmentTypes] = useState<AppointmentTypeFilter[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<"all" | "overdue" | "today" | "week" | "no_date">("all");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedStageIds, setSelectedStageIds] = useState<number[]>([]);
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [requestDateFrom, setRequestDateFrom] = useState<string | null>(null);
  const [requestDateTo, setRequestDateTo] = useState<string | null>(null);

  // Applied search query (used in filters - applied manually via button)
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>("");
  
  // Debounced search query (kept for backward compatibility, but not used in filters)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query (optional - for future use)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  
  // Function to apply search (called when user clicks search button)
  const applySearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  // Sync localSearchQuery with searchQuery
  useEffect(() => {
    setLocalSearchQuery(searchQuery || "");
  }, [searchQuery]);

  // Build newFilters object automatically from filter states using useMemo
  // New flat structure matching API format
  const newFilters = useMemo(() => {
    const filters: any = {};

    // Tab filter - always set tab and status based on active tab
    if (activeTab === "completed") {
      filters.tab = "completed";
      filters.status = ["completed"];
    } else {
      // Set tab based on active tab
      if (activeTab === "inbox") {
        filters.tab = "inbox";
        // Use status only, not types
        filters.status = ["pending", "in_progress"];
      } else if (activeTab === "followups") {
        filters.tab = "followups";
        // Use status only, not types
        filters.status = ["pending", "in_progress"];
      } else {
        filters.tab = "all";
        // Use status for "all" tab as well
        filters.status = ["pending", "in_progress"];
      }
    }

    // Search (use applied search query instead of debounced)
    if (appliedSearchQuery?.trim()) {
      filters.search = appliedSearchQuery.trim();
    }

    // Sources filter (changed from source to sources)
    // Only include if sources are selected (property_request moved to objectTypes)
    if (selectedSources.length > 0) {
      filters.sources = selectedSources;
    }

    // ObjectTypes filter (new field: Kind of record)
    // ALWAYS include property_request - it's required for all requests
    if (selectedObjectTypes.length > 0) {
      // Ensure property_request is always included, even if user selects other types
      if (!selectedObjectTypes.includes("property_request")) {
        filters.objectTypes = [...selectedObjectTypes, "property_request"];
      } else {
        filters.objectTypes = selectedObjectTypes;
      }
    } else {
      // Default to property_request if no objectTypes selected
      filters.objectTypes = ["property_request"];
    }

    // Priorities filter (changed from priority to priorities)
    if (selectedPriorities.length > 0) {
      filters.priorities = selectedPriorities;
    }

    // Appointment types filter: property_request only if has ≥1 appointment of selected type(s)
    if (selectedAppointmentTypes.length > 0) {
      filters.appointment_types = selectedAppointmentTypes;
    }

    // Assignees filter (changed from assignedTo to assignees, convert to numbers)
    if (selectedAssignees.length > 0) {
      filters.assignees = selectedAssignees.map(id => parseInt(id.toString()));
    }

    // Due date bucket filter (changed from dueDate to due_date_bucket)
    if (dueDateFilter !== "all") {
      filters.due_date_bucket = dueDateFilter;
    }

    // Cities filter (changed from city to cities)
    if (selectedCities.length > 0) {
      filters.cities = selectedCities;
    }

    // States filter (changed from state to states)
    if (selectedStates.length > 0) {
      filters.states = selectedStates;
    }

    // Pipeline stages filter (property_request_statuses.id)
    if (selectedStageIds.length > 0) {
      filters.stages = selectedStageIds;
    }

    // Budget filters (changed from budgetMin/budgetMax to budget_min/budget_max)
    if (budgetMin) {
      filters.budget_min = Number(budgetMin);
    }
    if (budgetMax) {
      filters.budget_max = Number(budgetMax);
    }

    // Property types filter (changed from propertyType to property_types)
    if (selectedPropertyTypes.length > 0) {
      filters.property_types = selectedPropertyTypes;
    }

    // Request created_at date range filter (date_from / date_to)
    if (requestDateFrom) {
      filters.date_from = requestDateFrom;
    }
    if (requestDateTo) {
      filters.date_to = requestDateTo;
    }

    // Default pagination and sorting
    filters.limit = 50;
    filters.offset = 0;
    filters.sort_by = "createdAt";
    filters.sort_dir = "desc";

    console.log("🔍 Building newFilters (Customers Hub - Flat Format):", {
      activeTab,
      selectedSources,
      selectedPriorities,
      selectedAppointmentTypes,
      filters,
    });

    return filters;
  }, [
    activeTab,
    appliedSearchQuery,
    selectedSources,
    selectedObjectTypes,
    selectedPriorities,
    selectedAppointmentTypes,
    selectedAssignees,
    dueDateFilter,
    selectedCities,
    selectedStates,
    selectedStageIds,
    budgetMin,
    budgetMax,
    selectedPropertyTypes,
    requestDateFrom,
    requestDateTo,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocalSearchQuery("");
    setAppliedSearchQuery("");
    setActiveTab("all");
    setSelectedSources([]); // Reset to empty (property_request moved to objectTypes)
    setSelectedObjectTypes(["property_request"]); // Reset to property_request default
    setSelectedPriorities([]);
    setSelectedAppointmentTypes([]);
    setSelectedAssignees([]);
    setDueDateFilter("all");
    setSelectedCities([]);
    setSelectedStates([]);
    setSelectedStageIds([]);
    setBudgetMin("");
    setBudgetMax("");
    setSelectedPropertyTypes([]);
    setRequestDateFrom(null);
    setRequestDateTo(null);
  };

  return {
    // Filter states
    searchQuery,
    setSearchQuery,
    localSearchQuery,
    setLocalSearchQuery,
    appliedSearchQuery,
    debouncedSearchQuery,
    activeTab,
    setActiveTab,
    selectedSources,
    setSelectedSources,
    selectedObjectTypes,
    setSelectedObjectTypes,
    selectedPriorities,
    setSelectedPriorities,
    selectedAppointmentTypes,
    setSelectedAppointmentTypes,
    selectedAssignees,
    setSelectedAssignees,
    dueDateFilter,
    setDueDateFilter,
    selectedCities,
    setSelectedCities,
    selectedStates,
    setSelectedStates,
    selectedStageIds,
    setSelectedStageIds,
    budgetMin,
    setBudgetMin,
    budgetMax,
    setBudgetMax,
    selectedPropertyTypes,
    setSelectedPropertyTypes,
    requestDateFrom,
    setRequestDateFrom,
    requestDateTo,
    setRequestDateTo,
    // Computed filters object
    newFilters,
    // Handlers
    applySearch,
    handleClearFilters,
  };
};
