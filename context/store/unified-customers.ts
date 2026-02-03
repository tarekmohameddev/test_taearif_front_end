import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UnifiedCustomer,
  CustomerFilters,
  CustomerStatistics,
  CustomerLifecycleStage,
  CustomerSource,
  Priority,
  Appointment,
  Reminder,
  Interaction,
  StageChange,
  CustomerAction,
  CustomerActionStatus,
  CustomerActionType,
} from "@/types/unified-customer";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface UnifiedCustomersStore {
  // Data
  customers: UnifiedCustomer[];
  filteredCustomers: UnifiedCustomer[];
  selectedCustomer: UnifiedCustomer | null;
  statistics: CustomerStatistics | null;
  
  // Actions Data
  actions: CustomerAction[];
  filteredActions: CustomerAction[];
  
  // Filters & Search
  filters: CustomerFilters;
  searchTerm: string;
  sortBy: 'name' | 'createdAt' | 'lastContactAt' | 'dealValue';
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCustomers: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  viewMode: 'table' | 'grid' | 'map' | 'pipeline';
  
  // Dialog States
  showAddCustomerDialog: boolean;
  showEditCustomerDialog: boolean;
  showCustomerDetailDialog: boolean;
  showStageChangeDialog: boolean;
  showQuickViewDialog: boolean;
  showWhatsAppDialog: boolean;
  showAddAppointmentDialog: boolean;
  showAddReminderDialog: boolean;
  showAddInteractionDialog: boolean;
  
  // Cache
  customersCache: Map<string, UnifiedCustomer>;
  lastFetched: number | null;
  cacheExpiry: number; // in milliseconds
  
  // Actions - Data Management
  setCustomers: (customers: UnifiedCustomer[]) => void;
  addCustomer: (customer: UnifiedCustomer) => void;
  updateCustomer: (customerId: string, updates: Partial<UnifiedCustomer>) => void;
  removeCustomer: (customerId: string) => void;
  setSelectedCustomer: (customer: UnifiedCustomer | null) => void;
  getCustomerById: (customerId: string) => UnifiedCustomer | undefined;
  
  // Actions - Customer Actions Management
  setActions: (actions: CustomerAction[]) => void;
  addAction: (action: CustomerAction) => void;
  updateAction: (actionId: string, updates: Partial<CustomerAction>) => void;
  updateActionStatus: (actionId: string, status: CustomerActionStatus) => void;
  snoozeAction: (actionId: string, until: string) => void;
  dismissAction: (actionId: string) => void;
  completeAction: (actionId: string) => void;
  getActionsByCustomerId: (customerId: string) => CustomerAction[];
  getPendingActionsCount: () => number;
  
  // Bulk Action Methods
  completeMultipleActions: (actionIds: string[]) => void;
  dismissMultipleActions: (actionIds: string[]) => void;
  snoozeMultipleActions: (actionIds: string[], until: string) => void;
  assignMultipleActions: (actionIds: string[], assignedTo: string, assignedToName: string) => void;
  updateMultipleActionsPriority: (actionIds: string[], priority: Priority) => void;
  
  // Undo & History
  undoStack: { actionIds: string[]; previousStates: CustomerAction[] }[];
  restoreAction: (actionId: string) => void;
  undoLastAction: () => void;
  getCompletedActions: () => CustomerAction[];
  addToUndoStack: (actionIds: string[], previousStates: CustomerAction[]) => void;
  
  // Action Notes
  addActionNote: (actionId: string, note: string) => void;
  
  // Actions - Filters & Search
  setFilters: (filters: Partial<CustomerFilters>) => void;
  clearFilters: () => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: UnifiedCustomersStore['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  applyFilters: () => void;
  
  // Actions - Pagination
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Actions - Stage Management
  updateCustomerStage: (
    customerId: string,
    newStage: CustomerLifecycleStage,
    notes?: string
  ) => void;
  addStageChange: (customerId: string, stageChange: StageChange) => void;
  
  // Actions - Relationships
  addAppointment: (customerId: string, appointment: Appointment) => void;
  updateAppointment: (customerId: string, appointmentId: string, updates: Partial<Appointment>) => void;
  removeAppointment: (customerId: string, appointmentId: string) => void;
  addReminder: (customerId: string, reminder: Reminder) => void;
  updateReminder: (customerId: string, reminderId: string, updates: Partial<Reminder>) => void;
  removeReminder: (customerId: string, reminderId: string) => void;
  addInteraction: (customerId: string, interaction: Interaction) => void;
  
  // Actions - UI State
  setViewMode: (mode: 'table' | 'grid' | 'map' | 'pipeline') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions - Dialogs
  setShowAddCustomerDialog: (show: boolean) => void;
  setShowEditCustomerDialog: (show: boolean) => void;
  setShowCustomerDetailDialog: (show: boolean) => void;
  setShowStageChangeDialog: (show: boolean) => void;
  setShowQuickViewDialog: (show: boolean) => void;
  setShowWhatsAppDialog: (show: boolean) => void;
  setShowAddAppointmentDialog: (show: boolean) => void;
  setShowAddReminderDialog: (show: boolean) => void;
  setShowAddInteractionDialog: (show: boolean) => void;
  
  // Actions - Statistics
  calculateStatistics: () => void;
  
  // Actions - Cache Management
  clearCache: () => void;
  shouldRefetchData: () => boolean;
  
  // Actions - Data Fetching (for future API integration)
  fetchCustomers: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Actions - KSA Compliance Management
  updateBrokerageLicense: (customerId: string, license: Partial<any>) => void;
  addBrokerageContract: (customerId: string, contract: any) => void;
  updateBrokerageContract: (customerId: string, contractId: string, updates: Partial<any>) => void;
  addEjarContract: (customerId: string, contract: any) => void;
  updateEjarContract: (customerId: string, contractId: string, updates: Partial<any>) => void;
  updateWafiLicense: (customerId: string, license: Partial<any>) => void;
  addEscrowMilestone: (customerId: string, milestone: any) => void;
  updateEscrowMilestone: (customerId: string, milestoneId: string, updates: Partial<any>) => void;
  addHandoverDefect: (customerId: string, defect: any) => void;
  updateHandoverDefect: (customerId: string, defectId: string, updates: Partial<any>) => void;
  updateSakaniEligibility: (customerId: string, eligibility: Partial<any>) => void;
  updateMortgageInfo: (customerId: string, mortgage: Partial<any>) => void;
  addPaymentScheduleItem: (customerId: string, payment: any) => void;
  updatePaymentScheduleItem: (customerId: string, paymentId: string, updates: Partial<any>) => void;
}

const useUnifiedCustomersStore = create<UnifiedCustomersStore>()(
  persist(
    (set, get) => ({
      // Initial Data State
      customers: [],
      filteredCustomers: [],
      selectedCustomer: null,
      statistics: null,
      
      // Initial Actions Data
      actions: [],
      filteredActions: [],
      undoStack: [],
      
      // Initial Filters & Search
      filters: {},
      searchTerm: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      
      // Initial Pagination
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,
      totalCustomers: 0,
      
      // Initial UI State
      isLoading: false,
      error: null,
      viewMode: 'table',
      
      // Initial Dialog States
      showAddCustomerDialog: false,
      showEditCustomerDialog: false,
      showCustomerDetailDialog: false,
      showStageChangeDialog: false,
      showQuickViewDialog: false,
      showWhatsAppDialog: false,
      showAddAppointmentDialog: false,
      showAddReminderDialog: false,
      showAddInteractionDialog: false,
      
      // Initial Cache
      customersCache: new Map(),
      lastFetched: null,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes
      
      // Data Management Actions
      setCustomers: (customers) => {
        const cache = new Map();
        customers.forEach((customer) => {
          cache.set(customer.id, customer);
        });
        
        set({
          customers,
          customersCache: cache,
          totalCustomers: customers.length,
          lastFetched: Date.now(),
        });
        
        // Apply filters to update filtered list
        get().applyFilters();
        get().calculateStatistics();
      },
      
      addCustomer: (customer) => {
        const { customers, customersCache } = get();
        const updatedCustomers = [...customers, customer];
        const updatedCache = new Map(customersCache);
        updatedCache.set(customer.id, customer);
        
        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
        
        get().applyFilters();
        get().calculateStatistics();
      },
      
      // Customer Actions Management
      setActions: (actions) => {
        set({ 
          actions,
          filteredActions: actions,
        });
      },
      
      addAction: (action) => {
        const { actions } = get();
        const updatedActions = [...actions, action];
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      updateAction: (actionId, updates) => {
        const { actions } = get();
        const updatedActions = actions.map((action) =>
          action.id === actionId
            ? { ...action, ...updates }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      updateActionStatus: (actionId, status) => {
        get().updateAction(actionId, { 
          status,
          ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
        });
      },
      
      snoozeAction: (actionId, until) => {
        get().updateAction(actionId, {
          status: 'snoozed',
          snoozedUntil: until,
        });
      },
      
      dismissAction: (actionId) => {
        const { actions, addToUndoStack } = get();
        const action = actions.find(a => a.id === actionId);
        if (action) {
          addToUndoStack([actionId], [action]);
        }
        get().updateAction(actionId, {
          status: 'dismissed',
          completedAt: new Date().toISOString(),
        });
      },
      
      completeAction: (actionId) => {
        const userData = useAuthStore.getState().userData;
        const { actions, addToUndoStack } = get();
        const action = actions.find(a => a.id === actionId);
        if (action) {
          addToUndoStack([actionId], [action]);
        }
        get().updateAction(actionId, {
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedBy: userData?.user?.name || 'Unknown',
        });
      },
      
      getActionsByCustomerId: (customerId) => {
        const { actions } = get();
        return actions.filter((action) => action.customerId === customerId);
      },
      
      getPendingActionsCount: () => {
        const { actions } = get();
        return actions.filter((action) => 
          action.status === 'pending' || action.status === 'in_progress'
        ).length;
      },
      
      // Bulk Action Implementations
      completeMultipleActions: (actionIds: string[]) => {
        const userData = useAuthStore.getState().userData;
        const { actions, addToUndoStack } = get();
        
        // Save previous states for undo
        const previousStates = actions.filter(a => actionIds.includes(a.id));
        addToUndoStack(actionIds, previousStates);
        
        const updatedActions = actions.map((action) =>
          actionIds.includes(action.id)
            ? {
                ...action,
                status: 'completed' as CustomerActionStatus,
                completedAt: new Date().toISOString(),
                completedBy: userData?.user?.name || 'Unknown',
              }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      dismissMultipleActions: (actionIds: string[]) => {
        const { actions, addToUndoStack } = get();
        
        // Save previous states for undo
        const previousStates = actions.filter(a => actionIds.includes(a.id));
        addToUndoStack(actionIds, previousStates);
        
        const updatedActions = actions.map((action) =>
          actionIds.includes(action.id)
            ? { 
                ...action, 
                status: 'dismissed' as CustomerActionStatus,
                completedAt: new Date().toISOString(),
              }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      snoozeMultipleActions: (actionIds: string[], until: string) => {
        const { actions, addToUndoStack } = get();
        
        // Save previous states for undo
        const previousStates = actions.filter(a => actionIds.includes(a.id));
        addToUndoStack(actionIds, previousStates);
        
        const updatedActions = actions.map((action) =>
          actionIds.includes(action.id)
            ? {
                ...action,
                status: 'snoozed' as CustomerActionStatus,
                snoozedUntil: until,
              }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      assignMultipleActions: (actionIds: string[], assignedTo: string, assignedToName: string) => {
        const { actions } = get();
        const updatedActions = actions.map((action) =>
          actionIds.includes(action.id)
            ? { ...action, assignedTo, assignedToName }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      updateMultipleActionsPriority: (actionIds: string[], priority: Priority) => {
        const { actions } = get();
        const updatedActions = actions.map((action) =>
          actionIds.includes(action.id)
            ? { ...action, priority }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      // Undo & History Implementation
      addToUndoStack: (actionIds: string[], previousStates: CustomerAction[]) => {
        const { undoStack } = get();
        // Keep last 20 undo operations
        const newStack = [...undoStack, { actionIds, previousStates }].slice(-20);
        set({ undoStack: newStack });
      },
      
      restoreAction: (actionId: string) => {
        const { actions } = get();
        const updatedActions = actions.map((action) =>
          action.id === actionId
            ? {
                ...action,
                status: 'pending' as CustomerActionStatus,
                completedAt: undefined,
                completedBy: undefined,
                snoozedUntil: undefined,
              }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      undoLastAction: () => {
        const { undoStack, actions } = get();
        if (undoStack.length === 0) return;
        
        const lastAction = undoStack[undoStack.length - 1];
        const previousStatesMap = new Map(lastAction.previousStates.map(a => [a.id, a]));
        
        const updatedActions = actions.map((action) =>
          previousStatesMap.has(action.id)
            ? previousStatesMap.get(action.id)!
            : action
        );
        
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
          undoStack: undoStack.slice(0, -1),
        });
      },
      
      getCompletedActions: () => {
        const { actions } = get();
        return actions.filter((a) => 
          a.status === 'completed' || a.status === 'dismissed'
        ).sort((a, b) => {
          const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return bDate - aDate;
        });
      },
      
      addActionNote: (actionId: string, note: string) => {
        const { actions } = get();
        const updatedActions = actions.map((action) =>
          action.id === actionId
            ? {
                ...action,
                metadata: {
                  ...action.metadata,
                  notes: [...(action.metadata?.notes || []), {
                    text: note,
                    createdAt: new Date().toISOString(),
                  }],
                },
              }
            : action
        );
        set({
          actions: updatedActions,
          filteredActions: updatedActions,
        });
      },
      
      updateCustomer: (customerId, updates) => {
        const { customers, customersCache } = get();
        
        const updatedCustomers = customers.map((customer) =>
          customer.id === customerId
            ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
            : customer
        );
        
        const updatedCache = new Map(customersCache);
        const customer = updatedCache.get(customerId);
        if (customer) {
          updatedCache.set(customerId, {
            ...customer,
            ...updates,
            updatedAt: new Date().toISOString(),
          });
        }
        
        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
        
        get().applyFilters();
        get().calculateStatistics();
      },
      
      removeCustomer: (customerId) => {
        const { customers, customersCache } = get();
        const updatedCustomers = customers.filter((c) => c.id !== customerId);
        const updatedCache = new Map(customersCache);
        updatedCache.delete(customerId);
        
        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
        
        get().applyFilters();
        get().calculateStatistics();
      },
      
      setSelectedCustomer: (customer) => {
        set({ selectedCustomer: customer });
      },
      
      getCustomerById: (customerId) => {
        const { customersCache } = get();
        return customersCache.get(customerId);
      },
      
      // Filter & Search Actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1, // Reset to first page when filters change
        }));
        get().applyFilters();
      },
      
      clearFilters: () => {
        set({ filters: {}, searchTerm: '', currentPage: 1 });
        get().applyFilters();
      },
      
      setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 });
        get().applyFilters();
      },
      
      setSortBy: (sortBy) => {
        set({ sortBy, currentPage: 1 });
        get().applyFilters();
      },
      
      setSortOrder: (order) => {
        set({ sortOrder: order });
        get().applyFilters();
      },
      
      applyFilters: () => {
        const { customers, filters, searchTerm, sortBy, sortOrder } = get();
        
        let filtered = [...customers];
        
        // Apply search
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(term) ||
              c.nameEn?.toLowerCase().includes(term) ||
              c.phone.includes(term) ||
              c.email?.toLowerCase().includes(term) ||
              c.nationalId?.includes(term)
          );
        }
        
        // Apply stage filter
        if (filters.stage && filters.stage.length > 0) {
          filtered = filtered.filter((c) => filters.stage!.includes(c.stage));
        }
        
        // Apply source filter
        if (filters.source && filters.source.length > 0) {
          filtered = filtered.filter((c) => filters.source!.includes(c.source));
        }
        
        // Apply priority filter
        if (filters.priority && filters.priority.length > 0) {
          filtered = filtered.filter((c) => filters.priority!.includes(c.priority));
        }
        
        // Apply assigned employee filter
        if (filters.assignedEmployee && filters.assignedEmployee.length > 0) {
          filtered = filtered.filter(
            (c) =>
              c.assignedEmployeeId &&
              filters.assignedEmployee!.includes(c.assignedEmployeeId)
          );
        }
        
        // Apply budget range
        if (filters.budgetMin !== undefined) {
          filtered = filtered.filter(
            (c) =>
              c.preferences.budgetMin !== undefined &&
              c.preferences.budgetMin >= filters.budgetMin!
          );
        }
        if (filters.budgetMax !== undefined) {
          filtered = filtered.filter(
            (c) =>
              c.preferences.budgetMax !== undefined &&
              c.preferences.budgetMax <= filters.budgetMax!
          );
        }
        
        // Apply property type filter
        if (filters.propertyType && filters.propertyType.length > 0) {
          filtered = filtered.filter((c) =>
            c.preferences.propertyType.some((type) =>
              filters.propertyType!.includes(type)
            )
          );
        }
        
        // Apply tags filter
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter((c) =>
            filters.tags!.some((tag) => c.tags.includes(tag))
          );
        }
        
        // Apply date filters
        if (filters.createdFrom) {
          filtered = filtered.filter((c) => c.createdAt >= filters.createdFrom!);
        }
        if (filters.createdTo) {
          filtered = filtered.filter((c) => c.createdAt <= filters.createdTo!);
        }
        
        // Apply KSA-specific filters
        if (filters.brokerageLicenseStatus && filters.brokerageLicenseStatus.length > 0) {
          filtered = filtered.filter((c) =>
            c.ksaCompliance?.brokerageLicense &&
            filters.brokerageLicenseStatus!.includes(c.ksaCompliance.brokerageLicense.status)
          );
        }
        
        if (filters.brokerageContractStatus && filters.brokerageContractStatus.length > 0) {
          filtered = filtered.filter((c) =>
            c.ksaCompliance?.brokerageContracts?.some((contract) =>
              filters.brokerageContractStatus!.includes(contract.status)
            )
          );
        }
        
        if (filters.ejarContractStatus && filters.ejarContractStatus.length > 0) {
          filtered = filtered.filter((c) =>
            c.ksaCompliance?.ejarContracts?.some((contract) =>
              filters.ejarContractStatus!.includes(contract.status)
            )
          );
        }
        
        if (filters.wafiProjectStatus && filters.wafiProjectStatus.length > 0) {
          filtered = filtered.filter((c) =>
            c.ksaCompliance?.wafiLicense &&
            filters.wafiProjectStatus!.includes(c.ksaCompliance.wafiLicense.status)
          );
        }
        
        if (filters.sakaniEligibility && filters.sakaniEligibility.length > 0) {
          filtered = filtered.filter((c) =>
            c.ksaCompliance?.sakaniEligibility &&
            filters.sakaniEligibility!.includes(c.ksaCompliance.sakaniEligibility.status)
          );
        }
        
        if (filters.mortgageStatus && filters.mortgageStatus.length > 0) {
          filtered = filtered.filter((c) =>
            c.ksaCompliance?.mortgageInfo &&
            filters.mortgageStatus!.includes(c.ksaCompliance.mortgageInfo.status)
          );
        }
        
        if (filters.hasEscrowOverdue !== undefined) {
          filtered = filtered.filter((c) => {
            const hasOverdue = c.ksaCompliance?.escrowMilestones?.some(
              (milestone) => milestone.isOverdue
            );
            return filters.hasEscrowOverdue ? hasOverdue : !hasOverdue;
          });
        }
        
        if (filters.hasHandoverDefects !== undefined) {
          filtered = filtered.filter((c) => {
            const hasDefects = c.ksaCompliance?.handoverDefects &&
              c.ksaCompliance.handoverDefects.length > 0;
            return filters.hasHandoverDefects ? hasDefects : !hasDefects;
          });
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
          let aVal: any;
          let bVal: any;
          
          switch (sortBy) {
            case 'name':
              aVal = a.name;
              bVal = b.name;
              break;
            case 'createdAt':
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
              break;
            case 'lastContactAt':
              aVal = a.lastContactAt ? new Date(a.lastContactAt).getTime() : 0;
              bVal = b.lastContactAt ? new Date(b.lastContactAt).getTime() : 0;
              break;
            case 'dealValue':
              aVal = a.totalDealValue || 0;
              bVal = b.totalDealValue || 0;
              break;
            default:
              aVal = a.createdAt;
              bVal = b.createdAt;
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
        
        const totalPages = Math.ceil(filtered.length / get().pageSize);
        
        set({
          filteredCustomers: filtered,
          totalPages,
          totalCustomers: filtered.length,
        });
      },
      
      // Pagination Actions
      setCurrentPage: (page) => {
        const { totalPages } = get();
        if (page >= 1 && page <= totalPages) {
          set({ currentPage: page });
        }
      },
      
      setPageSize: (size) => {
        set({ pageSize: size, currentPage: 1 });
        get().applyFilters();
      },
      
      nextPage: () => {
        const { currentPage, totalPages } = get();
        if (currentPage < totalPages) {
          set({ currentPage: currentPage + 1 });
        }
      },
      
      prevPage: () => {
        const { currentPage } = get();
        if (currentPage > 1) {
          set({ currentPage: currentPage - 1 });
        }
      },
      
      // Stage Management Actions
      updateCustomerStage: (customerId, newStage, notes) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        const userData = useAuthStore.getState().userData;
        const stageChange: StageChange = {
          id: `stage_${Date.now()}`,
          fromStage: customer.stage,
          toStage: newStage,
          changedBy: userData?.user?.name || 'Unknown',
          changedById: userData?.user?.id?.toString() || '0',
          changedAt: new Date().toISOString(),
          notes,
          autoGenerated: false,
        };
        
        get().updateCustomer(customerId, {
          stage: newStage,
          stageHistory: [...customer.stageHistory, stageChange],
        });
      },
      
      addStageChange: (customerId, stageChange) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        get().updateCustomer(customerId, {
          stageHistory: [...customer.stageHistory, stageChange],
        });
      },
      
      // Relationship Actions
      addAppointment: (customerId, appointment) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        get().updateCustomer(customerId, {
          appointments: [...customer.appointments, appointment],
        });
      },
      
      updateAppointment: (customerId, appointmentId, updates) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        const updatedAppointments = customer.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, ...updates } : apt
        );
        
        get().updateCustomer(customerId, {
          appointments: updatedAppointments,
        });
      },
      
      removeAppointment: (customerId, appointmentId) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        const updatedAppointments = customer.appointments.filter(
          (apt) => apt.id !== appointmentId
        );
        
        get().updateCustomer(customerId, {
          appointments: updatedAppointments,
        });
      },
      
      addReminder: (customerId, reminder) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        get().updateCustomer(customerId, {
          reminders: [...customer.reminders, reminder],
        });
      },
      
      updateReminder: (customerId, reminderId, updates) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        const updatedReminders = customer.reminders.map((rem) =>
          rem.id === reminderId ? { ...rem, ...updates } : rem
        );
        
        get().updateCustomer(customerId, {
          reminders: updatedReminders,
        });
      },
      
      removeReminder: (customerId, reminderId) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        const updatedReminders = customer.reminders.filter(
          (rem) => rem.id !== reminderId
        );
        
        get().updateCustomer(customerId, {
          reminders: updatedReminders,
        });
      },
      
      addInteraction: (customerId, interaction) => {
        const customer = get().getCustomerById(customerId);
        if (!customer) return;
        
        get().updateCustomer(customerId, {
          interactions: [...customer.interactions, interaction],
          lastContactAt: interaction.date,
          lastContactType: interaction.type,
          totalInteractions: (customer.totalInteractions || 0) + 1,
        });
      },
      
      // UI State Actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Dialog Actions
      setShowAddCustomerDialog: (show) => set({ showAddCustomerDialog: show }),
      setShowEditCustomerDialog: (show) => set({ showEditCustomerDialog: show }),
      setShowCustomerDetailDialog: (show) =>
        set({ showCustomerDetailDialog: show }),
      setShowStageChangeDialog: (show) => set({ showStageChangeDialog: show }),
      setShowQuickViewDialog: (show) => set({ showQuickViewDialog: show }),
      setShowWhatsAppDialog: (show) => set({ showWhatsAppDialog: show }),
      setShowAddAppointmentDialog: (show) =>
        set({ showAddAppointmentDialog: show }),
      setShowAddReminderDialog: (show) => set({ showAddReminderDialog: show }),
      setShowAddInteractionDialog: (show) =>
        set({ showAddInteractionDialog: show }),
      
      // Statistics Actions
      calculateStatistics: () => {
        const { customers } = get();
        
        if (customers.length === 0) {
          set({ statistics: null });
          return;
        }
        
        const statistics: CustomerStatistics = {
          total: customers.length,
          byStage: {} as any,
          bySource: {} as any,
          byPriority: {} as any,
          avgLeadScore: 0,
          totalDealValue: 0,
          conversionRate: 0,
          avgDaysInPipeline: 0,
          activeCustomers: 0,
          newThisMonth: 0,
          closedThisMonth: 0,
        };
        
        let totalDays = 0;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        customers.forEach((customer) => {
          // By stage
          statistics.byStage[customer.stage] =
            (statistics.byStage[customer.stage] || 0) + 1;
          
          // By source
          statistics.bySource[customer.source] =
            (statistics.bySource[customer.source] || 0) + 1;
          
          // By priority
          statistics.byPriority[customer.priority] =
            (statistics.byPriority[customer.priority] || 0) + 1;
          
          // Deal value
          statistics.totalDealValue += customer.totalDealValue || 0;
          
          // Days in pipeline
          const createdDate = new Date(customer.createdAt);
          const daysDiff = Math.floor(
            (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          totalDays += daysDiff;
          
          // Active customers (contacted in last 30 days)
          if (
            customer.lastContactAt &&
            new Date(customer.lastContactAt) >=
              new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          ) {
            statistics.activeCustomers++;
          }
          
          // New this month
          if (createdDate >= monthStart) {
            statistics.newThisMonth++;
          }
          
          // Closed this month
          if (
            customer.stage === 'closing' &&
            new Date(customer.updatedAt) >= monthStart
          ) {
            statistics.closedThisMonth++;
          }
        });
        
        statistics.avgDaysInPipeline = Math.round(totalDays / customers.length);
        statistics.conversionRate =
          statistics.newThisMonth > 0
            ? Math.round(
                (statistics.closedThisMonth / statistics.newThisMonth) * 100
              )
            : 0;
        
        set({ statistics });
      },
      
      // Cache Management
      clearCache: () => {
        set({
          customersCache: new Map(),
          lastFetched: null,
        });
      },
      
      shouldRefetchData: () => {
        const { lastFetched, cacheExpiry } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > cacheExpiry;
      },
      
      // Data Fetching (stub for future API integration)
      fetchCustomers: async () => {
        const userData = useAuthStore.getState().userData;
        if (!userData?.token) {
          console.log("No token available, skipping fetchCustomers");
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await axiosInstance.get('/v1/customers-hub');
          // get().setCustomers(response.data.data);
          
          // For now, this is a stub - will be populated with mock data separately
          console.log("Fetch customers - API integration pending");
        } catch (err: any) {
          console.error("Error fetching customers:", err);
          set({ error: err.response?.data?.message || "Failed to fetch customers" });
        } finally {
          set({ isLoading: false });
        }
      },
      
      refreshData: async () => {
        get().clearCache();
        await get().fetchCustomers();
      },
      
      // KSA Compliance Management Actions
      updateBrokerageLicense: (customerId, license) => {
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...get().getCustomerById(customerId)?.ksaCompliance,
            brokerageLicense: {
              ...get().getCustomerById(customerId)?.ksaCompliance?.brokerageLicense,
              ...license,
            },
          },
        });
      },
      
      addBrokerageContract: (customerId, contract) => {
        const customer = get().getCustomerById(customerId);
        const existingContracts = customer?.ksaCompliance?.brokerageContracts || [];
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            brokerageContracts: [...existingContracts, contract],
          },
        });
      },
      
      updateBrokerageContract: (customerId, contractId, updates) => {
        const customer = get().getCustomerById(customerId);
        const contracts = customer?.ksaCompliance?.brokerageContracts || [];
        const updatedContracts = contracts.map((c) =>
          c.id === contractId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            brokerageContracts: updatedContracts,
          },
        });
      },
      
      addEjarContract: (customerId, contract) => {
        const customer = get().getCustomerById(customerId);
        const existingContracts = customer?.ksaCompliance?.ejarContracts || [];
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            ejarContracts: [...existingContracts, contract],
          },
        });
      },
      
      updateEjarContract: (customerId, contractId, updates) => {
        const customer = get().getCustomerById(customerId);
        const contracts = customer?.ksaCompliance?.ejarContracts || [];
        const updatedContracts = contracts.map((c) =>
          c.id === contractId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            ejarContracts: updatedContracts,
          },
        });
      },
      
      updateWafiLicense: (customerId, license) => {
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...get().getCustomerById(customerId)?.ksaCompliance,
            wafiLicense: {
              ...get().getCustomerById(customerId)?.ksaCompliance?.wafiLicense,
              ...license,
            },
          },
        });
      },
      
      addEscrowMilestone: (customerId, milestone) => {
        const customer = get().getCustomerById(customerId);
        const existingMilestones = customer?.ksaCompliance?.escrowMilestones || [];
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            escrowMilestones: [...existingMilestones, milestone],
          },
        });
      },
      
      updateEscrowMilestone: (customerId, milestoneId, updates) => {
        const customer = get().getCustomerById(customerId);
        const milestones = customer?.ksaCompliance?.escrowMilestones || [];
        const updatedMilestones = milestones.map((m) =>
          m.id === milestoneId ? { ...m, ...updates } : m
        );
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            escrowMilestones: updatedMilestones,
          },
        });
      },
      
      addHandoverDefect: (customerId, defect) => {
        const customer = get().getCustomerById(customerId);
        const existingDefects = customer?.ksaCompliance?.handoverDefects || [];
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            handoverDefects: [...existingDefects, defect],
          },
        });
      },
      
      updateHandoverDefect: (customerId, defectId, updates) => {
        const customer = get().getCustomerById(customerId);
        const defects = customer?.ksaCompliance?.handoverDefects || [];
        const updatedDefects = defects.map((d) =>
          d.id === defectId ? { ...d, ...updates } : d
        );
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            handoverDefects: updatedDefects,
          },
        });
      },
      
      updateSakaniEligibility: (customerId, eligibility) => {
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...get().getCustomerById(customerId)?.ksaCompliance,
            sakaniEligibility: {
              ...get().getCustomerById(customerId)?.ksaCompliance?.sakaniEligibility,
              ...eligibility,
            },
          },
        });
      },
      
      updateMortgageInfo: (customerId, mortgage) => {
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...get().getCustomerById(customerId)?.ksaCompliance,
            mortgageInfo: {
              ...get().getCustomerById(customerId)?.ksaCompliance?.mortgageInfo,
              ...mortgage,
            },
          },
        });
      },
      
      addPaymentScheduleItem: (customerId, payment) => {
        const customer = get().getCustomerById(customerId);
        const existingPayments = customer?.ksaCompliance?.paymentSchedule || [];
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            paymentSchedule: [...existingPayments, payment],
          },
        });
      },
      
      updatePaymentScheduleItem: (customerId, paymentId, updates) => {
        const customer = get().getCustomerById(customerId);
        const payments = customer?.ksaCompliance?.paymentSchedule || [];
        const updatedPayments = payments.map((p) =>
          p.id === paymentId ? { ...p, ...updates } : p
        );
        get().updateCustomer(customerId, {
          ksaCompliance: {
            ...customer?.ksaCompliance,
            paymentSchedule: updatedPayments,
          },
        });
      },
    }),
    {
      name: 'unified-customers-storage',
      partialize: (state) => ({
        // Only persist these fields
        viewMode: state.viewMode,
        pageSize: state.pageSize,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

export default useUnifiedCustomersStore;
