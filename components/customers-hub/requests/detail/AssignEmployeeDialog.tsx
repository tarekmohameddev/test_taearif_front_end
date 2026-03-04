"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, UserPlus } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import type { EmployeeWorkload } from "@/lib/services/customers-hub-assignment-api";

interface AssignEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: {
    customerName: string;
    title: string;
    objectType?: string;
    sourceId?: string | number;
  };
  employees: EmployeeWorkload[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (id: string | null) => void;
  onAssign: () => void;
  onClose: () => void;
  loadingEmployees: boolean;
  savingEmployee: boolean;
}

function getEmployeeDisplayLabel(employee: EmployeeWorkload): string {
  let name = "";
  if (employee.name?.trim()) {
    name = employee.name.trim();
  } else if (
    (employee as { first_name?: string; last_name?: string }).first_name ||
    (employee as { first_name?: string; last_name?: string }).last_name
  ) {
    const first =
      (employee as { first_name?: string }).first_name?.trim() ?? "";
    const last = (employee as { last_name?: string }).last_name?.trim() ?? "";
    name = `${first} ${last}`.trim();
  } else if ((employee as { email?: string }).email?.trim()) {
    name = (employee as { email: string }).email.trim();
  } else {
    name = `موظف #${employee.id}`;
  }
  const phone = employee.phone
    ? employee.phone
        .replace(/^\+20/, "0")
        .replace(/^\+966/, "0")
        .replace(/^\+/, "")
    : null;
  return phone ? `${name} (${phone})` : name;
}

export function AssignEmployeeDialog({
  open,
  onOpenChange,
  action,
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onAssign,
  onClose,
  loadingEmployees,
  savingEmployee,
}: AssignEmployeeDialogProps) {
  const selectedEmployee = selectedEmployeeId
    ? employees.find((e) => e.id === selectedEmployeeId)
    : null;
  const triggerLabel = selectedEmployee
    ? getEmployeeDisplayLabel(selectedEmployee)
    : "اختر الموظف";

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="p-3">
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تعيين الموظف المسؤول</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر الموظف المسؤول عن طلب العقار
              </div>
            </div>
          </CustomDialogTitle>
          <CustomDialogClose onClose={onClose} />
        </CustomDialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{action.customerName}</div>
              <div className="text-sm text-muted-foreground">
                {action.objectType === "property_request" && action.sourceId != null
                  ? `طلب عقار رقم #${action.sourceId}`
                  : action.title}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">اختر الموظف:</Label>
            {loadingEmployees ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mr-2 text-sm text-muted-foreground">
                  جاري تحميل الموظفين...
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <CustomDropdown
                  trigger={<span className="flex items-center gap-2">{triggerLabel}</span>}
                  triggerClassName="w-full justify-between"
                >
                  <DropdownItem onClick={() => onSelectEmployee(null)}>
                    لا يوجد موظف
                  </DropdownItem>
                  {employees.map((employee) => (
                    <DropdownItem
                      key={employee.id}
                      onClick={() => onSelectEmployee(employee.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{getEmployeeDisplayLabel(employee)}</span>
                      </div>
                    </DropdownItem>
                  ))}
                </CustomDropdown>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={savingEmployee}>
            إلغاء
          </Button>
          <Button
            onClick={onAssign}
            disabled={savingEmployee || loadingEmployees}
            className="min-w-[100px]"
          >
            {savingEmployee ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ"
            )}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
}
