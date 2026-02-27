import type { CustomerAction, Priority, UnifiedCustomer } from "@/types/unified-customer";
import toast from "react-hot-toast";

export interface UseRequestsCenterHandlersParams {
  completeAction: (actionId: string) => Promise<void>;
  dismissAction: (actionId: string) => Promise<void>;
  snoozeAction: (actionId: string, until: string) => Promise<void>;
  completeMultipleActions: (actionIds: string[]) => Promise<void>;
  dismissMultipleActions: (actionIds: string[]) => Promise<void>;
  snoozeMultipleActions: (actionIds: string[], until: string) => Promise<void>;
  assignMultipleActions: (
    actionIds: string[],
    employeeId: string,
    employeeName: string
  ) => Promise<void>;
  changeMultipleActionsPriority: (
    actionIds: string[],
    priority: Priority
  ) => Promise<void>;
  addActionNote: (actionId: string, note: string) => void;
  restoreAction: (actionId: string) => void;
  getCustomerById: (id: string) => UnifiedCustomer | undefined;
  selectedActionIds: Set<string>;
  currentTabActions: CustomerAction[];
  filteredActions: CustomerAction[];
  completedActions: CustomerAction[];
  setSelectedActionIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setCompletingActionIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setCompleteDialogOpen: (v: boolean) => void;
  setDismissDialogOpen: (v: boolean) => void;
  setSnoozeDialogOpen: (v: boolean) => void;
  setSnoozeUntil: (v: string) => void;
  setAssignDialogOpen: (v: boolean) => void;
  setAssignEmployee: (v: { id: string; name: string } | null) => void;
  setPriorityDialogOpen: (v: boolean) => void;
  setSelectedPriority: (v: Priority | null) => void;
  setQuickViewAction: (v: CustomerAction | null) => void;
  setQuickViewCustomer: (v: UnifiedCustomer | null) => void;
  setShowQuickView: (v: boolean) => void;
  completingActionIds: Set<string>;
  clearFilters: () => void;
}

export function useRequestsCenterHandlers({
  completeAction,
  dismissAction,
  snoozeAction,
  completeMultipleActions,
  dismissMultipleActions,
  snoozeMultipleActions,
  assignMultipleActions,
  changeMultipleActionsPriority,
  addActionNote,
  restoreAction,
  getCustomerById,
  selectedActionIds,
  currentTabActions,
  filteredActions,
  completedActions,
  setSelectedActionIds,
  setCompletingActionIds,
  setCompleteDialogOpen,
  setDismissDialogOpen,
  setSnoozeDialogOpen,
  setSnoozeUntil,
  setAssignDialogOpen,
  setAssignEmployee,
  setPriorityDialogOpen,
  setSelectedPriority,
  setQuickViewAction,
  setQuickViewCustomer,
  setShowQuickView,
  completingActionIds,
  clearFilters,
}: UseRequestsCenterHandlersParams) {
  const handleComplete = async (actionId: string) => {
    if (completingActionIds.has(actionId)) return;
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
      await assignMultipleActions(
        Array.from(selectedActionIds),
        employeeId,
        employeeName
      );
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error assigning multiple actions:", err);
    }
  };

  const handleBulkChangePriority = async (priority: Priority) => {
    try {
      await changeMultipleActionsPriority(
        Array.from(selectedActionIds),
        priority
      );
      setSelectedActionIds(new Set());
    } catch (err) {
      console.error("Error changing priority for multiple actions:", err);
    }
  };

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

  const handleAddNote = (actionId: string, note: string) =>
    addActionNote(actionId, note);

  const handleCompleteForTable = async (id: string) => {
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
      throw err;
    } finally {
      setCompletingActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDismissForTable = async (id: string) => {
    try {
      await dismissAction(id);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Error dismissing action:", err);
      throw err;
    }
  };

  const handleSnoozeForTable = async (id: string, until: string) => {
    try {
      await snoozeAction(id, until);
      setSelectedActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Error snoozing action:", err);
      throw err;
    }
  };

  const handleAddNoteForTable = async (id: string, note: string) => {
    try {
      await addActionNote(id, note);
    } catch (err) {
      console.error("Error adding note:", err);
      throw err;
    }
  };

  const handleRestore = (actionId: string) => restoreAction(actionId);

  return {
    handleComplete,
    handleDismiss,
    handleSnooze,
    handleSelectAction,
    handleSelectAll,
    handleDeselectAll,
    handleBulkComplete,
    handleBulkDismiss,
    handleBulkSnooze,
    handleBulkAssign,
    handleBulkChangePriority,
    handleOpenCompleteDialog,
    handleOpenDismissDialog,
    handleOpenSnoozeDialog,
    handleOpenAssignDialog,
    handleOpenPriorityDialog,
    handleQuickView,
    handleAddNote,
    handleCompleteForTable,
    handleDismissForTable,
    handleSnoozeForTable,
    handleAddNoteForTable,
    handleRestore,
    clearFilters,
  };
}
