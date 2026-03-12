import { useMemo } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import type { CustomerAction, CustomerActionType, CustomerSource, Priority } from "@/types/unified-customer";
import {
  getOverdueActions,
  getActionsDueToday,
  groupActionsBySource,
  sortActionsByPriority,
} from "@/lib/utils/action-helpers";

export function useActionsData(
  searchQuery: string,
  selectedSources: CustomerSource[],
  selectedPriorities: Priority[],
  selectedTypes: CustomerActionType[],
  selectedAssignees: string[],
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'no_date',
  hasNotesFilter: boolean | null
) {
  const customers = useUnifiedCustomersStore((state) => state.customers);
  const actions = useUnifiedCustomersStore((state) => state.actions);
  const getCompletedActions = useUnifiedCustomersStore(
    (state) => state.getCompletedActions,
  );
  const getCustomerById = useUnifiedCustomersStore(
    (state) => state.getCustomerById,
  );

  // Get all actions (both from store and AI-generated)
  const allActions = useMemo(() => {
    // Get stored actions
    const storedActions = [...actions];
    
    // Generate AI-recommended actions from customers (legacy support)
    const aiActions: CustomerAction[] = customers
      .filter((c) => c.aiInsights.nextBestAction && !actions.find(a => a.customerId === c.id))
      .map((customer) => ({
        id: `ai_${customer.id}`,
        customerId: customer.id,
        customerName: customer.name,
        type: 'ai_recommended' as CustomerActionType,
        title: customer.aiInsights.nextBestAction || '',
        description: customer.aiInsights.nextBestAction,
        priority: customer.priority,
        status: 'pending' as const,
        source: customer.source,
        dueDate: customer.nextFollowUpDate,
        assignedTo: customer.assignedEmployeeId,
        assignedToName: customer.assignedEmployee?.name,
        createdAt: customer.createdAt,
        metadata: {
          dealValue: customer.totalDealValue,
        },
      }));
    
    return [...storedActions, ...aiActions];
  }, [actions, customers]);

  // Get unique assignees from actions
  const uniqueAssignees = useMemo(() => {
    const assignees = new Map<string, string>();
    allActions.forEach((action) => {
      if (action.assignedTo && action.assignedToName) {
        assignees.set(action.assignedTo, action.assignedToName);
      }
    });
    return Array.from(assignees.entries()).map(([id, name]) => ({ id, name }));
  }, [allActions]);

  // Filter actions
  const filteredActions = useMemo(() => {
    let filtered = allActions.filter((a) => a.status === 'pending' || a.status === 'in_progress');

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.customerName.toLowerCase().includes(query) ||
          a.title.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (selectedSources.length > 0) {
      filtered = filtered.filter((a) => selectedSources.includes(a.source));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((a) => selectedPriorities.includes(a.priority));
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((a) => selectedTypes.includes(a.type));
    }

    // Assignee filter
    if (selectedAssignees.length > 0) {
      filtered = filtered.filter((a) => a.assignedTo && selectedAssignees.includes(a.assignedTo));
    }

    // Due date filter
    if (dueDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      filtered = filtered.filter((a) => {
        if (dueDateFilter === 'no_date') {
          return !a.dueDate;
        }
        if (!a.dueDate) return false;
        
        const dueDate = new Date(a.dueDate);
        
        switch (dueDateFilter) {
          case 'overdue':
            return dueDate < now;
          case 'today':
            return dueDate >= today && dueDate < tomorrow;
          case 'week':
            return dueDate >= today && dueDate < weekEnd;
          default:
            return true;
        }
      });
    }

    // Has notes filter
    if (hasNotesFilter !== null) {
      filtered = filtered.filter((a) => {
        const hasNotes = a.metadata?.notes && a.metadata.notes.length > 0;
        return hasNotesFilter ? hasNotes : !hasNotes;
      });
    }

    return sortActionsByPriority(filtered);
  }, [allActions, searchQuery, selectedSources, selectedPriorities, selectedTypes, selectedAssignees, dueDateFilter, hasNotesFilter, getCustomerById]);

  // Categorize actions
  const incomingActions = useMemo(() => {
    return filteredActions.filter(
      (a) => a.type === 'new_inquiry' || a.type === 'whatsapp_incoming' || a.type === 'callback_request'
    );
  }, [filteredActions]);

  const followUpActions = useMemo(() => {
    return filteredActions.filter((a) => a.type === 'follow_up' || a.type === 'site_visit');
  }, [filteredActions]);

  const aiRecommendedActions = useMemo(() => {
    return filteredActions.filter((a) => a.type === 'ai_recommended');
  }, [filteredActions]);

  const overdueActions = useMemo(() => getOverdueActions(filteredActions), [filteredActions]);
  const todayActions = useMemo(() => getActionsDueToday(filteredActions), [filteredActions]);
  
  // Completed/History Actions
  const completedActions = useMemo(() => getCompletedActions(), [actions]);
  
  // Due Date Grouped Actions
  const dueDateGroupedActions = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const groups: Record<string, CustomerAction[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      noDueDate: [],
    };
    
    filteredActions.forEach((action) => {
      if (!action.dueDate) {
        groups.noDueDate.push(action);
        return;
      }
      
      const dueDate = new Date(action.dueDate);
      if (dueDate < now) {
        groups.overdue.push(action);
      } else if (dueDate.toDateString() === now.toDateString()) {
        groups.today.push(action);
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        groups.tomorrow.push(action);
      } else if (dueDate <= nextWeek) {
        groups.thisWeek.push(action);
      } else {
        groups.later.push(action);
      }
    });
    
    return groups;
  }, [filteredActions]);

  // Statistics
  const stats = useMemo(() => {
    const pending = allActions.filter((a) => a.status === 'pending' || a.status === 'in_progress');
    const completed = allActions.filter((a) => a.status === 'completed');
    const total = allActions.length;
    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;
    const urgentCount = pending.filter((a) => a.priority === 'urgent').length;
    const overdueCount = overdueActions.length;
    const todayCount = todayActions.length;
    const bySource = groupActionsBySource(pending);

    return {
      pending: pending.length,
      completed: completed.length,
      total,
      completionRate,
      urgentCount,
      overdueCount,
      todayCount,
      bySource,
    };
  }, [allActions, overdueActions, todayActions]);

  return {
    allActions,
    uniqueAssignees,
    filteredActions,
    incomingActions,
    followUpActions,
    aiRecommendedActions,
    overdueActions,
    todayActions,
    completedActions,
    dueDateGroupedActions,
    stats,
  };
}
