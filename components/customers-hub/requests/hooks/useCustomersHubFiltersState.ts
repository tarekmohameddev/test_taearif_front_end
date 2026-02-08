import { useState, useEffect, useMemo, useRef } from "react";
import type { CustomerSource, Priority, CustomerActionType } from "@/types/unified-customer";

const REQUEST_TYPES: CustomerActionType[] = ["new_inquiry", "callback_request", "whatsapp_incoming"];
const FOLLOWUP_TYPES: CustomerActionType[] = ["follow_up", "site_visit"];

export const useCustomersHubFiltersState = () => {
  // Filter states - local state like Properties
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"inbox" | "followups" | "all" | "completed">("all");
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>([]);
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
  const newFilters = useMemo(() => {
    const filters: any = {};

    // Tab filter
    if (activeTab === "completed") {
      filters.status = ["completed"];
    } else {
      // Only set tab if no specific types are selected
      if (selectedTypes.length === 0) {
        if (activeTab === "inbox") {
          filters.tab = "inbox";
          filters.type = REQUEST_TYPES;
        } else if (activeTab === "followups") {
          filters.tab = "followups";
          filters.type = FOLLOWUP_TYPES;
        } else {
          filters.tab = "all";
        }
      }
    }

    // Search (use applied search query instead of debounced)
    if (appliedSearchQuery?.trim()) {
      filters.search = appliedSearchQuery.trim();
    }

    // Source filter
    if (selectedSources.length > 0) {
      filters.source = selectedSources;
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filters.priority = selectedPriorities;
    }

    // Type filter (overrides tab type if selected)
    if (selectedTypes.length > 0) {
      filters.type = selectedTypes;
    }

    // Assignee filter
    if (selectedAssignees.length > 0) {
      filters.assignedTo = selectedAssignees;
    }

    // Due date filter
    if (dueDateFilter !== "all") {
      filters.dueDate = dueDateFilter;
    }

    // City filter
    if (selectedCities.length > 0) {
      filters.city = selectedCities;
    }

    // State/Region filter
    if (selectedStates.length > 0) {
      filters.state = selectedStates;
    }

    // Budget filter
    if (budgetMin) {
      filters.budgetMin = Number(budgetMin);
    }
    if (budgetMax) {
      filters.budgetMax = Number(budgetMax);
    }

    // Property type filter
    if (selectedPropertyTypes.length > 0) {
      filters.propertyType = selectedPropertyTypes;
    }

    console.log("🔍 Building newFilters (Customers Hub):", {
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
    setSelectedSources([]);
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
