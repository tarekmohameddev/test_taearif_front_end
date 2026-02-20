"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Inbox,
  CalendarClock,
  ListTodo,
  CheckCircle2,
  ArrowLeft,
  Filter,
  Search,
  ChevronDown,
  AlertTriangle,
  Timer,
  UserPlus,
  MessageSquare,
  LayoutGrid,
  LayoutList,
  Table2,
  X,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "../actions/IncomingActionsCard";
import { BulkActionsToolbar } from "../actions/BulkActionsToolbar";
import { QuickViewPanel } from "../actions/QuickViewPanel";
import { ActionHistoryList } from "../actions/ActionHistoryList";
import { SourceBadge } from "../actions/SourceBadge";
import { TableRequestsList } from "./TableRequestsList";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { useCustomersHubFiltersState } from "./hooks/useCustomersHubFiltersState";
import { Progress } from "@/components/ui/progress";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";
import type { CustomerStatistics } from "@/types/unified-customer";
import type {
  CustomerAction,
  CustomerActionType,
  CustomerSource,
  Priority,
  UnifiedCustomer,
} from "@/types/unified-customer";
import {
  getOverdueActions,
  getActionsDueToday,
  sortActionsByPriority,
} from "@/lib/utils/action-helpers";
import type { StageDistribution, RequestsListParams, RequestsListFilters } from "@/lib/services/customers-hub-requests-api";

const priorityLabels: Record<Priority, string> = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "urgent", label: "عاجل", color: "bg-red-100 text-red-700" },
  { value: "high", label: "مهم", color: "bg-orange-100 text-orange-700" },
  { value: "medium", label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  { value: "low", label: "منخفض", color: "bg-green-100 text-green-700" },
];

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
}

function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "إلغاء",
  onConfirm,
  variant = "default",
  icon,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent>
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div
                className={cn(
                  "p-2 rounded-full",
                  variant === "danger"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-600"
                )}
              >
                {icon}
              </div>
            )}
            <CustomDialogTitle>{title}</CustomDialogTitle>
          </div>
          <CustomDialogDescription className="text-base text-gray-600 mt-2">
            {description}
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={cn(
              "min-w-[100px]",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            )}
          >
            {confirmText}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}

const actionTypeLabels: Record<CustomerActionType, string> = {
  new_inquiry: "استفسار جديد",
  callback_request: "طلب اتصال",
  property_match: "مطابقة عقار",
  follow_up: "متابعة",
  document_required: "مستندات",
  payment_due: "دفع مستحق",
  site_visit: "معاينة",
  whatsapp_incoming: "واتساب",
  ai_recommended: "موصى به",
};

// Property type filter options (Arabic labels)
const PROPERTY_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "villa", label: "فيلا" },
  { value: "apartment", label: "شقة" },
  { value: "land", label: "أرض" },
  { value: "commercial", label: "تجاري" },
];

// Saudi regions (states) for filter
const SAUDI_REGIONS = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "الشرقية",
  "القصيم",
  "عسير",
  "تبوك",
  "حائل",
  "الحدود الشمالية",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
] as const;

// Map city name to region (state) for filtering
const CITY_TO_REGION: Record<string, string> = {
  الرياض: "الرياض",
  جدة: "مكة المكرمة",
  مكة: "مكة المكرمة",
  الدمام: "الشرقية",
  الخبر: "الشرقية",
  الظهران: "الشرقية",
  أبها: "عسير",
  "خميس مشيط": "عسير",
  المدينة: "المدينة المنورة",
  بريدة: "القصيم",
  حائل: "حائل",
  تبوك: "تبوك",
  نجران: "نجران",
  جازان: "جازان",
  الباحة: "الباحة",
  الجوف: "الجوف",
};

// Request types: customer-originated (inbound)
const REQUEST_TYPES: CustomerActionType[] = [
  "new_inquiry",
  "callback_request",
  "whatsapp_incoming",
];

const FOLLOWUP_TYPES: CustomerActionType[] = ["follow_up", "site_visit"];

interface RequestsCenterPageProps {
  actions?: CustomerAction[];
  stats?: any;
  stages?: StageDistribution[];
  filterOptions?: any;
  loading?: boolean;
  error?: string | null;
  pagination?: any;
  onFetchRequests?: (params: RequestsListFilters | RequestsListParams) => Promise<void>;
  onCompleteAction?: (actionId: string, notes?: string) => Promise<boolean>;
  onDismissAction?: (actionId: string, reason?: string) => Promise<boolean>;
  onSnoozeAction?: (actionId: string, snoozeUntil: string, reason?: string) => Promise<boolean>;
  onAssignAction?: (actionId: string, employeeId: number) => Promise<boolean>;
  onCompleteMultipleActions?: (actionIds: string[], notes?: string) => Promise<boolean>;
  onDismissMultipleActions?: (actionIds: string[], reason?: string) => Promise<boolean>;
  onSnoozeMultipleActions?: (actionIds: string[], snoozeUntil: string, reason?: string) => Promise<boolean>;
  onAssignMultipleActions?: (actionIds: string[], employeeId: number) => Promise<boolean>;
  onChangeMultipleActionsPriority?: (actionIds: string[], priority: Priority) => Promise<boolean>;
}

