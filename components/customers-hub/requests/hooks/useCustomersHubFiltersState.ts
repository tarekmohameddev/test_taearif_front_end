import { useState, useEffect, useMemo, useRef } from "react";
import type { CustomerSource, Priority, CustomerActionType, ObjectType } from "@/types/unified-customer";

const REQUEST_TYPES: CustomerActionType[] = ["new_inquiry", "callback_request", "whatsapp_incoming"];
const FOLLOWUP_TYPES: CustomerActionType[] = ["follow_up", "site_visit"];

export const useCustomersHubFiltersState = () => {
  // Filter states - local state like Properties
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"inbox" | "followups" | "all" | "completed">("all");
  // Default to property_request source only
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>(["property_request"]);
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<ObjectType[]>([]); // New field: Kind of record
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CustomerActionType[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<"all" | "overdue" | "today" | "week" | "no_date">("all");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

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

    // Tab filter - always set tab
    if (activeTab === "completed") {
      filters.tab = "completed";
      filters.statuses = ["completed"];
    } else {
      // Set tab based on active tab
      if (activeTab === "inbox") {
        filters.tab = "inbox";
        // Only set types if no specific types are selected
        if (selectedTypes.length === 0) {
          filters.types = REQUEST_TYPES;
        }
      } else if (activeTab === "followups") {
        filters.tab = "followups";
        // Only set types if no specific types are selected
        if (selectedTypes.length === 0) {
          filters.types = FOLLOWUP_TYPES;
        }
      } else {
        filters.tab = "all";
      }
    }

    // Search (use applied search query instead of debounced)
    if (appliedSearchQuery?.trim()) {
      filters.search = appliedSearchQuery.trim();
    }

    // Sources filter (changed from source to sources)
    // Always include property_request filter (default behavior)
    if (selectedSources.length > 0) {
      filters.sources = selectedSources;
    } else {
      // Default to property_request if no sources selected
      filters.sources = ["property_request"];
    }

    // ObjectTypes filter (new field: Kind of record)
    if (selectedObjectTypes.length > 0) {
      filters.objectTypes = selectedObjectTypes;
    }

    // Priorities filter (changed from priority to priorities)
    if (selectedPriorities.length > 0) {
      filters.priorities = selectedPriorities;
    }

    // Types filter (changed from type to types, overrides tab type if selected)
    if (selectedTypes.length > 0) {
      filters.types = selectedTypes;
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

    // Default pagination and sorting
    filters.limit = 50;
    filters.offset = 0;
    filters.sort_by = "createdAt";
    filters.sort_dir = "desc";

    console.log("🔍 Building newFilters (Customers Hub - Flat Format):", {
      activeTab,
      selectedSources,
      selectedPriorities,
      selectedTypes,
      filters,
    });

    return filters;
  }, [
    activeTab,
    appliedSearchQuery,
    selectedSources,
    selectedObjectTypes,
    selectedPriorities,
    selectedTypes,
    selectedAssignees,
    dueDateFilter,
    selectedCities,
    selectedStates,
    budgetMin,
    budgetMax,
    selectedPropertyTypes,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocalSearchQuery("");
    setAppliedSearchQuery("");
    setActiveTab("all");
    setSelectedSources(["property_request"]); // Reset to property_request default
    setSelectedObjectTypes([]);
    setSelectedPriorities([]);
    setSelectedTypes([]);
    setSelectedAssignees([]);
    setDueDateFilter("all");
    setSelectedCities([]);
    setSelectedStates([]);
    setBudgetMin("");
    setBudgetMax("");
    setSelectedPropertyTypes([]);
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
    selectedTypes,
    setSelectedTypes,
    selectedAssignees,
    setSelectedAssignees,
    dueDateFilter,
    setDueDateFilter,
    selectedCities,
    setSelectedCities,
    selectedStates,
    setSelectedStates,
    budgetMin,
    setBudgetMin,
    budgetMax,
    setBudgetMax,
    selectedPropertyTypes,
    setSelectedPropertyTypes,
    // Computed filters object
    newFilters,
    // Handlers
    applySearch,
    handleClearFilters,
  };
};
