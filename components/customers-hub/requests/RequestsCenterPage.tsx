"use client";

import React, { useState, useMemo, useCallback } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  X,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "../actions/IncomingActionsCard";
import { BulkActionsToolbar } from "../actions/BulkActionsToolbar";
import { QuickViewPanel } from "../actions/QuickViewPanel";
import { ActionHistoryList } from "../actions/ActionHistoryList";
import { SourceBadge } from "../actions/SourceBadge";
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

const priorityLabels: Record<Priority, string> = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

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
  filterOptions?: any;
  loading?: boolean;
  error?: string | null;
  pagination?: any;
  onFetchRequests?: (params: any) => Promise<void>;
  onCompleteAction?: (actionId: string, notes?: string) => Promise<boolean>;
  onDismissAction?: (actionId: string, reason?: string) => Promise<boolean>;
  onSnoozeAction?: (actionId: string, snoozeUntil: string, reason?: string) => Promise<boolean>;
  onAssignAction?: (actionId: string, employeeId: number) => Promise<boolean>;
  onCompleteMultipleActions?: (actionIds: string[], notes?: string) => Promise<boolean>;
  onDismissMultipleActions?: (actionIds: string[], reason?: string) => Promise<boolean>;
  onSnoozeMultipleActions?: (actionIds: string[], snoozeUntil: string, reason?: string) => Promise<boolean>;
  onAssignMultipleActions?: (actionIds: string[], employeeId: number) => Promise<boolean>;
}

export function RequestsCenterPage(props?: RequestsCenterPageProps) {
  const store = useUnifiedCustomersStore();
  const {
    actions: storeActions,
    customers,
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

  // Use props if provided, otherwise use store
  const actions = props?.actions ?? storeActions;
  const apiStats = props?.stats;
  const apiFilterOptions = props?.filterOptions;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;

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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"inbox" | "followups" | "all" | "completed">("inbox");
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CustomerActionType[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<
    "all" | "overdue" | "today" | "week" | "no_date"
  >("all");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [isCompactView, setIsCompactView] = useState(false);
  const [quickViewAction, setQuickViewAction] = useState<CustomerAction | null>(null);
  const [quickViewCustomer, setQuickViewCustomer] = useState<UnifiedCustomer | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const allPendingActions = useMemo(
    () =>
      sortActionsByPriority(
        actions.filter((a) => a.status === "pending" || a.status === "in_progress")
      ),
    [actions]
  );

  const completedActions = useMemo(() => getCompletedActions(), [actions]);

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

  const filteredActions = useMemo(() => {
    let filtered = allPendingActions;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
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
    searchQuery,
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
    () => filteredActions.filter((a) => REQUEST_TYPES.includes(a.type)),
    [filteredActions]
  );
  const followupRequests = useMemo(
    () => filteredActions.filter((a) => FOLLOWUP_TYPES.includes(a.type)),
    [filteredActions]
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
    () => ({
      pending: apiStats?.pending ?? allPendingActions.length,
      inbox: inboxRequests.length,
      followups: followupRequests.length,
      overdue: apiStats?.overdue ?? overdueActions.length,
      today: todayActions.length,
      completed: apiStats?.completed ?? completedActions.length,
      total: apiStats?.total ?? allPendingActions.length,
    }),
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
    try {
      await completeAction(actionId);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    } catch (err) {
      console.error("Error completing action:", err);
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
  const handleBulkChangePriority = (priority: Priority) => {
    updateMultipleActionsPriority(Array.from(selectedActionIds), priority);
    setSelectedActionIds(new Set());
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
    searchQuery ||
    selectedSources.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedTypes.length > 0 ||
    selectedAssignees.length > 0 ||
    dueDateFilter !== "all" ||
    selectedCities.length > 0 ||
    selectedStates.length > 0 ||
    budgetMin !== "" ||
    budgetMax !== "" ||
    selectedPropertyTypes.length > 0;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900" dir="rtl">
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
            <Button
              variant={isCompactView ? "default" : "outline"}
              size="icon"
              onClick={() => setIsCompactView(!isCompactView)}
            >
              {isCompactView ? (
                <LayoutList className="h-4 w-4" />
              ) : (
                <LayoutGrid className="h-4 w-4" />
              )}
            </Button>
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في الطلبات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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
                  <DropdownMenu>
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
                            value={budgetMin}
                            onChange={(e) => setBudgetMin(e.target.value)}
                            className="h-8"
                            min={0}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">إلى</label>
                          <Input
                            type="number"
                            placeholder="الحد الأقصى"
                            value={budgetMax}
                            onChange={(e) => setBudgetMax(e.target.value)}
                            className="h-8"
                            min={0}
                          />
                        </div>
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
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                      <X className="h-4 w-4" />
                      مسح الفلاتر
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs & List */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl">
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
            <TabsTrigger value="all" className="gap-2">
              <ListTodo className="h-4 w-4" />
              الكل
              <Badge variant="secondary" className="mr-1">
                {stats.pending}
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
            <RequestsList
              actions={inboxRequests}
              getCustomerById={getCustomerForCard}
              isCompactView={isCompactView}
              selectedActionIds={selectedActionIds}
              onSelect={handleSelectAction}
              onComplete={handleComplete}
              onDismiss={handleDismiss}
              onSnooze={handleSnooze}
              onAddNote={handleAddNote}
              onQuickView={handleQuickView}
            />
          </TabsContent>
          <TabsContent value="followups" className="mt-6">
            <RequestsList
              actions={followupRequests}
              getCustomerById={getCustomerForCard}
              isCompactView={isCompactView}
              selectedActionIds={selectedActionIds}
              onSelect={handleSelectAction}
              onComplete={handleComplete}
              onDismiss={handleDismiss}
              onSnooze={handleSnooze}
              onAddNote={handleAddNote}
              onQuickView={handleQuickView}
            />
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            <RequestsList
              actions={filteredActions}
              getCustomerById={getCustomerForCard}
              isCompactView={isCompactView}
              selectedActionIds={selectedActionIds}
              onSelect={handleSelectAction}
              onComplete={handleComplete}
              onDismiss={handleDismiss}
              onSnooze={handleSnooze}
              onAddNote={handleAddNote}
              onQuickView={handleQuickView}
            />
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
          onCompleteAll={handleBulkComplete}
          onDismissAll={handleBulkDismiss}
          onSnoozeAll={handleBulkSnooze}
          onAssignAll={handleBulkAssign}
          onChangePriority={handleBulkChangePriority}
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
}) {
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
    <div className={cn("grid gap-3", isCompactView ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
      {actions.map((action) => (
        <IncomingActionsCard
          key={action.id}
          action={action}
          customer={getCustomerById(action.customerId)}
          onComplete={onComplete}
          onDismiss={onDismiss}
          onSnooze={onSnooze}
          onAddNote={onAddNote}
          onQuickView={onQuickView}
          isSelected={selectedActionIds.has(action.id)}
          onSelect={onSelect}
          showCheckbox={true}
          isCompact={isCompactView}
        />
      ))}
    </div>
  );
}
