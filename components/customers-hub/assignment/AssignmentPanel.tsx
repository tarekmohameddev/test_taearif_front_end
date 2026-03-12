"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCustomersHubAssignment } from "@/hooks/useCustomersHubAssignment";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Users,
  ChevronDown,
  ChevronLeft,
  Plus,
  Trash2,
  Play,
  Settings,
  User,
  CheckCircle,
  Save,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import type { EmployeeConfig, EmployeeRule, AutoAssignResponse } from "@/lib/services/customers-hub-assignment-api";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";

export function AssignmentPanel() {
  const {
    employees,
    rules: apiRules,
    unassignedCount,
    loading: apiLoading,
    error: apiError,
    fetchEmployees,
    fetchUnassignedCount,
    fetchRules,
    handleAutoAssign,
    handleSaveRules,
  } = useCustomersHubAssignment();
  
  const customers = useUnifiedCustomersStore((state) => state.customers);
  
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [configs, setConfigs] = useState<EmployeeConfig[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoAssigning, setAutoAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<AutoAssignResponse | null>(null);
  const hasFetchedOnOpenRef = useRef(false);

  // Initialize configs from API rules or employees
  useEffect(() => {
    if (employees.length > 0) {
      if (apiRules.length > 0) {
        // Use rules from API
        setConfigs(apiRules);
      } else if (configs.length === 0) {
        // Initialize empty configs for all employees
        setConfigs(
          employees.map((emp) => ({
            employeeId: emp.id,
            isActive: true,
            rules: [],
          }))
        );
      }
    }
  }, [employees, apiRules]);

  // Reset selected employee when panel opens - always show employee list first
  useEffect(() => {
    if (open) {
      setSelectedEmployee(null);
    }
  }, [open]);

  // Refresh data when panel opens - only fetch once per open session
  useEffect(() => {
    if (open && !apiLoading && !hasFetchedOnOpenRef.current) {
      hasFetchedOnOpenRef.current = true;
      // Only fetch if data is not already loaded
      // The store will prevent duplicate requests
      fetchEmployees();
      fetchUnassignedCount();
      fetchRules();
    }
    
    // Reset flag when panel closes
    if (!open) {
      hasFetchedOnOpenRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, apiLoading]);

  // Get config for employee
  const getConfig = (empId: string) => configs.find((c) => c.employeeId === empId);

  // Validate rule field and operator compatibility
  const getValidOperatorsForField = (field: EmployeeRule["field"]): EmployeeRule["operator"][] => {
    switch (field) {
      case "budgetMin":
        return ["greaterThan"];
      case "budgetMax":
        return ["lessThan"];
      case "propertyType":
        return ["equals"];
      case "city":
        return ["equals", "contains"];
      case "source":
        return ["equals", "contains"];
      default:
        return [];
    }
  };

  // Validate rule value type
  const isValidValueForField = (field: EmployeeRule["field"], value: string): boolean => {
    if (!value || value.trim() === "") return false;
    
    switch (field) {
      case "budgetMin":
      case "budgetMax":
        // Must be a valid number
        const num = Number(value);
        return !isNaN(num) && isFinite(num) && num >= 0;
      case "propertyType":
      case "city":
      case "source":
        // Must be non-empty string
        return value.trim().length > 0;
      default:
        return false;
    }
  };

  // Validate a single rule
  const validateRule = (rule: EmployeeRule): { valid: boolean; error?: string } => {
    const validOperators = getValidOperatorsForField(rule.field);
    
    if (!validOperators.includes(rule.operator)) {
      return {
        valid: false,
        error: `العامل "${rule.operator}" غير صالح للحقل "${rule.field}". العوامل الصالحة: ${validOperators.join(", ")}`
      };
    }

    if (!isValidValueForField(rule.field, rule.value)) {
      const fieldName = rule.field === "budgetMin" || rule.field === "budgetMax" 
        ? "رقم" 
        : "نص";
      return {
        valid: false,
        error: `قيمة غير صالحة للحقل "${rule.field}". يجب أن يكون ${fieldName}`
      };
    }

    return { valid: true };
  };

  // Toggle employee active
  const toggleEmployeeActive = (empId: string) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.employeeId === empId ? { ...c, isActive: !c.isActive } : c
      )
    );
    setHasUnsavedChanges(true);
  };

  // Add rule to employee
  const addRule = (empId: string) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.employeeId === empId
          ? {
              ...c,
              rules: [
                ...c.rules,
                { id: `rule_${Date.now()}`, field: "budgetMin", operator: "greaterThan", value: "" },
              ],
            }
          : c
      )
    );
    setHasUnsavedChanges(true);
  };

  // Update rule
  const updateRule = (empId: string, ruleId: string, updates: Partial<EmployeeRule>) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.employeeId === empId
          ? {
              ...c,
              rules: c.rules.map((r) => {
                if (r.id === ruleId) {
                  const updatedRule = { ...r, ...updates };
                  
                  // If field changed, reset operator and value to defaults
                  if (updates.field && updates.field !== r.field) {
                    const validOperators = getValidOperatorsForField(updates.field);
                    updatedRule.operator = validOperators[0] || "equals";
                    updatedRule.value = "";
                  }
                  
                  // If operator changed and is invalid for field, reset to first valid operator
                  if (updates.operator) {
                    const validOperators = getValidOperatorsForField(updatedRule.field);
                    if (!validOperators.includes(updates.operator)) {
                      updatedRule.operator = validOperators[0] || "equals";
                    }
                  }
                  
                  return updatedRule;
                }
                return r;
              }),
            }
          : c
      )
    );
    setHasUnsavedChanges(true);
  };

  // Delete rule
  const deleteRule = (empId: string, ruleId: string) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.employeeId === empId
          ? { ...c, rules: c.rules.filter((r) => r.id !== ruleId) }
          : c
      )
    );
    setHasUnsavedChanges(true);
  };

  // Save rules to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      // Filter out employees without rules - only send employees with at least one rule
      const configsWithRules = configs.filter(
        (config) => config.rules.length > 0
      );

      // Check if there are any employees with rules
      if (configsWithRules.length === 0) {
        toast.error("لا يمكن حفظ القواعد: يجب أن يكون هناك موظف واحد على الأقل لديه قواعد");
        setSaving(false);
        return;
      }

      // Validate all rules before saving
      const validationErrors: string[] = [];
      configsWithRules.forEach((config) => {
        const employee = employees.find((e) => e.id === config.employeeId);
        config.rules.forEach((rule, index) => {
          const validation = validateRule(rule);
          if (!validation.valid) {
            validationErrors.push(
              `موظف "${employee?.name || config.employeeId}" - قاعدة ${index + 1}: ${validation.error}`
            );
          }
        });
      });

      if (validationErrors.length > 0) {
        toast.error(
          `يوجد أخطاء في القواعد:\n${validationErrors.slice(0, 3).join("\n")}${
            validationErrors.length > 3 ? `\nو ${validationErrors.length - 3} أخطاء أخرى...` : ""
          }`,
          { duration: 5000 }
        );
        setSaving(false);
        return;
      }

      const success = await handleSaveRules({ employeeRules: configsWithRules });
      if (success) {
        toast.success("تم حفظ القواعد بنجاح");
        setHasUnsavedChanges(false);
        await fetchRules();
      } else {
        toast.error("فشل حفظ القواعد");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ القواعد");
    } finally {
      setSaving(false);
    }
  };

  // Check if customer matches rules
  const matchesRules = (customer: any, rules: EmployeeRule[]): boolean => {
    if (rules.length === 0) return false;
    
    return rules.every((rule) => {
      let customerValue: any;
      
      switch (rule.field) {
        case "budgetMin":
          customerValue = customer.preferences?.budgetMin || 0;
          break;
        case "budgetMax":
          customerValue = customer.preferences?.budgetMax || 0;
          break;
        case "propertyType":
          customerValue = customer.preferences?.propertyType?.[0] || "";
          break;
        case "city":
          customerValue = customer.city || "";
          break;
        case "source":
          customerValue = customer.source || "";
          break;
        default:
          return false;
      }

      switch (rule.operator) {
        case "equals":
          return String(customerValue).toLowerCase() === String(rule.value).toLowerCase();
        case "greaterThan":
          return Number(customerValue) > Number(rule.value);
        case "lessThan":
          return Number(customerValue) < Number(rule.value);
        case "contains":
          return String(customerValue).toLowerCase().includes(String(rule.value).toLowerCase());
        default:
          return false;
      }
    });
  };

  // Run auto-assignment using API
  const runAutoAssignment = async () => {
    console.log("runAutoAssignment called", { 
      configs, 
      configsLength: configs.length,
      employees: employees.length,
      apiRules: apiRules.length
    });
    
    if (autoAssigning) {
      console.warn("Auto assignment already in progress");
      return;
    }

    setAutoAssigning(true);
    
    try {
      // Filter out employees without rules - only send employees with at least one rule
      const configsWithRules = configs.filter(
        (config) => config.isActive && config.rules.length > 0
      );

      console.log("configsWithRules:", configsWithRules, "count:", configsWithRules.length);

      // Check if there are any employees with rules
      if (configsWithRules.length === 0) {
        console.warn("No employees with rules found");
        toast.error("لا يمكن إرسال الطلب: يجب أن يكون هناك موظف واحد على الأقل لديه قواعد");
        setAutoAssigning(false);
        return;
      }

      console.log("Sending request with:", { 
        employeeRules: configsWithRules,
        employeeCount: configsWithRules.length
      });
      
      const result = await handleAutoAssign({ employeeRules: configsWithRules });
      
      console.log("Response received:", result);
      
      if (result && result.status === "success") {
        const { assignedCount, failedCount } = result.data;
        console.log("Assignment result:", { assignedCount, failedCount });
        
        // Save result to show in sidebar
        setAssignmentResult(result);
        
        if (assignedCount > 0) {
          toast.success(
            `تم تعيين ${assignedCount} عميل تلقائياً${failedCount > 0 ? ` (فشل ${failedCount})` : ""}`
          );
        } else {
          toast.info("لا يوجد عملاء مطابقين للقواعد");
        }
      } else {
        console.error("Auto assign failed - invalid response:", result);
        toast.error("فشل التعيين التلقائي");
      }
    } catch (error) {
      console.error("Error in runAutoAssignment:", error);
      toast.error("حدث خطأ أثناء التعيين التلقائي");
    } finally {
      setAutoAssigning(false);
    }
  };

  const selectedEmp = selectedEmployee ? employees.find((e) => e.id === selectedEmployee) : null;
  const selectedConfig = selectedEmployee ? getConfig(selectedEmployee) : null;

  return (
    <>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          التعيينات
          {unassignedCount > 0 && (
            <Badge variant="destructive" className="mr-1 h-5 px-1.5 text-xs">
              {unassignedCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[500px] sm:max-w-[500px] p-0" dir="rtl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center justify-between">
              <span>إدارة التعيينات</span>
              {unassignedCount > 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  {unassignedCount} غير معين
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!selectedEmployee ? (
              /* Employee List */
              <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-2">
                  {employees.map((emp) => {
                    const config = getConfig(emp.id);
                    const rulesCount = config?.rules.length || 0;
                    const loadPercent = Math.round((emp.customerCount / emp.maxCapacity) * 100);
                    
                    // Check if employee has invalid rules
                    const hasInvalidRules = config?.rules.some((rule) => !validateRule(rule).valid) || false;
                    const invalidRulesCount = config?.rules.filter((rule) => !validateRule(rule).valid).length || 0;

                    return (
                      <div
                        key={emp.id}
                        className={`p-3 border-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          hasInvalidRules
                            ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => setSelectedEmployee(emp.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-xs text-gray-500">{emp.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasInvalidRules && (
                              <Badge variant="destructive" className="text-xs">
                                {invalidRulesCount} خطأ
                              </Badge>
                            )}
                            {rulesCount > 0 && (
                              <Badge variant={hasInvalidRules ? "outline" : "secondary"} className="text-xs">
                                {rulesCount} قاعدة
                              </Badge>
                            )}
                            <ChevronLeft className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Progress
                            value={loadPercent}
                            className={`flex-1 h-2 ${
                              loadPercent >= 90 ? "[&>div]:bg-red-500" :
                              loadPercent >= 70 ? "[&>div]:bg-amber-500" :
                              "[&>div]:bg-green-500"
                            }`}
                          />
                          <span className="text-xs text-gray-500 w-16 text-left">
                            {emp.customerCount}/{emp.maxCapacity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Auto Assign Button */}
                {unassignedCount > 0 && (
                  <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                    {(() => {
                      // Count employees with rules
                      const employeesWithRules = configs.filter(
                        (config) => config.isActive && config.rules.length > 0
                      ).length;
                      const hasEmployeesWithRules = employeesWithRules > 0;

                      return (
                        <>
                          <Button 
                            onClick={runAutoAssignment} 
                            className="w-full gap-2"
                            disabled={apiLoading || autoAssigning || !hasEmployeesWithRules}
                          >
                            {apiLoading || autoAssigning ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جاري التعيين...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                تشغيل التعيين التلقائي
                              </>
                            )}
                          </Button>
                          {!hasEmployeesWithRules ? (
                            <p className="text-xs text-amber-600 text-center mt-2">
                              يجب إضافة قواعد لموظف واحد على الأقل قبل التعيين التلقائي
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500 text-center mt-2">
                              سيتم تعيين العملاء حسب قواعد كل موظف ({employeesWithRules} موظف لديه قواعد)
                            </p>
                          )}
                        </>
                      );
                    })()}

                    {/* Assignment Results */}
                    {assignmentResult && assignmentResult.status === "success" && (
                      <div className="mt-4 p-4 bg-white dark:bg-gray-800 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            نتائج التعيين
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setAssignmentResult(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400">نجح</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {assignmentResult.data.assignedCount}
                            </p>
                          </div>
                          {assignmentResult.data.failedCount > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 text-center">
                              <p className="text-xs text-gray-600 dark:text-gray-400">فشل</p>
                              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                {assignmentResult.data.failedCount}
                              </p>
                            </div>
                          )}
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400">إجمالي</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {assignmentResult.data.assignedCount + assignmentResult.data.failedCount}
                            </p>
                          </div>
                        </div>

                        {/* Assignments by Employee */}
                        {assignmentResult.data.assignments.length > 0 && (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {(() => {
                              const assignmentsByEmployee = assignmentResult.data.assignments.reduce(
                                (acc, assignment) => {
                                  const empId = assignment.employeeId;
                                  const employee = employees.find((e) => e.id === empId);
                                  if (!acc[empId]) {
                                    acc[empId] = {
                                      employee: employee || { id: empId, name: `موظف ${empId}` },
                                      assignments: [],
                                    };
                                  }
                                  acc[empId].assignments.push(assignment);
                                  return acc;
                                },
                                {} as Record<
                                  string,
                                  {
                                    employee: { id: string; name: string };
                                    assignments: Array<{ customerId: string; employeeId: string; assignedAt: string }>;
                                  }
                                >
                              );

                              return Object.values(assignmentsByEmployee).map((group) => (
                                <div
                                  key={group.employee.id}
                                  className="p-2 bg-gray-50 dark:bg-gray-700 rounded border"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {group.employee.name.charAt(0)}
                                      </div>
                                      <span className="text-xs font-medium">{group.employee.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {group.assignments.length}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {group.assignments.slice(0, 5).map((assignment) => (
                                      <span
                                        key={assignment.customerId}
                                        className="text-xs px-1.5 py-0.5 bg-white dark:bg-gray-600 rounded font-mono"
                                      >
                                        #{assignment.customerId}
                                      </span>
                                    ))}
                                    {group.assignments.length > 5 && (
                                      <span className="text-xs text-gray-500">
                                        +{group.assignments.length - 5}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Employee Rules Editor */
              <div className="h-full flex flex-col">
                {/* Back Button & Employee Info */}
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-900">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEmployee(null)}
                    className="mb-3 -mr-2"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90 ml-1" />
                    رجوع
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedEmp?.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{selectedEmp?.name}</p>
                      <p className="text-sm text-gray-500">{selectedEmp?.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="emp-active" className="text-sm">مفعل</Label>
                      <Switch
                        id="emp-active"
                        checked={selectedConfig?.isActive}
                        onCheckedChange={() => toggleEmployeeActive(selectedEmployee)}
                      />
                    </div>
                  </div>
                </div>

                {/* Rules List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">قواعد التعيين</h3>
                      {hasUnsavedChanges && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                          تغييرات غير محفوظة
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addRule(selectedEmployee)}>
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة قاعدة
                    </Button>
                  </div>

                  {selectedConfig?.rules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">لا توجد قواعد</p>
                      <p className="text-xs">أضف قواعد لتعيين العملاء تلقائياً</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedConfig?.rules.map((rule, idx) => {
                        const validation = validateRule(rule);
                        return (
                          <div 
                            key={rule.id} 
                            className={`p-3 border-2 rounded-lg bg-white dark:bg-gray-800 space-y-3 ${
                              !validation.valid 
                                ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10" 
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">قاعدة {idx + 1}</span>
                                {!validation.valid && (
                                  <Badge variant="destructive" className="text-xs">
                                    خطأ
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-red-500"
                                onClick={() => deleteRule(selectedEmployee, rule.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {!validation.valid && validation.error && (
                              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {validation.error}
                              </p>
                            )}

                          <div className="grid grid-cols-3 gap-2">
                            {/* Field */}
                            <Select
                              value={rule.field}
                              onValueChange={(v) => updateRule(selectedEmployee, rule.id, { field: v as any })}
                            >
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="budgetMin">الحد الأدنى للميزانية</SelectItem>
                                <SelectItem value="budgetMax">الحد الأقصى للميزانية</SelectItem>
                                <SelectItem value="propertyType">نوع العقار</SelectItem>
                                <SelectItem value="city">المدينة</SelectItem>
                                <SelectItem value="source">المصدر</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Operator */}
                            <Select
                              value={rule.operator}
                              onValueChange={(v) => updateRule(selectedEmployee, rule.id, { operator: v as any })}
                            >
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getValidOperatorsForField(rule.field).map((op) => (
                                  <SelectItem key={op} value={op}>
                                    {op === "equals" && "يساوي"}
                                    {op === "greaterThan" && "أكبر من"}
                                    {op === "lessThan" && "أقل من"}
                                    {op === "contains" && "يحتوي"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Value */}
                            {rule.field === "propertyType" ? (
                              <Select
                                value={rule.value}
                                onValueChange={(v) => updateRule(selectedEmployee, rule.id, { value: v })}
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="اختر" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="villa">فيلا</SelectItem>
                                  <SelectItem value="apartment">شقة</SelectItem>
                                  <SelectItem value="land">أرض</SelectItem>
                                  <SelectItem value="commercial">تجاري</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : rule.field === "source" ? (
                              <Select
                                value={rule.value}
                                onValueChange={(v) => updateRule(selectedEmployee, rule.id, { value: v })}
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="اختر" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="inquiry">استفسار</SelectItem>
                                  <SelectItem value="whatsapp">واتساب</SelectItem>
                                  <SelectItem value="referral">إحالة</SelectItem>
                                  <SelectItem value="manual">يدوي</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="flex-1">
                                <Input
                                  className="h-9 text-xs"
                                  placeholder={
                                    rule.field === "budgetMin" || rule.field === "budgetMax"
                                      ? "أدخل رقم (مثال: 5000000)"
                                      : "القيمة"
                                  }
                                  type={rule.field === "budgetMin" || rule.field === "budgetMax" ? "number" : "text"}
                                  value={rule.value}
                                  onChange={(e) => updateRule(selectedEmployee, rule.id, { value: e.target.value })}
                                />
                                {rule.value && !isValidValueForField(rule.field, rule.value) && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {rule.field === "budgetMin" || rule.field === "budgetMax"
                                      ? "يجب أن يكون رقم"
                                      : "قيمة غير صالحة"}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Employee Stats & Save Button */}
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="font-bold text-lg">{selectedEmp?.customerCount}</p>
                      <p className="text-xs text-gray-500">العملاء</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedEmp?.activeCount}</p>
                      <p className="text-xs text-gray-500">نشط</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedEmp?.maxCapacity}</p>
                      <p className="text-xs text-gray-500">السعة</p>
                    </div>
                  </div>
                  
                  {/* Save Rules Button */}
                  <Button
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges || saving}
                    className="w-full gap-2"
                    variant={hasUnsavedChanges ? "default" : "outline"}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {hasUnsavedChanges ? "حفظ التغييرات" : "تم الحفظ"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </>
  );
}