export function RequestsCenterPage(props?: RequestsCenterPageProps) {
  const store = useUnifiedCustomersStore();
  const {
    actions: storeActions,
    customers,
    statistics: storeStatistics,
    completeAction: storeCompleteAction,
    dismissAction: storeDismissAction,
    snoozeAction: storeSnoozeAction,
    completeMultipleActions: storeCompleteMultipleActions,
    dismissMultipleActions: storeDismissMultipleActions,
    snoozeMultipleActions: storeSnoozeMultipleActions,
    assignMultipleActions: storeAssignMultipleActions,
    updateMultipleActionsPriority,
    getCustomerById,
    getCompletedActions,
    addActionNote,
    restoreAction,
  } = store;

  // Use stages from Zustand store (fetched once, shared across all components)
  const { stages: storeStages, loading: stagesLoading, fetchStages } = useCustomersHubStagesStore();
  const { userData, IsLoading: authLoading } = useAuthStore();

  // Fetch stages on mount (only once) - wait for token to be ready
  React.useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }
    
    fetchStages(true); // activeOnly = true
  }, [authLoading, userData?.token, fetchStages]);

  // Use props if provided, otherwise use store
  const actions = props?.actions ?? storeActions;
  const apiStats = props?.stats;
  const apiStages = props?.stages; // Stages from API response (must come from backend)
  const apiFilterOptions = props?.filterOptions;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;
  
  // Debug: Log stages to see if they're being passed correctly
  React.useEffect(() => {
    console.log("🔍 RequestsCenterPage - apiStages:", apiStages);
    console.log("🔍 RequestsCenterPage - apiStages length:", apiStages?.length);
  }, [apiStages]);

  // Use storeStages for IncomingActionsCard (prevents API spam)
  // Only pass stages if they exist and are not empty
  const stagesForCards = (storeStages && storeStages.length > 0) ? storeStages : undefined;

  // API handlers with fallback to store
  const completeAction = props?.onCompleteAction 
    ? async (actionId: string) => {
        try {
          await props.onCompleteAction!(actionId);
        } catch (err) {
          console.error("Error completing action:", err);
        }
      }
    : storeCompleteAction;

  const dismissAction = props?.onDismissAction
    ? async (actionId: string) => {
        try {
          await props.onDismissAction!(actionId);
        } catch (err) {
          console.error("Error dismissing action:", err);
        }
      }
    : storeDismissAction;

  const snoozeAction = props?.onSnoozeAction
    ? async (actionId: string, until: string) => {
        try {
          await props.onSnoozeAction!(actionId, until);
        } catch (err) {
          console.error("Error snoozing action:", err);
        }
      }
    : storeSnoozeAction;

  const completeMultipleActions = props?.onCompleteMultipleActions
    ? async (actionIds: string[]) => {
        try {
          await props.onCompleteMultipleActions!(actionIds);
        } catch (err) {
          console.error("Error completing multiple actions:", err);
        }
      }
    : storeCompleteMultipleActions;

  const dismissMultipleActions = props?.onDismissMultipleActions
    ? async (actionIds: string[]) => {
        try {
          await props.onDismissMultipleActions!(actionIds);
        } catch (err) {
          console.error("Error dismissing multiple actions:", err);
        }
      }
    : storeDismissMultipleActions;

  const snoozeMultipleActions = props?.onSnoozeMultipleActions
    ? async (actionIds: string[], until: string) => {
        try {
          await props.onSnoozeMultipleActions!(actionIds, until);
        } catch (err) {
          console.error("Error snoozing multiple actions:", err);
        }
      }
    : storeSnoozeMultipleActions;

  const assignMultipleActions = props?.onAssignMultipleActions
    ? async (actionIds: string[], employeeId: string, employeeName: string) => {
        try {
          const empId = typeof employeeId === 'string' ? parseInt(employeeId) : employeeId;
          await props.onAssignMultipleActions!(actionIds, empId);
        } catch (err) {
          console.error("Error assigning multiple actions:", err);
        }
      }
    : storeAssignMultipleActions;

  const changeMultipleActionsPriority = props?.onChangeMultipleActionsPriority
    ? async (actionIds: string[], priority: Priority) => {
        try {
          await props.onChangeMultipleActionsPriority!(actionIds, priority);
        } catch (err) {
          console.error("Error changing priority for multiple actions:", err);
        }
      }
    : updateMultipleActionsPriority;

  // Use the new filters hook (like Properties)
  const filterHooks = useCustomersHubFiltersState();
  const {
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
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
    applySearch,
    newFilters,
  } = filterHooks;

  // Other local states (not filters)
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"compact" | "grid" | "table">("grid");
  const [quickViewAction, setQuickViewAction] = useState<CustomerAction | null>(null);
  const [quickViewCustomer, setQuickViewCustomer] = useState<UnifiedCustomer | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [completingActionIds, setCompletingActionIds] = useState<Set<string>>(new Set());
  
  // Dialog states for bulk actions
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [snoozeDialogOpen, setSnoozeDialogOpen] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<string>("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignEmployee, setAssignEmployee] = useState<{ id: string; name: string } | null>(null);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  
  // Temporary budget state for dialog (before applying)
  const [tempBudgetMin, setTempBudgetMin] = useState<string>("");
  const [tempBudgetMax, setTempBudgetMax] = useState<string>("");
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  // Advanced filters panel visibility (toggle via "تصفية متقدمة" button)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch requests when filters change (only if API handler is provided)
  // Use useRef to track previous filters and prevent unnecessary API calls
  const prevFiltersRef = useRef<string>("");

  useEffect(() => {
    if (!props?.onFetchRequests) {
      return; // Use local filtering if no API handler
    }

    const currentFiltersString = JSON.stringify(newFilters);
    
    // Only fetch if filters actually changed
    if (prevFiltersRef.current !== currentFiltersString) {
      prevFiltersRef.current = currentFiltersString;
      
      const fetchWithFilters = async () => {
        try {
          console.log("🔄 Filters changed, fetching requests with filters:", newFilters);
          // Send flat structure directly (newFilters already has the correct flat format)
          // newFilters already includes limit, offset, sort_by, sort_dir from useCustomersHubFiltersState
          const requestParams = newFilters as RequestsListFilters;
          console.log("📤 Sending API request with flat params:", JSON.stringify(requestParams, null, 2));
          await props.onFetchRequests!(requestParams);
        } catch (err) {
          console.error("Error fetching requests with filters:", err);
        }
      };

      fetchWithFilters();
    }
  }, [props?.onFetchRequests, newFilters]);

  // Use API-filtered actions if API handler is provided, otherwise use local filtering
  const useAPIFiltering = !!props?.onFetchRequests;

  const allPendingActions = useMemo(
    () => {
      if (useAPIFiltering) {
        // API handles filtering, just return actions sorted by priority
        return sortActionsByPriority(
          actions.filter((a) => a.status === "pending" || a.status === "in_progress")
        );
      }
      // Local filtering (fallback)
      return sortActionsByPriority(
        actions.filter((a) => a.status === "pending" || a.status === "in_progress")
      );
    },
    [actions, useAPIFiltering]
  );

  const completedActions = useMemo(() => {
    if (useAPIFiltering) {
      return actions.filter((a) => a.status === "completed" || a.status === "dismissed");
    }
    return getCompletedActions();
  }, [actions, useAPIFiltering]);

  /** Stable map for customer lookup so cards get phone without store calls during list render */
  const customerByIdMap = useMemo(() => {
    const map = new Map<string, UnifiedCustomer>();
    customers.forEach((c) => map.set(c.id, c));
    return map;
  }, [customers]);

  const getCustomerForCard = useCallback(
    (id: string) => customerByIdMap.get(id),
    [customerByIdMap]
  );

  const uniqueAssignees = useMemo(() => {
    const assignees = new Map<string, string>();
    allPendingActions.forEach((a) => {
      if (a.assignedTo && a.assignedToName) assignees.set(a.assignedTo, a.assignedToName);
    });
    return Array.from(assignees.entries()).map(([id, name]) => ({ id, name }));
  }, [allPendingActions]);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    customers.forEach((c) => {
      if (c.city?.trim()) cities.add(c.city.trim());
    });
    return Array.from(cities).sort((a, b) => a.localeCompare(b, "ar"));
  }, [customers]);

  // Local filtering (fallback when API is not available)
  const filteredActions = useMemo(() => {
    if (useAPIFiltering) {
      // API handles filtering, return actions as-is
      return allPendingActions;
    }

    // Local filtering fallback
    let filtered = allPendingActions;

    if (appliedSearchQuery) {
      const q = appliedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.customerName.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }
    if (selectedSources.length > 0)
      filtered = filtered.filter((a) => selectedSources.includes(a.source));
    if (selectedPriorities.length > 0)
      filtered = filtered.filter((a) => selectedPriorities.includes(a.priority));
    if (selectedTypes.length > 0)
      filtered = filtered.filter((a) => selectedTypes.includes(a.type));
    if (selectedAssignees.length > 0)
      filtered = filtered.filter(
        (a) => a.assignedTo && selectedAssignees.includes(a.assignedTo)
      );

    if (dueDateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      filtered = filtered.filter((a) => {
        if (dueDateFilter === "no_date") return !a.dueDate;
        if (!a.dueDate) return false;
        const due = new Date(a.dueDate);
        switch (dueDateFilter) {
          case "overdue":
            return due < now;
          case "today":
            return due >= today && due < tomorrow;
          case "week":
            return due >= today && due < weekEnd;
          default:
            return true;
        }
      });
    }

    // Customer-based filters: city, state (region), budget range, property type
    if (
      selectedCities.length > 0 ||
      selectedStates.length > 0 ||
      budgetMin !== "" ||
      budgetMax !== "" ||
      selectedPropertyTypes.length > 0
    ) {
      const filterMin = budgetMin ? Number(budgetMin) : undefined;
      const filterMax = budgetMax ? Number(budgetMax) : undefined;
      filtered = filtered.filter((a) => {
        const customer = getCustomerById(a.customerId);
        if (!customer) return false;
        if (selectedCities.length > 0 && (!customer.city || !selectedCities.includes(customer.city))) return false;
        if (selectedStates.length > 0) {
          const customerRegion = customer.city ? CITY_TO_REGION[customer.city] : undefined;
          if (!customerRegion || !selectedStates.includes(customerRegion)) return false;
        }
        if (filterMin !== undefined || filterMax !== undefined) {
          const cMin = customer.preferences?.budgetMin;
          const cMax = customer.preferences?.budgetMax;
          if (filterMin !== undefined && cMax !== undefined && cMax < filterMin) return false;
          if (filterMax !== undefined && cMin !== undefined && cMin > filterMax) return false;
        }
        if (selectedPropertyTypes.length > 0) {
          const types = customer.preferences?.propertyType ?? [];
          if (!types.some((t) => selectedPropertyTypes.includes(t))) return false;
        }
        return true;
      });
    }

    return filtered;
  }, [
    allPendingActions,
    useAPIFiltering,
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
    getCustomerById,
  ]);

  const inboxRequests = useMemo(
    () => {
      if (useAPIFiltering && activeTab === "inbox") {
        // API already filtered for inbox, return actions as-is
        return filteredActions;
      }
      return filteredActions.filter((a) => REQUEST_TYPES.includes(a.type));
    },
    [filteredActions, useAPIFiltering, activeTab]
  );
  
  const followupRequests = useMemo(
    () => {
      if (useAPIFiltering && activeTab === "followups") {
        // API already filtered for followups, return actions as-is
        return filteredActions;
      }
      return filteredActions.filter((a) => FOLLOWUP_TYPES.includes(a.type));
    },
    [filteredActions, useAPIFiltering, activeTab]
  );
  const overdueActions = useMemo(
    () => getOverdueActions(filteredActions),
    [filteredActions]
  );
  const todayActions = useMemo(
    () => getActionsDueToday(filteredActions),
    [filteredActions]
  );

  const getCurrentTabActions = useCallback((): CustomerAction[] => {
    switch (activeTab) {
      case "inbox":
        return inboxRequests;
      case "followups":
        return followupRequests;
      case "all":
        return filteredActions;
      case "completed":
        return completedActions;
      default:
        return filteredActions;
    }
  }, [activeTab, inboxRequests, followupRequests, filteredActions, completedActions]);

  const currentTabActions = getCurrentTabActions();
  const isAllSelected =
    currentTabActions.length > 0 &&
    currentTabActions.every((a) => selectedActionIds.has(a.id));

  const stats = useMemo(
    () => {
      // إذا كان apiStats موجوداً، استخدمه بشكل إجباري (لا تحسب محلياً)
      if (apiStats) {
        return {
          pending: apiStats.pending ?? 0,
          inbox: apiStats.inbox ?? 0,
          followups: apiStats.followups ?? 0,
          overdue: apiStats.overdue ?? 0,
          today: apiStats.today ?? 0,
          completed: apiStats.completed ?? 0,
          total: apiStats.total ?? 0,
        };
      }
      // Fallback: حساب محلي فقط إذا لم يكن apiStats موجوداً
      return {
        pending: allPendingActions.length,
        inbox: inboxRequests.length,
        followups: followupRequests.length,
        overdue: overdueActions.length,
        today: todayActions.length,
        completed: completedActions.length,
        total: allPendingActions.length,
      };
    },
    [
      apiStats,
      allPendingActions.length,
      inboxRequests.length,
      followupRequests.length,
      overdueActions.length,
      todayActions.length,
      completedActions.length,
    ]
  );

  const handleComplete = async (actionId: string) => {
    // Prevent multiple clicks
    if (completingActionIds.has(actionId)) {
      return;
    }

    // Add to completing set
    setCompletingActionIds((prev) => new Set(prev).add(actionId));

    try {
      await completeAction(actionId);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
      toast.success("تم إكمال الطلب بنجاح");
    } catch (err) {
      console.error("Error completing action:", err);
      toast.error("حدث خطأ أثناء إكمال الطلب");
    } finally {
      // Remove from completing set
      setCompletingActionIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };
  const handleDismiss = async (actionId: string) => {
    try {
      await dismissAction(actionId);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    } catch (err) {
      console.error("Error dismissing action:", err);
    }
  };
  const handleSnooze = async (actionId: string, until: string) => {
    try {
      await snoozeAction(actionId, until);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    } catch (err) {
      console.error("Error snoozing action:", err);
    }
  };
  const handleSelectAction = (actionId: string, selected: boolean) => {
    setSelectedActionIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(actionId);
      else next.delete(actionId);
      return next;
    });
  };
  const handleSelectAll = () =>
    setSelectedActionIds(new Set(currentTabActions.map((a) => a.id)));
  const handleDeselectAll = () => setSelectedActionIds(new Set());
  const handleBulkComplete = async () => {
    try {
      await completeMultipleActions(Array.from(selectedActionIds));
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error completing multiple actions:", err);
    }
  };
  const handleBulkDismiss = async () => {
    try {
      await dismissMultipleActions(Array.from(selectedActionIds));
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error dismissing multiple actions:", err);
    }
  };
  const handleBulkSnooze = async (until: string) => {
    try {
      await snoozeMultipleActions(Array.from(selectedActionIds), until);
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error snoozing multiple actions:", err);
    }
  };
  const handleBulkAssign = async (employeeId: string, employeeName: string) => {
    try {
      await assignMultipleActions(Array.from(selectedActionIds), employeeId, employeeName);
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error assigning multiple actions:", err);
    }
  };
  const handleBulkChangePriority = async (priority: Priority) => {
    try {
      await changeMultipleActionsPriority(Array.from(selectedActionIds), priority);
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error changing priority for multiple actions:", err);
    }
  };
  
  // Handlers to open dialogs
  const handleOpenCompleteDialog = () => setCompleteDialogOpen(true);
  const handleOpenDismissDialog = () => setDismissDialogOpen(true);
  const handleOpenSnoozeDialog = (until: string) => {
    setSnoozeUntil(until);
    setSnoozeDialogOpen(true);
  };
  const handleOpenAssignDialog = (employeeId: string, employeeName: string) => {
    setAssignEmployee({ id: employeeId, name: employeeName });
    setAssignDialogOpen(true);
  };
  const handleOpenPriorityDialog = (priority: Priority) => {
    setSelectedPriority(priority);
    setPriorityDialogOpen(true);
  };
  const handleQuickView = (actionId: string) => {
    const action =
      filteredActions.find((a) => a.id === actionId) ||
      completedActions.find((a) => a.id === actionId);
    if (action) {
      setQuickViewAction(action);
      setQuickViewCustomer(getCustomerById(action.customerId) ?? null);
      setShowQuickView(true);
    }
  };
  const handleAddNote = (actionId: string, note: string) => addActionNote(actionId, note);

  // Wrapper functions for Table view to handle toast and loading states
  const handleCompleteForTable = async (id: string) => {
    // Wrapper to prevent duplicate toast (toast shown in TableRequestsList)
    if (completingActionIds.has(id)) return;
    setCompletingActionIds((prev) => new Set(prev).add(id));
    try {
      await completeAction(id);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Error completing action:", err);
      throw err; // Re-throw to let TableRequestsList handle toast
    } finally {
      setCompletingActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDismissForTable = async (id: string) => {
    // Wrapper to prevent duplicate toast (toast shown in TableRequestsList)
    try {
      await dismissAction(id);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Error dismissing action:", err);
      throw err; // Re-throw to let TableRequestsList handle toast
    }
  };

  const handleSnoozeForTable = async (id: string, until: string) => {
    // Wrapper to prevent duplicate toast (toast shown in TableRequestsList)
    try {
      await snoozeAction(id, until);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Error snoozing action:", err);
      throw err; // Re-throw to let TableRequestsList handle toast
    }
  };

  const handleAddNoteForTable = async (id: string, note: string) => {
    // Wrapper to prevent duplicate toast (toast shown in TableRequestsList)
    try {
      await addActionNote(id, note);
    } catch (err) {
      console.error("Error adding note:", err);
      throw err; // Re-throw to let TableRequestsList handle toast
    }
  };
  const handleRestore = (actionId: string) => restoreAction(actionId);

  const clearFilters = () => {
    setSearchQuery("");
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

  const hasActiveFilters =
    appliedSearchQuery ||
    selectedSources.length > 0 ||
    selectedObjectTypes.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedTypes.length > 0 ||
    selectedAssignees.length > 0 ||
    dueDateFilter !== "all" ||
    selectedCities.length > 0 ||
    selectedStates.length > 0 ||
    budgetMin !== "" ||
    budgetMax !== "" ||
    selectedPropertyTypes.length > 0;

  // Count of active filter dimensions (for "تصفية متقدمة" badge)
  const activeFiltersCount =
    (appliedSearchQuery ? 1 : 0) +
    (selectedSources.length > 0 ? 1 : 0) +
    (selectedObjectTypes.length > 0 ? 1 : 0) +
    (selectedPriorities.length > 0 ? 1 : 0) +
    (selectedTypes.length > 0 ? 1 : 0) +
    (selectedAssignees.length > 0 ? 1 : 0) +
    (dueDateFilter !== "all" ? 1 : 0) +
    (selectedCities.length > 0 ? 1 : 0) +
    (selectedStates.length > 0 ? 1 : 0) +
    (budgetMin !== "" || budgetMax !== "" ? 1 : 0) +
    (selectedPropertyTypes.length > 0 ? 1 : 0);

  // Show loading state
  if (apiLoading && actions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (apiError && actions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{apiError}</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ar/dashboard/customers-hub/list">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                العملاء
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                مركز طلبات العملاء
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                إدارة الطلبات الواردة والإجراءات في مكان واحد
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    عرض الشبكة
                  </div>
                </SelectItem>
                <SelectItem value="compact">
                  <div className="flex items-center gap-2">
                    <LayoutList className="h-4 w-4" />
                    عرض مضغوط
                  </div>
                </SelectItem>
                <SelectItem value="table">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Table</Badge>
                    عرض جدول منظم
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <Inbox className="h-6 w-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.inbox}</div>
                <div className="text-xs text-white/80">طلبات واردة</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <CalendarClock className="h-6 w-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.followups}</div>
                <div className="text-xs text-white/80">متابعات</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <ListTodo className="h-6 w-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-xs text-white/80">إجمالي المعلق</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-200" />
                <div className="text-2xl font-bold">{stats.overdue}</div>
                <div className="text-xs text-white/80">متأخر</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <Timer className="h-6 w-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.today}</div>
                <div className="text-xs text-white/80">اليوم</div>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-xs text-white/80">مكتمل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stage Distribution - Requests by Customer Stage */}
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>توزيع طلبات العملاء حسب المرحلة</CardTitle>
          </CardHeader>
          <CardContent>
            {apiLoading ? (
              <div className="text-center py-8 text-gray-500">جاري تحميل البيانات...</div>
            ) : (() => {
              // Use stages ONLY from API response (no static fallback)
              // Check if stages exist and have length > 0
              const hasStages = apiStages && Array.isArray(apiStages) && apiStages.length > 0;
              
              if (!hasStages) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد مراحل متاحة من الباك إند
                  </div>
                );
              }

              // Sort stages by order
              const sortedStages = [...apiStages].sort((a, b) => 
                (a.order || 0) - (b.order || 0)
              );

              return (
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                  {sortedStages.map((stage) => {
                    const count = stage.requestCount || 0;
                    const percentage = stage.percentage || 0;

                    return (
                      <div
                        key={stage.stage_id}
                        className="flex flex-col gap-2 p-3 border rounded-lg hover:shadow-md transition-shadow"
                        style={{ borderColor: stage.color }}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="text-xs font-medium"
                            style={{ color: stage.color }}
                          >
                            {stage.stage_name_ar}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-1"
                          style={
                            {
                              "--progress-background": stage.color,
                            } as React.CSSProperties
                          }
                        />
                        <div className="text-xs text-gray-500">
                          {percentage.toFixed(1)}% من إجمالي الطلبات
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Top row: Search (right) | View toggles + مسح الفلاتر + تصفية متقدمة (left) */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md flex gap-2 order-2 md:order-1">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث عن اسم العميل، رقم الهاتف، أو المرجع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applySearch();
                        }
                      }}
                      className="pr-10 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={applySearch}
                    size="sm"
                    className="gap-2 rounded-xl"
                  >
                    <Search className="h-4 w-4" />
                    بحث
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap order-1 md:order-2">
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 rounded-xl">
                      مسح الفلاتر
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="gap-2 relative rounded-xl"
                    onClick={() => setShowAdvancedFilters((v) => !v)}
                  >
                    <Filter className="h-4 w-4" />
                    تصفية متقدمة
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-foreground text-primary text-[10px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvancedFilters && "rotate-180")} />
                  </Button>
                  {/* View mode: list / grid / table */}
                  <div className="flex items-center rounded-md bg-muted/60 p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn("h-10 w-10 p-0 hover:bg-white [&_svg]:!h-5 [&_svg]:!w-5", viewMode === "compact" && "bg-white")}
                      onClick={() => setViewMode("compact")}
                    >
                      <LayoutList />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn("h-10 w-10 p-0 hover:bg-white [&_svg]:!h-5 [&_svg]:!w-5", viewMode === "grid" && "bg-white")}
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn("h-10 w-10 p-0 hover:bg-white [&_svg]:!h-5 [&_svg]:!w-5", viewMode === "table" && "bg-white")}
                      onClick={() => setViewMode("table")}
                    >
                      <Table2 />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Advanced filters (dropdowns) - visible only when "تصفية متقدمة" is open */}
              {showAdvancedFilters && (
                <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        المصدر
                        {selectedSources.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedSources.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>المصدر</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(
                        [
                          "whatsapp",
                          "inquiry",
                          "manual",
                          "referral",
                          "import",
                        ] as CustomerSource[]
                      ).map((source) => (
                        <DropdownMenuCheckboxItem
                          key={source}
                          checked={selectedSources.includes(source)}
                          onCheckedChange={(checked) =>
                            setSelectedSources((prev) =>
                              checked ? [...prev, source] : prev.filter((s) => s !== source)
                            )
                          }
                        >
                          <SourceBadge source={source} className="text-xs" />
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        الأولوية
                        {selectedPriorities.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedPriorities.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
                        <DropdownMenuCheckboxItem
                          key={p}
                          checked={selectedPriorities.includes(p)}
                          onCheckedChange={(checked) =>
                            setSelectedPriorities((prev) =>
                              checked ? [...prev, p] : prev.filter((x) => x !== p)
                            )
                          }
                        >
                          {priorityLabels[p]}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ListTodo className="h-4 w-4" />
                        النوع
                        {selectedTypes.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedTypes.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>نوع الطلب</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(Object.keys(actionTypeLabels) as CustomerActionType[]).map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) =>
                            setSelectedTypes((prev) =>
                              checked ? [...prev, type] : prev.filter((t) => t !== type)
                            )
                          }
                        >
                          {actionTypeLabels[type]}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {uniqueAssignees.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          الموظف
                          {selectedAssignees.length > 0 && (
                            <Badge variant="secondary" className="mr-1">
                              {selectedAssignees.length}
                            </Badge>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الموظف المعين</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {uniqueAssignees.map((a) => (
                          <DropdownMenuCheckboxItem
                            key={a.id}
                            checked={selectedAssignees.includes(a.id)}
                            onCheckedChange={(checked) =>
                              setSelectedAssignees((prev) =>
                                checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)
                              )
                            }
                          >
                            {a.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Timer className="h-4 w-4" />
                        الموعد
                        {dueDateFilter !== "all" && (
                          <Badge variant="secondary" className="mr-1">
                            1
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الموعد</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDueDateFilter("all")}>
                        الكل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter("overdue")}>
                        <span className="text-red-600">متأخر</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter("today")}>
                        اليوم
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter("week")}>
                        هذا الأسبوع
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter("no_date")}>
                        بدون تاريخ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {uniqueCities.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MapPin className="h-4 w-4" />
                          المدينة
                          {selectedCities.length > 0 && (
                            <Badge variant="secondary" className="mr-1">
                              {selectedCities.length}
                            </Badge>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>المدينة</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {uniqueCities.map((city) => (
                          <DropdownMenuCheckboxItem
                            key={city}
                            checked={selectedCities.includes(city)}
                            onCheckedChange={(checked) =>
                              setSelectedCities((prev) =>
                                checked ? [...prev, city] : prev.filter((c) => c !== city)
                              )
                            }
                          >
                            {city}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        المنطقة
                        {selectedStates.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedStates.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>المنطقة (الولاية)</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {SAUDI_REGIONS.map((region) => (
                        <DropdownMenuCheckboxItem
                          key={region}
                          checked={selectedStates.includes(region)}
                          onCheckedChange={(checked) =>
                            setSelectedStates((prev) =>
                              checked ? [...prev, region] : prev.filter((r) => r !== region)
                            )
                          }
                        >
                          {region}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu open={isBudgetDialogOpen} onOpenChange={(open) => {
                    setIsBudgetDialogOpen(open);
                    // Initialize temp values when opening dialog
                    if (open) {
                      setTempBudgetMin(budgetMin);
                      setTempBudgetMax(budgetMax);
                    }
                  }}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <DollarSign className="h-4 w-4" />
                        الميزانية
                        {(budgetMin !== "" || budgetMax !== "") && (
                          <Badge variant="secondary" className="mr-1">
                            1
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-3">
                      <DropdownMenuLabel>نطاق الميزانية (ر.س)</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="grid grid-cols-2 gap-2 py-2">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">من</label>
                          <Input
                            type="number"
                            placeholder="الحد الأدنى"
                            value={tempBudgetMin}
                            onChange={(e) => setTempBudgetMin(e.target.value)}
                            className="h-8"
                            min={0}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">إلى</label>
                          <Input
                            type="number"
                            placeholder="الحد الأقصى"
                            value={tempBudgetMax}
                            onChange={(e) => setTempBudgetMax(e.target.value)}
                            className="h-8"
                            min={0}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setBudgetMin(tempBudgetMin);
                            setBudgetMax(tempBudgetMax);
                            setIsBudgetDialogOpen(false);
                          }}
                        >
                          تطبيق
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setTempBudgetMin("");
                            setTempBudgetMax("");
                            setBudgetMin("");
                            setBudgetMax("");
                            setIsBudgetDialogOpen(false);
                          }}
                        >
                          إعادة تعيين
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        نوع العقار
                        {selectedPropertyTypes.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedPropertyTypes.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>نوع العقار</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {PROPERTY_TYPE_OPTIONS.map((opt) => (
                        <DropdownMenuCheckboxItem
                          key={opt.value}
                          checked={selectedPropertyTypes.includes(opt.value)}
                          onCheckedChange={(checked) =>
                            setSelectedPropertyTypes((prev) =>
                              checked
                                ? [...prev, opt.value]
                                : prev.filter((t) => t !== opt.value)
                            )
                          }
                        >
                          {opt.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs & List */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl">
            <TabsTrigger value="all" className="gap-2">
              <ListTodo className="h-4 w-4" />
              الكل
              <Badge variant="secondary" className="mr-1">
                {stats.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inbox" className="gap-2">
              <Inbox className="h-4 w-4" />
              طلبات واردة
              <Badge variant="secondary" className="mr-1">
                {stats.inbox}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="followups" className="gap-2">
              <CalendarClock className="h-4 w-4" />
              متابعات
              <Badge variant="secondary" className="mr-1">
                {stats.followups}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              مكتمل
              <Badge variant="secondary" className="mr-1">
                {stats.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-6">
            {viewMode === "table" ? (
              <TableRequestsList
                actions={inboxRequests}
                getCustomerById={getCustomerForCard}
                selectedActionIds={selectedActionIds}
                onSelect={handleSelectAction}
                onComplete={handleCompleteForTable}
                onDismiss={handleDismissForTable}
                onSnooze={handleSnoozeForTable}
                onAddNote={handleAddNoteForTable}
                onQuickView={handleQuickView}
                stages={stagesForCards}
                completingActionIds={completingActionIds}
              />
            ) : (
              <RequestsList
                actions={inboxRequests}
                getCustomerById={getCustomerForCard}
                isCompactView={viewMode === "compact"}
                selectedActionIds={selectedActionIds}
                onSelect={handleSelectAction}
                onComplete={handleComplete}
                onDismiss={handleDismiss}
                onSnooze={handleSnooze}
                onAddNote={handleAddNote}
                onQuickView={handleQuickView}
                stages={stagesForCards}
                completingActionIds={completingActionIds}
              />
            )}
          </TabsContent>
          <TabsContent value="followups" className="mt-6">
            {viewMode === "table" ? (
              <TableRequestsList
                actions={followupRequests}
                getCustomerById={getCustomerForCard}
                selectedActionIds={selectedActionIds}
                onSelect={handleSelectAction}
                onComplete={handleCompleteForTable}
                onDismiss={handleDismissForTable}
                onSnooze={handleSnoozeForTable}
                onAddNote={handleAddNoteForTable}
                onQuickView={handleQuickView}
                stages={stagesForCards}
                completingActionIds={completingActionIds}
              />
            ) : (
              <RequestsList
                actions={followupRequests}
                getCustomerById={getCustomerForCard}
                isCompactView={viewMode === "compact"}
                selectedActionIds={selectedActionIds}
                onSelect={handleSelectAction}
                onComplete={handleComplete}
                onDismiss={handleDismiss}
                onSnooze={handleSnooze}
                onAddNote={handleAddNote}
                onQuickView={handleQuickView}
                stages={stagesForCards}
                completingActionIds={completingActionIds}
              />
            )}
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            {viewMode === "table" ? (
              <TableRequestsList
                actions={filteredActions}
                getCustomerById={getCustomerForCard}
                selectedActionIds={selectedActionIds}
                onSelect={handleSelectAction}
                onComplete={handleCompleteForTable}
                onDismiss={handleDismissForTable}
                onSnooze={handleSnoozeForTable}
                onAddNote={handleAddNoteForTable}
                onQuickView={handleQuickView}
                stages={stagesForCards}
                completingActionIds={completingActionIds}
              />
            ) : (
              <RequestsList
                actions={filteredActions}
                getCustomerById={getCustomerForCard}
                isCompactView={viewMode === "compact"}
                selectedActionIds={selectedActionIds}
                onSelect={handleSelectAction}
                onComplete={handleComplete}
                onDismiss={handleDismiss}
                onSnooze={handleSnooze}
                onAddNote={handleAddNote}
                onQuickView={handleQuickView}
                stages={stagesForCards}
                completingActionIds={completingActionIds}
              />
            )}
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <ActionHistoryList
              actions={completedActions}
              onRestore={handleRestore}
            />
          </TabsContent>
        </Tabs>

        {/* Bulk toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedActionIds.size}
          totalCount={currentTabActions.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onCompleteAll={handleOpenCompleteDialog}
          onDismissAll={handleOpenDismissDialog}
          onSnoozeAll={handleOpenSnoozeDialog}
          onAssignAll={handleOpenAssignDialog}
          onChangePriority={handleOpenPriorityDialog}
          isAllSelected={isAllSelected}
        />

        {/* Quick view */}
        <QuickViewPanel
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setQuickViewAction(null);
            setQuickViewCustomer(null);
          }}
          customer={quickViewCustomer}
          action={quickViewAction}
        />

        {/* Confirmation Dialogs */}
        <ConfirmationDialog
          open={completeDialogOpen}
          onOpenChange={setCompleteDialogOpen}
          title="تأكيد إكمال الإجراءات"
          description={`هل أنت متأكد من إكمال ${selectedActionIds.size} إجراء؟ سيتم تحديث حالتها إلى "مكتمل".`}
          confirmText="تأكيد الإكمال"
          onConfirm={handleBulkComplete}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <ConfirmationDialog
          open={dismissDialogOpen}
          onOpenChange={setDismissDialogOpen}
          title="تأكيد رفض الإجراءات"
          description={`هل أنت متأكد من رفض ${selectedActionIds.size} إجراء؟ هذا الإجراء لا يمكن التراجع عنه.`}
          confirmText="تأكيد الرفض"
          onConfirm={handleBulkDismiss}
          variant="danger"
          icon={<Trash2 className="h-5 w-5" />}
        />

        {snoozeUntil && (
          <ConfirmationDialog
            open={snoozeDialogOpen}
            onOpenChange={setSnoozeDialogOpen}
            title="تأكيد تأجيل الإجراءات"
            description={`هل أنت متأكد من تأجيل ${selectedActionIds.size} إجراء حتى ${new Date(snoozeUntil).toLocaleDateString("ar-SA", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}؟`}
            confirmText="تأكيد التأجيل"
            onConfirm={() => {
              handleBulkSnooze(snoozeUntil);
              setSnoozeUntil("");
            }}
            icon={<Clock className="h-5 w-5" />}
          />
        )}

        {assignEmployee && (
          <ConfirmationDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            title="تأكيد تعيين الإجراءات"
            description={`هل أنت متأكد من تعيين ${selectedActionIds.size} إجراء إلى ${assignEmployee.name}؟`}
            confirmText="تأكيد التعيين"
            onConfirm={() => {
              handleBulkAssign(assignEmployee.id, assignEmployee.name);
              setAssignEmployee(null);
            }}
            icon={<UserPlus className="h-5 w-5" />}
          />
        )}

        {selectedPriority && (
          <ConfirmationDialog
            open={priorityDialogOpen}
            onOpenChange={setPriorityDialogOpen}
            title="تأكيد تغيير الأولوية"
            description={`هل أنت متأكد من تغيير أولوية ${selectedActionIds.size} إجراء إلى "${priorityOptions.find(p => p.value === selectedPriority)?.label}"؟`}
            confirmText="تأكيد التغيير"
            onConfirm={() => {
              handleBulkChangePriority(selectedPriority);
              setSelectedPriority(null);
            }}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        )}
      </div>
    </div>
  );
}

function RequestsList({
  actions,
  getCustomerById,
  isCompactView,
  selectedActionIds,
  onSelect,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  stages,
  completingActionIds,
}: {
  actions: CustomerAction[];
  getCustomerById: (id: string) => UnifiedCustomer | undefined;
  isCompactView: boolean;
  selectedActionIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string, until: string) => void;
  onAddNote: (id: string, note: string) => void;
  onQuickView: (id: string) => void;
  stages?: Array<{
    stage_id: string;
    stage_name_ar: string;
    stage_name_en: string;
    color: string;
    order: number;
  }>;
  completingActionIds: Set<string>;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [maxCardHeight, setMaxCardHeight] = useState<number | null>(null);

  // Measure max card height across entire grid so all cards share the same height
  useEffect(() => {
    if (isCompactView || actions.length === 0) {
      setMaxCardHeight(null);
      return;
    }
    const measure = () => {
      const grid = gridRef.current;
      if (!grid?.children?.length) return;
      let max = 0;
      for (let i = 0; i < grid.children.length; i++) {
        const h = (grid.children[i] as HTMLElement).getBoundingClientRect().height;
        if (h > max) max = h;
      }
      if (max > 0) setMaxCardHeight(max);
    };
    const t = setTimeout(measure, 0);
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [actions, isCompactView]);

  if (actions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">لا توجد طلبات في هذا القسم</p>
          <p className="text-sm mt-1">ستظهر الطلبات هنا عند ورودها</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      ref={gridRef}
      className={cn("grid gap-3 items-stretch", isCompactView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}
    >
      {actions.map((action) => (
        <div
          key={action.id}
          className={isCompactView ? undefined : "h-full min-h-0"}
          style={!isCompactView && maxCardHeight != null ? { minHeight: maxCardHeight } : undefined}
        >
          <IncomingActionsCard
            action={action}
            customer={getCustomerById(action.customerId)}
            stages={stages}
            onComplete={onComplete}
            onDismiss={onDismiss}
            onSnooze={onSnooze}
            onAddNote={onAddNote}
            onQuickView={onQuickView}
            isSelected={selectedActionIds.has(action.id)}
            onSelect={onSelect}
            showCheckbox={true}
            isCompact={isCompactView}
            isCompleting={completingActionIds.has(action.id)}
            className={isCompactView ? undefined : "h-full"}
          />
        </div>
      ))}
    </div>
  );
}
