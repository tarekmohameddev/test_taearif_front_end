"use client";

import React, { useState, useEffect } from "react";
import useAssignmentStore from "@/context/store/assignment-rules";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogFooter,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Zap, UserPlus, Users, Settings } from "lucide-react";
import { toast } from "sonner";

export function AssignmentBar() {
  const { employees, rules, autoAssignCustomers, assignMultiple, refreshWorkloads, toggleRule } = useAssignmentStore();
  const customers = useUnifiedCustomersStore((state) => state.customers);
  
  const [showAutoDialog, setShowAutoDialog] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  
  const unassigned = customers.filter((c) => !c.assignedEmployeeId);
  const unassignedCount = unassigned.length;
  
  useEffect(() => {
    refreshWorkloads();
  }, [customers]);

  const handleAutoAssign = () => {
    const ids = unassigned.map((c) => c.id);
    const result = autoAssignCustomers(ids);
    toast.success(`تم تعيين ${result.assigned} عميل${result.failed > 0 ? ` (فشل ${result.failed})` : ""}`);
    setShowAutoDialog(false);
  };

  const handleManualAssign = () => {
    if (!selectedEmployee) return;
    const ids = unassigned.map((c) => c.id);
    assignMultiple(ids, selectedEmployee);
    const emp = employees.find((e) => e.id === selectedEmployee);
    toast.success(`تم تعيين ${ids.length} عميل إلى ${emp?.name}`);
    setShowManualDialog(false);
    setSelectedEmployee("");
  };

  if (unassignedCount === 0) return null;

  return (
    <>
      {/* Alert Bar */}
      <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800 dark:text-amber-200">
            {unassignedCount} عميل بدون تعيين
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowRulesDialog(true)} className="gap-1">
            <Settings className="h-4 w-4" />
            القواعد
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowManualDialog(true)} className="gap-1">
            <UserPlus className="h-4 w-4" />
            تعيين يدوي
          </Button>
          <Button size="sm" onClick={() => setShowAutoDialog(true)} className="gap-1 bg-amber-600 hover:bg-amber-700">
            <Zap className="h-4 w-4" />
            تعيين تلقائي
          </Button>
        </div>
      </div>

      {/* Auto Assign Dialog */}
      <CustomDialog open={showAutoDialog} onOpenChange={setShowAutoDialog} maxWidth="max-w-md">
        <CustomDialogContent className="dir-rtl">
          <CustomDialogClose onClose={() => setShowAutoDialog(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>التعيين التلقائي</CustomDialogTitle>
          </CustomDialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              سيتم تعيين <strong>{unassignedCount}</strong> عميل حسب القواعد المفعلة:
            </p>
            
            <div className="space-y-2">
              {rules.filter((r) => r.isActive).map((rule) => (
                <div key={rule.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  <Badge variant="outline" className="text-xs">نشط</Badge>
                  <span>{rule.name}</span>
                </div>
              ))}
              {rules.filter((r) => r.isActive).length === 0 && (
                <p className="text-sm text-gray-500">لا توجد قواعد نشطة - سيتم التوزيع على الأقل تحميلاً</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">توزيع الموظفين:</p>
              {employees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-2">
                  <span className="text-sm w-24 truncate">{emp.name}</span>
                  <Progress 
                    value={(emp.customerCount / emp.maxCapacity) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-gray-500 w-12">
                    {emp.customerCount}/{emp.maxCapacity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setShowAutoDialog(false)}>إلغاء</Button>
            <Button onClick={handleAutoAssign} className="gap-1">
              <Zap className="h-4 w-4" />
              تعيين الكل
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Manual Assign Dialog */}
      <CustomDialog open={showManualDialog} onOpenChange={setShowManualDialog} maxWidth="max-w-md">
        <CustomDialogContent className="dir-rtl">
          <CustomDialogClose onClose={() => setShowManualDialog(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>التعيين اليدوي</CustomDialogTitle>
          </CustomDialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              تعيين <strong>{unassignedCount}</strong> عميل إلى موظف واحد:
            </p>
            
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الموظف" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex justify-between gap-4">
                      <span>{emp.name}</span>
                      <span className="text-xs text-gray-400">
                        {emp.customerCount}/{emp.maxCapacity}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CustomDialogFooter>
            <Button variant="outline" onClick={() => setShowManualDialog(false)}>إلغاء</Button>
            <Button onClick={handleManualAssign} disabled={!selectedEmployee}>
              تعيين الكل
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      {/* Rules Dialog */}
      <CustomDialog open={showRulesDialog} onOpenChange={setShowRulesDialog} maxWidth="max-w-lg">
        <CustomDialogContent className="dir-rtl">
          <CustomDialogClose onClose={() => setShowRulesDialog(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>قواعد التوزيع</CustomDialogTitle>
          </CustomDialogHeader>
          
          <div className="space-y-3 py-4">
            {rules.map((rule) => (
              <div 
                key={rule.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  rule.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{rule.name}</p>
                  <p className="text-xs text-gray-500">
                    {employees.filter((e) => rule.employeeIds.includes(e.id)).map((e) => e.name).join("، ")}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant={rule.isActive ? "default" : "outline"}
                  onClick={() => toggleRule(rule.id)}
                >
                  {rule.isActive ? "مفعل" : "معطل"}
                </Button>
              </div>
            ))}
          </div>

          <CustomDialogFooter>
            <Button onClick={() => setShowRulesDialog(false)}>إغلاق</Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </>
  );
}
