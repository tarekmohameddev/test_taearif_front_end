import { useCallback, useState } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import type { CustomerAction, Priority, UnifiedCustomer } from "@/types/unified-customer";
import { actionTypeLabels, priorityLabels } from "../types";

export function useActionsHandlers(
  selectedActionIds: Set<string>,
  setSelectedActionIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  filteredActions: CustomerAction[],
  completedActions: CustomerAction[],
  getCurrentTabActions: () => CustomerAction[]
) {
  const completeAction = useUnifiedCustomersStore(
    (state) => state.completeAction,
  );
  const dismissAction = useUnifiedCustomersStore(
    (state) => state.dismissAction,
  );
  const snoozeAction = useUnifiedCustomersStore((state) => state.snoozeAction);
  const completeMultipleActions = useUnifiedCustomersStore(
    (state) => state.completeMultipleActions,
  );
  const dismissMultipleActions = useUnifiedCustomersStore(
    (state) => state.dismissMultipleActions,
  );
  const snoozeMultipleActions = useUnifiedCustomersStore(
    (state) => state.snoozeMultipleActions,
  );
  const assignMultipleActions = useUnifiedCustomersStore(
    (state) => state.assignMultipleActions,
  );
  const updateMultipleActionsPriority = useUnifiedCustomersStore(
    (state) => state.updateMultipleActionsPriority,
  );
  const addActionNote = useUnifiedCustomersStore(
    (state) => state.addActionNote,
  );
  const restoreAction = useUnifiedCustomersStore(
    (state) => state.restoreAction,
  );
  const getCustomerById = useUnifiedCustomersStore(
    (state) => state.getCustomerById,
  );

  // Action handlers
  const handleComplete = useCallback((actionId: string) => {
    completeAction(actionId);
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
  }, [completeAction, setSelectedActionIds]);

  const handleDismiss = useCallback((actionId: string) => {
    dismissAction(actionId);
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
  }, [dismissAction, setSelectedActionIds]);

  const handleSnooze = useCallback((actionId: string, until: string) => {
    snoozeAction(actionId, until);
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
  }, [snoozeAction, setSelectedActionIds]);

  // Bulk action handlers
  const handleBulkComplete = useCallback(() => {
    const ids = Array.from(selectedActionIds);
    completeMultipleActions(ids);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, completeMultipleActions, setSelectedActionIds]);

  const handleBulkDismiss = useCallback(() => {
    const ids = Array.from(selectedActionIds);
    dismissMultipleActions(ids);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, dismissMultipleActions, setSelectedActionIds]);

  const handleBulkSnooze = useCallback((until: string) => {
    const ids = Array.from(selectedActionIds);
    snoozeMultipleActions(ids, until);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, snoozeMultipleActions, setSelectedActionIds]);

  const handleBulkAssign = useCallback((employeeId: string, employeeName: string) => {
    const ids = Array.from(selectedActionIds);
    assignMultipleActions(ids, employeeId, employeeName);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, assignMultipleActions, setSelectedActionIds]);

  const handleBulkChangePriority = useCallback((priority: Priority) => {
    const ids = Array.from(selectedActionIds);
    updateMultipleActionsPriority(ids, priority);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, updateMultipleActionsPriority, setSelectedActionIds]);

  // Quick View handlers
  const [quickViewAction, setQuickViewAction] = useState<CustomerAction | null>(null);
  const [quickViewCustomer, setQuickViewCustomer] = useState<UnifiedCustomer | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickView = useCallback((actionId: string) => {
    const action = filteredActions.find((a) => a.id === actionId) || 
                   completedActions.find((a) => a.id === actionId);
    if (action) {
      const customer = getCustomerById(action.customerId);
      setQuickViewAction(action);
      setQuickViewCustomer(customer || null);
      setShowQuickView(true);
    }
  }, [filteredActions, completedActions, getCustomerById]);

  // Handle add note
  const handleAddNote = useCallback((actionId: string, note: string) => {
    addActionNote(actionId, note);
  }, [addActionNote]);

  // Handle restore action from history
  const handleRestoreAction = useCallback((actionId: string) => {
    restoreAction(actionId);
  }, [restoreAction]);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    const currentActions = getCurrentTabActions();
    const headers = ["اسم العميل", "العنوان", "النوع", "الأولوية", "المصدر", "تاريخ الاستحقاق", "الموظف المعين"];
    
    const rows = currentActions.map((action) => [
      action.customerName,
      action.title,
      actionTypeLabels[action.type],
      priorityLabels[action.priority],
      action.source,
      action.dueDate ? new Date(action.dueDate).toLocaleDateString("ar-SA") : "",
      action.assignedToName || "",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `actions-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }, [getCurrentTabActions]);

  return {
    handleComplete,
    handleDismiss,
    handleSnooze,
    handleBulkComplete,
    handleBulkDismiss,
    handleBulkSnooze,
    handleBulkAssign,
    handleBulkChangePriority,
    handleQuickView,
    handleAddNote,
    handleRestoreAction,
    handleExportCSV,
    quickViewAction,
    quickViewCustomer,
    showQuickView,
    setShowQuickView,
  };
}
