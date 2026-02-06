"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import type { EmployeeConfig, EmployeeRule } from "@/lib/services/customers-hub-assignment-api";

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
  
  const { customers } = useUnifiedCustomersStore();
  
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [configs, setConfigs] = useState<EmployeeConfig[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

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

  // Refresh data when panel opens
  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchUnassignedCount();
      fetchRules();
    }
  }, [open, fetchEmployees, fetchUnassignedCount, fetchRules]);

  // Get config for employee
  const getConfig = (empId: string) => configs.find((c) => c.employeeId === empId);

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
              rules: c.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
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
      const success = await handleSaveRules({ employeeRules: configs });
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
    try {
      const result = await handleAutoAssign({ employeeRules: configs });
      if (result.assignedCount > 0) {
        toast.success(`تم تعيين ${result.assignedCount} عميل تلقائياً`);
      } else {
        toast.info("لا يوجد عملاء مطابقين للقواعد");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التعيين التلقائي");
    }
  };

  const selectedEmp = selectedEmployee ? employees.find((e) => e.id === selectedEmployee) : null;
  const selectedConfig = selectedEmployee ? getConfig(selectedEmployee) : null;

  return (
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

                    return (
                      <div
                        key={emp.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
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
                            {rulesCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
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
                    <Button 
                      onClick={runAutoAssignment} 
                      className="w-full gap-2"
                      disabled={apiLoading}
                    >
                      {apiLoading ? (
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
                    <p className="text-xs text-gray-500 text-center mt-2">
                      سيتم تعيين العملاء حسب قواعد كل موظف
                    </p>
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
                  
                  {/* Apply/Save Button in Header */}
                  {hasUnsavedChanges && (
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full gap-2"
                        size="sm"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            حفظ التغييرات
                          </>
                        )}
                      </Button>
                    </div>
                  )}
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
                      {selectedConfig?.rules.map((rule, idx) => (
                        <div key={rule.id} className="p-3 border rounded-lg bg-white dark:bg-gray-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">قاعدة {idx + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-500"
                              onClick={() => deleteRule(selectedEmployee, rule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

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
                                <SelectItem value="equals">يساوي</SelectItem>
                                <SelectItem value="greaterThan">أكبر من</SelectItem>
                                <SelectItem value="lessThan">أقل من</SelectItem>
                                <SelectItem value="contains">يحتوي</SelectItem>
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
                              <Input
                                className="h-9 text-xs"
                                placeholder="القيمة"
                                value={rule.value}
                                onChange={(e) => updateRule(selectedEmployee, rule.id, { value: e.target.value })}
                              />
                            )}
                          </div>
                        </div>
                      ))}
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
  );
}
