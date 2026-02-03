import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UnifiedCustomer, Employee } from "@/types/unified-customer";
import useUnifiedCustomersStore from "./unified-customers";

// Simple assignment rule
export interface AssignmentRule {
  id: string;
  name: string;
  field: "source" | "propertyType" | "budgetMin" | "priority" | "city";
  operator: "equals" | "greater_than" | "contains";
  value: string | number;
  employeeIds: string[];
  isActive: boolean;
}

// Employee with workload
export interface EmployeeWorkload extends Employee {
  customerCount: number;
  activeCount: number;
  maxCapacity: number;
}

interface AssignmentStore {
  // Data
  employees: EmployeeWorkload[];
  rules: AssignmentRule[];
  
  // Actions
  assignCustomer: (customerId: string, employeeId: string) => void;
  assignMultiple: (customerIds: string[], employeeId: string) => void;
  unassignCustomer: (customerId: string) => void;
  autoAssignCustomers: (customerIds: string[]) => { assigned: number; failed: number };
  
  // Rules
  addRule: (rule: AssignmentRule) => void;
  updateRule: (id: string, updates: Partial<AssignmentRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  
  // Helpers
  getUnassignedCount: () => number;
  refreshWorkloads: () => void;
}

// Mock employees
const EMPLOYEES: EmployeeWorkload[] = [
  { id: "emp_1", name: "أحمد محمد", role: "مستشار مبيعات", customerCount: 25, activeCount: 18, maxCapacity: 50, isActive: true },
  { id: "emp_2", name: "فاطمة علي", role: "مستشار عقاري", customerCount: 30, activeCount: 22, maxCapacity: 40, isActive: true },
  { id: "emp_3", name: "محمد خالد", role: "مستشار مبيعات", customerCount: 15, activeCount: 10, maxCapacity: 45, isActive: true },
  { id: "emp_4", name: "سارة أحمد", role: "مستشار أول", customerCount: 40, activeCount: 32, maxCapacity: 50, isActive: true },
  { id: "emp_5", name: "عمر ياسر", role: "مستشار مبيعات", customerCount: 20, activeCount: 14, maxCapacity: 40, isActive: true },
];

const useAssignmentStore = create<AssignmentStore>()(
  persist(
    (set, get) => ({
      employees: EMPLOYEES,
      rules: [
        {
          id: "rule_1",
          name: "ميزانية عالية → فريق VIP",
          field: "budgetMin",
          operator: "greater_than",
          value: 1000000,
          employeeIds: ["emp_4", "emp_2"],
          isActive: true,
        },
        {
          id: "rule_2",
          name: "استفسارات الموقع → بالتناوب",
          field: "source",
          operator: "equals",
          value: "inquiry",
          employeeIds: ["emp_1", "emp_3", "emp_5"],
          isActive: true,
        },
      ],

      assignCustomer: (customerId, employeeId) => {
        const emp = get().employees.find((e) => e.id === employeeId);
        if (!emp) return;

        useUnifiedCustomersStore.getState().updateCustomer(customerId, {
          assignedEmployeeId: employeeId,
          assignedEmployee: { id: emp.id, name: emp.name, role: emp.role },
        });
        
        get().refreshWorkloads();
      },

      assignMultiple: (customerIds, employeeId) => {
        customerIds.forEach((id) => get().assignCustomer(id, employeeId));
      },

      unassignCustomer: (customerId) => {
        useUnifiedCustomersStore.getState().updateCustomer(customerId, {
          assignedEmployeeId: undefined,
          assignedEmployee: undefined,
        });
        get().refreshWorkloads();
      },

      autoAssignCustomers: (customerIds) => {
        const customers = useUnifiedCustomersStore.getState().customers;
        const rules = get().rules.filter((r) => r.isActive);
        const employees = get().employees;
        let assigned = 0;
        let failed = 0;

        customerIds.forEach((customerId) => {
          const customer = customers.find((c) => c.id === customerId);
          if (!customer || customer.assignedEmployeeId) {
            failed++;
            return;
          }

          // Find matching rule
          let matchedRule: AssignmentRule | null = null;
          for (const rule of rules) {
            let matches = false;
            const customerValue = 
              rule.field === "source" ? customer.source :
              rule.field === "priority" ? customer.priority :
              rule.field === "budgetMin" ? customer.preferences?.budgetMin :
              rule.field === "city" ? customer.city :
              rule.field === "propertyType" ? customer.preferences?.propertyType?.[0] : null;

            if (rule.operator === "equals") {
              matches = customerValue === rule.value;
            } else if (rule.operator === "greater_than") {
              matches = Number(customerValue) > Number(rule.value);
            } else if (rule.operator === "contains") {
              matches = String(customerValue).includes(String(rule.value));
            }

            if (matches) {
              matchedRule = rule;
              break;
            }
          }

          if (matchedRule && matchedRule.employeeIds.length > 0) {
            // Pick least loaded employee from the rule
            const availableEmps = employees.filter((e) => 
              matchedRule!.employeeIds.includes(e.id) && e.customerCount < e.maxCapacity
            );
            
            if (availableEmps.length > 0) {
              const leastLoaded = availableEmps.reduce((min, e) => 
                e.customerCount < min.customerCount ? e : min
              );
              get().assignCustomer(customerId, leastLoaded.id);
              assigned++;
            } else {
              failed++;
            }
          } else {
            // No rule matched - assign to least loaded overall
            const available = employees.filter((e) => e.customerCount < e.maxCapacity);
            if (available.length > 0) {
              const leastLoaded = available.reduce((min, e) => 
                e.customerCount < min.customerCount ? e : min
              );
              get().assignCustomer(customerId, leastLoaded.id);
              assigned++;
            } else {
              failed++;
            }
          }
        });

        return { assigned, failed };
      },

      addRule: (rule) => set((s) => ({ rules: [...s.rules, rule] })),
      
      updateRule: (id, updates) => set((s) => ({
        rules: s.rules.map((r) => r.id === id ? { ...r, ...updates } : r),
      })),
      
      deleteRule: (id) => set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),
      
      toggleRule: (id) => set((s) => ({
        rules: s.rules.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r),
      })),

      getUnassignedCount: () => {
        const customers = useUnifiedCustomersStore.getState().customers;
        return customers.filter((c) => !c.assignedEmployeeId).length;
      },

      refreshWorkloads: () => {
        const customers = useUnifiedCustomersStore.getState().customers;
        set((s) => ({
          employees: s.employees.map((emp) => {
            const assigned = customers.filter((c) => c.assignedEmployeeId === emp.id);
            return {
              ...emp,
              customerCount: assigned.length,
              activeCount: assigned.filter((c) => !["closing", "post_sale"].includes(c.stage)).length,
            };
          }),
        }));
      },
    }),
    {
      name: "assignment-store",
      partialize: (state) => ({ rules: state.rules }),
    }
  )
);

export default useAssignmentStore;
